// Camila NPC Interactivo - Maipú (Siempre visible y activa)
(()=>{
  const PLAZA_CENTER = [-33.5100194, -70.756975];
  const WAYPOINTS = [
    { lat: -33.51000, lng: -70.75697, name: 'Centro Plaza Maipú' },
    { lat: -33.50975, lng: -70.75718, name: 'Feria Artesanal' },
    { lat: -33.50965, lng: -70.75675, name: 'Puesto Pan de Pascua' },
    { lat: -33.50985, lng: -70.75655, name: 'Árbol Navideño Gigante' },
    { lat: -33.51020, lng: -70.75665, name: 'Monumento a Maipú' },
    { lat: -33.51035, lng: -70.75705, name: 'Boulevard' },
    { lat: -33.51025, lng: -70.75735, name: 'Buzón de Santa' }
  ];

  const MESSAGES = [
    '¡Si quieres te llevo en mi moto! 🏍️💨',
    '¡Mira ese Capibara Gigante en la plaza! 🦫✨',
    '¡Quiero echar un duelo con mi Shiba Perrón! 🐕⚔️',
    '¡Qué linda se ve la feria navideña de Maipú! 🎄⭐',
    '¡Atrapé un Pollito con lentes en la esquina! 🐥🕶️',
    '¡Wena vecino! ¿Vamos por un pan de pascua y cola de mono? ☕🎅',
    '¡Desafíame a un duelo de GitAnimals en la arena! ⚔️',
    '¿Viste los animalitos de GitAnimals en las plazas? ¡Están bacanes! 🐾'
  ];

  let currentWpIndex = 0;
  let progress = 0;
  let currentLat = WAYPOINTS[0].lat;
  let currentLng = WAYPOINTS[0].lng;
  let currentBubble = MESSAGES[0];
  let msgIndex = 0;
  let marker = null;

  // Avatar SVG for Camila (wearing Xmas Hat)
  const camilaAvatar = {
    hat: '#e14d42',
    shirt: '#61a879',
    skin: '#efbf87',
    item: 'xmas_hat'
  };

  function createCamilaIcon(bubbleText) {
    const avatarSvg = window.makeCityAvatar ? window.makeCityAvatar(camilaAvatar) : '';
    const bubbleHtml = bubbleText ? `<div class="player-bubble camila-bubble" title="Hablar con Camila">${bubbleText}</div>` : '';
    const html = `
      <div class="friend-marker camila-marker">
        ${bubbleHtml}
        <span class="camila-badge">Camila 🏍️</span>
        <img class="sprite" src="data:image/svg+xml,${encodeURIComponent(avatarSvg)}" alt="Camila">
      </div>
    `;
    return L.divIcon({
      className: 'friend-marker-wrap',
      html,
      iconSize: [44, 56],
      iconAnchor: [22, 48]
    });
  }

  function openCamilaDialog() {
    if (window.playClickSound) window.playClickSound();

    // Custom Interactive Camila Popup
    const box = document.createElement('div');
    box.className = 'camila-popup-card';
    box.innerHTML = `
      <div class="camila-popup-head">
        <strong style="color: #ffd166; font-size: 0.95rem;"><i class="ti ti-motorbike"></i> Camila de Maipú</strong>
        <span style="font-size: 0.72rem; color: #a8dadc;">Entrenadora GitAnimals</span>
      </div>
      <p style="margin: 8px 0; font-size: 0.8rem; line-height: 1.35; color: #f1f5f9;">
        "${currentBubble}"
      </p>
      <div class="camila-actions-col">
        <button id="camila-battle-act" class="camila-act-btn battle-act"><i class="ti ti-swords"></i> Duelo de Mascotas con Camila</button>
        <button id="camila-ride-act" class="camila-act-btn ride-act"><i class="ti ti-motorbike"></i> Paseo en Moto (Aventón)</button>
        <button id="camila-chat-act" class="camila-act-btn chat-act"><i class="ti ti-message-dots"></i> Charlar un rato</button>
      </div>
    `;

    box.querySelector('#camila-battle-act').onclick = () => {
      if (marker) marker.closePopup();
      if (window.playClickSound) window.playClickSound();
      if (window.startPokemonBattle) {
        window.startPokemonBattle('Camila_Maipu');
      } else {
        setTimeout(() => {
          if (window.startPokemonBattle) window.startPokemonBattle('Camila_Maipu');
        }, 300);
      }
    };

    box.querySelector('#camila-ride-act').onclick = () => {
      if (marker) marker.closePopup();
      if (window.playThrowSound) window.playThrowSound();
      if (window.show) window.show('🏍️ ¡Camila aceleró su moto! Súbete al aventón.');

      // Speed boost or quick ride across plaza
      window.citySpeedBoost = 2.4;
      if (window.player && window.pos) {
        const nextTarget = WAYPOINTS[(currentWpIndex + 2) % WAYPOINTS.length];
        window.start([nextTarget.lat, nextTarget.lng]);
      }
      setTimeout(() => {
        window.citySpeedBoost = 1.0;
        if (window.show) window.show('🏍️ ¡Llegaron al destino del paseo con Camila!');
      }, 3500);
    };

    box.querySelector('#camila-chat-act').onclick = () => {
      msgIndex = (msgIndex + 1) % MESSAGES.length;
      currentBubble = MESSAGES[msgIndex];
      if (marker) {
        marker.setIcon(createCamilaIcon(currentBubble));
        marker.closePopup();
      }
      if (window.show) window.show(`Camila: "${currentBubble}"`);
    };

    return box;
  }

  function initCamila() {
    if (!window.map || !window.L) {
      setTimeout(initCamila, 300);
      return;
    }

    marker = L.marker([currentLat, currentLng], {
      icon: createCamilaIcon(currentBubble),
      zIndexOffset: 990
    }).addTo(window.map);

    marker.bindPopup(() => openCamilaDialog(), { minWidth: 240 });

    // Smooth movement loop every 1.5s
    setInterval(() => {
      const from = WAYPOINTS[currentWpIndex];
      const nextIndex = (currentWpIndex + 1) % WAYPOINTS.length;
      const target = WAYPOINTS[nextIndex];

      progress += 0.14;
      if (progress >= 1) {
        progress = 0;
        currentWpIndex = nextIndex;
      }

      currentLat = from.lat + (target.lat - from.lat) * progress;
      currentLng = from.lng + (target.lng - from.lng) * progress;

      if (marker) {
        marker.setLatLng([currentLat, currentLng]);
      }
    }, 1500);

    // Speech cycle every 9s
    setInterval(() => {
      msgIndex = (msgIndex + 1) % MESSAGES.length;
      currentBubble = MESSAGES[msgIndex];
      if (marker) {
        marker.setIcon(createCamilaIcon(currentBubble));
      }
    }, 9000);
  }

  // Hook button in dock for battle
  function hookBattleButton() {
    const btn = document.querySelector('#battle-btn');
    if (btn) {
      btn.onclick = () => {
        if (window.playClickSound) window.playClickSound();
        if (window.show) window.show('⚔️ ¡Desafiaste a Camila a un duelo de Mascotas GitAnimals!');
        if (window.startPokemonBattle) {
          window.startPokemonBattle('Camila_Maipu');
        }
      };
    } else {
      setTimeout(hookBattleButton, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initCamila();
      hookBattleButton();
    });
  } else {
    initCamila();
    hookBattleButton();
  }
})();
