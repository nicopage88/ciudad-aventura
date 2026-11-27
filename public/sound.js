// Sound System for Ciudad Aventura (Web Audio API + PokeAPI Cries)
(()=>{
  let audioCtx = null;
  let soundEnabled = true;
  try {
    const saved = localStorage.getItem('ciudad_sound_enabled');
    if (saved !== null) soundEnabled = saved === 'true';
  } catch {}

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  // Synthesis helpers
  function playTone(freq, type = 'sine', duration = 0.15, volume = 0.25) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  // Retro Catch Fanfare (Jingle)
  window.playCatchSound = function() {
    if (!soundEnabled) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => playTone(freq, 'triangle', 0.18, 0.3), idx * 110);
      });
      setTimeout(() => playTone(1318.51, 'square', 0.35, 0.2), notes.length * 110);
    } catch {}
  };

  // Pokeball Throw Swoosh
  window.playThrowSound = function() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {}
  };

  // Combat Hit Strike
  window.playHitSound = function() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  // Combat Victory Fanfare
  window.playVictorySound = function() {
    if (!soundEnabled) return;
    try {
      const fanNotes = [
        { f: 587.33, d: 0.12 }, // D5
        { f: 587.33, d: 0.12 }, // D5
        { f: 587.33, d: 0.12 }, // D5
        { f: 783.99, d: 0.40 }, // G5
        { f: 880.00, d: 0.25 }, // A5
        { f: 987.77, d: 0.50 }  // B5
      ];
      let delay = 0;
      fanNotes.forEach(note => {
        setTimeout(() => playTone(note.f, 'triangle', note.d, 0.3), delay);
        delay += note.d * 1000 + 35;
      });
    } catch {}
  };

  // Click Blip
  window.playClickSound = function() {
    if (!soundEnabled) return;
    playTone(880, 'sine', 0.08, 0.15);
  };

  // Official PokeAPI Cry Audio
  window.playCry = function(id) {
    if (!soundEnabled || !id) return;
    try {
      const url = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
      const audio = new Audio(url);
      audio.volume = 0.45;
      audio.play().catch(() => {});
    } catch {}
  };

  // Toggle Sound Button in HUD
  let soundBtn = document.querySelector('#sound-toggle-btn');
  if (!soundBtn) {
    soundBtn = document.createElement('button');
    soundBtn.id = 'sound-toggle-btn';
    soundBtn.className = 'sound-toggle-btn' + (soundEnabled ? ' active' : '');
    soundBtn.title = 'Sonidos del juego [ON/OFF]';
    soundBtn.innerHTML = soundEnabled ? '🔊 Sonido [ON]' : '🔇 Sonido [OFF]';
    document.querySelector('.map-wrap')?.append(soundBtn);
  }

  soundBtn.onclick = () => {
    soundEnabled = !soundEnabled;
    try {
      localStorage.setItem('ciudad_sound_enabled', String(soundEnabled));
    } catch {}
    soundBtn.classList.toggle('active', soundEnabled);
    soundBtn.innerHTML = soundEnabled ? '🔊 Sonido [ON]' : '🔇 Sonido [OFF]';
    if (soundEnabled) {
      playClickSound();
      if (window.show) window.show('🔊 Sonidos activados.');
    } else {
      if (window.show) window.show('🔇 Sonidos silenciados.');
    }
  };

  window.isSoundEnabled = () => soundEnabled;
})();
