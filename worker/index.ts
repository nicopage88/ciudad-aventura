import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";

const worker = {
  async fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    const url = new URL(request.url);
    if (url.pathname === "/") return Response.redirect(new URL("/game.html" + url.search + url.hash, url), 302);
    if (url.pathname === "/api/rides") {
      if(request.method!=="POST" || request.headers.get("origin")!==url.origin) return new Response("Forbidden",{status:403});
      const db=(env as unknown as {DB:D1Database}).DB;
      let input:Record<string,unknown>;try{input=await request.json()}catch{return new Response("Datos inválidos",{status:400})}
      const room=String(input.room||""),id=String(input.id||""),action=String(input.action||"list"),now=Date.now();
      if(!db||!/^[a-zA-Z0-9_-]{8,64}$/.test(room)||!/^[a-zA-Z0-9_-]{8,64}$/.test(id))return new Response("Datos inválidos",{status:400});
      const member=await db.prepare("SELECT player FROM players WHERE room=? AND player=? AND updated>?").bind(room,id,now-20000).first();
      if(!member)return Response.json({error:"Conéctate a la sala primero."},{status:403});
      if(action==="offer"){
        const origin=String(input.origin||"").trim().slice(0,60),destination=String(input.destination||"").trim().slice(0,60),contribution=String(input.contribution||"").trim().slice(0,80),seats=Number(input.seats);
        if(!origin||!destination||!Number.isInteger(seats)||seats<1||seats>8)return Response.json({error:"Completa origen, destino y asientos disponibles."},{status:400});
        await db.prepare("INSERT INTO rides(room,player,origin,destination,seats,contribution,updated) VALUES(?,?,?,?,?,?,?) ON CONFLICT(room,player) DO UPDATE SET origin=excluded.origin,destination=excluded.destination,seats=excluded.seats,contribution=excluded.contribution,updated=excluded.updated").bind(room,id,origin,destination,seats,contribution,now).run();
      }else if(action==="remove")await db.prepare("DELETE FROM rides WHERE room=? AND player=?").bind(room,id).run();
      else if(action!=="list")return new Response("Acción inválida",{status:400});
      const rides=await db.prepare("SELECT r.player,p.name,r.origin,r.destination,r.seats,r.contribution FROM rides r JOIN players p ON p.room=r.room AND p.player=r.player WHERE r.room=? AND p.updated>? AND r.updated>? ORDER BY r.updated DESC LIMIT 30").bind(room,now-20000,now-43200000).all();
      return Response.json({rides:rides.results},{headers:{"Cache-Control":"no-store"}});
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
