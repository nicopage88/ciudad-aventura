type Card = { id: string; rank: number; suit: string };
type Group = { type: "trio" | "run"; cards: Card[] };
type Person = { id: string; name: string; hand: Card[]; down: boolean; score: number };
type Game = { players: Person[]; deck: Card[]; discard: Card[]; groups: Group[]; round: number; turn: number; phase: "draw" | "play" | "ended" | "finished"; info: string };
const contracts: Array<Array<"trio" | "run">> = [["trio","trio"],["trio","run"],["run","run"],["trio","trio","trio"],["trio","trio","run"],["trio","run","run"],["run","run","run"]];
const names=["2 tríos","1 trío y 1 escalera","2 escaleras","3 tríos","2 tríos y 1 escalera","1 trío y 2 escaleras","3 escaleras"];
function shuffle<T>(arr:T[]):T[]{for(let i=arr.length-1;i>0;i--){const r=new Uint32Array(1);crypto.getRandomValues(r);const j=r[0]%(i+1);[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
function deck(): Card[]{const out:Card[]=[];for(let d=0;d<2;d++){for(const suit of ["♠","♥","♣","♦"])for(let rank=1;rank<=13;rank++)out.push({id:crypto.randomUUID(),rank,suit});for(let j=0;j<2;j++)out.push({id:crypto.randomUUID(),rank:0,suit:"★"})}return shuffle(out)}
function valid(type:"trio"|"run", cards:Card[]):boolean{
 const normal=cards.filter(c=>c.rank!==0), jokers=cards.length-normal.length;
 if(jokers>1||normal.length<2)return false;
 if(type==="trio")return cards.length>=3&&normal.every(c=>c.rank===normal[0].rank);
 if(cards.length<4||cards.length>13||!normal.every(c=>c.suit===normal[0].suit))return false;
 for(const highAce of [false,true]){const values=normal.map(c=>highAce&&c.rank===1?14:c.rank);if(new Set(values).size!==values.length)continue;for(let start=1;start+cards.length-1<=14;start++)if(values.every(v=>v>=start&&v<start+cards.length))return true}return false;
}
function findGroups(hand:Card[], need:Array<"trio"|"run">):Group[]|null{
 const candidates:Record<string,Group[]>={trio:[],run:[]};
 for(const type of ["trio","run"] as const){const n=type==="trio"?3:4;function choose(start:number,selected:Card[]){if(selected.length===n){if(valid(type,selected))candidates[type].push({type,cards:[...selected]});return}for(let i=start;i<=hand.length-(n-selected.length);i++){selected.push(hand[i]);choose(i+1,selected);selected.pop()}}choose(0,[])}
 function search(i:number,used:Set<string>):Group[]|null{if(i===need.length)return [];for(const g of candidates[need[i]]){if(g.cards.some(c=>used.has(c.id)))continue;const next=new Set(used);g.cards.forEach(c=>next.add(c.id));const result=search(i+1,next);if(result)return [g,...result]}return null}return search(0,new Set());
}
function deal(g:Game){g.deck=deck();g.discard=[g.deck.pop()!];g.groups=[];g.players.forEach(p=>{p.hand=[];p.down=false;for(let i=0;i<(g.round===7?12:11);i++)p.hand.push(g.deck.pop()!)});g.turn=(g.round-1)%2;g.phase="draw";g.info="Ronda "+g.round+": "+names[g.round-1]}
export function newGame(players:Array<{player:string;name:string}>):Game{const g:Game={players:players.map(p=>({id:p.player,name:p.name,hand:[],down:false,score:0})),deck:[],discard:[],groups:[],round:1,turn:0,phase:"draw",info:""};deal(g);return g}
function endRound(g:Game,winner:Person){for(const p of g.players)if(p!==winner)p.score+=p.hand.reduce((s,c)=>s+(c.rank===0?25:c.rank===1?14:c.rank),0);g.phase=g.round===7?"finished":"ended";g.info=winner.name+" cerró la ronda."}
export function act(g:Game,id:string,action:string,cardId?:string){const p=g.players.find(x=>x.id===id);if(!p)throw Error("No eres parte de esta mesa.");if(action==="next"){if(g.phase!=="ended")throw Error("La ronda aún no termina.");g.round++;deal(g);return}if(g.phase==="ended"||g.phase==="finished")throw Error("La ronda terminó.");if(g.players[g.turn].id!==id)throw Error("Espera tu turno.");
 if(action==="draw"){if(g.phase!=="draw")throw Error("Ya robaste.");if(!g.deck.length){if(g.discard.length<=1)throw Error("No quedan cartas para robar.");const top=g.discard.pop()!;g.deck=shuffle(g.discard);g.discard=[top]}p.hand.push(g.deck.pop()!);g.phase="play";return}
 if(action==="take"){if(g.phase!=="draw"||!g.discard.length)throw Error("No puedes tomar esa carta.");p.hand.push(g.discard.pop()!);g.phase="play";return}
 if(g.phase!=="play")throw Error("Primero roba una carta.");
 if(action==="down"){if(p.down)throw Error("Ya bajaste tus juegos.");const groups=findGroups(p.hand,contracts[g.round-1]);if(!groups)throw Error("Todavía no completas "+names[g.round-1]+".");const ids=new Set(groups.flatMap(x=>x.cards.map(c=>c.id)));p.hand=p.hand.filter(c=>!ids.has(c.id));p.down=true;g.groups.push(...groups);g.info=p.name+" bajó "+names[g.round-1]+".";if(!p.hand.length)endRound(g,p);return}
 if(action==="add"){if(!p.down)throw Error("Primero debes bajar tus juegos.");let n=0;for(let i=p.hand.length-1;i>=0;i--){const card=p.hand[i];const group=g.groups.find(x=>valid(x.type,[...x.cards,card]));if(group){group.cards.push(card);p.hand.splice(i,1);n++}}if(!n)throw Error("No tienes cartas que agregar a los juegos.");g.info=p.name+" agregó "+n+" carta(s).";if(!p.hand.length)endRound(g,p);return}
 if(action==="discard"){const i=p.hand.findIndex(c=>c.id===cardId);if(i<0)throw Error("Elige una carta de tu mano.");g.discard.push(p.hand.splice(i,1)[0]);if(!p.hand.length){endRound(g,p);return}g.turn=1-g.turn;g.phase="draw";return}
 throw Error("Acción no válida.");
}
export function view(g:Game,id:string){const p=g.players.find(x=>x.id===id);if(!p)throw Error("No eres parte de esta mesa.");return {round:g.round,contract:names[g.round-1],phase:g.phase,turn:g.players[g.turn].id,info:g.info,hand:p.hand,down:p.down,players:g.players.map(x=>({id:x.id,name:x.name,count:x.hand.length,down:x.down,score:x.score})),discard:g.discard.at(-1)||null,deck:g.deck.length,groups:g.groups}}
