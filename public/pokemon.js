(()=>{
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'pokemon.css';
  document.head.append(style);

  // Curated wild Pokémon catalog with authentic IDs, Spanish names and types
  const WILD_POKEMON = [
    { id: 25, name: 'Pikachu', type: 'Eléctrico', color: '#f7d02c', rarity: 'uncommon' },
    { id: 4, name: 'Charmander', type: 'Fuego', color: '#ee8130', rarity: 'rare' },
    { id: 1, name: 'Bulbasaur', type: 'Planta', color: '#7ac74c', rarity: 'rare' },
    { id: 7, name: 'Squirtle', type: 'Agua', color: '#6390f0', rarity: 'rare' },
    { id: 133, name: 'Eevee', type: 'Normal', color: '#a8a878', rarity: 'uncommon' },
    { id: 94, name: 'Gengar', type: 'Fantasma', color: '#705598', rarity: 'rare' },
    { id: 143, name: 'Snorlax', type: 'Normal', color: '#708090', rarity: 'rare' },
    { id: 54, name: 'Psyduck', type: 'Agua', color: '#6390f0', rarity: 'common' },
    { id: 39, name: 'Jigglypuff', type: 'Hada', color: '#d685ad', rarity: 'common' },
    { id: 52, name: 'Meowth', type: 'Normal', color: '#a8a878', rarity: 'common' },
    { id: 448, name: 'Lucario', type: 'Lucha', color: '#c22e28', rarity: 'epic' },
    { id: 175, name: 'Togepi', type: 'Hada', color: '#d685ad', rarity: 'rare' },
    { id: 58, name: 'Growlithe', type: 'Fuego', color: '#ee8130', rarity: 'uncommon' },
    { id: 37, name: 'Vulpix', type: 'Fuego', color: '#ee8130', rarity: 'uncommon' },
    { id: 79, name: 'Slowpoke', type: 'Agua/Psíquico', color: '#f95587', rarity: 'common' },
    { id: 216, name: 'Teddiursa', type: 'Normal', color: '#a8a878', rarity: 'common' },
    { id: 63, name: 'Abra', type: 'Psíquico', color: '#f95587', rarity: 'uncommon' },
    { id: 258, name: 'Mudkip', type: 'Agua', color: '#6390f0', rarity: 'rare' },
    { id: 255, name: 'Torchic', type: 'Fuego', color: '#ee8130', rarity: 'rare' },
    { id: 252, name: 'Treecko', type: 'Planta', color: '#7ac74c', rarity: 'rare' }
  ];

  // Helper URLs
  const getAnimatedSprite = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
  const getStaticSprite = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  const getCryAudioUrl = (id) => `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;

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

  // Active wild Pokémon on map
  const activeSpawns = new Map(); // id -> { marker, data, latlng }
  let spawnCounter = 0;
  let activeEncounter = null;
  let berryFed = false;

  // UI Setup
  const hudButton = document.createElement('button');
  hudButton.className = 'pokedex-launch';
  hudButton.id = 'pokedex-btn';
  hudButton.innerHTML = `🔴 MOCHILA <span class="pokedex-badge" id="pokedex-count">${caughtCount}</span>`;
  document.querySelector('.map-wrap')?.append(hudButton);

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

  // Play official cry
  function playCry(id) {
    try {
      const audio = new Audio(getCryAudioUrl(id));
      audio.volume = 0.55;
      audio.play().catch(() => {});
    } catch {}
  }

  // Open Encounter
  function openEncounter(spawnId) {
    const spawn = activeSpawns.get(spawnId);
    if (!spawn) return;

    activeEncounter = spawn;
    berryFed = false;
    modalTitle.textContent = `¡UN ${spawn.data.name.toUpperCase()} SALVAJE!`;

    modalBody.innerHTML = `
      <div class="poke-stage" id="encounter-stage">
        <img class="encounter-sprite" id="encounter-sprite" src="${getAnimatedSprite(spawn.data.id)}" alt="${spawn.data.name}" onerror="this.src='${getStaticSprite(spawn.data.id)}'">
        <div class="poke-type-badges">
          <span class="poke-type-badge" style="background-color: ${spawn.data.color};">${spawn.data.type}</span>
          <span class="poke-type-badge" style="background-color: #495057;">#${spawn.data.id}</span>
        </div>
      </div>
      <div class="poke-info-row">
        <span>Rareza: ${spawn.data.rarity.toUpperCase()}</span>
        <span id="encounter-status">Apareció en la calle</span>
      </div>
      <div class="poke-actions">
        <button class="poke-btn-catch" id="btn-catch">🔴 Lanzar Pokébola</button>
        <button class="poke-btn-berry" id="btn-berry">🍓 Dar Baya</button>
        <button class="poke-btn-cry" id="btn-cry">🎶 Rugido</button>
        <button class="poke-btn-run" id="btn-run">🏃 Dejar ir</button>
      </div>
    `;

    modalOverlay.hidden = false;
    playCry(spawn.data.id);

    const btnCatch = modalBody.querySelector('#btn-catch');
    const btnBerry = modalBody.querySelector('#btn-berry');
    const btnCry = modalBody.querySelector('#btn-cry');
    const btnRun = modalBody.querySelector('#btn-run');
    const statusText = modalBody.querySelector('#encounter-status');
    const stage = modalBody.querySelector('#encounter-stage');

    btnCry.onclick = () => playCry(spawn.data.id);

    btnBerry.onclick = () => {
      if (berryFed) {
        statusText.textContent = `¡${spawn.data.name} ya está satisfecho! ❤️`;
        return;
      }
      berryFed = true;
      statusText.textContent = `¡A ${spawn.data.name} le encantó la Baya! ❤️`;
      btnBerry.disabled = true;
      btnBerry.style.opacity = '0.6';
      if (window.show) window.show(`🍓 ¡Le diste una baya a ${spawn.data.name}!`);
    };

    btnRun.onclick = () => {
      modalOverlay.hidden = true;
      activeEncounter = null;
    };

    btnCatch.onclick = () => {
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
      // Base chances: common=90%, uncommon=80%, rare=65%, epic=50%
      // Berry adds +25%
      const baseChance = { common: 0.90, uncommon: 0.80, rare: 0.65, epic: 0.50 }[spawn.data.rarity] || 0.75;
      const successChance = berryFed ? Math.min(1.0, baseChance + 0.25) : baseChance;
      const caught = Math.random() < successChance;

      setTimeout(() => {
        if (caught) {
          playCry(spawn.data.id);
          statusText.textContent = `¡${spawn.data.name} atrapado con éxito! 🎉`;
          pokedex[spawn.data.id] = (pokedex[spawn.data.id] || 0) + 1;
          savePokedex(pokedex);
          updatePokedexCount();

          // Remove from map
          if (window.map && spawn.marker) {
            window.map.removeLayer(spawn.marker);
          }
          activeSpawns.delete(spawnId);

          if (window.show) window.show(`⭐ ¡Atrapaste a ${spawn.data.name}! Añadido a tu mochila.`);
          
          setTimeout(() => {
            modalOverlay.hidden = true;
            activeEncounter = null;
          }, 1800);
        } else {
          ball.remove();
          sprite.style.display = 'block';
          statusText.textContent = `¡${spawn.data.name} se liberó de la Pokébola! 💨`;
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
      const count = pokedex[p.id] || 0;
      const caughtClass = count > 0 ? 'caught' : 'unseen';
      return `
        <div class="pokedex-item ${caughtClass}">
          <img src="${count > 0 ? getAnimatedSprite(p.id) : getStaticSprite(p.id)}" alt="${p.name}" onerror="this.src='${getStaticSprite(p.id)}'">
          <span>${p.name}</span>
          <small>${count > 0 ? `×${count}` : '---'}</small>
        </div>
      `;
    }).join('');

    modalBody.innerHTML = `
      <p style="font-size: 0.8rem; margin-bottom: 12px; color: #495057;">
        Has capturado <strong>${caughtCount} de ${WILD_POKEMON.length}</strong> especies de Pokémon caminando por tu barrio.
      </p>
      <div class="pokedex-grid">
        ${itemsHtml}
      </div>
      <div style="margin-top: 14px; text-align: center;">
        <button class="poke-btn-run" style="width: 100%;" onclick="document.querySelector('.poke-modal-overlay').hidden = true;">Cerrar Mochila</button>
      </div>
    `;
    modalOverlay.hidden = false;
  }

  // Create Leaflet icon for Pokemon
  function createPokemonIcon(data) {
    const html = `
      <div class="pokemon-marker">
        <div class="poke-spawn-sparkle">✨</div>
        <div class="poke-tag">
          <span class="wild-badge">●</span>
          <span>${data.name}</span>
        </div>
        <img class="poke-sprite" src="${getAnimatedSprite(data.id)}" alt="${data.name}" onerror="this.src='${getStaticSprite(data.id)}'">
      </div>
    `;
    return L.divIcon({
      className: '',
      html,
      iconSize: [60, 75],
      iconAnchor: [30, 68]
    });
  }

  // Spawner logic
  function spawnWildPokemonNear(playerLatLng) {
    if (!window.map) return;
    if (activeSpawns.size >= 5) return;

    // Pick random Pokémon
    const pData = WILD_POKEMON[Math.floor(Math.random() * WILD_POKEMON.length)];
    
    // Spawn within 25 to 70 meters in random direction
    const distanceMeters = 25 + Math.random() * 55;
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
      createdAt: Date.now()
    };

    activeSpawns.set(spawnId, spawnObj);

    // Subtle toast message occasionally
    if (Math.random() < 0.45 && window.show) {
      window.show(`¡Un ${pData.name} salvaje apareció en la calle!`);
    }
  }

  // Clean faraway Pokémon and auto-check proximity
  function updatePokemonSpawns(playerLatLng) {
    if (!window.map || !playerLatLng) return;

    const now = Date.now();
    for (const [id, spawn] of activeSpawns) {
      const dist = playerLatLng.distanceTo(spawn.latlng);
      
      // Auto-trigger encounter if walked right over it (<14m)
      if (dist < 14 && (!activeEncounter || activeEncounter.id !== id) && modalOverlay.hidden) {
        openEncounter(id);
        break;
      }

      // Despawn if player moved very far away (>140m) or lived > 6 minutes
      if (dist > 140 || (now - spawn.createdAt > 360000)) {
        window.map.removeLayer(spawn.marker);
        activeSpawns.delete(id);
      }
    }

    // Keep between 3 and 5 spawns near player
    while (activeSpawns.size < 4) {
      spawnWildPokemonNear(playerLatLng);
    }
  }

  // Periodic cycle
  function initPokemonLoop() {
    if (!window.map || !window.pos) {
      setTimeout(initPokemonLoop, 500);
      return;
    }

    // Initial batch of Pokémon
    updatePokemonSpawns(window.pos);

    // Periodic check every 10 seconds
    setInterval(() => {
      if (window.pos) {
        updatePokemonSpawns(window.pos);
      }
    }, 10000);

    // Listen for movement
    window.addEventListener('city-player-moved', (e) => {
      if (e.detail) {
        updatePokemonSpawns(L.latLng(e.detail.lat, e.detail.lng));
      }
    });
  }

  initPokemonLoop();
})();
