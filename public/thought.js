(()=>{
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'thought.css';
  document.head.append(style);

  // Setup modal
  const modal = document.createElement('div');
  modal.id = 'thought-modal';
  modal.className = 'thought-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="thought-dialog" role="dialog" aria-modal="true" aria-label="¿Qué estás pensando?">
      <div class="thought-header">
        <strong>💭 ¿QUÉ ESTÁS PENSANDO?</strong>
        <button id="thought-close" class="thought-close-btn" type="button" aria-label="Cerrar">✕</button>
      </div>
      <p class="thought-hint">
        Escribe un mensaje o aviso para que aparezca sobre la cabeza de tu personaje (avisos vecinales, billeteras u objetos perdidos, saludos, etc.):
      </p>
      <textarea id="thought-input" class="thought-textarea" maxlength="150" rows="3" placeholder="Ej.: Me encontré una billetera en la plaza Maipú, la persona se llama Pepe Grillo y mi número es 987273554..."></textarea>
      
      <div class="thought-quick-picks">
        <small>💡 Ideas rápidas (haz clic para usar):</small>
        <div class="quick-chips">
          <button type="button" class="thought-chip" data-text="Me encontré una billetera en la plaza Maipú, la persona se llama Pepe Grillo y mi número es 987273554">👛 Me encontré una billetera en Plaza Maipú (Pepe Grillo)...</button>
          <button type="button" class="thought-chip" data-text="¡Wena vecinos! Paseando por la feria navideña de Maipú 👋">👋 ¡Wena vecinos! Paseando por la feria navideña</button>
          <button type="button" class="thought-chip" data-text="¿Quién se anima a jugar o buscar Pokémon en el barrio? 🔴">🔴 ¿Quién para buscar Pokémon o jugar memorice?</button>
          <button type="button" class="thought-chip" data-text="¡Feliz Navidad a todos los vecinos de Maipú y Chile! ⭐🎄">🎄 ¡Feliz Navidad a todos los vecinos de Maipú! ⭐</button>
        </div>
      </div>

      <div class="thought-actions">
        <button id="thought-save" type="button" class="thought-btn-save">💬 Mostrar en mi cabeza</button>
        <button id="thought-clear" type="button" class="thought-btn-clear">Borrar</button>
      </div>
    </div>
  `;
  document.body.append(modal);

  const input = modal.querySelector('#thought-input');
  const btnClose = modal.querySelector('#thought-close');
  const btnSave = modal.querySelector('#thought-save');
  const btnClear = modal.querySelector('#thought-clear');

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
