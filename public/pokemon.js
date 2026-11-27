(()=>{
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'pokemon.css';
  document.head.append(style);

  // Curated Pokémon catalog including the most powerful ("más perrones"), epic and legendary
  const WILD_POKEMON = [
    // --- LOS MÁS PERRONES (Legendarios y Épicos de alto CP) ---
    { id: 150, name: 'Mewtwo', type: 'Psíquico', color: '#f95587', rarity: 'legendary', baseCp: 3850, hp: 250, moves: [{ name: 'Psicocorte', power: 55, type: 'Psíquico' }, { name: 'Bola Sombra', power: 75, type: 'Fantasma' }, { name: 'Onda Certera', power: 80, type: 'Lucha' }, { name: 'Onda Mental', power: 100, type: 'Psíquico' }] },
    { id: 384, name: 'Rayquaza', type: 'Dragón/Volador', color: '#7038f8', rarity: 'legendary', baseCp: 3750, hp: 240, moves: [{ name: 'Cola Dragón', power: 55, type: 'Dragón' }, { name: 'Tajo Aéreo', power: 65, type: 'Volador' }, { name: 'Enfado', power: 85, type: 'Dragón' }, { name: 'Ascenso Draco', power: 100, type: 'Volador' }] },
    { id: 6, name: 'Charizard', type: 'Fuego/Volador', color: '#ee8130', rarity: 'epic', baseCp: 2880, hp: 210, moves: [{ name: 'Giro Fuego', power: 50, type: 'Fuego' }, { name: 'Garra Dragón', power: 60, type: 'Dragón' }, { name: 'Lanzallamas', power: 75, type: 'Fuego' }, { name: 'Anillo Ígneo', power: 95, type: 'Fuego' }] },
    { id: 448, name: 'Lucario', type: 'Lucha/Acero', color: '#c22e28', rarity: 'epic', baseCp: 2750, hp: 200, moves: [{ name: 'Contraataque', power: 50, type: 'Lucha' }, { name: 'Puño Incremento', power: 55, type: 'Lucha' }, { name: 'Esfera Aural', power: 75, type: 'Lucha' }, { name: 'A Bocajarro', power: 95, type: 'Lucha' }] },
    { id: 94, name: 'Gengar', type: 'Fantasma/Veneno', color: '#705598', rarity: 'epic', baseCp: 2650, hp: 185, moves: [{ name: 'Garra Umbría', power: 45, type: 'Fantasma' }, { name: 'Bomba Lodo', power: 60, type: 'Veneno' }, { name: 'Bola Sombra', power: 75, type: 'Fantasma' }, { name: 'Come Sueños', power: 85, type: 'Psíquico' }] },
    { id: 149, name: 'Dragonite', type: 'Dragón/Volador', color: '#f7a838', rarity: 'epic', baseCp: 3400, hp: 230, moves: [{ name: 'Dragoaliento', power: 50, type: 'Dragón' }, { name: 'Garra Dragón', power: 65, type: 'Dragón' }, { name: 'Cometa Draco', power: 90, type: 'Dragón' }, { name: 'Hiperrayo', power: 95, type: 'Normal' }] },
    { id: 130, name: 'Gyarados', type: 'Agua/Volador', color: '#0077b6', rarity: 'epic', baseCp: 3200, hp: 220, moves: [{ name: 'Cascada', power: 50, type: 'Agua' }, { name: 'Acua Cola', power: 65, type: 'Agua' }, { name: 'Hidrobomba', power: 85, type: 'Agua' }, { name: 'Triturar', power: 70, type: 'Siniestro' }] },
    { id: 248, name: 'Tyranitar', type: 'Roca/Siniestro', color: '#588157', rarity: 'epic', baseCp: 3500, hp: 230, moves: [{ name: 'Antiaéreo', power: 50, type: 'Roca' }, { name: 'Triturar', power: 65, type: 'Siniestro' }, { name: 'Roca Afilada', power: 85, type: 'Roca' }, { name: 'Llamarada', power: 90, type: 'Fuego' }] },
    { id: 445, name: 'Garchomp', type: 'Dragón/Tierra', color: '#4361ee', rarity: 'epic', baseCp: 3600, hp: 235, moves: [{ name: 'Disparo Lodo', power: 45, type: 'Tierra' }, { name: 'Bucle Arena', power: 60, type: 'Tierra' }, { name: 'Terremoto', power: 85, type: 'Tierra' }, { name: 'Enfado', power: 95, type: 'Dragón' }] },
    { id: 145, name: 'Zapdos', type: 'Eléctrico/Volador', color: '#f7d02c', rarity: 'legendary', baseCp: 3250, hp: 210, moves: [{ name: 'Impactrueno', power: 45, type: 'Eléctrico' }, { name: 'Pico Taladro', power: 60, type: 'Volador' }, { name: 'Rayo', power: 75, type: 'Eléctrico' }, { name: 'Trueno', power: 95, type: 'Eléctrico' }] },
    { id: 143, name: 'Snorlax', type: 'Normal', color: '#708090', rarity: 'rare', baseCp: 3100, hp: 290, moves: [{ name: 'Lengüetazo', power: 40, type: 'Fantasma' }, { name: 'Golpe Cuerpo', power: 65, type: 'Normal' }, { name: 'Terremoto', power: 80, type: 'Tierra' }, { name: 'Hiperrayo', power: 95, type: 'Normal' }] },
    { id: 9, name: 'Blastoise', type: 'Agua', color: '#6390f0', rarity: 'rare', baseCp: 2550, hp: 200, moves: [{ name: 'Pistola Agua', power: 45, type: 'Agua' }, { name: 'Rayo Hielo', power: 65, type: 'Hielo' }, { name: 'Hidrobomba', power: 80, type: 'Agua' }, { name: 'Hidrocañón', power: 95, type: 'Agua' }] },
    { id: 59, name: 'Arcanine', type: 'Fuego', color: '#ee8130', rarity: 'rare', baseCp: 2750, hp: 210, moves: [{ name: 'Colmillo Ígneo', power: 50, type: 'Fuego' }, { name: 'Voltio Cruel', power: 65, type: 'Eléctrico' }, { name: 'Lanzallamas', power: 75, type: 'Fuego' }, { name: 'Llamarada', power: 90, type: 'Fuego' }] },
    { id: 68, name: 'Machamp', type: 'Lucha', color: '#9d8189', rarity: 'rare', baseCp: 2700, hp: 210, moves: [{ name: 'Golpe Roca', power: 45, type: 'Lucha' }, { name: 'Tajo Cruzado', power: 65, type: 'Lucha' }, { name: 'Puño Dinámico', power: 80, type: 'Lucha' }, { name: 'A Bocajarro', power: 95, type: 'Lucha' }] },
    { id: 65, name: 'Alakazam', type: 'Psíquico', color: '#f7b05b', rarity: 'rare', baseCp: 2800, hp: 175, moves: [{ name: 'Confusión', power: 50, type: 'Psíquico' }, { name: 'Bola Sombra', power: 65, type: 'Fantasma' }, { name: 'Psicocarga', power: 75, type: 'Psíquico' }, { name: 'Premonición', power: 90, type: 'Psíquico' }] },

    // --- POPULARES Y DE CALLE ---
    { id: 25, name: 'Pikachu', type: 'Eléctrico', color: '#f7d02c', rarity: 'uncommon', baseCp: 1550, hp: 150, moves: [{ name: 'Impactrueno', power: 40, type: 'Eléctrico' }, { name: 'Ataque Rápido', power: 45, type: 'Normal' }, { name: 'Chispazo', power: 60, type: 'Eléctrico' }, { name: 'Trueno', power: 85, type: 'Eléctrico' }] },
    { id: 133, name: 'Eevee', type: 'Normal', color: '#a8a878', rarity: 'uncommon', baseCp: 1350, hp: 140, moves: [{ name: 'Placaje', power: 35, type: 'Normal' }, { name: 'Ataque Rápido', power: 45, type: 'Normal' }, { name: 'Rapidez', power: 55, type: 'Normal' }, { name: 'Última Baza', power: 80, type: 'Normal' }] },
    { id: 4, name: 'Charmander', type: 'Fuego', color: '#ee8130', rarity: 'uncommon', baseCp: 1300, hp: 140, moves: [{ name: 'Ascuas', power: 40, type: 'Fuego' }, { name: 'Arañazo', power: 40, type: 'Normal' }, { name: 'Giro Fuego', power: 55, type: 'Fuego' }, { name: 'Lanzallamas', power: 75, type: 'Fuego' }] },
    { id: 1, name: 'Bulbasaur', type: 'Planta', color: '#7ac74c', rarity: 'uncommon', baseCp: 1300, hp: 140, moves: [{ name: 'Placaje', power: 35, type: 'Normal' }, { name: 'Látigo Cepa', power: 45, type: 'Planta' }, { name: 'Bomba Lodo', power: 60, type: 'Veneno' }, { name: 'Rayo Solar', power: 85, type: 'Planta' }] },
    { id: 7, name: 'Squirtle', type: 'Agua', color: '#6390f0', rarity: 'uncommon', baseCp: 1300, hp: 140, moves: [{ name: 'Burbuja', power: 35, type: 'Agua' }, { name: 'Pistola Agua', power: 45, type: 'Agua' }, { name: 'Acua Cola', power: 60, type: 'Agua' }, { name: 'Hidrobomba', power: 80, type: 'Agua' }] },
    { id: 58, name: 'Growlithe', type: 'Fuego', color: '#ee8130', rarity: 'uncommon', baseCp: 1450, hp: 155, moves: [{ name: 'Ascuas', power: 40, type: 'Fuego' }, { name: 'Mordisco', power: 45, type: 'Siniestro' }, { name: 'Rueda Fuego', power: 60, type: 'Fuego' }, { name: 'Lanzallamas', power: 75, type: 'Fuego' }] },
    { id: 37, name: 'Vulpix', type: 'Fuego', color: '#ee8130', rarity: 'uncommon', baseCp: 1250, hp: 140, moves: [{ name: 'Ascuas', power: 40, type: 'Fuego' }, { name: 'Ataque Rápido', power: 45, type: 'Normal' }, { name: 'Fuego Fatuo', power: 55, type: 'Fuego' }, { name: 'Llamarada', power: 80, type: 'Fuego' }] },
    { id: 79, name: 'Slowpoke', type: 'Agua/Psíquico', color: '#f95587', rarity: 'common', baseCp: 1150, hp: 165, moves: [{ name: 'Pistola Agua', power: 35, type: 'Agua' }, { name: 'Confusión', power: 45, type: 'Psíquico' }, { name: 'Psíquico', power: 65, type: 'Psíquico' }, { name: 'Bostezo', power: 30, type: 'Normal' }] },
    { id: 54, name: 'Psyduck', type: 'Agua', color: '#6390f0', rarity: 'common', baseCp: 1100, hp: 145, moves: [{ name: 'Arañazo', power: 35, type: 'Normal' }, { name: 'Pistola Agua', power: 45, type: 'Agua' }, { name: 'Hidropulso', power: 55, type: 'Agua' }, { name: 'Psicoonda', power: 70, type: 'Psíquico' }] },
    { id: 216, name: 'Teddiursa', type: 'Normal', color: '#a8a878', rarity: 'common', baseCp: 1200, hp: 145, moves: [{ name: 'Arañazo', power: 35, type: 'Normal' }, { name: 'Golpe', power: 50, type: 'Normal' }, { name: 'Tajo Umbrío', power: 60, type: 'Siniestro' }, { name: 'Fuerza Bruta', power: 80, type: 'Lucha' }] }
  ];

  window.WILD_POKEMON = WILD_POKEMON;

  // Plazas and Remote Landmark Registry in Región Metropolitana and Central Zone
  const PLAZAS_AND_LANDMARKS = [
    { name: 'Plaza de Maipú', lat: -33.5100194, lng: -70.756975, radius: 140, isPlaza: true },
    { name: 'Plaza Arica', lat: -33.5014, lng: -70.76412, radius: 100, isPlaza: true },
    { name: 'Plaza de Armas de Santiago', lat: -33.4378, lng: -70.6504, radius: 160, isPlaza: true },
    { name: 'Plaza Ñuñoa', lat: -33.4542, lng: -70.5985, radius: 120, isPlaza: true },
    { name: 'Parque Bustamante / Baquedano', lat: -33.4370, lng: -70.6340, radius: 160, isPlaza: true },
    { name: 'Cerro San Cristóbal', lat: -33.4250, lng: -70.6330, radius: 350, isRemote: true },
    { name: 'Cerro Santa Lucía', lat: -33.4410, lng: -70.6435, radius: 140, isRemote: true },
    { name: 'Parque O\'Higgins', lat: -33.4650, lng: -70.6600, radius: 260, isRemote: true },
    { name: 'Playa y Litoral Central', lat: -33.5850, lng: -71.6150, radius: 2500, isRemote: true }
  ];

  function detectCurrentZone(latlng) {
    if (!latlng) return { isPlaza: false, isRemote: false, name: 'Calles del barrio' };
    for (const z of PLAZAS_AND_LANDMARKS) {
      const dist = latlng.distanceTo(L.latLng(z.lat, z.lng));
      if (dist <= z.radius) {
        return { isPlaza: !!z.isPlaza, isRemote: !!z.isRemote, name: z.name, dist };
      }
    }
    return { isPlaza: false, isRemote: false, name: 'Calles del barrio' };
  }

  // Helper URLs (Showdown Edge CDN + PokeAPI fallback)
  const getAnimatedSprite = (id, name) => {
    if (name) {
      const slug = String(name).toLowerCase().replace(/[^a-z0-9]/g, '');
      return `https://play.pokemonshowdown.com/sprites/ani/${slug}.gif`;
    }
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
  };
  const getStaticSprite = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  // Persistent Pokédex state
  const loadPokedex = () => {
    try {
      return JSON.parse(localStorage.getItem('ciudad_pokedex') || '{}');
    } catch {
      return {};
    }
  };

  const savePokedex = (pokedex) => {
    try {
      localStorage.setItem('ciudad_pokedex', JSON.stringify(pokedex));
    } catch {}
  };

  let pokedex = loadPokedex();
  let caughtCount = Object.keys(pokedex).length;
  window.getPokedex = () => pokedex;

  window.addPokemonToPokedex = function(pokeData, spawnId) {
    if (!pokeData || !pokeData.id) return;
    const cpVal = pokeData.cp || pokeData.baseCp || 1600;
    const existing = pokedex[pokeData.id];
    const count = (typeof existing === 'number' ? existing : (existing?.count || 0)) + 1;
    pokedex[pokeData.id] = {
      id: pokeData.id,
      name: pokeData.name,
      type: pokeData.type,
      color: pokeData.color || '#4361ee',
      rarity: pokeData.rarity || 'common',
      cp: cpVal,
      hp: pokeData.hp || 190,
      maxHp: pokeData.hp || 190,
      moves: pokeData.moves || [],
      count
    };
    savePokedex(pokedex);
    updatePokedexCount();

    if (spawnId && activeSpawns.has(spawnId)) {
      const sp = activeSpawns.get(spawnId);
      if (window.map && sp.marker) window.map.removeLayer(sp.marker);
      activeSpawns.delete(spawnId);
    }
  };

  // Active wild Pokémon on map
  const activeSpawns = new Map(); // id -> { marker, data, latlng }
  let spawnCounter = 0;
  let activeEncounter = null;
  let berryFed = false;
  let lastSpawnTime = 0;

  // UI Setup
  let hudButton = document.querySelector('#pokedex-btn');
  if (!hudButton) {
    hudButton = document.createElement('button');
    hudButton.className = 'pokedex-launch';
    hudButton.id = 'pokedex-btn';
    hudButton.innerHTML = `🔴 MOCHILA <span class="pokedex-badge" id="pokedex-count">${caughtCount}</span>`;
    document.querySelector('.map-wrap')?.append(hudButton);
  } else {
    const badge = hudButton.querySelector('#pokedex-count');
    if (badge) badge.textContent = caughtCount;
  }

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'poke-modal-overlay';
  modalOverlay.hidden = true;
  modalOverlay.innerHTML = `
    <div class="poke-card" id="poke-card-inner">
      <div class="poke-card-header">
        <strong id="poke-modal-title">¡POKÉMON SALVAJE!</strong>
        <button class="poke-card-close" id="poke-modal-close">✕</button>
      </div>
      <div id="poke-modal-body"></div>
    </div>
  `;
  document.body.append(modalOverlay);

  const modalTitle = modalOverlay.querySelector('#poke-modal-title');
  const modalBody = modalOverlay.querySelector('#poke-modal-body');
  const modalClose = modalOverlay.querySelector('#poke-modal-close');

  modalClose.onclick = () => {
    modalOverlay.hidden = true;
    activeEncounter = null;
  };

  hudButton.onclick = () => openPokedexModal();

  function updatePokedexCount() {
    caughtCount = Object.keys(pokedex).length;
    const badge = document.querySelector('#pokedex-count');
    if (badge) badge.textContent = caughtCount;
  }

  // Audio disabled
  function playCry(_id) {}

  // Open Encounter
  function openEncounter(spawnId) {
    const spawn = activeSpawns.get(spawnId);
    if (!spawn) return;

    activeEncounter = spawn;
    berryFed = false;
    modalTitle.textContent = `¡UN ${spawn.data.name.toUpperCase()} SALVAJE!`;

    const cpDisplay = spawn.data.cp || spawn.data.baseCp;

    modalBody.innerHTML = `
      <div class="poke-stage" id="encounter-stage">
        <img class="encounter-sprite" id="encounter-sprite" src="${getAnimatedSprite(spawn.data.id, spawn.data.name)}" alt="${spawn.data.name}" onerror="this.src='${getStaticSprite(spawn.data.id)}'">
        <div class="poke-type-badges">
          <span class="poke-type-badge" style="background-color: ${spawn.data.color};">${spawn.data.type}</span>
          <span class="poke-type-badge" style="background-color: #d90429; font-weight: 900;">CP ${cpDisplay}</span>
          <span class="poke-type-badge" style="background-color: #495057;">#${spawn.data.id}</span>
        </div>
      </div>
      <div class="poke-info-row">
        <span>Rareza: <strong style="color: #d90429;">${spawn.data.rarity.toUpperCase()}</strong></span>
        <span id="encounter-status">${spawn.locationName || 'Apareció en la calle'}</span>
      </div>
      <div class="poke-actions">
        <button class="poke-btn-battle" id="btn-battle-wild">⚔️ Luchar en Arena Pokémon</button>
        <button class="poke-btn-catch" id="btn-catch">🔴 Lanzar Pokébola</button>
        <button class="poke-btn-berry" id="btn-berry">🍓 Dar Baya</button>
        <button class="poke-btn-run" id="btn-run">🏃 Dejar ir</button>
      </div>
    `;

    modalOverlay.hidden = false;
    if (window.playCry) window.playCry(spawn.data.id);

    const btnBattleWild = modalBody.querySelector('#btn-battle-wild');
    const btnCatch = modalBody.querySelector('#btn-catch');
    const btnBerry = modalBody.querySelector('#btn-berry');
    const btnRun = modalBody.querySelector('#btn-run');
    const statusText = modalBody.querySelector('#encounter-status');
    const stage = modalBody.querySelector('#encounter-stage');

    if (btnBattleWild) {
      btnBattleWild.onclick = () => {
        if (window.playClickSound) window.playClickSound();
        modalOverlay.hidden = true;
        activeEncounter = null;
        if (window.startPokemonBattleWithWild) {
          window.startPokemonBattleWithWild(spawn.data, spawnId);
        } else if (window.startPokemonBattle) {
          window.startPokemonBattle(spawn.data, { isWild: true, spawnId });
        }
      };
    }

    btnBerry.onclick = () => {
      if (window.playClickSound) window.playClickSound();
      if (berryFed) {
        statusText.textContent = `¡${spawn.data.name} ya está satisfecho! ❤️`;
        return;
      }
      berryFed = true;
      statusText.textContent = `¡A ${spawn.data.name} le encantó la Baya! ❤️ Subió tu probabilidad.`;
      btnBerry.disabled = true;
      btnBerry.style.opacity = '0.6';
      if (window.show) window.show(`🍓 ¡Le diste una baya a ${spawn.data.name}!`);
    };

    btnRun.onclick = () => {
      if (window.playClickSound) window.playClickSound();
      modalOverlay.hidden = true;
      activeEncounter = null;
    };

    btnCatch.onclick = () => {
      if (window.playThrowSound) window.playThrowSound();
      btnCatch.disabled = true;
      btnBerry.disabled = true;
      btnRun.disabled = true;
      statusText.textContent = '¡Lanzando Pokébola...! 🔴';

      const sprite = modalBody.querySelector('#encounter-sprite');
      sprite.style.display = 'none';

      const ball = document.createElement('div');
      ball.className = 'pokeball-throw-anim';
      ball.innerHTML = `
        <svg viewBox="0 0 100 100" width="48" height="48">
          <circle cx="50" cy="50" r="48" fill="#fff" stroke="#111" stroke-width="6"/>
          <path d="M 2 50 A 48 48 0 0 1 98 50 Z" fill="#e63946"/>
          <rect x="2" y="46" width="96" height="8" fill="#111"/>
          <circle cx="50" cy="50" r="14" fill="#fff" stroke="#111" stroke-width="6"/>
          <circle cx="50" cy="50" r="6" fill="#333"/>
        </svg>
      `;
      stage.append(ball);

      // Catch rate calculation:
      const baseChance = { common: 0.90, uncommon: 0.80, rare: 0.65, epic: 0.50, legendary: 0.40 }[spawn.data.rarity] || 0.70;
      const successChance = berryFed ? Math.min(1.0, baseChance + 0.25) : baseChance;
      const caught = Math.random() < successChance;

      setTimeout(() => {
        if (caught) {
          if (window.playCatchSound) window.playCatchSound();
          if (window.playCry) setTimeout(() => window.playCry(spawn.data.id), 600);
          statusText.textContent = `¡${spawn.data.name} atrapado con éxito! 🎉 (CP ${cpDisplay})`;

          // Save rich Pokémon info for battles
          const existing = pokedex[spawn.data.id];
          const count = (typeof existing === 'number' ? existing : (existing?.count || 0)) + 1;
          pokedex[spawn.data.id] = {
            id: spawn.data.id,
            name: spawn.data.name,
            type: spawn.data.type,
            color: spawn.data.color,
            rarity: spawn.data.rarity,
            cp: cpDisplay,
            hp: spawn.data.hp || 190,
            maxHp: spawn.data.hp || 190,
            moves: spawn.data.moves || [],
            count
          };
          savePokedex(pokedex);
          updatePokedexCount();

          // Remove from map
          if (window.map && spawn.marker) {
            window.map.removeLayer(spawn.marker);
          }
          activeSpawns.delete(spawnId);

          if (window.show) window.show(`⭐ ¡Atrapaste a ${spawn.data.name} (CP ${cpDisplay})! Listo para el combate.`);
          
          setTimeout(() => {
            modalOverlay.hidden = true;
            activeEncounter = null;
          }, 1800);
        } else {
          ball.remove();
          sprite.style.display = 'block';
          statusText.textContent = `¡${spawn.data.name} se liberó de la Pokébola! 💨 Intenta de nuevo.`;
          btnCatch.disabled = false;
          btnRun.disabled = false;
        }
      }, 1650);
    };
  }

  // Open Pokédex collection modal
  function openPokedexModal() {
    modalTitle.textContent = '🎒 TU MOCHILA POKÉMON';
    let itemsHtml = WILD_POKEMON.map(p => {
      const entry = pokedex[p.id];
      const count = typeof entry === 'number' ? entry : (entry?.count || 0);
      const cpVal = entry?.cp || p.baseCp;
      const caughtClass = count > 0 ? 'caught' : 'unseen';
      return `
        <div class="pokedex-item ${caughtClass}">
          <img src="${count > 0 ? getAnimatedSprite(p.id) : getStaticSprite(p.id)}" alt="${p.name}" onerror="this.src='${getStaticSprite(p.id)}'">
          <span>${p.name}</span>
          <small>${count > 0 ? `CP ${cpVal} (×${count})` : '---'}</small>
        </div>
      `;
    }).join('');

    modalBody.innerHTML = `
      <p style="font-size: 0.82rem; margin-bottom: 12px; color: #374151;">
        Has capturado <strong>${caughtCount} de ${WILD_POKEMON.length}</strong> especies. ¡Los Pokémon de mayor CP lucharán en la arena contra Camila y jugadores online!
      </p>
      <div class="pokedex-grid">
        ${itemsHtml}
      </div>
      <div style="margin-top: 14px; display: flex; gap: 8px;">
        <button class="fair-goto-btn" style="flex: 1; padding: 10px;" onclick="document.querySelector('.poke-modal-overlay').hidden = true; if(window.startPokemonBattle) window.startPokemonBattle();">⚔️ Ir a Batalla</button>
        <button class="poke-btn-run" style="flex: 1;" onclick="document.querySelector('.poke-modal-overlay').hidden = true;">Cerrar</button>
      </div>
    `;
    modalOverlay.hidden = false;
  }
  window.openPokedexModal = openPokedexModal;

  // Create Leaflet icon for Pokemon
  function createPokemonIcon(data) {
    const isEpicOrLegendary = data.rarity === 'epic' || data.rarity === 'legendary';
    const badgeColor = data.rarity === 'legendary' ? '#ffd700' : (data.rarity === 'epic' ? '#ff0054' : '#ffcb05');
    const badgeText = data.rarity === 'legendary' ? '★ LEGENDARIO' : (data.rarity === 'epic' ? '⚡ PERRÓN' : data.name);

    const html = `
      <div class="pokemon-marker ${isEpicOrLegendary ? 'pokemon-perron' : ''}">
        <div class="poke-spawn-sparkle">✨</div>
        <div class="poke-tag" style="border-color: ${badgeColor};">
          <span class="wild-badge" style="color: ${badgeColor};">●</span>
          <span>${badgeText}</span>
        </div>
        <img class="poke-sprite" src="${getAnimatedSprite(data.id, data.name)}" alt="${data.name}" onerror="this.src='${getStaticSprite(data.id)}'">
      </div>
    `;
    return L.divIcon({
      className: '',
      html,
      iconSize: [66, 80],
      iconAnchor: [33, 72]
    });
  }

  // Pick Pokémon according to zone (Plaza = Los más perrones, Remoto = Legendarios, Calles = Variados)
  function pickPokemonForZone(zone) {
    let pool;
    if (zone.isPlaza) {
      // In plazas: 75% chance of epic/rare/legendary "más perrones"
      if (Math.random() < 0.75) {
        pool = WILD_POKEMON.filter(p => p.rarity === 'epic' || p.rarity === 'legendary' || p.rarity === 'rare');
      } else {
        pool = WILD_POKEMON;
      }
    } else if (zone.isRemote) {
      // In remote spots (hills, coast, beaches): 65% chance of legendary or epic
      if (Math.random() < 0.65) {
        pool = WILD_POKEMON.filter(p => p.rarity === 'legendary' || p.rarity === 'epic');
      } else {
        pool = WILD_POKEMON;
      }
    } else {
      // Regular streets: common, uncommon, occasional rare
      if (Math.random() < 0.20) {
        pool = WILD_POKEMON.filter(p => p.rarity === 'rare');
      } else {
        pool = WILD_POKEMON.filter(p => p.rarity === 'common' || p.rarity === 'uncommon');
      }
    }

    if (!pool || pool.length === 0) pool = WILD_POKEMON;
    const base = pool[Math.floor(Math.random() * pool.length)];

    // Generate dynamic CP around base
    const variance = 0.88 + Math.random() * 0.26;
    const cp = Math.round(base.baseCp * variance);

    return {
      ...base,
      cp
    };
  }

  // Spawner logic
  function spawnWildPokemonNear(playerLatLng) {
    if (!window.map || !playerLatLng) return;

    const zone = detectCurrentZone(playerLatLng);
    const maxSpawns = zone.isPlaza ? 4 : (zone.isRemote ? 3 : 2);

    if (activeSpawns.size >= maxSpawns) return;

    const pData = pickPokemonForZone(zone);
    
    // Spawn within 25 to 65 meters in random direction
    const distanceMeters = 25 + Math.random() * 40;
    const angle = Math.random() * Math.PI * 2;
    const dLat = (distanceMeters * Math.cos(angle)) / 111320;
    const dLng = (distanceMeters * Math.sin(angle)) / (111320 * Math.cos(playerLatLng.lat * Math.PI / 180));
    
    const spawnPos = L.latLng(playerLatLng.lat + dLat, playerLatLng.lng + dLng);
    const spawnId = 'poke_' + (++spawnCounter);

    const marker = L.marker(spawnPos, {
      icon: createPokemonIcon(pData),
      zIndexOffset: 850
    }).addTo(window.map);

    marker.on('click', () => {
      openEncounter(spawnId);
    });

    const spawnObj = {
      id: spawnId,
      marker,
      data: pData,
      latlng: spawnPos,
      locationName: zone.name,
      createdAt: Date.now()
    };

    activeSpawns.set(spawnId, spawnObj);
    lastSpawnTime = Date.now();

    // Inform user when entering a plaza with perrones
    if (zone.isPlaza && (pData.rarity === 'epic' || pData.rarity === 'legendary') && Math.random() < 0.4 && window.show) {
      window.show(`⚡ ¡Un ${pData.name} de alto nivel (CP ${pData.cp}) apareció en ${zone.name}!`);
    }
  }

  // Clean faraway Pokémon and auto-check proximity
  function updatePokemonSpawns(playerLatLng) {
    if (!window.map || !playerLatLng) return;

    const now = Date.now();
    const zone = detectCurrentZone(playerLatLng);
    const maxSpawns = zone.isPlaza ? 4 : (zone.isRemote ? 3 : 2);
    const spawnInterval = zone.isPlaza ? 14000 : 28000;

    for (const [id, spawn] of activeSpawns) {
      const dist = playerLatLng.distanceTo(spawn.latlng);
      
      // Auto-trigger encounter if walked right over it (<12m)
      if (dist < 12 && (!activeEncounter || activeEncounter.id !== id) && modalOverlay.hidden) {
        openEncounter(id);
        break;
      }

      // Despawn if moved far away (>130m) or lived > 5 minutes
      if (dist > 130 || (now - spawn.createdAt > 300000)) {
        window.map.removeLayer(spawn.marker);
        activeSpawns.delete(id);
      }
    }

    // Spawn if below limit and cooldown elapsed
    if (activeSpawns.size < maxSpawns && (now - lastSpawnTime > spawnInterval)) {
      spawnWildPokemonNear(playerLatLng);
    }
  }

  // Periodic cycle
  let lastMoveCheck = 0;
  function initPokemonLoop() {
    if (!window.map || !window.pos) {
      setTimeout(initPokemonLoop, 500);
      return;
    }

    // Initial batch in current zone
    setTimeout(() => {
      if (window.pos) {
        spawnWildPokemonNear(window.pos);
        // If plaza, spawn a second one
        const zone = detectCurrentZone(window.pos);
        if (zone.isPlaza) {
          setTimeout(() => spawnWildPokemonNear(window.pos), 1200);
        }
      }
    }, 1500);

    // Periodic check every 15 seconds
    setInterval(() => {
      if (window.pos) {
        updatePokemonSpawns(window.pos);
      }
    }, 15000);

    // Listen for movement
    window.addEventListener('city-player-moved', (e) => {
      const now = Date.now();
      if (e.detail && (now - lastMoveCheck > 4000)) {
        lastMoveCheck = now;
        updatePokemonSpawns(L.latLng(e.detail.lat, e.detail.lng));
      }
    });
  }

  initPokemonLoop();
})();
