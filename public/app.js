const retroStyle=document.createElement('link');retroStyle.rel='stylesheet';retroStyle.href='retro.css';document.head.append(retroStyle);
const experienceStyle=document.createElement('link');experienceStyle.rel='stylesheet';experienceStyle.href='experience.css';document.head.append(experienceStyle);
const PLAZA=L.latLng(-33.5100194,-70.756975);
const ARICA=L.latLng(-33.5014,-70.76412);
const map=L.map('map',{zoomControl:false,minZoom:10,maxZoom:19,maxBounds:[[-34.8,-72.8],[-32.2,-69.4]]}).setView(PLAZA,18);
window.map=map;
map.attributionControl.setPrefix('');
map.attributionControl.addAttribution('Datos © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>');
const world=L.layerGroup().addTo(map);
let fallback=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map),lastQuery='',queryTimer,fetchController;
fallback.bringToBack();

// Dynamic Zoom Controls for game feel
const zoomPanel=document.createElement('div');
zoomPanel.className='game-zoom-panel';
zoomPanel.innerHTML=`
  <div class="zoom-actions">
    <button id="zoom-in" title="Acercar mapa" aria-label="Acercar">＋</button>
    <button id="zoom-out" title="Alejar mapa" aria-label="Alejar">－</button>
  </div>
  <div class="zoom-presets">
    <button class="zoom-chip active" data-zoom="18" title="Vista calle">🚶 Calle</button>
    <button class="zoom-chip" data-zoom="16" title="Vista barrio">🏘️ Barrio</button>
    <button class="zoom-chip" data-zoom="13" title="Vista ciudad Santiago">🏙️ Ciudad</button>
    <button class="zoom-chip" data-zoom="11" title="Vista Región Metropolitana">🗺️ RM</button>
  </div>
`;
document.querySelector('.map-wrap')?.append(zoomPanel);
zoomPanel.querySelector('#zoom-in').onclick=()=>map.zoomIn();
zoomPanel.querySelector('#zoom-out').onclick=()=>map.zoomOut();
zoomPanel.querySelectorAll('.zoom-chip').forEach(b=>{
  b.onclick=()=>map.setZoom(Number(b.dataset.zoom),{animate:true});
});
map.on('zoomend',()=>{
  const z=map.getZoom();
  zoomPanel.querySelectorAll('.zoom-chip').forEach(b=>{
    const targetZ=Number(b.dataset.zoom);
    b.classList.toggle('active',Math.abs(z-targetZ)<=1);
  });
});

const hint=document.querySelector('#hint'),place=document.querySelector('#place'),scoreEl=document.querySelector('#score'),toast=document.querySelector('#toast');
function show(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(show.t);show.t=setTimeout(()=>toast.classList.remove('show'),2200)}
window.show=show;
function loadWorld(){clearTimeout(queryTimer);queryTimer=setTimeout(async()=>{
  if(map.getZoom()<15)return; // Avoid heavy Overpass calls when zoomed out to RM level
  let center=map.getCenter(),key=(Math.round(center.lat*300)/300)+','+(Math.round(center.lng*300)/300);if(key===lastQuery)return;lastQuery=key;const b=map.getBounds().pad(.05),box=[b.getSouth(),b.getWest(),b.getNorth(),b.getEast()].join(',');let query=`[out:json][timeout:8];(way["highway"](${box});way["building"](${box});way["leisure"="park"](${box});way["landuse"~"grass|forest|recreation_ground"](${box}););out geom;`;if(fetchController)fetchController.abort();fetchController=new AbortController();try{const res=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:new URLSearchParams({data:query}),signal:fetchController.signal});if(!res.ok)throw Error('map');let data=await res.json();world.clearLayers();if(fallback){map.removeLayer(fallback);fallback=null}let ways=data.elements.filter(w=>w.geometry?.length>1);for(const w of ways.filter(w=>w.tags.leisure||w.tags.landuse)){L.polygon(w.geometry.map(p=>[p.lat,p.lon]),{color:'#568a55',weight:2,fillColor:'#7dc470',fillOpacity:1,interactive:false}).addTo(world)}for(const w of ways.filter(w=>w.tags.highway)){let p=w.geometry.map(p=>[p.lat,p.lon]);let major=/primary|secondary|tertiary/.test(w.tags.highway),wide=major?16:9;L.polyline(p,{color:'#9e9981',weight:wide+4,interactive:false}).addTo(world);L.polyline(p,{color:major?'#e9cf91':'#dfd3ae',weight:wide,interactive:false}).addTo(world)}for(const w of ways.filter(w=>w.tags.building)){L.polygon(w.geometry.map(p=>[p.lat,p.lon]),{color:'#745d56',weight:2,fillColor:'#c99076',fillOpacity:1,interactive:false}).addTo(world)}hint.textContent='Las calles y edificios representan datos reales. ¡Visita la plaza!'}catch(e){if(e.name==='AbortError')return;lastQuery='';if(!fallback){fallback=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);fallback.bringToBack()}hint.textContent='¡A recorrer el barrio, po!'}},700)}
