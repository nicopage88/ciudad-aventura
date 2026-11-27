(()=>{
const style=document.createElement('link');style.rel='stylesheet';style.href='profile.css';document.head.append(style);
let profileBtn=document.querySelector('#profile-open');
const root=document.createElement('section');
root.innerHTML=`<div id="profile-overlay" class="profile-overlay" hidden><div class="profile-panel" role="dialog" aria-modal="true" aria-label="Perfil"><header><strong>MI PERSONAJE</strong><button id="profile-close" type="button" aria-label="Cerrar">✕</button></header><div id="auth-view"><h2>¡Wena, veci!</h2><p>Tu apodo y tu clave guardan tu personaje para la próxima visita.</p><form id="auth-form"><label>Apodo<input id="auth-name" autocomplete="username" minlength="3" maxlength="20" pattern="[A-Za-z0-9_]{3,20}" required placeholder="Tu apodo"></label><label>Clave<input id="auth-pass" type="password" autocomplete="current-password" minlength="8" maxlength="128" required placeholder="Mínimo 8 caracteres"></label><button id="auth-submit">Entrar</button></form><button id="auth-switch" type="button" class="link-button">¿Primera vez? Crea tu cuenta</button><small>Guarda bien tu clave: por ahora no hay recuperación.</small></div><div id="profile-view" hidden><h2 id="profile-greeting"></h2><div class="avatar-preview"><img id="avatar-image" alt="Vista previa de tu personaje"></div><div id="avatar-options"></div><button id="avatar-save" type="button">Guardar personaje</button><button id="logout" type="button" class="link-button">Cerrar sesión</button></div><p id="profile-message" role="status"></p></div></div>`;
if(!profileBtn){profileBtn=document.createElement('button');profileBtn.id='profile-open';profileBtn.className='profile-open';profileBtn.textContent='👤 PERFIL';root.prepend(profileBtn)}
document.body.append(root);
const q=s=>root.querySelector(s),overlay=q('#profile-overlay');let mode='login',selected={};const palette={hat:['#e14d42','#3f85c9','#66a66a','#8a65b7','#f0b844'],shirt:['#4f91d1','#df6b61','#61a879','#8d70b8','#e0a43c'],skin:['#efbf87','#e9a76e','#ba7b4c','#875238','#f5d5ae']},labels={hat:'Gorro',shirt:'Ropa',skin:'Piel'};
const items=[
  {id:'none',label:'Ninguno',emoji:'🚫',title:'Sin objeto adicional'},
  {id:'xmas_hat',label:'Gorro Navidad',emoji:'🎅',title:'Gorro de Navidad con pompón y nieve'},
  {id:'reindeer',label:'Cuernos Reno',emoji:'🦌',title:'Astas de reno y nariz roja'},
  {id:'xmas_scarf',label:'Bufanda',emoji:'🧣',title:'Bufanda navideña de lana abrigada'},
  {id:'tree_hat',label:'Arbolito',emoji:'🎄',title:'Gorro de árbol de navidad'}
];
window.cityProfile=null;window.openCityProfile=()=>{overlay.hidden=false;q('#profile-message').textContent=''};profileBtn.onclick=window.openCityProfile;q('#profile-close').onclick=()=>overlay.hidden=true;
function preview(){
  q('#avatar-image').src='data:image/svg+xml,'+encodeURIComponent(window.makeCityAvatar(selected));
  let options=q('#avatar-options');
  options.replaceChildren();
  for(const [key,colors] of Object.entries(palette)){
    const row=document.createElement('div');
    row.className='avatar-row';
    const label=document.createElement('strong');
    label.textContent=labels[key];
    row.append(label);
    colors.forEach((color,i)=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='swatch'+(selected[key]===color?' chosen':'');
      b.style.backgroundColor=color;
      b.setAttribute('aria-label',labels[key]+' opción '+(i+1));
      b.setAttribute('aria-pressed',String(selected[key]===color));
      b.onclick=()=>{selected[key]=color;preview()};
      row.append(b);
    });
    options.append(row);
  }
  const itemSection=document.createElement('div');
  itemSection.className='profile-items-section';
  itemSection.innerHTML='<strong class="items-heading">🎄 Objetos de Navidad:</strong>';
  const itemGrid=document.createElement('div');
  itemGrid.className='item-grid';
  items.forEach(it=>{
    const isSelected=(selected.item||'none')===it.id;
    const b=document.createElement('button');
    b.type='button';
    b.className='item-btn'+(isSelected?' chosen':'');
    b.title=it.title;
    b.innerHTML=`<span class="item-emoji">${it.emoji}</span><span class="item-text">${it.label}</span>`;
    b.setAttribute('aria-pressed',String(isSelected));
    b.onclick=()=>{selected.item=it.id;preview()};
    itemGrid.append(b);
  });
  itemSection.append(itemGrid);
  options.append(itemSection);

  // GitAnimals.org Companion Pet Section
  const gitPets = [
    { id: 'none', label: 'Sin Mascota', emoji: '🚫', title: 'Sin mascota' },
    { id: 'chick', label: 'Pollito 🐥', emoji: '🐥', title: 'Little Chick de GitAnimals', petId: '1' },
    { id: 'cat', label: 'Gatito 🐱', emoji: '🐱', title: 'Cheese Cat de GitAnimals', petId: '17' },
    { id: 'penguin', label: 'Pingüino 🐧', emoji: '🐧', title: 'Penguin de GitAnimals', petId: '1057' },
    { id: 'capybara', label: 'Capibara 🦫', emoji: '🦫', title: 'Capybara de GitAnimals', petId: '791899491629877139' },
    { id: 'shiba', label: 'Shiba 🐕', emoji: '🐕', title: 'Shiba Inu de GitAnimals', petId: '739451414643536153' }
  ];

  const petSection = document.createElement('div');
  petSection.className = 'profile-items-section';
  petSection.innerHTML = '<strong class="items-heading">🐾 Mascota Compañera (GitAnimals):</strong>';
  const petGrid = document.createElement('div');
  petGrid.className = 'item-grid';
  let curPet = 'none';
  try { curPet = localStorage.getItem('ciudad_pet') || 'none'; } catch {}

  gitPets.forEach(p => {
    const isChosen = curPet === p.id;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'item-btn' + (isChosen ? ' chosen' : '');
    b.title = p.title;
    b.innerHTML = `<span class="item-emoji">${p.emoji}</span><span class="item-text">${p.label}</span>`;
    b.onclick = () => {
      try {
        if (p.id === 'none') localStorage.removeItem('ciudad_pet');
        else localStorage.setItem('ciudad_pet', p.id);
      } catch {}
      if (window.updatePlayerPet) window.updatePlayerPet(p);
      preview();
    };
    petGrid.append(b);
  });
  petSection.append(petGrid);
  options.append(petSection);
}
function setUser(user){window.cityProfile=user;q('#auth-view').hidden=!!user;q('#profile-view').hidden=!user;const label=profileBtn.querySelector('.btn-label');if(label){label.textContent=user?user.nickname:'Perfil'}else{profileBtn.textContent=user?'👤 '+user.nickname:'👤 PERFIL'}if(user){selected={...user.avatar};q('#profile-greeting').textContent='¡Wena, '+user.nickname+'!';preview();window.applyCityAvatar(user.avatar)}else window.applyCityAvatar({});window.dispatchEvent(new CustomEvent('city-profile-changed',{detail:user}))}
async function request(body){const response=await fetch('/api/account',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}),data=await response.json();if(!response.ok)throw Error(data.error||'No se pudo completar.');return data}
q('#auth-switch').onclick=()=>{mode=mode==='login'?'register':'login';q('#auth-submit').textContent=mode==='login'?'Entrar':'Crear cuenta';q('#auth-switch').textContent=mode==='login'?'¿Primera vez? Crea tu cuenta':'Ya tengo cuenta';q('#auth-pass').autocomplete=mode==='login'?'current-password':'new-password';q('#profile-message').textContent=''};
q('#auth-form').onsubmit=async e=>{e.preventDefault();let button=q('#auth-submit');button.disabled=true;q('#profile-message').textContent='Un momento…';try{const data=await request({action:mode,nickname:q('#auth-name').value,password:q('#auth-pass').value});q('#auth-pass').value='';setUser(data.user);q('#profile-message').textContent='¡Listo! Personaliza tu personaje.'}catch(err){q('#profile-message').textContent=err.message}finally{button.disabled=false}};
q('#avatar-save').onclick=async()=>{try{const data=await request({action:'avatar',avatar:selected});setUser(data.user);q('#profile-message').textContent='¡Personaje guardado!';setTimeout(()=>{overlay.hidden=true},700)}catch(err){q('#profile-message').textContent=err.message}};
q('#logout').onclick=async()=>{try{await request({action:'logout'});setUser(null);q('#profile-message').textContent='Sesión cerrada.'}catch(err){q('#profile-message').textContent=err.message}};
async function autoGuestRegister(){
  try{
    const rand=Math.floor(1000+Math.random()*9000);
    const guestNick='Veci_'+rand;
    const guestPass='Veci-'+crypto.randomUUID().slice(0,10);
    const res=await request({action:'register',nickname:guestNick,password:guestPass});
    if(res&&res.user){
      setUser(res.user);
      const xmasItems=['xmas_hat','reindeer','xmas_scarf','tree_hat'];
      const chosen=xmasItems[Math.floor(Math.random()*xmasItems.length)];
      request({action:'avatar',avatar:{...res.user.avatar,item:chosen}}).then(d=>{if(d?.user)setUser(d.user);}).catch(()=>{});
      return res.user;
    }
  }catch{}
  return null;
}
fetch('/api/account',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('profile');return r.json()}).then(async data=>{
  if(data&&data.user)setUser(data.user);
  else await autoGuestRegister();
}).catch(async()=>{
  await autoGuestRegister();
}).finally(()=>window.cityProfileResolve());
})();
