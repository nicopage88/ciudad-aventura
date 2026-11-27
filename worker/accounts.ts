type Account = { id:string; nickname:string; avatar:string };
const palette={hat:['#e14d42','#3f85c9','#66a66a','#8a65b7','#f0b844'],shirt:['#4f91d1','#df6b61','#61a879','#8d70b8','#e0a43c'],skin:['#efbf87','#e9a76e','#ba7b4c','#875238','#f5d5ae'],item:['none','xmas_hat','reindeer','xmas_scarf','tree_hat']};
const defaults={hat:palette.hat[0],shirt:palette.shirt[0],skin:palette.skin[0],item:'none'};
const bytes=(n:number)=>crypto.getRandomValues(new Uint8Array(n));
const hex=(b:ArrayBuffer|Uint8Array)=>Array.from(new Uint8Array(b as ArrayBuffer)).map(x=>x.toString(16).padStart(2,'0')).join('');
function unhex(s:string){return new Uint8Array((s.match(/../g)||[]).map(x=>parseInt(x,16)))}
async function digest(s:string){return hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))}
async function derive(password:string,salt:string){let material:BufferSource=new TextEncoder().encode(password);for(let i=0;i<6;i++){const key=await crypto.subtle.importKey('raw',material,'PBKDF2',false,['deriveBits']);const stageSalt=new Uint8Array(17);stageSalt.set(unhex(salt));stageSalt[16]=i;material=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:stageSalt,iterations:100000},key,256)}return hex(material as ArrayBuffer)}
function equal(a:string,b:string){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0}
export function cleanAvatar(value:unknown){let v:Record<string,unknown>={};try{v=typeof value==='string'?JSON.parse(value):value as Record<string,unknown>||{}}catch{};return Object.fromEntries(Object.entries(palette).map(([key,colors])=>[key,colors.includes(String(v[key]))?String(v[key]):defaults[key as keyof typeof defaults]]))}
function tokenFrom(request:Request){return request.headers.get('cookie')?.match(/(?:^|;\s*)city_session=([a-f0-9]{64})(?:;|$)/)?.[1]||''}
export function publicOrigin(request:Request){const url=new URL(request.url),forwarded=request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();return url.protocol==='http:'&&(forwarded==='http'||forwarded==='https')?`${forwarded}://${url.host}`:url.origin}
export async function currentAccount(request:Request,db:D1Database):Promise<Account|null>{const token=tokenFrom(request);if(!token)return null;return await db.prepare('SELECT a.id,a.nickname,a.avatar FROM sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.expires>?').bind(await digest(token),Date.now()).first<Account>()}
const error=(message:string,status=400)=>Response.json({error:message},{status,headers:{'Cache-Control':'no-store'}});
export async function accountApi(request:Request,db:D1Database):Promise<Response>{
 if(request.method==='GET'){const user=await currentAccount(request,db);return Response.json({user:user?{id:user.id,nickname:user.nickname,avatar:cleanAvatar(user.avatar)}:null},{headers:{'Cache-Control':'no-store'}})}
 if(request.method!=='POST'||request.headers.get('origin')!==publicOrigin(request))return error('Acceso no permitido.',403);
 if(Number(request.headers.get('content-length')||0)>4096)return error('Solicitud demasiado grande.',413);
 let input:Record<string,unknown>;try{input=await request.json()}catch{return error('Datos inválidos.')}
 const action=String(input.action||'');
 if(action==='logout'){const token=tokenFrom(request);if(token)await db.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await digest(token)).run();return Response.json({ok:true},{headers:{'Set-Cookie':'city_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0','Cache-Control':'no-store'}})}
 if(action==='avatar'){const user=await currentAccount(request,db);if(!user)return error('Inicia sesión primero.',401);const avatar=cleanAvatar(input.avatar);await db.prepare('UPDATE accounts SET avatar=? WHERE id=?').bind(JSON.stringify(avatar),user.id).run();return Response.json({user:{id:user.id,nickname:user.nickname,avatar}},{headers:{'Cache-Control':'no-store'}})}
 if(!['login','register'].includes(action))return error('Acción no válida.');
 const nickname=String(input.nickname||'').trim(),password=String(input.password||'');
 if(!/^[a-zA-Z0-9_]{3,20}$/.test(nickname)||password.length<8||password.length>128)return error('Usa un apodo de 3 a 20 letras, números o guion bajo y una clave de 8 a 128 caracteres.');
 const now=Date.now(),ip=request.headers.get('CF-Connecting-IP')||'local',limitKey=await digest('auth:'+ip);
 await db.prepare('INSERT INTO auth_limits(key,attempts,reset) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN reset<? THEN 1 ELSE attempts+1 END,reset=CASE WHEN reset<? THEN excluded.reset ELSE reset END').bind(limitKey,now+900000,now,now).run();
 const limit=await db.prepare('SELECT attempts FROM auth_limits WHERE key=?').bind(limitKey).first<{attempts:number}>();if((limit?.attempts||0)>20)return error('Demasiados intentos. Espera unos minutos.',429);
 const key=nickname.toLowerCase();let user=await db.prepare('SELECT id,nickname,avatar,password_hash,salt FROM accounts WHERE nickname_key=?').bind(key).first<Account&{password_hash:string;salt:string}>();
 if(action==='register'){if(user)return error('Ese apodo ya está ocupado.');const salt=hex(bytes(16)),hash=await derive(password,salt),id=crypto.randomUUID();try{await db.prepare('INSERT INTO accounts(id,nickname,nickname_key,password_hash,salt,avatar,created) VALUES(?,?,?,?,?,?,?)').bind(id,nickname,key,hash,salt,JSON.stringify(defaults),now).run()}catch{return error('Ese apodo ya está ocupado.')}user={id,nickname,avatar:JSON.stringify(defaults),password_hash:hash,salt}}
 else{const hash=await derive(password,user?.salt||'00000000000000000000000000000000');if(!user||!equal(hash,user.password_hash))return error('Apodo o clave incorrectos.',401)}
 const token=hex(bytes(32)),expires=now+30*86400000;await db.prepare('INSERT INTO sessions(token_hash,account_id,expires) VALUES(?,?,?)').bind(await digest(token),user.id,expires).run();
 return Response.json({user:{id:user.id,nickname:user.nickname,avatar:cleanAvatar(user.avatar)}},{headers:{'Set-Cookie':'city_session='+token+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000','Cache-Control':'no-store'}});
}