map.on('moveend',loadWorld);
const baseSvg=`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42" shape-rendering="crispEdges"><path fill="#29303a" d="M8 2h16v4h4v13h-3v12h-3v8h-6v-5h-2v5H8v-8H5V19H3V7h5z"/><path fill="#e14d42" d="M8 3h16v4h4v5H4V7h4z"/><path fill="#fff3d7" d="M7 12h18v9h-3v3H10v-3H7z"/><path fill="#192e38" d="M10 14h3v3h-3zm9 0h3v3h-3z"/><path fill="#4f91d1" d="M8 24h16v9h-5v-4h-6v4H8z"/><path fill="#efbf87" d="M5 22h3v7H5zm19 0h3v7h-3z"/></svg>`;
let svg=baseSvg;
let myThought = '';
try { myThought = localStorage.getItem('ciudad_my_thought') || ''; } catch {}
window.getMyThought = () => myThought;
function escapeThoughtHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function makeLocalPlayerIcon() {
  const bubble = myThought ? `<div class="player-bubble my-thought-bubble" title="Click para cambiar tu pensamiento">${escapeThoughtHtml(myThought)}</div>` : '';
  const html = `<div class="my-player-wrap">${bubble}<img class="sprite" src="data:image/svg+xml,${encodeURIComponent(svg)}" alt=""></div>`;
  return L.divIcon({ className: '', html, iconSize: [40, 52], iconAnchor: [20, 45] });
}
let pos=L.latLng(PLAZA.lat+.001,PLAZA.lng),player=L.marker(pos,{icon:makeLocalPlayerIcon(),interactive:true,zIndexOffset:1000}).addTo(map),started=true,timer=null,score=0;
window.player=player;
player.on('click', () => { if (window.openThoughtModal) window.openThoughtModal(); });
window.setPlayerThought = text => {
  myThought = (text || '').trim();
  try {
    if (myThought) localStorage.setItem('ciudad_my_thought', myThought);
    else localStorage.removeItem('ciudad_my_thought');
  } catch {}
  player.setIcon(makeLocalPlayerIcon());
  if (window.sendThoughtToRoom) window.sendThoughtToRoom(myThought);
};
window.pos=pos;
const plazaIcon=L.divIcon({className:'',html:'<div class="plaza-mark">★<span>PLAZA DE MAIPÚ</span></div>',iconSize:[80,50],iconAnchor:[40,25]});
L.marker(PLAZA,{icon:plazaIcon,interactive:false}).addTo(map);
const aricaIcon=L.divIcon({className:'',html:'<div class="plaza-mark">★<span>PLAZA ARICA</span></div>',iconSize:[80,50],iconAnchor:[40,25]});
L.marker(ARICA,{icon:aricaIcon,interactive:false}).addTo(map);
const aricaBtn=document.querySelector('#arica-btn');
if(aricaBtn){aricaBtn.onclick=()=>{start([ARICA.lat+.0006,ARICA.lng]);show('¡Llegaste cerca de Plaza Arica!')}}
function update(){window.pos=pos;let dm=Math.round(pos.distanceTo(PLAZA)),da=Math.round(pos.distanceTo(ARICA));let d=Math.min(dm,da),title=da<dm?'PLAZA ARICA':'PLAZA DE MAIPÚ';place.textContent=d<60?title:'A '+d+' M DE '+title;document.querySelector('#play').hidden=dm>=60;window.dispatchEvent(new CustomEvent('city-player-moved',{detail:{lat:pos.lat,lng:pos.lng}}))}
function start(latlng){pos=L.latLng(latlng);window.pos=pos;player.setLatLng(pos);map.setView(pos,18);update();loadWorld()}
window.start=start;
function geolocate(){if(!navigator.geolocation){hint.textContent='Tu navegador no permite GPS.';return}hint.textContent='Buscando tu ubicación…';navigator.geolocation.getCurrentPosition(p=>start([p.coords.latitude,p.coords.longitude]),()=>{hint.textContent='No se pudo obtener tu ubicación. Prueba desde Maipú.'},{enableHighAccuracy:true,timeout:12000,maximumAge:60000})}
window.geolocate=geolocate;
document.querySelector('#gps').addEventListener('click',geolocate);
document.querySelector('#reset').addEventListener('click',()=>start([PLAZA.lat+.001,PLAZA.lng]));
function move(dir,step){let lat=step/111320,lng=step/(111320*Math.cos(pos.lat*Math.PI/180));if(dir==='up')pos.lat+=lat;if(dir==='down')pos.lat-=lat;if(dir==='left')pos.lng-=lng;if(dir==='right')pos.lng+=lng;window.pos=pos;player.setLatLng(pos);map.panTo(pos,{animate:false});const img=player.getElement()?.querySelector('.sprite');if(img){img.classList.add('walking');if(dir==='left')img.style.transform='scaleX(-1)';if(dir==='right')img.style.transform='scaleX(1)'}update()}
let activeDirection=null,frameId=null,lastFrame=0;function frame(t){if(!activeDirection){frameId=null;lastFrame=0;return}if(!lastFrame)lastFrame=t;const elapsed=t-lastFrame;if(elapsed>=32){lastFrame=t;move(activeDirection,Math.min(elapsed,80)*.045*(window.citySpeedBoost||1.0))}frameId=requestAnimationFrame(frame)}function begin(dir){activeDirection=dir;if(!frameId){lastFrame=0;frameId=requestAnimationFrame(frame)}}function stop(){activeDirection=null;const img=player.getElement()?.querySelector('.sprite');if(img)img.classList.remove('walking')}document.querySelectorAll('[data-dir]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);begin(b.dataset.dir)});b.addEventListener('pointerup',stop);b.addEventListener('pointercancel',stop);b.addEventListener('lostpointercapture',stop)});window.addEventListener('blur',stop);
const keys={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'};document.addEventListener('keydown',e=>{if(!document.querySelector('#modal').hidden||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;const dir=keys[e.key.toLowerCase()]||keys[e.key];if(dir){e.preventDefault();begin(dir)}});document.addEventListener('keyup',e=>{const dir=keys[e.key.toLowerCase()]||keys[e.key];if(dir&&dir===activeDirection)stop()});
const modal=document.querySelector('#modal'),board=document.querySelector('#board'),status=document.querySelector('#mini-status');let cards=[],flipped=[],busy=false,pairs=0;
function game(){cards=['🍎','🍎','⭐','⭐','🌻','🌻','🍒','🍒'].sort(()=>Math.random()-.5);flipped=[];busy=false;pairs=0;status.textContent='Encuentra las cuatro parejas.';board.innerHTML=cards.map((x,i)=>`<button class="memory" data-index="${i}" aria-label="Carta ${i+1}">?</button>`).join('');}
document.querySelector('#play').onclick=()=>{modal.hidden=false;game()};
document.querySelector('#close').onclick=()=>{modal.hidden=true};
document.querySelector('#again').onclick=game;
board.onclick=e=>{let b=e.target.closest('.memory');if(!b||busy||b.disabled||flipped.includes(b))return;let i=Number(b.dataset.index);b.textContent=cards[i];flipped.push(b);if(flipped.length===2){if(cards[Number(flipped[0].dataset.index)]===cards[i]){flipped.forEach(x=>x.disabled=true);flipped=[];pairs++;status.textContent=`Parejas: ${pairs}/4`;if(pairs===4){score++;scoreEl.textContent=score;status.textContent='¡Ganaste! Completaste todas las parejas.'}}else{busy=true;setTimeout(()=>{flipped.forEach(x=>x.textContent='?');flipped=[];busy=false},700)}}};
update();loadWorld();
window.makeCityAvatar=(avatar={})=>{const valid=(v,f)=>/^#[a-fA-F0-9]{6}$/.test(v||'')?v:f;let res=baseSvg.replace('#e14d42',valid(avatar.hat,'#e14d42')).replace('#4f91d1',valid(avatar.shirt,'#4f91d1')).replaceAll('#efbf87',valid(avatar.skin,'#efbf87'));const item=avatar.item||avatar.accessory;let extra='';if(item==='xmas_hat'){extra='<path fill="#29303a" d="M7 1h15v2h5v5h3v5h-5v-1H7z"/><path fill="#d91e2e" d="M8 2h14v7H8z M22 3h4v5h-4z M25 6h3v4h-3z"/><path fill="#ff4d5a" d="M9 3h8v3H9z"/><path fill="#ffffff" d="M5 8h22v4H5z M26 7h4v4h-4z"/><path fill="#e2e8f0" d="M5 11h22v1H5z M27 10h3v1h-3z"/>';}else if(item==='reindeer'){extra='<path fill="#5c3a21" d="M4 0h3v4h2v3H7v-2H5V3H4z M25 0h3v3h-1v2h-2v2h-2V4h2V0z"/><path fill="#8b5a2b" d="M5 1h2v3H5z M25 1h2v2h-2z"/><path fill="#e63946" d="M14 17h4v3h-4z"/><rect x="15" y="18" width="1" height="1" fill="#ffffff"/>';}else if(item==='xmas_scarf'){extra='<path fill="#d91e2e" d="M6 21h20v4H6z M18 25h5v8h-5z"/><path fill="#2d6a4f" d="M10 21h3v4h-3z M19 21h3v4h-3z M18 28h5v2h-5z"/><path fill="#ffffff" d="M18 32h5v1h-5z"/>';}else if(item==='tree_hat'){extra='<path fill="#ffd166" d="M15 0h2v2h-2z M14 1h4v1h-4z"/><path fill="#1b4332" d="M13 2h6v2h-6z M11 4h10v3h-10z M8 7h16v3H8z"/><path fill="#2d6a4f" d="M14 3h4v1h-4z M12 5h8v2h-8z M9 8h14v2H9z"/><circle cx="11" cy="9" r="1" fill="#e63946"/><circle cx="21" cy="9" r="1" fill="#3a86ff"/><circle cx="16" cy="6" r="1" fill="#ffd166"/>';}if(extra){res=res.replace('</svg>',extra+'</svg>');}return res;};window.applyCityAvatar=avatar=>{svg=window.makeCityAvatar(avatar);player.setIcon(makeLocalPlayerIcon());};window.cityProfileReady=new Promise(resolve=>{window.cityProfileResolve=resolve});const profileScript=document.createElement('script');profileScript.src='profile.js';document.body.append(profileScript);
const thoughtScript=document.createElement('script');thoughtScript.src='thought.js';document.body.append(thoughtScript);
const soundScript=document.createElement('script');soundScript.src='sound.js';document.body.append(soundScript);
const multiplayerScript=document.createElement('script');multiplayerScript.src='multiplayer.js';document.body.append(multiplayerScript);
const pokeScript=document.createElement('script');pokeScript.src='pokemon.js';document.body.append(pokeScript);
const battleScript=document.createElement('script');battleScript.src='battle.js';document.body.append(battleScript);
const camilaScript=document.createElement('script');camilaScript.src='camila.js';document.body.append(camilaScript);
const servicesScript=document.createElement('script');servicesScript.src='services.js';document.body.append(servicesScript);
const xmasScript=document.createElement('script');xmasScript.src='christmas.js';document.body.append(xmasScript);

// GitAnimals Pet Companion Support
let playerPetMarker = null;
window.updatePlayerPet = function(pet) {
  if (!pet || pet.id === 'none') {
    if (playerPetMarker && window.map) {
      window.map.removeLayer(playerPetMarker);
      playerPetMarker = null;
    }
    return;
  }
  const petUrl = `https://render.gitanimals.org/lines/devxb?pet-id=${pet.petId || 1}`;
  const html = `
    <div class="player-pet-wrap" title="${pet.title || 'Mascota GitAnimals'}">
      <img src="${petUrl}" width="52" height="34" alt="${pet.label}" style="object-fit: contain; pointer-events: none;">
    </div>
  `;
  const icon = L.divIcon({ className: '', html, iconSize: [52, 34], iconAnchor: [-12, 28] });
  if (!playerPetMarker && window.map) {
    playerPetMarker = L.marker(pos, { icon, interactive: false, zIndexOffset: 920 }).addTo(window.map);
  } else if (playerPetMarker) {
    playerPetMarker.setIcon(icon);
  }
};
window.addEventListener('city-player-moved', (e) => {
  if (playerPetMarker && e.detail) {
    playerPetMarker.setLatLng([e.detail.lat, e.detail.lng]);
  }
});
setTimeout(() => {
  try {
    const saved = localStorage.getItem('ciudad_pet');
    if (saved && saved !== 'none') {
      const petMap = {
        chick: { id: 'chick', label: 'Pollito 🐥', petId: '1', title: 'Little Chick de GitAnimals' },
        cat: { id: 'cat', label: 'Gatito 🐱', petId: '17', title: 'Cheese Cat de GitAnimals' },
        penguin: { id: 'penguin', label: 'Pingüino 🐧', petId: '1057', title: 'Penguin de GitAnimals' },
        capybara: { id: 'capybara', label: 'Capibara 🦫', petId: '791899491629877139', title: 'Capybara de GitAnimals' },
        shiba: { id: 'shiba', label: 'Shiba 🐕', petId: '739451414643536153', title: 'Shiba Inu de GitAnimals' }
      };
      if (petMap[saved]) window.updatePlayerPet(petMap[saved]);
    }
  } catch {}
}, 1200);
