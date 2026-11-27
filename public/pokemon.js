// GitAnimals & Wildlife System for Ciudad Aventura (Powered by GitAnimals.org)
(()=>{
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'pokemon.css';
  document.head.append(style);

  // Curated GitAnimals catalog with authentic GitAnimals.org animated vector sprites
  const GIT_ANIMALS = [
    // --- LOS MÁS PERRONES (Legendarios y Épicos de GitAnimals) ---
    {
      id: 101,
      petId: '791899491629877139',
      name: 'Capibara Gigante',
      emoji: '🦫',
      type: 'Fauna / Chill',
      color: '#99582a',
      rarity: 'legendary',
      baseCp: 3800,
      hp: 260,
      moves: [
        { name: 'Zen Capibara', power: 55, type: 'Chill' },
        { name: 'Bao de Barro', power: 75, type: 'Tierra' },
        { name: 'Mordisco Relajado', power: 80, type: 'Fauna' },
        { name: 'Carga Soberana', power: 100, type: 'Fauna' }
      ]
    },
    {
      id: 102,
      petId: '577523468959026701',
      name: 'Conejo Rudolph',
      emoji: '🦌',
      type: 'Navideño',
      color: '#c1121f',
      rarity: 'legendary',
      baseCp: 3700,
      hp: 245,
      moves: [
        { name: 'Nariz Roja', power: 55, type: 'Luz' },
        { name: 'Salto Polar', power: 65, type: 'Hielo' },
        { name: 'Espíritu Navideño', power: 85, type: 'Mágico' },
        { name: 'Ventisca Navideña', power: 100, type: 'Hielo' }
      ]
    },
    {
      id: 103,
      petId: '739451414643536153',
      name: 'Shiba Inu Perrón',
      emoji: '🐕',
      type: 'Canino / Leal',
      color: '#e07a5f',
      rarity: 'epic',
      baseCp: 3500,
      hp: 230,
      moves: [
        { name: 'Ladrido Furioso', power: 50, type: 'Canino' },
        { name: 'Doble Salto', power: 65, type: 'Agilidad' },
        { name: 'Mordida Ágil', power: 75, type: 'Canino' },
        { name: 'Impacto Shiba', power: 95, type: 'Perrón' }
      ]
    },
    {
      id: 104,
      petId: '882831376988693460',
      name: 'Capibara con Zanahoria',
      emoji: '🥕',
      type: 'Fauna',
      color: '#bc6c25',
      rarity: 'epic',
      baseCp: 3200,
      hp: 220,
      moves: [
        { name: 'Mordisco Zanahoria', power: 50, type: 'Fauna' },
        { name: 'Reflexión Marina', power: 65, type: 'Agua' },
        { name: 'Giro Relajado', power: 75, type: 'Fauna' },
        { name: 'Golpe Cosecha', power: 90, type: 'Tierra' }
      ]
    },
    {
      id: 105,
      petId: '103',
      name: 'Pingüino con Lentes',
      emoji: '🐧',
      type: 'Hielo / Fachero',
      color: '#2a9d8f',
      rarity: 'epic',
      baseCp: 3300,
      hp: 215,
      moves: [
        { name: 'Desliz Glaciar', power: 50, type: 'Hielo' },
        { name: 'Destello Fachero', power: 65, type: 'Luz' },
        { name: 'Aletazo Polar', power: 80, type: 'Hielo' },
        { name: 'Tsunami Frío', power: 95, type: 'Agua' }
      ]
    },
    {
      id: 106,
      petId: '6',
      name: 'Pollito Fachero',
      emoji: '🐥',
      type: 'Ave / Estilo',
      color: '#f4a261',
      rarity: 'epic',
      baseCp: 3100,
      hp: 200,
      moves: [
        { name: 'Picotazo Fachero', power: 50, type: 'Ave' },
        { name: 'Aleteo Dorado', power: 65, type: 'Estilo' },
        { name: 'Destello Lentes', power: 75, type: 'Luz' },
        { name: 'Rayo Estelar', power: 90, type: 'Estilo' }
      ]
    },
    {
      id: 107,
      petId: '17',
      name: 'Gatito de Queso',
      emoji: '🧀',
      type: 'Felino',
      color: '#e9c46a',
      rarity: 'epic',
      baseCp: 2950,
      hp: 195,
      moves: [
        { name: 'Arañazo Veloz', power: 45, type: 'Felino' },
        { name: 'Ronroneo Feroz', power: 60, type: 'Felino' },
        { name: 'Zarpazo Quesero', power: 75, type: 'Felino' },
        { name: 'Salto Felino', power: 90, type: 'Agilidad' }
      ]
    },
    {
      id: 108,
      petId: '577523468959026700',
      name: 'Quokka Feliz',
      emoji: '😊',
      type: 'Felicidad',
      color: '#a2d2ff',
      rarity: 'rare',
      baseCp: 2800,
      hp: 190,
      moves: [
        { name: 'Sonrisa Radiante', power: 45, type: 'Luz' },
        { name: 'Abrazo Amigo', power: 60, type: 'Felicidad' },
        { name: 'Salto Alegre', power: 75, type: 'Felicidad' },
        { name: 'Onda Positiva', power: 90, type: 'Felicidad' }
      ]
    },
    {
      id: 109,
      petId: '107',
      name: 'Ganso Bravo',
      emoji: '🪿',
      type: 'Ave / Bravo',
      color: '#f77f00',
      rarity: 'rare',
      baseCp: 2750,
      hp: 195,
      moves: [
        { name: 'Graznido Bélico', power: 45, type: 'Bravo' },
        { name: 'Persecución', power: 60, type: 'Agilidad' },
        { name: 'Picotazo Loco', power: 75, type: 'Bravo' },
        { name: 'Aletazo Feroz', power: 90, type: 'Bravo' }
      ]
    },
    {
      id: 110,
      petId: '791663331330084729',
      name: 'Gato Blanco',
      emoji: '🐱',
      type: 'Felino',
      color: '#f8f9fa',
      rarity: 'rare',
      baseCp: 2700,
      hp: 185,
      moves: [
        { name: 'Zarpazo Nieve', power: 45, type: 'Felino' },
        { name: 'Sigilo Nocturno', power: 60, type: 'Sombra' },
        { name: 'Salto Garra', power: 75, type: 'Felino' },
        { name: 'Impacto Lunar', power: 85, type: 'Mágico' }
      ]
    },
    {
      id: 111,
      petId: '1057',
      name: 'Pingüino Austral',
      emoji: '🐧',
      type: 'Hielo',
      color: '#457b9d',
      rarity: 'rare',
      baseCp: 2600,
      hp: 190,
      moves: [
        { name: 'Picotazo Helado', power: 45, type: 'Hielo' },
        { name: 'Patinada Veloz', power: 60, type: 'Agilidad' },
        { name: 'Rayo Hielo', power: 75, type: 'Hielo' },
        { name: 'Granizada', power: 85, type: 'Hielo' }
      ]
    },
    {
      id: 112,
      petId: '125',
      name: 'Flamenco Rosado',
      emoji: '🦩',
      type: 'Ave',
      color: '#ff70a6',
      rarity: 'rare',
      baseCp: 2650,
      hp: 185,
      moves: [
        { name: 'Danza Rosa', power: 45, type: 'Ave' },
        { name: 'Picotazo Laguna', power: 60, type: 'Agua' },
        { name: 'Vuelo Elegante', power: 75, type: 'Aire' },
        { name: 'Canto Flamenco', power: 85, type: 'Música' }
      ]
    },

    // --- DE BARRIO Y CALLES (GitAnimals Populares) ---
    {
      id: 113,
      petId: '1020',
      name: 'Slime Rojo',
      emoji: '🔴',
      type: 'Gelatina / Fuego',
      color: '#e63946',
      rarity: 'uncommon',
      baseCp: 1750,
      hp: 160,
      moves: [
        { name: 'Salpicadura Ígnea', power: 40, type: 'Fuego' },
        { name: 'Rebote Ardiente', power: 55, type: 'Fuego' },
        { name: 'Chispa Bote', power: 65, type: 'Fuego' },
        { name: 'Explosión Slime', power: 85, type: 'Fuego' }
      ]
    },
    {
      id: 114,
      petId: '882831374509852857',
      name: 'Slime Azul',
      emoji: '🔵',
      type: 'Gelatina / Agua',
      color: '#3a86ff',
      rarity: 'uncommon',
      baseCp: 1700,
      hp: 160,
      moves: [
        { name: 'Burbuja Bote', power: 40, type: 'Agua' },
        { name: 'Chorrito', power: 55, type: 'Agua' },
        { name: 'Salto Acuático', power: 65, type: 'Agua' },
        { name: 'Mega Ola', power: 85, type: 'Agua' }
      ]
    },
    {
      id: 115,
      petId: '126',
      name: 'Slime Verde',
      emoji: '🟢',
      type: 'Gelatina',
      color: '#38b000',
      rarity: 'uncommon',
      baseCp: 1600,
      hp: 155,
      moves: [
        { name: 'Rebote Básico', power: 35, type: 'Gelatina' },
        { name: 'Salpicón', power: 50, type: 'Gelatina' },
        { name: 'Super Salto', power: 65, type: 'Gelatina' },
        { name: 'Gelatina Gigante', power: 80, type: 'Gelatina' }
      ]
    },
    {
      id: 116,
      petId: '1',
      name: 'Pollito GitAnimals',
      emoji: '🐥',
      type: 'Ave',
      color: '#ffd166',
      rarity: 'common',
      baseCp: 1400,
      hp: 145,
      moves: [
        { name: 'Picotazo', power: 35, type: 'Ave' },
        { name: 'Cacareo Alegre', power: 45, type: 'Normal' },
        { name: 'Aleteo Rápido', power: 55, type: 'Ave' },
        { name: 'Súper Carrera', power: 75, type: 'Normal' }
      ]
    },
    {
      id: 117,
      petId: '737937905409645544',
      name: 'Conejito',
      emoji: '🐰',
      type: 'Fauna',
      color: '#d8bbff',
      rarity: 'common',
      baseCp: 1350,
      hp: 140,
      moves: [
        { name: 'Mordisco', power: 35, type: 'Fauna' },
        { name: 'Salto Largo', power: 45, type: 'Fauna' },
        { name: 'Patada Conejo', power: 60, type: 'Lucha' },
        { name: 'Salto Veloz', power: 75, type: 'Fauna' }
      ]
    },
    {
      id: 118,
      petId: '582912111348294524',
      name: 'Chanchito',
      emoji: '🐷',
      type: 'Fauna',
      color: '#ffb5a7',
      rarity: 'common',
      baseCp: 1300,
      hp: 150,
      moves: [
        { name: 'Oink Sonoro', power: 35, type: 'Normal' },
        { name: 'Embestida Suave', power: 45, type: 'Fauna' },
        { name: 'Revolcón', power: 60, type: 'Tierra' },
        { name: 'Carga Chanchito', power: 80, type: 'Fauna' }
      ]
    },
    {
      id: 119,
      petId: '764717762480517875',
      name: 'Hámster Glotón',
      emoji: '🐹',
      type: 'Fauna',
      color: '#f3c68f',
      rarity: 'common',
      baseCp: 1250,
      hp: 135,
      moves: [
        { name: 'Mordisquito', power: 35, type: 'Fauna' },
        { name: 'Semillazo', power: 45, type: 'Planta' },
        { name: 'Giro en Rueda', power: 60, type: 'Normal' },
        { name: 'Bofetada Hámster', power: 75, type: 'Fauna' }
      ]
    },
    {
      id: 120,
      petId: '582445371259817665',
      name: 'Topo Curioso',
      emoji: '🐾',
      type: 'Tierra',
      color: '#7f5539',
      rarity: 'common',
      baseCp: 1200,
      hp: 135,
      moves: [
        { name: 'Excavada', power: 35, type: 'Tierra' },
        { name: 'Zarpazo Tierra', power: 45, type: 'Tierra' },
        { name: 'Lanzar Piedra', power: 60, type: 'Roca' },
        { name: 'Túnel Secreto', power: 75, type: 'Tierra' }
      ]
    }
  ];

  window.GIT_ANIMALS = GIT_ANIMALS;
  window.WILD_POKEMON = GIT_ANIMALS; // Compatibility alias

  // Helper URLs for GitAnimals
  const getGitAnimalSprite = (petId) => `https://render.gitanimals.org/lines/devxb?pet-id=${petId || '1'}`;
  const getAnimatedSprite = (id, _name) => {
    const found = GIT_ANIMALS.find(a => a.id === id || a.petId === String(id));
    if (found) return getGitAnimalSprite(found.petId);
    return getGitAnimalSprite('1');
  };
  const getStaticSprite = (id) => getAnimatedSprite(id);

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

  // Persistent Collection state
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

  window.addPokemonToPokedex = function(animalData, spawnId) {
    if (!animalData || !animalData.id) return;
    const cpVal = animalData.cp || animalData.baseCp || 1600;
    const existing = pokedex[animalData.id];
    const count = (typeof existing === 'number' ? existing : (existing?.count || 0)) + 1;
    pokedex[animalData.id] = {
      id: animalData.id,
      petId: animalData.petId,
      name: animalData.name,
      emoji: animalData.emoji || '🐾',
      type: animalData.type,
      color: animalData.color || '#4361ee',
      rarity: animalData.rarity || 'common',
      cp: cpVal,
      hp: animalData.hp || 190,
      maxHp: animalData.hp || 190,
      moves: animalData.moves || [],
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

  // Active wild GitAnimals on map
  const activeSpawns = new Map(); // id -> { marker, data, latlng }
  let spawnCounter = 0;
  let activeEncounter = null;
  let berryFed = false;
  let lastSpawnTime = 0;

  // UI Setup: Modal Overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'poke-modal-overlay';
  modalOverlay.hidden = true;
  modalOverlay.innerHTML = `
    <div class="poke-card" id="poke-card-inner">
      <div class="poke-card-header">
        <strong id="poke-modal-title">¡ANIMALITO GITANIMALS!</strong>
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

  function updatePokedexCount() {
    caughtCount = Object.keys(pokedex).length;
    const badge = document.querySelector('#pokedex-count');
    if (badge) badge.textContent = caughtCount;
  }

  // Hook button in footer dock
  function hookDockPokedexBtn() {
    const dockBtn = document.querySelector('#pokedex-btn');
    if (dockBtn) {
      const label = dockBtn.querySelector('.btn-label');
      if (label) label.textContent = 'Animalitos';
      const emoji = dockBtn.querySelector('.btn-emoji');
      if (emoji) emoji.textContent = '🐾';
      dockBtn.onclick = () => {
        if (window.playClickSound) window.playClickSound();
        openPokedexModal();
      };
      updatePokedexCount();
    }
  }
  hookDockPokedexBtn();

  // Open Encounter
  function openEncounter(spawnId) {
    const spawn = activeSpawns.get(spawnId);
    if (!spawn) return;

    activeEncounter = spawn;
    berryFed = false;
    modalTitle.textContent = `¡${spawn.data.name.toUpperCase()} SALVAJE!`;

    const cpDisplay = spawn.data.cp || spawn.data.baseCp;
    const petUrl = getGitAnimalSprite(spawn.data.petId);

    modalBody.innerHTML = `
      <div class="poke-stage" id="encounter-stage" style="min-height: 140px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <img class="encounter-sprite" id="encounter-sprite" src="${petUrl}" alt="${spawn.data.name}" style="width: 140px; height: 90px; object-fit: contain;">
        <div class="poke-type-badges" style="margin-top: 10px;">
          <span class="poke-type-badge" style="background-color: ${spawn.data.color};">${spawn.data.emoji} ${spawn.data.type}</span>
          <span class="poke-type-badge" style="background-color: #d90429; font-weight: 900;">CP ${cpDisplay}</span>
          <span class="poke-type-badge" style="background-color: #1b263b;">GitAnimals.org</span>
        </div>
      </div>
      <div class="poke-info-row">
        <span>Rareza: <strong style="color: #d90429;">${spawn.data.rarity.toUpperCase()}</strong></span>
        <span id="encounter-status">${spawn.locationName || 'Encontrado en las calles'}</span>
      </div>
      <div class="poke-actions">
        <button class="poke-btn-battle" id="btn-battle-wild">⚔️ Duelo en Arena de Mascotas</button>
        <button class="poke-btn-catch" id="btn-catch">🏡 Adoptar / Atrapar</button>
        <button class="poke-btn-berry" id="btn-berry">🥕 Dar Comidita (+Probabilidad)</button>
        <button class="poke-btn-run" id="btn-run">🏃 Dejar ir</button>
      </div>
    `;

    modalOverlay.hidden = false;

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
      statusText.textContent = `¡A ${spawn.data.name} le encantó la comida! ❤️ Ahora es más fácil adoptarlo.`;
      btnBerry.disabled = true;
      btnBerry.style.opacity = '0.6';
      if (window.show) window.show(`🥕 ¡Alimentaste a ${spawn.data.name}!`);
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
      if (btnBattleWild) btnBattleWild.disabled = true;
      statusText.textContent = `¡Acercándote con cariño a ${spawn.data.name}... 🏡!`;

      // Catch rate calculation:
      const baseChance = { common: 0.92, uncommon: 0.85, rare: 0.70, epic: 0.55, legendary: 0.42 }[spawn.data.rarity] || 0.75;
      const successChance = berryFed ? Math.min(1.0, baseChance + 0.25) : baseChance;
      const caught = Math.random() < successChance;

      setTimeout(() => {
        if (caught) {
          if (window.playCatchSound) window.playCatchSound();
          statusText.textContent = `¡${spawn.data.name} adoptado con éxito! 🎉 (CP ${cpDisplay})`;

          window.addPokemonToPokedex(spawn.data, spawnId);

          if (window.show) window.show(`⭐ ¡Adoptaste a ${spawn.data.name} (CP ${cpDisplay})!`);

          setTimeout(() => {
            modalOverlay.hidden = true;
            activeEncounter = null;
          }, 1500);
        } else {
          statusText.textContent = `¡${spawn.data.name} se asustó y escapó un poco! 💨`;
          btnCatch.disabled = false;
          btnRun.disabled = false;
          if (btnBattleWild) btnBattleWild.disabled = false;
        }
      }, 1400);
    };
  }

  // Open Collection modal
  function openPokedexModal() {
    modalTitle.textContent = '🎒 TU GRANJA DE ANIMALITOS GITANIMALS';
    let itemsHtml = GIT_ANIMALS.map(p => {
      const entry = pokedex[p.id];
      const count = typeof entry === 'number' ? entry : (entry?.count || 0);
      const cpVal = entry?.cp || p.baseCp;
      const caughtClass = count > 0 ? 'caught' : 'unseen';
      const petUrl = getGitAnimalSprite(p.petId);

      return `
        <div class="pokedex-item ${caughtClass}">
          <img src="${petUrl}" alt="${p.name}" style="width: 58px; height: 38px; object-fit: contain;">
          <span>${p.emoji} ${p.name}</span>
          <small>${count > 0 ? `CP ${cpVal} (×${count})` : 'Por descubrir'}</small>
        </div>
      `;
    }).join('');

    modalBody.innerHTML = `
      <p style="font-size: 0.82rem; margin-bottom: 12px; color: #374151;">
        Has adoptado <strong>${caughtCount} de ${GIT_ANIMALS.length}</strong> especies de <b>GitAnimals.org</b> caminando por tu barrio. ¡Tus animalitos de mayor CP luchan en la arena con Camila!
      </p>
      <div class="pokedex-grid">
        ${itemsHtml}
      </div>
      <div style="margin-top: 14px; display: flex; gap: 8px;">
        <button class="fair-goto-btn" style="flex: 1; padding: 10px;" onclick="document.querySelector('.poke-modal-overlay').hidden = true; if(window.startPokemonBattle) window.startPokemonBattle();">⚔️ Ir a Duelo en Arena</button>
        <button class="poke-btn-run" style="flex: 1;" onclick="document.querySelector('.poke-modal-overlay').hidden = true;">Cerrar</button>
      </div>
    `;
    modalOverlay.hidden = false;
  }
  window.openPokedexModal = openPokedexModal;

  // Create Leaflet icon for GitAnimal
  function createAnimalIcon(data) {
    const isEpicOrLegendary = data.rarity === 'epic' || data.rarity === 'legendary';
    const badgeColor = data.rarity === 'legendary' ? '#ffd700' : (data.rarity === 'epic' ? '#ff0054' : '#2a9d8f');
    const badgeText = data.rarity === 'legendary' ? '★ LEGENDARIO' : (data.rarity === 'epic' ? '⚡ PERRÓN' : data.name);
    const petUrl = getGitAnimalSprite(data.petId);

    const html = `
      <div class="pokemon-marker gitanimal-marker ${isEpicOrLegendary ? 'pokemon-perron' : ''}">
        <div class="poke-spawn-sparkle">✨</div>
        <div class="poke-tag" style="border-color: ${badgeColor};">
          <span class="wild-badge">${data.emoji}</span>
          <span>${badgeText}</span>
        </div>
        <div class="gitanimal-sprite-box">
          <img class="gitanimal-map-sprite" src="${petUrl}" width="65" height="42" alt="${data.name}" style="object-fit: contain;">
        </div>
      </div>
    `;
    return L.divIcon({
      className: '',
      html,
      iconSize: [70, 75],
      iconAnchor: [35, 65]
    });
  }

  // Pick GitAnimal according to zone (Plaza = Los más perrones, Remoto = Legendarios, Calles = Variados)
  function pickAnimalForZone(zone) {
    let pool;
    if (zone.isPlaza) {
      if (Math.random() < 0.75) {
        pool = GIT_ANIMALS.filter(p => p.rarity === 'epic' || p.rarity === 'legendary' || p.rarity === 'rare');
      } else {
        pool = GIT_ANIMALS;
      }
    } else if (zone.isRemote) {
      if (Math.random() < 0.85) {
        pool = GIT_ANIMALS.filter(p => p.rarity === 'legendary' || p.rarity === 'epic');
      } else {
        pool = GIT_ANIMALS;
      }
    } else {
      if (Math.random() < 0.35) {
        pool = GIT_ANIMALS.filter(p => p.rarity === 'rare');
      } else {
        pool = GIT_ANIMALS.filter(p => p.rarity === 'common' || p.rarity === 'uncommon');
      }
    }

    if (!pool || pool.length === 0) pool = GIT_ANIMALS;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Spawner logic
  function spawnWildAnimalNear(playerLatLng) {
    if (!window.map || !playerLatLng) return;
    if (activeSpawns.size >= 6) return;

    const zone = detectCurrentZone(playerLatLng);
    const aData = pickAnimalForZone(zone);

    // Dynamic CP variance: +/- 15%
    const cpVariance = 0.88 + Math.random() * 0.24;
    const finalCp = Math.round(aData.baseCp * cpVariance);

    const distanceMeters = 20 + Math.random() * 55;
    const angle = Math.random() * Math.PI * 2;
    const dLat = (distanceMeters * Math.cos(angle)) / 111320;
    const dLng = (distanceMeters * Math.sin(angle)) / (111320 * Math.cos(playerLatLng.lat * Math.PI / 180));

    const spawnPos = L.latLng(playerLatLng.lat + dLat, playerLatLng.lng + dLng);
    const spawnId = 'animal_' + (++spawnCounter);

    const marker = L.marker(spawnPos, {
      icon: createAnimalIcon(aData),
      zIndexOffset: 850
    }).addTo(window.map);

    marker.on('click', () => {
      openEncounter(spawnId);
    });

    const spawnObj = {
      id: spawnId,
      marker,
      data: {
        ...aData,
        cp: finalCp
      },
      locationName: zone.name,
      latlng: spawnPos,
      createdAt: Date.now()
    };

    activeSpawns.set(spawnId, spawnObj);

    if (Math.random() < 0.45 && window.show) {
      window.show(`¡Un ${aData.name} ${aData.emoji} de GitAnimals apareció cerca!`);
    }
  }

  // Clean faraway animals and auto-check proximity
  function updateAnimalSpawns(playerLatLng) {
    if (!window.map || !playerLatLng) return;

    const now = Date.now();
    for (const [id, spawn] of activeSpawns) {
      const dist = playerLatLng.distanceTo(spawn.latlng);

      if (dist < 15 && (!activeEncounter || activeEncounter.id !== id) && modalOverlay.hidden) {
        openEncounter(id);
        break;
      }

      if (dist > 150 || (now - spawn.createdAt > 360000)) {
        window.map.removeLayer(spawn.marker);
        activeSpawns.delete(id);
      }
    }

    const zone = detectCurrentZone(playerLatLng);
    const targetSpawns = zone.isPlaza ? 5 : (zone.isRemote ? 5 : 4);

    while (activeSpawns.size < targetSpawns) {
      spawnWildAnimalNear(playerLatLng);
    }
  }

  function initAnimalsLoop() {
    if (!window.map || !window.pos) {
      setTimeout(initAnimalsLoop, 400);
      return;
    }

    hookDockPokedexBtn();
    updateAnimalSpawns(window.pos);

    setInterval(() => {
      if (window.pos) {
        updateAnimalSpawns(window.pos);
      }
    }, 10000);

    window.addEventListener('city-player-moved', (e) => {
      if (e.detail) {
        updateAnimalSpawns(L.latLng(e.detail.lat, e.detail.lng));
      }
    });
  }

  initAnimalsLoop();
})();
