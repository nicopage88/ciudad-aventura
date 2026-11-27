(()=>{
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'christmas.css';
  document.head.append(style);

  // Curated list of prominent Chilean Christmas Fairs (Ferias Navideñas Chile 2026)
  const CHILEAN_FAIRS = [
    {
      id: 'maipu-plaza',
      name: 'Gran Feria Navideña Plaza de Maipú',
      commune: 'Maipú, Región Metropolitana',
      lat: -33.5100194,
      lng: -70.756975,
      hours: '10:00 a 23:00 hrs',
      desc: 'Más de 200 puestos de artesanos, juguetes, luces navideñas, pan de pascua y el árbol gigante de Maipú.'
    },
    {
      id: 'maipu-arica',
      name: 'Feria Navideña Plaza Arica',
      commune: 'Maipú, Región Metropolitana',
      lat: -33.5014,
      lng: -70.76412,
      hours: '17:00 a 23:30 hrs',
      desc: 'Tradicional feria de barrio con regalos hechos a mano, bazar vecinal y puestos familiares.'
    },
    {
      id: 'maipu-bueras',
      name: 'Feria Navideña Parque Bueras',
      commune: 'Maipú, Región Metropolitana',
      lat: -33.5028,
      lng: -70.7512,
      hours: '16:00 a 23:00 hrs',
      desc: 'Paseo sombreado con juguetes, adornos navideños, villancicos y carritos de comida.'
    },
    {
      id: 'maipu-arauco',
      name: 'Villa Navideña Mall Arauco Maipú',
      commune: 'Maipú, Región Metropolitana',
      lat: -33.4812,
      lng: -70.7523,
      hours: '10:00 a 22:00 hrs',
      desc: 'Feria de emprendedores, aldea de duendes y punto oficial para foto con el Viejito Pascuero.'
    },
    {
      id: 'san-miguel-llano',
      name: 'Feria Navideña Parque El Llano',
      commune: 'San Miguel, Región Metropolitana',
      lat: -33.4912,
      lng: -70.6528,
      hours: '11:00 a 23:00 hrs',
      desc: 'Histórico paseo navideño sobre Gran Avenida, con artesanos locales, libros y regalos de temporada.'
    },
    {
      id: 'nunoa-plaza',
      name: 'Feria y Bazar Navideño Plaza Ñuñoa',
      commune: 'Ñuñoa, Región Metropolitana',
      lat: -33.4542,
      lng: -70.5985,
      hours: '12:00 a 22:30 hrs',
      desc: 'Diseño independiente chileno, orfebrería, juguetes de madera, plantas y delicias navideñas.'
    },
    {
      id: 'santiago-bulnes',
      name: 'Paseo Navideño Bulnes y Plaza de Armas',
      commune: 'Santiago Centro, Región Metropolitana',
      lat: -33.4440,
      lng: -70.6535,
      hours: '10:00 a 22:00 hrs',
      desc: 'El corazón cívico y comercial con puestos navideños, iluminación festiva y gran afluencia vecinal.'
    },
    {
      id: 'providencia-bustamante',
      name: 'Mercado Navideño Parque Bustamante',
      commune: 'Providencia, Región Metropolitana',
      lat: -33.4385,
      lng: -70.6315,
      hours: '11:00 a 22:00 hrs',
      desc: 'Feria sustentable y gourmet, regalos con identidad nacional, coros de villancicos y food trucks.'
    },
    {
      id: 'puente-alto-plaza',
      name: 'Gran Feria Navideña Plaza de Puente Alto',
      commune: 'Puente Alto, Región Metropolitana',
      lat: -33.6105,
      lng: -70.5755,
      hours: '11:00 a 23:00 hrs',
      desc: 'El punto de encuentro navideño más concurrido de la zona sur, con precios populares y variedad inmensa.'
    },
    {
      id: 'la-florida-bellavista',
      name: 'Feria Navideña Bellavista La Florida',
      commune: 'La Florida, Región Metropolitana',
      lat: -33.5220,
      lng: -70.5980,
      hours: '16:00 a 23:00 hrs',
      desc: 'Gran bulevar navideño familiar con artesanía, juguetes para niños y puestos de gastronomía típica.'
    },
    {
      id: 'vina-vergara',
      name: 'Feria Navideña Plaza Vergara',
      commune: 'Viña del Mar, Región de Valparaíso',
      lat: -33.0245,
      lng: -71.5525,
      hours: '11:00 a 22:00 hrs',
      desc: 'Paseo festivo en el centro de Viña con artesanía marina, ropa de verano y regalos navideños.'
    },
    {
      id: 'laserena-plaza',
      name: 'Feria Navideña Plaza de Armas de La Serena',
      commune: 'La Serena, Región de Coquimbo',
      lat: -29.9027,
      lng: -71.2520,
      hours: '10:00 a 22:30 hrs',
      desc: 'Bazar regional con artesanías en piedra combarbalita, papayas confitadas, lana de alpaca y regalos.'
    },
    {
      id: 'concepcion-ecuador',
      name: 'Feria Navideña Parque Ecuador',
      commune: 'Concepción, Región del Biobío',
      lat: -36.8320,
      lng: -73.0485,
      hours: '11:00 a 22:00 hrs',
      desc: 'Feria verde junto a las faldas del Cerro Caracol con emprendimientos y diseño penquista.'
    }
  ];

  // Map markers map
  const fairMarkers = new Map();
  let currentClosestFair = null;
  let activeFairArrival = null;

  // HUD Button: 🎄 FERIAS NAVIDEÑAS 2026
  let christmasHudBtn = document.querySelector('#christmas-btn');
  if (!christmasHudBtn) {
    christmasHudBtn = document.createElement('button');
    christmasHudBtn.className = 'christmas-launch';
    christmasHudBtn.id = 'christmas-btn';
    christmasHudBtn.innerHTML = '🎄 FERIAS NAVIDEÑAS 2026';
    document.querySelector('.map-wrap')?.append(christmasHudBtn);
  }

  // Arrival banner (shown when player is at the fair)
  const arrivalBanner = document.createElement('button');
  arrivalBanner.className = 'fair-active-banner';
  arrivalBanner.hidden = true;
  arrivalBanner.innerHTML = '🎄 ¡ESTÁS EN LA FERIA NAVIDEÑA!';
  document.querySelector('.map-wrap')?.append(arrivalBanner);

  // Modal setup
  const modal = document.createElement('div');
  modal.className = 'christmas-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="christmas-dialog" id="christmas-dialog-inner">
      <div class="christmas-dialog-header">
        <strong id="christmas-modal-title">🎄 FERIAS NAVIDEÑAS CHILE 2026</strong>
        <button class="christmas-dialog-close" id="christmas-modal-close">✕</button>
      </div>
      <div class="christmas-search-row">
        <input class="christmas-search-input" id="fair-search" placeholder="Buscar por comuna (ej. Maipú, Santiago, Ñuñoa...)" autocomplete="off">
        <button class="christmas-gps-btn" id="fair-gps-btn">📍 Cerca de mi casa</button>
      </div>
      <div class="christmas-fairs-list" id="fairs-list"></div>
    </div>
  `;
  document.body.append(modal);

  const fairsList = modal.querySelector('#fairs-list');
  const searchInput = modal.querySelector('#fair-search');
  const gpsBtn = modal.querySelector('#fair-gps-btn');
  const modalClose = modal.querySelector('#christmas-modal-close');

  modalClose.onclick = () => { modal.hidden = true; };
  christmasHudBtn.onclick = () => {
    modal.hidden = false;
    renderFairsList(searchInput.value);
  };

  searchInput.oninput = () => renderFairsList(searchInput.value);

  gpsBtn.onclick = () => {
    if (window.geolocate) {
      window.geolocate();
    } else if (navigator.geolocation) {
      if (window.show) window.show('📍 Obteniendo tu ubicación para buscar ferias cercanas...');
      navigator.geolocation.getCurrentPosition(p => {
        if (window.start) window.start([p.coords.latitude, p.coords.longitude]);
        renderFairsList('');
        if (window.show) window.show('¡Ubicación actualizada! Ferias ordenadas por cercanía.');
      }, () => {
        if (window.show) window.show('No se pudo acceder al GPS.');
      });
    }
  };

  // Distance formatting helper
  function formatDistance(meters) {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  }

  // Render list of fairs sorted by distance to player
  function renderFairsList(query = '') {
    fairsList.replaceChildren();
    const playerPos = window.pos || L.latLng(-33.5100194, -70.756975);
    const qLower = query.trim().toLowerCase();

    // Calculate distance and sort
    const fairsWithDist = CHILEAN_FAIRS.map(fair => {
      const fairLatLng = L.latLng(fair.lat, fair.lng);
      const dist = Math.round(playerPos.distanceTo(fairLatLng));
      return { ...fair, dist };
    }).sort((a, b) => a.dist - b.dist);

    const filtered = fairsWithDist.filter(f => 
      !qLower || f.name.toLowerCase().includes(qLower) || f.commune.toLowerCase().includes(qLower) || f.desc.toLowerCase().includes(qLower)
    );

    if (filtered.length === 0) {
      const emptyMsg = document.createElement('p');
      emptyMsg.style.cssText = 'padding: 20px; text-align: center; color: #6c757d; font-size: 0.85rem;';
      emptyMsg.textContent = 'No se encontraron ferias navideñas con esa búsqueda. Prueba con otra comuna.';
      fairsList.append(emptyMsg);
      return;
    }

    filtered.forEach((fair, index) => {
      const card = document.createElement('div');
      card.className = 'fair-card' + (index === 0 && !qLower ? ' closest' : '');

      const isVeryClose = fair.dist < 80;
      const distBadge = isVeryClose ? '¡AQUÍ MISMO! 🎄' : formatDistance(fair.dist);

      card.innerHTML = `
        <div class="fair-card-head">
          <strong>${fair.name}</strong>
          <span class="fair-card-distance">${distBadge}</span>
        </div>
        <span class="fair-card-commune">📍 ${fair.commune}</span>
        <p class="fair-card-desc">${fair.desc}</p>
        <div class="fair-card-actions">
          <span class="fair-hours">⏰ ${fair.hours}</span>
          <button class="fair-goto-btn" data-id="${fair.id}">${isVeryClose ? '✨ Explorar' : '🎯 Ir a esta feria'}</button>
        </div>
      `;

      const gotoBtn = card.querySelector('.fair-goto-btn');
      gotoBtn.onclick = () => {
        modal.hidden = true;
        if (window.start) {
          window.start([fair.lat, fair.lng]);
          if (window.show) window.show(`¡Llegaste a la ${fair.name}! 🎄`);
        }
      };

      fairsList.append(card);
    });
  }

  // Local festive attractions in Maipú and Plaza Arica
  const LOCAL_DECORATIONS = [
    {
      id: 'maipu-grand-tree',
      name: 'Gran Árbol Navideño de Maipú',
      tag: 'Árbol Gigante',
      icon: '🎄',
      type: 'tree',
      lat: -33.50985,
      lng: -70.75685,
      desc: 'El monumental árbol de Navidad de Maipú, decorado con miles de luces doradas, esferas rojas y una gran estrella en la cima.',
      actionTitle: '✨ Encender Luces y Pedir Deseo',
      actionSuccess: '¡Las luces del gran árbol brillaron con fuerza! Tu deseo navideño subió al cielo ⭐'
    },
    {
      id: 'maipu-stall-pan',
      name: 'Puesto Pan de Pascua y Cola de Mono',
      tag: 'Tradición',
      icon: '☕',
      type: 'stall',
      lat: -33.50965,
      lng: -70.75675,
      desc: 'Delicioso pan de pascua artesanal con nueces y almendras, acompañado de cola de mono heladita.',
      actionTitle: '🥤 Servirse Cola de Mono (+Velocidad)',
      actionSuccess: '¡Qué delicia! Quedaste con energía navideña para recorrer más rápido la ciudad ⚡'
    },
    {
      id: 'maipu-stall-toys',
      name: 'Bazar de Regalos y Juguetes',
      tag: 'Feria',
      icon: '🎁',
      type: 'stall',
      lat: -33.50980,
      lng: -70.75730,
      desc: 'Puestos de juguetes clásicos, adornos navideños hechos a mano y regalos para la familia.',
      actionTitle: '🎁 Ver Regalo Sorpresa',
      actionSuccess: '¡Recibiste un pack de adornos y regalitos de la feria! ⭐'
    },
    {
      id: 'maipu-stall-santa',
      name: 'Casita y Buzón del Viejito Pascuero',
      tag: 'Polo Norte',
      icon: '🎅',
      type: 'stall',
      lat: -33.51030,
      lng: -70.75720,
      desc: 'El buzón directo al Polo Norte para dejar tu carta y deseos para el 2026.',
      actionTitle: '📮 Dejar Carta en el Buzón',
      actionSuccess: '¡Tu carta fue depositada en el buzón oficial de Santa! 💌'
    },
    {
      id: 'maipu-stall-churros',
      name: 'Churrería y Dulces Navideños',
      tag: 'Repostería',
      icon: '🍪',
      type: 'stall',
      lat: -33.51035,
      lng: -70.75665,
      desc: 'Churros calientes rellenos de manjar casero y galletas de jengibre navideñas.',
      actionTitle: '🍪 Degustar Churros con Manjar',
      actionSuccess: '¡Churros crujientes con manjar! Un clásico infaltable de la plaza 😋'
    },
    {
      id: 'arica-tree',
      name: 'Árbol Navideño Plaza Arica',
      tag: 'Árbol Barrial',
      icon: '🎄',
      type: 'tree',
      lat: -33.50135,
      lng: -70.76405,
      desc: 'Hermoso arbolito comunitario adornado con luces y guirnaldas por los vecinos de la Plaza Arica.',
      actionTitle: '🌟 Colocar un Adorno',
      actionSuccess: '¡Añadiste una estrella brillante al arbolito de Plaza Arica! ✨'
    }
  ];

  // Create Christmas Marker on map
  function createChristmasMarker(fair) {
    const html = `
      <div class="christmas-marker">
        <div class="fair-label">
          <span>🎄 ${fair.name.replace('Feria Navideña ', '').replace('Gran Feria Navideña ', '')}</span>
        </div>
        <div class="tree-icon">🎄</div>
      </div>
    `;
    return L.divIcon({
      className: '',
      html,
      iconSize: [120, 60],
      iconAnchor: [60, 48]
    });
  }

  function createGrandTreeMarker(item) {
    const html = `
      <div class="christmas-grand-tree">
        <div class="grand-tree-wrap">
          <div class="grand-tree-star">⭐</div>
          <div class="grand-tree-icon">🎄</div>
          <div class="grand-tree-presents">🎁🎁</div>
        </div>
        <div class="tree-tag">
          <span>★ ${item.name}</span>
        </div>
      </div>
    `;
    return L.divIcon({
      className: '',
      html,
      iconSize: [130, 80],
      iconAnchor: [65, 70]
    });
  }

  function createStallMarker(item) {
    const html = `
      <div class="christmas-stall-marker">
        <div class="stall-kiosk">
          <div class="stall-roof"></div>
          <span>${item.icon}</span>
        </div>
        <div class="stall-tag">
          <span>${item.name}</span>
        </div>
      </div>
    `;
    return L.divIcon({
      className: '',
      html,
      iconSize: [110, 68],
      iconAnchor: [55, 54]
    });
  }

  // Plot fairs and local decorations on map
  function plotFairs() {
    if (!window.map) return;
    
    // Regional Fairs
    CHILEAN_FAIRS.forEach(fair => {
      if (!fairMarkers.has(fair.id)) {
        const marker = L.marker([fair.lat, fair.lng], {
          icon: createChristmasMarker(fair),
          zIndexOffset: 800
        }).addTo(window.map);

        marker.on('click', () => {
          openFairActivityModal(fair);
        });

        fairMarkers.set(fair.id, marker);
      }
    });

    // Local festive decorations (Trees, Stalls)
    LOCAL_DECORATIONS.forEach(item => {
      if (!fairMarkers.has(item.id)) {
        const icon = item.type === 'tree' ? createGrandTreeMarker(item) : createStallMarker(item);
        const marker = L.marker([item.lat, item.lng], {
          icon,
          zIndexOffset: 860
        }).addTo(window.map);

        marker.on('click', () => {
          openLocalDecorationModal(item);
        });

        fairMarkers.set(item.id, marker);
      }
    });
  }

  // Modal for local festive stalls & trees
  function openLocalDecorationModal(item) {
    const dialog = document.createElement('div');
    dialog.className = 'christmas-modal';
    dialog.innerHTML = `
      <div class="christmas-dialog">
        <div class="christmas-dialog-header">
          <strong>${item.icon} ${item.name.toUpperCase()}</strong>
          <button class="christmas-dialog-close" id="dec-close">✕</button>
        </div>
        <span style="display: inline-block; background: #e8f5e9; color: #1b4332; font-weight: 800; font-size: 0.75rem; padding: 4px 8px; border-radius: 6px; margin-bottom: 10px;">
          📍 Plaza de Maipú · Feria Navideña 2026
        </span>
        <p style="font-size: 0.85rem; color: #374151; line-height: 1.45; margin-bottom: 14px;">
          ${item.desc}
        </p>
        <div style="text-align: center; margin-bottom: 14px;">
          <button class="fair-goto-btn" id="dec-action" style="padding: 11px 18px; font-size: 0.85rem;">${item.actionTitle}</button>
        </div>
        <p id="dec-status" style="font-size: 0.8rem; font-weight: 800; color: #2d6a4f; text-align: center; min-height: 20px;"></p>
        <button class="christmas-gps-btn" id="dec-done" style="width: 100%; margin-top: 6px;">Cerrar</button>
      </div>
    `;
    document.body.append(dialog);

    const close = () => dialog.remove();
    dialog.querySelector('#dec-close').onclick = close;
    dialog.querySelector('#dec-done').onclick = close;

    const actionBtn = dialog.querySelector('#dec-action');
    const statusText = dialog.querySelector('#dec-status');

    actionBtn.onclick = () => {
      statusText.textContent = item.actionSuccess;
      if (item.id === 'maipu-stall-pan') {
        window.citySpeedBoost = 1.4;
        setTimeout(() => { window.citySpeedBoost = 1.0; }, 120000);
      }
      if (window.show) window.show(item.actionSuccess);
      actionBtn.disabled = true;
      actionBtn.style.opacity = '0.6';
    };
  }

  // Open interactive fair activity modal
  function openFairActivityModal(fair) {
    const activityModal = document.createElement('div');
    activityModal.className = 'christmas-modal';
    activityModal.innerHTML = `
      <div class="christmas-dialog">
        <div class="christmas-dialog-header">
          <strong>🎄 ${fair.name.toUpperCase()}</strong>
          <button class="christmas-dialog-close" id="act-close">✕</button>
        </div>
        <p style="font-size: 0.85rem; color: #2d6a4f; font-weight: 700; margin-bottom: 6px;">
          📍 ${fair.commune} · ⏰ ${fair.hours}
        </p>
        <p style="font-size: 0.8rem; color: #495057; line-height: 1.4; margin-bottom: 12px;">
          ${fair.desc}
        </p>
        <div style="background: #e8f5e9; border: 2px dashed #40916c; border-radius: 8px; padding: 10px; margin-bottom: 12px;">
          <strong style="color: #1b4332; font-size: 0.8rem;">✨ PUESTOS Y ACTIVIDADES NAVIDEÑAS:</strong>
          <div class="fair-activity-grid">
            <button class="fair-activity-btn" id="act-pan">
              <span class="act-icon">☕</span>
              <strong>Pan de Pascua y Cola de Mono</strong>
              <small>+Velocidad de caminata</small>
            </button>
            <button class="fair-activity-btn" id="act-gift">
              <span class="act-icon">🎁</span>
              <strong>Regalo Sorpresa</strong>
              <small>Premio navideño</small>
            </button>
            <button class="fair-activity-btn" id="act-wish">
              <span class="act-icon">💌</span>
              <strong>Carta al Viejito Pascuero</strong>
              <small>Escribe un deseo</small>
            </button>
            <button class="fair-activity-btn" id="act-snow">
              <span class="act-icon">❄️</span>
              <strong>Nieve Navideña</strong>
              <small>Efecto en el mapa</small>
            </button>
          </div>
        </div>
        <p id="act-status" style="font-size: 0.78rem; font-weight: 800; color: #d90429; text-align: center; min-height: 20px;"></p>
        <button class="christmas-gps-btn" id="act-done" style="margin-top: 8px; width: 100%;">Seguir Recorriendo</button>
      </div>
    `;
    document.body.append(activityModal);

    const closeBtn = activityModal.querySelector('#act-close');
    const doneBtn = activityModal.querySelector('#act-done');
    const status = activityModal.querySelector('#act-status');

    const removeModal = () => activityModal.remove();
    closeBtn.onclick = removeModal;
    doneBtn.onclick = removeModal;

    // Pan de pascua boost
    activityModal.querySelector('#act-pan').onclick = () => {
      status.textContent = '¡Qué rico! Tomaste Cola de Mono y Pan de Pascua. ☕ Corres más rápido.';
      if (window.show) window.show('⚡ ¡Energía Navideña! Caminas con mayor agilidad.');
      // Temporarily boost speed in app.js if supported
      window.citySpeedBoost = 1.45;
      setTimeout(() => { window.citySpeedBoost = 1.0; }, 120000);
    };

    // Gift
    activityModal.querySelector('#act-gift').onclick = () => {
      const gifts = [
        '¡Te regalaron 3 Pokébolas extras para atrapar Pokémon en el barrio! 🔴',
        '¡Te regalaron un gorro de Viejito Pascuero para tu avatar! 🎅',
        '¡Te ganaste una bolsa de dulces navideños de la feria! 🍬'
      ];
      const picked = gifts[Math.floor(Math.random() * gifts.length)];
      status.textContent = picked;
      if (window.show) window.show(picked);
    };

    // Wish
    activityModal.querySelector('#act-wish').onclick = () => {
      const wish = prompt('Escribe tu deseo navideño para tu comuna o Chile 2026:', 'Más alegría, áreas verdes y paz para todos los vecinos');
      if (wish && wish.trim()) {
        status.textContent = '¡Carta enviada al Polo Norte! 🎅✨ Tu deseo fue registrado.';
        if (window.show) window.show('💌 ¡Deseo navideño enviado con éxito!');
      }
    };

    // Snow toggle
    activityModal.querySelector('#act-snow').onclick = () => {
      toggleSnowfall();
      status.textContent = isSnowing ? '¡Comenzó a caer nieve navideña sobre el mapa! ❄️' : 'Nieve desactivada.';
    };
  }

  arrivalBanner.onclick = () => {
    if (activeFairArrival) {
      openFairActivityModal(activeFairArrival);
    }
  };

  // Pixel Snowfall Canvas
  let isSnowing = false;
  let snowCanvas = null;
  let snowAnimId = null;
  const snowflakes = [];

  function toggleSnowfall() {
    isSnowing = !isSnowing;
    if (isSnowing) {
      if (!snowCanvas) {
        snowCanvas = document.createElement('canvas');
        snowCanvas.className = 'snowfall-canvas';
        document.querySelector('.map-wrap')?.append(snowCanvas);
      }
      snowCanvas.width = snowCanvas.parentElement.clientWidth;
      snowCanvas.height = snowCanvas.parentElement.clientHeight;
      snowflakes.length = 0;
      for (let i = 0; i < 45; i++) {
        snowflakes.push({
          x: Math.random() * snowCanvas.width,
          y: Math.random() * snowCanvas.height,
          size: 2 + Math.random() * 4,
          speed: 0.8 + Math.random() * 1.5,
          drift: (Math.random() - 0.5) * 0.8
        });
      }

      function drawSnow() {
        if (!isSnowing || !snowCanvas) return;
        const ctx = snowCanvas.getContext('2d');
        ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
        ctx.fillStyle = '#ffffff';
        snowflakes.forEach(f => {
          ctx.fillRect(Math.round(f.x), Math.round(f.y), Math.round(f.size), Math.round(f.size));
          f.y += f.speed;
          f.x += f.drift;
          if (f.y > snowCanvas.height) { f.y = -5; f.x = Math.random() * snowCanvas.width; }
          if (f.x > snowCanvas.width) f.x = 0;
          if (f.x < 0) f.x = snowCanvas.width;
        });
        snowAnimId = requestAnimationFrame(drawSnow);
      }
      drawSnow();
    } else {
      if (snowAnimId) cancelAnimationFrame(snowAnimId);
      if (snowCanvas) {
        snowCanvas.remove();
        snowCanvas = null;
      }
    }
  }

  // Check proximity to fairs
  function checkFairProximity(playerPos) {
    if (!playerPos) return;

    let closest = null;
    let minDistance = Infinity;

    CHILEAN_FAIRS.forEach(fair => {
      const d = playerPos.distanceTo(L.latLng(fair.lat, fair.lng));
      if (d < minDistance) {
        minDistance = d;
        closest = fair;
      }
    });

    currentClosestFair = closest;

    // If within 65 meters, show banner!
    if (minDistance <= 65) {
      activeFairArrival = closest;
      arrivalBanner.hidden = false;
      arrivalBanner.innerHTML = `🎄 ¡ESTÁS EN LA ${closest.name.toUpperCase()}!`;
    } else {
      arrivalBanner.hidden = true;
      activeFairArrival = null;
    }
  }

  // Init loop
  function initChristmas() {
    if (!window.map || !window.pos) {
      setTimeout(initChristmas, 500);
      return;
    }

    plotFairs();
    checkFairProximity(window.pos);

    // Subtle Snow Toggle Button
    let snowBtn = document.querySelector('#snow-toggle-btn');
    if (!snowBtn) {
      snowBtn = document.createElement('button');
      snowBtn.className = 'snow-toggle-btn active';
      snowBtn.id = 'snow-toggle-btn';
      snowBtn.innerHTML = '❄️ Nieve [ON]';
      document.querySelector('.map-wrap')?.append(snowBtn);
    }

    // Auto-start gentle snowfall
    toggleSnowfall();

    snowBtn.onclick = () => {
      toggleSnowfall();
      snowBtn.classList.toggle('active', isSnowing);
      snowBtn.innerHTML = isSnowing ? '❄️ Nieve [ON]' : '❄️ Nieve [OFF]';
    };

    window.addEventListener('city-player-moved', (e) => {
      if (e.detail) {
        checkFairProximity(L.latLng(e.detail.lat, e.detail.lng));
      }
    });
  }

  initChristmas();
})();
