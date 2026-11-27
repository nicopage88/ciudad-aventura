// ¿Qué estás pensando? con integración de Tabler Icons (github.com/tabler/tabler-icons)
(()=>{
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'thought.css?v=20261127_04';
  document.head.append(style);

  // Dictionary of convenient Tabler Icon shortcodes
  const TABLER_ALIASES = {
    'swords': 'swords',
    'duelo': 'swords',
    'pelea': 'swords',
    'sword': 'sword',
    'shield': 'shield',
    'escudo': 'shield',
    'paw': 'paw',
    'pata': 'paw',
    'mascota': 'paw',
    'dog': 'dog',
    'perro': 'dog',
    'cat': 'cat',
    'gato': 'cat',
    'car': 'car',
    'auto': 'car',
    'moto': 'motorbike',
    'motorcycle': 'motorbike',
    'bike': 'bike',
    'bici': 'bike',
    'heart': 'heart',
    'corazon': 'heart',
    'star': 'star',
    'estrella': 'star',
    'trophy': 'trophy',
    'copa': 'trophy',
    'gift': 'gift',
    'regalo': 'gift',
    'tree': 'christmas-tree',
    'arbol': 'christmas-tree',
    'coffee': 'coffee',
    'cafe': 'coffee',
    'sparkles': 'sparkles',
    'brillo': 'sparkles',
    'map-pin': 'map-pin',
    'pin': 'map-pin',
    'ubicacion': 'map-pin',
    'message': 'message',
    'mensaje': 'message',
    'chat': 'message-dots',
    'bulb': 'bulb',
    'idea': 'bulb',
    'bolt': 'bolt',
    'rayo': 'bolt',
    'flame': 'flame',
    'fuego': 'flame',
    'smile': 'mood-smile',
    'feliz': 'mood-smile',
    'wallet': 'wallet',
    'billetera': 'wallet',
    'phone': 'phone',
    'telefono': 'phone'
  };

  // Convert :name: or :ti-name: to <i class="ti ti-name"></i>
  window.renderTablerIcons = function(text) {
    if (!text) return '';
    return text.replace(/:([a-zA-Z0-9_-]+):/g, (match, name) => {
      let icon = name.toLowerCase();
      if (icon.startsWith('ti-')) icon = icon.slice(3);
      const resolved = TABLER_ALIASES[icon] || icon;
      return `<i class="ti ti-${resolved}" style="vertical-align: -0.15em; font-size: 1.1em; display: inline-block;"></i>`;
    });
  };

  // Setup modal
  const modal = document.createElement('div');
  modal.id = 'thought-modal';
  modal.className = 'thought-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="thought-dialog" role="dialog" aria-modal="true" aria-label="¿Qué estás pensando?">
      <div class="thought-header">
        <strong><i class="ti ti-message-dots"></i> ¿QUÉ ESTÁS PENSANDO?</strong>
        <button id="thought-close" class="thought-close-btn" type="button" aria-label="Cerrar">✕</button>
      </div>
      <p class="thought-hint">
        Escribe un mensaje o aviso para que aparezca sobre la cabeza de tu personaje (avisos vecinales, billeteras perdidas, duelos, saludos, etc.). ¡Puedes usar iconos Tabler como <code>:swords:</code>, <code>:wallet:</code> o <code>:moto:</code>!
      </p>
      <textarea id="thought-input" class="thought-textarea" maxlength="160" rows="3" placeholder="Ej.: Me encontré una :wallet: billetera en plaza Maipú, la persona se llama Pepe Grillo y mi número es :phone: 987273554..."></textarea>

      <!-- Tabler Icon Quick Picker -->
      <div class="tabler-icon-picker">
        <small>✨ Iconos Tabler rápidos (clic para insertar):</small>
        <div class="tabler-chips" id="thought-tabler-chips">
          <button type="button" class="tabler-btn" data-code=":swords:"><i class="ti ti-swords"></i> :swords:</button>
          <button type="button" class="tabler-btn" data-code=":paw:"><i class="ti ti-paw"></i> :paw:</button>
          <button type="button" class="tabler-btn" data-code=":wallet:"><i class="ti ti-wallet"></i> :wallet:</button>
          <button type="button" class="tabler-btn" data-code=":phone:"><i class="ti ti-phone"></i> :phone:</button>
          <button type="button" class="tabler-btn" data-code=":moto:"><i class="ti ti-motorbike"></i> :moto:</button>
          <button type="button" class="tabler-btn" data-code=":car:"><i class="ti ti-car"></i> :car:</button>
          <button type="button" class="tabler-btn" data-code=":heart:"><i class="ti ti-heart"></i> :heart:</button>
          <button type="button" class="tabler-btn" data-code=":star:"><i class="ti ti-star"></i> :star:</button>
          <button type="button" class="tabler-btn" data-code=":tree:"><i class="ti ti-christmas-tree"></i> :tree:</button>
          <button type="button" class="tabler-btn" data-code=":coffee:"><i class="ti ti-coffee"></i> :coffee:</button>
          <button type="button" class="tabler-btn" data-code=":trophy:"><i class="ti ti-trophy"></i> :trophy:</button>
          <button type="button" class="tabler-btn" data-code=":bolt:"><i class="ti ti-bolt"></i> :bolt:</button>
        </div>
      </div>
      
      <div class="thought-quick-picks">
        <small>💡 Ideas rápidas de ejemplo:</small>
        <div class="quick-chips">
          <button type="button" class="thought-chip" data-text="Me encontré una :wallet: billetera en Plaza Maipú (Pepe Grillo) :phone: 987273554">👛 Me encontré una billetera en Plaza Maipú (Pepe Grillo) - 987273554</button>
          <button type="button" class="thought-chip" data-text="¿Quién se anima a un :swords: duelo de mascotas GitAnimals en la plaza? :trophy:">⚔️ ¿Quién para un duelo de mascotas GitAnimals en la plaza?</button>
          <button type="button" class="thought-chip" data-text="¡Wena vecinos! Paseando por la feria navideña de Maipú :tree: :star:">🎄 Paseando por la feria navideña de Maipú</button>
          <button type="button" class="thought-chip" data-text="¡Súbanse a mi :moto: moto o :car: auto para dar un aventón!">🏍️ ¡Dando aventones en moto por el barrio!</button>
        </div>
      </div>

      <div class="thought-actions">
        <button id="thought-save" type="button" class="thought-btn-save"><i class="ti ti-check"></i> Mostrar en mi cabeza</button>
        <button id="thought-clear" type="button" class="thought-btn-clear"><i class="ti ti-trash"></i> Borrar</button>
      </div>
    </div>
  `;
  document.body.append(modal);

  const input = modal.querySelector('#thought-input');
  const btnClose = modal.querySelector('#thought-close');
  const btnSave = modal.querySelector('#thought-save');
  const btnClear = modal.querySelector('#thought-clear');

  // Insert text at cursor position in textarea
  function insertAtCursor(myField, myValue) {
    if (document.selection) {
      myField.focus();
      const sel = document.selection.createRange();
      sel.text = myValue;
    } else if (myField.selectionStart || myField.selectionStart === 0) {
      const startPos = myField.selectionStart;
      const endPos = myField.selectionEnd;
      myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
      myField.selectionStart = startPos + myValue.length;
      myField.selectionEnd = startPos + myValue.length;
    } else {
      myField.value += myValue;
    }
    myField.focus();
  }

  // Hook Tabler Icon quick chips
  modal.querySelectorAll('#thought-tabler-chips .tabler-btn').forEach(btn => {
    btn.onclick = () => {
      const code = btn.dataset.code || '';
      if (code) {
        insertAtCursor(input, ' ' + code + ' ');
      }
    };
  });

  function openThoughtModal() {
    const current = window.getMyThought ? window.getMyThought() : '';
    input.value = current;
    modal.hidden = false;
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }, 50);
  }
  window.openThoughtModal = openThoughtModal;

  function closeThoughtModal() {
    modal.hidden = true;
  }

  // Hook button in footer dock
  const thoughtBtn = document.querySelector('#thought-btn');
  if (thoughtBtn) {
    thoughtBtn.onclick = openThoughtModal;
  }

  btnClose.onclick = closeThoughtModal;

  modal.onclick = (e) => {
    if (e.target === modal) closeThoughtModal();
  };

  // Quick chips click
  modal.querySelectorAll('.thought-chip').forEach(chip => {
    chip.onclick = () => {
      input.value = chip.dataset.text || '';
      input.focus();
    };
  });

  // Save thought
  btnSave.onclick = () => {
    const text = input.value.trim();
    if (window.setPlayerThought) {
      window.setPlayerThought(text);
    }
    closeThoughtModal();
    if (window.show) {
      window.show(text ? '💭 ¡Tu mensaje ahora se ve sobre tu personaje!' : 'Pensamiento borrado.');
    }
  };

  // Clear thought
  btnClear.onclick = () => {
    input.value = '';
    if (window.setPlayerThought) {
      window.setPlayerThought('');
    }
    closeThoughtModal();
    if (window.show) {
      window.show('Pensamiento borrado de tu cabeza.');
    }
  };

  // Submit on Ctrl+Enter or Cmd+Enter
  input.onkeydown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      btnSave.click();
    }
  };
})();
