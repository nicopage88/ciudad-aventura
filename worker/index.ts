import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";
import { newGame, act, view } from "./carioca";

const worker = {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    const url = new URL(request.url);
    if (url.pathname === "/") return Response.redirect(new URL("/game.html" + url.search + url.hash, url), 302);
    if (url.pathname === "/api/carioca") {
      if (request.method !== "POST" || request.headers.get("origin") !== url.origin) return new Response("Forbidden", {status:403});
      const db=(env as unknown as {DB:D1Database}).DB;
      let data:Record<string,unknown>;try{data=await request.json()}catch{return new Response("Datos inválidos",{status:400})}
      const room=String(data.room||""),id=String(data.id||""),action=String(data.action||"view");
      if(!db||!/^[a-zA-Z0-9_-]{8,64}$/.test(room)||!/^[a-zA-Z0-9_-]{8,64}$/.test(id))return new Response("Datos inválidos",{status:400});
      const now=Date.now();
      try {
        let row=await db.prepare("SELECT state,revision,updated FROM card_games WHERE room=?").bind(room).first<{state:string;revision:number;updated:number}>();
        if(action==="start"&&(!row||now-row.updated>7200000||JSON.parse(row.state).phase==="finished")){
          const people=await db.prepare("SELECT player,name,lat,lng FROM players WHERE room=? AND updated>? ORDER BY updated DESC LIMIT 30").bind(room,now-20000).all<{player:string;name:string;lat:number;lng:number}>();
          const near=people.results.filter(p=>Math.hypot((p.lat+33.5014)*111320,(p.lng+70.76412)*92500)<100);
          if(!near.some(p=>p.player===id)||near.length<2)throw Error("Ambos deben estar conectados y dentro de Plaza Arica.");
          const selected=[near.find(p=>p.player===id)!,near.find(p=>p.player!==id)!], game=newGame(selected);
          if(row)await db.prepare("UPDATE card_games SET state=?,revision=revision+1,updated=? WHERE room=? AND revision=?").bind(JSON.stringify(game),now,room,row.revision).run();
          else await db.prepare("INSERT OR IGNORE INTO card_games(room,state,revision,updated) VALUES(?,?,0,?)").bind(room,JSON.stringify(game),now).run();
          row=await db.prepare("SELECT state,revision,updated FROM card_games WHERE room=?").bind(room).first<{state:string;revision:number;updated:number}>();
        }
        if(!row)throw Error("Aún no hay una mesa. Júntense en Plaza Arica y comienza una partida.");
        const game=JSON.parse(row.state);
        if(action!=="view"&&action!=="start"){
          act(game,id,action,String(data.cardId||""));
          const result=await db.prepare("UPDATE card_games SET state=?,revision=revision+1,updated=? WHERE room=? AND revision=?").bind(JSON.stringify(game),now,room,row.revision).run();
          if(!result.meta.changes)return Response.json({error:"La mesa cambió; inténtalo nuevamente."},{status:409});
        }
        return Response.json(view(game,id),{headers:{"Cache-Control":"no-store"}});
      }catch(error){return Response.json({error:error instanceof Error?error.message:"No se pudo abrir la mesa."},{status:400})}
    }
    if (url.pathname === "/api/room") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
      if (request.headers.get("origin") !== url.origin) return new Response("Forbidden", { status: 403 });
      const db = (env as unknown as { DB: D1Database }).DB;
      if (!db) return new Response("Unavailable", { status: 503 });
      let input: Record<string, unknown>;
      try { input = await request.json(); } catch { return new Response("Invalid JSON", { status: 400 }); }
      const room = String(input.room ?? ""), id = String(input.id ?? ""), name = String(input.name ?? "").trim().slice(0, 20);
      const lat = Number(input.lat), lng = Number(input.lng), message = String(input.message ?? "").trim().slice(0, 200);
      if (!/^[a-zA-Z0-9_-]{8,64}$/.test(room) || !/^[a-zA-Z0-9_-]{8,64}$/.test(id) || !name || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return new Response("Invalid input", { status: 400 });
      const now = Date.now();
      await db.prepare("INSERT INTO players (room,player,name,lat,lng,updated) VALUES (?,?,?,?,?,?) ON CONFLICT(room,player) DO UPDATE SET name=excluded.name,lat=excluded.lat,lng=excluded.lng,updated=excluded.updated").bind(room,id,name,lat,lng,now).run();
      if (message) await db.prepare("INSERT INTO messages (id,room,player,name,body,created) VALUES (?,?,?,?,?,?)").bind(crypto.randomUUID(),room,id,name,message,now).run();
      const [players, messages] = await db.batch([
        db.prepare("SELECT player,name,lat,lng FROM players WHERE room=? AND updated>? LIMIT 30").bind(room,now-20000),
        db.prepare("SELECT id,player,name,body,created FROM messages WHERE room=? AND created>? ORDER BY created DESC LIMIT 30").bind(room,now-86400000),
        db.prepare("DELETE FROM players WHERE updated<?").bind(now-300000),
        db.prepare("DELETE FROM messages WHERE created<?").bind(now-86400000)
      ]);
      return Response.json({ players: players.results, messages: messages.results }, { headers: { "Cache-Control": "no-store" } });
    }
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    return runWithConnectorBinding(binding, () => handler.fetch(request, env, ctx));
  },
};

export default worker;
