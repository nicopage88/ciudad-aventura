(()=>{
const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href='multiplayer.css?v=3';document.head.append(sheet);
const noticeSheet=document.createElement('link');noticeSheet.rel='stylesheet';noticeSheet.href='notifications.css';document.head.append(noticeSheet);
const ridesSheet=document.createElement('link');ridesSheet.rel='stylesheet';ridesSheet.href='rides.css';document.head.append(ridesSheet);
const pixelSheet=document.createElement('link');pixelSheet.rel='stylesheet';pixelSheet.href='pixel-ui.css';document.head.append(pixelSheet);
const ambientSheet=document.createElement('link');ambientSheet.rel='stylesheet';ambientSheet.href='ambient.css';document.head.append(ambientSheet);
let roomBtn=document.querySelector('#open-room');let ridesBtn=document.querySelector('#rides-open');
const ui=document.createElement('section');ui.innerHTML=`<aside id="room-panel" class="room-panel" hidden><div class="room-head"><strong>LA JUNTA ONLINE</strong><button id="hide-room" aria-label="Cerrar">✕</button></div><div id="join-view"><p>¡Arma la junta, po! Entra a la sala y comparte el enlace.</p><p>Ingresa con tu perfil para jugar con tus amigos.</p><button id="join-room">Entrar a la sala</button></div><div id="chat-view" hidden><div class="room-meta"><span id="room-status">Conectando…</span><button id="copy-room">Copiar invitación</button></div><form id="chat-form"><label for="chat-text">Enviar mensaje a la sala</label><div class="chat-compose"><input id="chat-text" maxlength="200" placeholder="Escribe algo, po..." autocomplete="off"><button>Enviar</button></div></form><button id="leave-room">Salir de la sala</button></div></aside><div id="notice" class="message-notice" hidden><strong id="notice-name"></strong><span id="notice-body"></span><div id="notice-actions"></div></div>`;
if(!roomBtn){roomBtn=document.createElement('button');roomBtn.id='open-room';roomBtn.className='room-launch';roomBtn.textContent='👋 JUGAR CON AMIGOS';ui.prepend(roomBtn)}
document.body.append(ui);
const q=s=>ui.querySelector(s),panel=q('#room-panel'),join=q('#join-view'),chat=q('#chat-view'),status=q('#room-status'),notice=q('#notice');
let room=new URL(location.href).searchParams.get('sala'),player='',name='',connected=false,busy=false,pending=[],markers=new Map(),known=new Set(),initial=true,noticeTimer;
const rideUI=document.createElement('section');rideUI.innerHTML=`<aside id="rides-panel" class="rides-panel" hidden><div class="rides-head"><strong>🚗 AVENTONES EN LA SALA</strong><button id="rides-close" aria-label="Cerrar">✕</button></div><p>¿Vai para algún lado? Comparte tu ruta con la junta.</p><form id="ride-form"><label>Desde <input id="ride-origin" maxlength="60" placeholder="Punto de partida" required></label><label>Hacia <input id="ride-destination" maxlength="60" placeholder="Destino" required></label><label>Asientos disponibles <select id="ride-seats"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option></select></label><label>Gastos compartidos (opcional) <input id="ride-cost" maxlength="80" placeholder="Ej.: lo conversamos"></label><button>Estar disponible</button><button type="button" id="ride-remove">Dejar de ofrecer</button></form><p id="rides-error" role="status"></p><h3>¿Quién va en tu dirección?</h3><div id="rides-list">Aún no hay aventones disponibles.</div><small>Las solicitudes se coordinan en la sala. El juego no cobra ni reparte pagos.</small></aside>`;
if(!ridesBtn){ridesBtn=document.createElement('button');ridesBtn.id='rides-open';ridesBtn.className='rides-launch';ridesBtn.hidden=true;ridesBtn.textContent='🚗 AVENTONES';rideUI.prepend(ridesBtn)}
document.body.append(rideUI);
const rq=s=>rideUI.querySelector(s),ridesPanel=rq('#rides-panel');let ridesBusy=false;
function setPixelIcon(element,id,label){const labelEl=element.querySelector('.btn-label');if(labelEl){labelEl.textContent=label}else{element.replaceChildren();const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.classList.add('pixel-icon');icon.setAttribute('aria-hidden','true');const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href','pixel-icons.svg#'+id);icon.append(use);element.append(icon,document.createTextNode(label))}}
setPixelIcon(ridesBtn,'car','AVENTONES');setPixelIcon(roomBtn,'people','Junta Online');
ridesBtn.onclick=()=>{ridesPanel.hidden=!ridesPanel.hidden;if(!ridesPanel.hidden)refreshRides()};rq('#rides-close').onclick=()=>ridesPanel.hidden=true;
async function ridesCall(action,extra={}){if(!connected)return;const response=await fetch('/api/rides',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({room,id:player,action,...extra})});let data=await response.json();if(!response.ok)throw Error(data.error||'No se pudo actualizar');return data}
function renderRides(rides){let list=rq('#rides-list');list.replaceChildren();if(!rides.length){list.textContent='Aún no hay aventones disponibles.';return}for(const ride of rides){const card=document.createElement('div');card.className='ride-card';const driver=document.createElement('strong');driver.textContent=ride.name+(ride.player===player?' · tú':'');const route=document.createElement('span');route.textContent=ride.origin+' → '+ride.destination;const details=document.createElement('span');details.textContent=ride.seats+' asiento(s)'+(ride.contribution?' · '+ride.contribution:'');card.append(driver,route,details);if(ride.player!==player){const btn=document.createElement('button');btn.textContent='Pedir aventón';btn.onclick=()=>{send('@@junta:'+JSON.stringify({to:ride.player,type:'viaje'}));ridesPanel.hidden=true;show('¡Solicitud enviada!')};card.append(btn)}list.append(card)}}
async function refreshRides(){if(!connected||ridesBusy)return;ridesBusy=true;try{const data=await ridesCall('list');if(data)renderRides(data.rides)}catch{}finally{ridesBusy=false}}
rq('#ride-form').onsubmit=async e=>{e.preventDefault();try{const data=await ridesCall('offer',{origin:rq('#ride-origin').value,destination:rq('#ride-destination').value,seats:Number(rq('#ride-seats').value),contribution:rq('#ride-cost').value});renderRides(data.rides);rq('#rides-error').textContent='¡Quedaste disponible para un aventón!'}catch(e){rq('#rides-error').textContent=e.message}};
rq('#ride-remove').onclick=async()=>{try{const data=await ridesCall('remove');renderRides(data.rides);rq('#rides-error').textContent='Ya no estás ofreciendo aventones.'}catch(e){rq('#rides-error').textContent=e.message}};
setInterval(()=>{if(!ridesPanel.hidden)refreshRides()},5000);
function send(text){pending.push(text);sync()}
window.sendThoughtToRoom=function(text){if(connected&&text){send(text)}};
function notify(item){let event=null;try{if(item.body.startsWith('@@junta:'))event=JSON.parse(item.body.slice(8))}catch{}if(event&&event.to!==player)return;q('#notice-name').textContent=item.name+(event?'':' dice:');q('#notice-body').textContent=event?({pregunta:'¿Qué querís? 😄',rey:'¿Qué pasa, rey? 👑',necesidad:'¿Qué necesitái? 🤔',saludo:'¡Te manda un saludo! 👋',viaje:'¿Le das un aventón? 🚗',invitar:'Te invita a juntarse. ¿Aceptas?',junta:'Quiere formar una junta contigo. ¿Aceptas?',aceptado:'¡Aceptó tu invitación! 🙌',rechazado:'Por ahora no puede unirse.'}[event.type]||'Te mandó una invitación.'):item.body;let buttons=q('#notice-actions');buttons.replaceChildren();function button(label,fn){let b=document.createElement('button');b.textContent=label;b.onclick=fn;buttons.append(b)}if(event&&['invitar','junta','viaje'].includes(event.type)){button('Aceptar',()=>{send('@@junta:'+JSON.stringify({to:item.player,type:'aceptado'}));notice.hidden=true;show('¡Se armó, po!')});button('Ahora no',()=>{send('@@junta:'+JSON.stringify({to:item.player,type:'rechazado'}));notice.hidden=true})}else{button('Responder',()=>{notice.hidden=true;panel.hidden=false;q('#chat-text').focus()});button('Cerrar',()=>notice.hidden=true)}notice.hidden=false;clearTimeout(noticeTimer);if(!event||!['invitar','junta','viaje'].includes(event.type))noticeTimer=setTimeout(()=>notice.hidden=true,9000)}
roomBtn.onclick=()=>panel.hidden=!panel.hidden;q('#hide-room').onclick=()=>panel.hidden=true;
q('#join-room').onclick=async()=>{await window.cityProfileReady;if(!window.cityProfile){window.openCityProfile();return}player=window.cityProfile.id;name=window.cityProfile.nickname;if(!room||!/^[a-zA-Z0-9_-]{8,64}$/.test(room)){room=crypto.randomUUID();const u=new URL(location.href);u.searchParams.set('sala',room);history.replaceState(null,'',u)}connected=true;ridesBtn.hidden=false;initial=true;known.clear();join.hidden=true;chat.hidden=false;setPixelIcon(roomBtn,'chat','MENSAJES');sync()};
q('#leave-room').onclick=()=>{ridesCall('remove').catch(()=>{});connected=false;ridesBtn.hidden=true;ridesPanel.hidden=true;markers.forEach(m=>map.removeLayer(m));markers.clear();chat.hidden=true;join.hidden=false;notice.hidden=true;setPixelIcon(roomBtn,'people','Junta Online')};
window.addEventListener('city-profile-changed',e=>{if(connected&&(!e.detail||e.detail.id!==player))q('#leave-room').click();else if(e.detail&&room&&!connected){setTimeout(()=>q('#join-room').click(),400)}});
window.cityProfileReady.then(()=>{if(room&&/^[a-zA-Z0-9_-]{8,64}$/.test(room)){if(window.cityProfile&&!connected){q('#join-room').click();if(window.show)window.show('¡Te uniste automáticamente a la junta!')}else if(!window.cityProfile){if(window.show)window.show('👋 ¡Te invitaron a una junta! Inicia sesión en Perfil.');panel.hidden=false}}});
q('#copy-room').onclick=async()=>{try{await navigator.clipboard.writeText(location.href);q('#copy-room').textContent='¡Enlace copiado!';setTimeout(()=>{q('#copy-room').textContent='Copiar invitación';panel.hidden=true},1200)}catch{window.prompt('Copia este enlace para tu amigo:',location.href)}};
q('#chat-form').onsubmit=e=>{e.preventDefault();const input=q('#chat-text'),msg=input.value.trim();if(msg){send(msg);input.value='';panel.hidden=true;show('Mensaje listo para enviar')}};
const playerRecentMsgs=new Map();
function playerIcon(name,avatar,bubbleMsg){
  let root=document.createElement('div');
  root.className='friend-marker';
  if(bubbleMsg){
    let b=document.createElement('div');
    b.className='player-bubble';
    b.textContent=bubbleMsg;
    root.append(b);
  }
  let img=document.createElement('img');
  img.src='data:image/svg+xml,'+encodeURIComponent(window.makeCityAvatar(avatar));
  img.className='sprite';
  let label=document.createElement('span');
  label.textContent=name;
  root.append(label,img);
  return L.divIcon({className:'friend-marker-wrap',html:root.outerHTML,iconSize:[40,52],iconAnchor:[20,45]});
}
function friendMenu(p){
  const box=document.createElement('div');
  box.className='friend-menu';
  const title=document.createElement('strong');
  title.textContent=p.name;
  box.append(title);

  // Direct Pokémon Battle button
  const battleBtn=document.createElement('button');
  battleBtn.textContent='⚔️ Batalla Pokémon';
  battleBtn.style.cssText='background:#991b1b !important; color:#fff !important; font-weight:900 !important; margin-bottom:5px;';
  battleBtn.onclick=()=>{
    map.closePopup();
    if(window.startPokemonBattle) window.startPokemonBattle(p.name);
  };
  box.append(battleBtn);

  for(const [label,type] of [['👋 Saludar','saludo'],['¿Qué querís?','pregunta'],['¿Qué pasa, rey?','rey'],['¿Qué necesitái?','necesidad'],['📍 Invitar a juntarse','invitar'],['🤝 Formar junta','junta']]){
    let b=document.createElement('button');
    b.textContent=label;
    b.onclick=()=>{send('@@junta:'+JSON.stringify({to:p.player,type}));map.closePopup();show(type==='saludo'?'¡Saludo enviado!':'Invitación enviada')};
    box.append(b);
  }
  return box;
}
async function sync(){
  if(!connected||busy)return;
  busy=true;
  const message=pending.shift()||'';
  try{
    const response=await fetch('/api/room',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({room,id:player,name,lat:pos.lat,lng:pos.lng,message})});
    if(!response.ok)throw Error('http');
    const data=await response.json();
    status.textContent='● '+data.players.length+' en la sala';
    
    // Store recent chat messages for speech bubbles
    if(data.messages){
      const now=Date.now();
      for(const item of data.messages){
        if(!item.body.startsWith('@@junta:')&&(!playerRecentMsgs.has(item.player)||(now-(item.created||now)<60000))){
          playerRecentMsgs.set(item.player,{text:item.body,created:item.created||now});
        }
      }
    }

    let seen=new Set();
    const now=Date.now();
    data.players.filter(p=>p.player!==player).forEach(p=>{
      seen.add(p.player);
      let avatar={};
      try{avatar=JSON.parse(p.avatar||'{}')}catch{}
      const recent=playerRecentMsgs.get(p.player);
      const bubbleText=(recent&&(now-recent.created<60000))?recent.text:'';
      const iconKey=p.avatar+'|'+bubbleText;

      let m=markers.get(p.player);
      if(!m){
        m=L.marker([p.lat,p.lng],{icon:playerIcon(p.name,avatar,bubbleText),zIndexOffset:999}).addTo(map);
        m.bindPopup(()=>friendMenu(p));
        m._iconKey=iconKey;
        markers.set(p.player,m);
      }else{
        m.setLatLng([p.lat,p.lng]);
        if(m._iconKey!==iconKey){
          m.setIcon(playerIcon(p.name,avatar,bubbleText));
          m._iconKey=iconKey;
        }
      }
    });
    for(const [id,m] of markers)if(!seen.has(id)){map.removeLayer(m);markers.delete(id)}
    for(const item of data.messages.slice().reverse()){
      if(!initial&&!known.has(item.id)&&item.player!==player)notify(item);
      known.add(item.id);
    }
    initial=false;
    if(known.size>200)known=new Set(data.messages.map(m=>m.id));
  }catch{
    if(message)pending.unshift(message);
    status.textContent='Sin conexión, reintentando…';
  }finally{
    busy=false;
  }
}
setInterval(sync,1800);
})();
