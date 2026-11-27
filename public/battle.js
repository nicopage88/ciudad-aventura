// GitAnimals Battle Arena System for Ciudad Aventura (Powered by GitAnimals.org & Tabler Icons)
(()=>{
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'battle.css?v=20261127_04';
  document.head.append(style);

  // Camila's Battle Team (Los GitAnimals más perrones de Maipú)
  const CAMILA_TEAM = [
    {
      id: 101,
      petId: '791899491629877139',
      name: 'Capibara Gigante',
      emoji: '🦫',
      type: 'Fauna / Chill',
      level: 50,
      cp: 3800,
      maxHp: 260,
      moves: [
        { name: 'Zen Capibara', power: 55, type: 'Chill' },
        { name: 'Bao de Barro', power: 75, type: 'Tierra' },
        { name: 'Mordisco Relajado', power: 80, type: 'Fauna' },
        { name: 'Carga Soberana', power: 100, type: 'Poder' }
      ]
    },
    {
      id: 103,
      petId: '739451414643536153',
      name: 'Shiba Inu Perrón',
      emoji: '🐕',
      type: 'Canino / Leal',
      level: 48,
      cp: 3500,
      maxHp: 230,
      moves: [
        { name: 'Ladrido Furioso', power: 50, type: 'Canino' },
        { name: 'Doble Salto', power: 65, type: 'Agilidad' },
        { name: 'Mordida Ágil', power: 75, type: 'Canino' },
        { name: 'Impacto Shiba', power: 95, type: 'Perrón' }
      ]
    },
    {
      id: 106,
      petId: '6',
      name: 'Pollito Fachero',
      emoji: '🐥',
      type: 'Ave / Estilo',
      level: 46,
      cp: 3100,
      maxHp: 200,
      moves: [
        { name: 'Picotazo Fachero', power: 50, type: 'Ave' },
        { name: 'Aleteo Dorado', power: 65, type: 'Estilo' },
        { name: 'Destello Lentes', power: 75, type: 'Luz' },
        { name: 'Rayo Estelar', power: 90, type: 'Estilo' }
      ]
    }
  ];

  // Default starter partner for players who haven't caught GitAnimals yet
  const DEFAULT_STARTER = {
    id: 103,
    petId: '739451414643536153',
    name: 'Shiba Inu Perrón',
    emoji: '🐕',
    type: 'Canino / Leal',
    level: 50,
    cp: 3500,
    maxHp: 230,
    moves: [
      { name: 'Ladrido Furioso', power: 50, type: 'Canino' },
      { name: 'Doble Salto', power: 65, type: 'Agilidad' },
      { name: 'Mordida Ágil', power: 75, type: 'Canino' },
      { name: 'Impacto Shiba', power: 95, type: 'Perrón' }
    ]
  };

  // Setup Modal Shell
  const modal = document.createElement('div');
  modal.id = 'battle-modal';
  modal.className = 'battle-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="battle-arena-card">
      <div class="battle-top-bar">
        <span id="battle-title"><i class="ti ti-swords"></i> ARENA GITANIMALS · COMBATE</span>
        <button class="battle-close-btn" id="battle-close" type="button" aria-label="Cerrar arena">✕</button>
      </div>

      <div class="battle-field" id="battle-field">
        <!-- Opponent (Top Right) -->
        <div class="battle-opponent-wrap">
          <div class="battle-hud" id="opponent-hud">
            <div class="hud-title-row">
              <span class="hud-name" id="opp-name">Capibara Gigante</span>
              <span class="hud-level" id="opp-lvl">Nv. 50</span>
            </div>
            <div class="hud-hp-bar-bg">
              <div class="hud-hp-fill" id="opp-hp-fill" style="width: 100%;"></div>
            </div>
            <div class="hud-info-row">
              <span id="opp-trainer">Entrenadora: Camila</span>
              <span id="opp-cp">CP 3800</span>
            </div>
          </div>
          <div class="opponent-stage" id="opp-stage">
            <img class="opponent-sprite-img" id="opp-sprite" alt="Oponente">
            <div class="pet-emoji-fallback" id="opp-emoji-fallback" hidden>🦫</div>
          </div>
        </div>

        <!-- Player (Bottom Left) -->
        <div class="battle-player-wrap">
          <div class="player-stage" id="player-stage">
            <img class="player-sprite-img" id="player-sprite" alt="Tu Mascota">
            <div class="pet-emoji-fallback" id="player-emoji-fallback" hidden>🐕</div>
          </div>
          <div class="battle-hud" id="player-hud">
            <div class="hud-title-row">
              <span class="hud-name" id="my-poke-name">Shiba Inu Perrón</span>
              <span class="hud-level" id="my-poke-lvl">Nv. 50</span>
            </div>
            <div class="hud-hp-bar-bg">
              <div class="hud-hp-fill" id="my-hp-fill" style="width: 100%;"></div>
            </div>
            <div class="hud-info-row">
              <span id="my-hp-text">230 / 230 HP</span>
              <span id="my-poke-cp">CP 3500</span>
            </div>
          </div>
        </div>

        <div id="battle-result" class="battle-result-overlay" hidden>
          <div class="result-title" id="result-title"><i class="ti ti-trophy"></i> ¡VICTORIA! 🎉</div>
          <p class="result-message" id="result-desc"></p>
          <div class="result-btn-row">
            <button class="result-btn btn-rematch" id="btn-rematch"><i class="ti ti-rotate"></i> Revancha</button>
            <button class="result-btn btn-quit" id="btn-quit"><i class="ti ti-arrow-back-up"></i> Volver al Mapa</button>
          </div>
        </div>
      </div>

      <div class="battle-log-box" id="battle-log">
        ¡Comienza el combate! Elige un movimiento para atacar.
      </div>

      <div class="battle-controls">
        <div class="moves-grid" id="moves-grid"></div>
      </div>
    </div>
  `;
  document.body.append(modal);

  const btnClose = modal.querySelector('#battle-close');
  const logBox = modal.querySelector('#battle-log');
  const movesGrid = modal.querySelector('#moves-grid');
  const resultOverlay = modal.querySelector('#battle-result');
  const btnRematch = modal.querySelector('#btn-rematch');
  const btnQuit = modal.querySelector('#btn-quit');
  const arenaTitle = modal.querySelector('#battle-title');

  // Opponent elements
  const oppName = modal.querySelector('#opp-name');
  const oppLvl = modal.querySelector('#opp-lvl');
  const oppHpFill = modal.querySelector('#opp-hp-fill');
  const oppTrainer = modal.querySelector('#opp-trainer');
  const oppCp = modal.querySelector('#opp-cp');
  const oppSprite = modal.querySelector('#opp-sprite');
  const oppFallback = modal.querySelector('#opp-emoji-fallback');

  // Player elements
  const myName = modal.querySelector('#my-poke-name');
  const myLvl = modal.querySelector('#my-poke-lvl');
  const myHpFill = modal.querySelector('#my-hp-fill');
  const myHpText = modal.querySelector('#my-hp-text');
  const myCp = modal.querySelector('#my-poke-cp');
  const mySprite = modal.querySelector('#player-sprite');
  const playerFallback = modal.querySelector('#player-emoji-fallback');

  let battleState = null;

  function closeBattle() {
    modal.hidden = true;
    battleState = null;
  }

  btnClose.onclick = closeBattle;
  btnQuit.onclick = closeBattle;
  btnRematch.onclick = () => {
    if (battleState && battleState.isWild && battleState.wildData) {
      startBattle(battleState.wildData, { isWild: true, spawnId: battleState.spawnId });
    } else {
      startBattle(battleState ? battleState.trainer : 'Camila_Maipu');
    }
  };

  // Safely sets GitAnimals sprite with instant emoji fallback
  function setPetSprite(imgEl, fallbackEl, pet) {
    if (!pet) return;
    if (pet.petId) {
      imgEl.hidden = false;
      fallbackEl.hidden = true;
      imgEl.src = `https://render.gitanimals.org/lines/devxb?pet-id=${pet.petId}&contribution-view=false`;
      imgEl.onerror = () => {
        imgEl.hidden = true;
        fallbackEl.textContent = pet.emoji || '🐾';
        fallbackEl.hidden = false;
      };
    } else {
      imgEl.hidden = true;
      fallbackEl.textContent = pet.emoji || '🐾';
      fallbackEl.hidden = false;
    }
  }

  // Find best Pet from user collection
  function getBestUserPokemon() {
    let pokedex = {};
    try {
      pokedex = window.getPokedex ? window.getPokedex() : JSON.parse(localStorage.getItem('ciudad_pokedex') || '{}');
    } catch {}

    const list = [];
    for (const [key, val] of Object.entries(pokedex)) {
      if (!val) continue;
      const id = Number(val.id || key);
      if (!id || isNaN(id)) continue;
      const count = typeof val === 'number' ? val : (val.count || 1);
      if (count <= 0) continue;

      const catalog = window.WILD_POKEMON ? window.WILD_POKEMON.find(w => w.id === id) : null;
      const name = val.name || catalog?.name || `Mascota #${id}`;
      const petId = val.petId || catalog?.petId || '739451414643536153';
      const emoji = val.emoji || catalog?.emoji || '🐕';
      const type = val.type || catalog?.type || 'Fauna';
      const cp = Number(val.cp || catalog?.baseCp || 2500);
      const hp = Number(val.hp || catalog?.hp || 200);
      const moves = (val.moves && val.moves.length > 0) ? val.moves : (catalog?.moves || [
        { name: 'Mordisco Ágil', power: 45, type: 'Fauna' },
        { name: 'Salto Veloz', power: 55, type: 'Agilidad' },
        { name: 'Golpe Amigo', power: 65, type: 'Normal' },
        { name: 'Impacto GitAnimal', power: 85, type: 'Poder' }
      ]);
      const level = Math.min(60, Math.max(25, Math.round(cp / 55)));
      list.push({ id, petId, emoji, name, type, cp, maxHp: hp, hp, level, moves });
    }

    if (list.length === 0) {
      return { ...DEFAULT_STARTER };
    }

    // Sort by CP descending (bring strongest into arena)
    list.sort((a, b) => b.cp - a.cp);
    return list[0];
  }

  function startBattle(target = 'Camila_Maipu', options = {}) {
    resultOverlay.hidden = true;
    const isWild = Boolean(options.isWild || (typeof target === 'object' && target.id));
    const isCamila = !isWild && (typeof target === 'string' && target.includes('Camila'));

    let oppData = null;
    let trainerLabel = '';
    let wildData = null;
    let spawnId = options.spawnId || null;

    if (isWild) {
      wildData = (typeof target === 'object') ? target : (window.WILD_POKEMON ? window.WILD_POKEMON.find(p => p.id === Number(target)) : null);
      if (!wildData) wildData = CAMILA_TEAM[0];

      const cp = Math.max(800, Number(wildData.cp || wildData.baseCp || 1800));
      const hp = Math.max(120, Number(wildData.hp || 190));
      const level = Math.min(60, Math.max(20, Math.round(cp / 55)));
      const moves = (wildData.moves && wildData.moves.length > 0) ? wildData.moves : [
        { name: 'Mordisco Salvaje', power: 45, type: 'Fauna' },
        { name: 'Ataque Furia', power: 55, type: 'Agilidad' },
        { name: 'Salto Amigo', power: 65, type: 'Normal' },
        { name: 'Carga Soberana', power: 85, type: 'Poder' }
      ];

      oppData = {
        id: wildData.id,
        petId: wildData.petId,
        emoji: wildData.emoji || '🐾',
        name: wildData.name,
        type: wildData.type || 'Fauna',
        level,
        cp,
        maxHp: hp,
        hp,
        moves
      };
      trainerLabel = 'Mascota Salvaje (GitAnimals)';
      arenaTitle.innerHTML = `<i class="ti ti-swords"></i> ARENA · COMBATE CON ${wildData.name.toUpperCase()} SALVAJE`;
    } else {
      // Pick Camila or other online trainer
      const oppBase = CAMILA_TEAM[Math.floor(Math.random() * CAMILA_TEAM.length)];
      oppData = { ...oppBase, hp: oppBase.maxHp };
      trainerLabel = isCamila ? 'Entrenadora: Camila' : `Entrenador: ${target}`;
      arenaTitle.innerHTML = isCamila ? '<i class="ti ti-swords"></i> ARENA DE MASCOTAS · DUELO CON CAMILA' : `<i class="ti ti-swords"></i> ARENA · DUELO CON ${target}`;
    }

    const myBase = getBestUserPokemon();

    battleState = {
      isWild,
      isCamila,
      wildData,
      spawnId,
      trainer: isCamila ? 'Camila' : (isWild ? 'Salvaje' : target),
      turnBusy: false,
      opp: oppData,
      player: {
        ...myBase,
        hp: myBase.maxHp
      }
    };

    // Update Opponent HUD
    oppName.textContent = (battleState.opp.emoji ? battleState.opp.emoji + ' ' : '') + battleState.opp.name;
    oppLvl.textContent = `Nv. ${battleState.opp.level}`;
    oppTrainer.textContent = trainerLabel;
    oppCp.textContent = `CP ${battleState.opp.cp}`;
    setPetSprite(oppSprite, oppFallback, battleState.opp);
    updateHpBars();

    // Update Player HUD
    myName.textContent = (battleState.player.emoji ? battleState.player.emoji + ' ' : '') + battleState.player.name;
    myLvl.textContent = `Nv. ${battleState.player.level}`;
    myCp.textContent = `CP ${battleState.player.cp}`;
    setPetSprite(mySprite, playerFallback, battleState.player);
    updateHpBars();

    // Render Moves
    renderMoveButtons();

    if (isWild) {
      logBox.innerHTML = `¡Un <strong>${battleState.opp.name}</strong> salvaje (CP ${battleState.opp.cp}) ruge en la arena! ¡Elige tu ataque!`;
    } else {
      logBox.innerHTML = `¡Comienza el duelo! <strong>${battleState.trainer}</strong> saca a <strong>${battleState.opp.name}</strong> (CP ${battleState.opp.cp}). ¡Elige tu movimiento!`;
    }

    modal.hidden = false;

    if (window.playCry) {
      window.playCry(battleState.opp.id);
    }

    if (isCamila && window.show) {
      window.show(`⚔️ ¡Entraste en duelo de mascotas con Camila!`);
    } else if (isWild && window.show) {
      window.show(`⚔️ ¡Combatiendo contra ${battleState.opp.name} salvaje!`);
    } else if (window.show) {
      window.show(`⚔️ ¡Duelo en la arena contra ${battleState.trainer}!`);
    }
  }

  // Public Battle Launcher APIs
  window.startPokemonBattle = (target = 'Camila_Maipu', opts = {}) => startBattle(target, opts);
  window.startPetBattle = window.startPokemonBattle;
  window.startBattle = window.startPokemonBattle;
  window.startPokemonBattleWithWild = (wildData, spawnId = null) => startBattle(wildData, { isWild: true, spawnId });
  window.startPetBattleWithWild = window.startPokemonBattleWithWild;

  function updateHpBars() {
    if (!battleState) return;

    // Opponent HP
    const oppPct = Math.max(0, Math.min(100, (battleState.opp.hp / battleState.opp.maxHp) * 100));
    oppHpFill.style.width = `${oppPct}%`;
    oppHpFill.className = 'hud-hp-fill' + (oppPct < 25 ? ' danger' : (oppPct < 50 ? ' warning' : ''));

    // Player HP
    const playerPct = Math.max(0, Math.min(100, (battleState.player.hp / battleState.player.maxHp) * 100));
    myHpFill.style.width = `${playerPct}%`;
    myHpFill.className = 'hud-hp-fill' + (playerPct < 25 ? ' danger' : (playerPct < 50 ? ' warning' : ''));
    myHpText.textContent = `${Math.max(0, Math.round(battleState.player.hp))} / ${battleState.player.maxHp} HP`;
  }

  function renderMoveButtons() {
    movesGrid.replaceChildren();
    if (!battleState || !battleState.player.moves) return;

    battleState.player.moves.forEach(move => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'move-btn';
      btn.innerHTML = `
        <span class="move-btn-name">${move.name}</span>
        <div class="move-btn-meta">
          <span><i class="ti ti-paw"></i> ${move.type}</span>
          <span><i class="ti ti-bolt"></i> ${move.power}</span>
        </div>
      `;
      btn.onclick = () => executePlayerMove(move);
      movesGrid.append(btn);
    });
  }

  function setMovesDisabled(disabled) {
    movesGrid.querySelectorAll('.move-btn').forEach(b => {
      b.disabled = disabled;
    });
  }

  function executePlayerMove(move) {
    if (!battleState || battleState.turnBusy) return;
    battleState.turnBusy = true;
    setMovesDisabled(true);

    try {
      if (window.playClickSound) window.playClickSound();

      // Player attack animation
      mySprite.classList.add('attack-lunge');
      playerFallback.classList.add('attack-lunge');
      setTimeout(() => {
        mySprite.classList.remove('attack-lunge');
        playerFallback.classList.remove('attack-lunge');
      }, 350);

      // Robust damage calculation
      const isCrit = Math.random() < 0.22;
      const variance = 0.90 + Math.random() * 0.25;
      const power = Math.max(20, Number(move.power) || 50);
      const playerCp = Math.max(500, Number(battleState.player.cp) || 2500);
      const oppCp = Math.max(500, Number(battleState.opp.cp) || 2500);
      const baseDamage = (power * 0.42 * (playerCp / oppCp)) * variance;
      const finalDamage = Math.max(14, Math.round(baseDamage * (isCrit ? 1.4 : 1.0)));

      battleState.opp.hp = Math.max(0, battleState.opp.hp - finalDamage);

      setTimeout(() => {
        oppSprite.classList.add('hit-flash');
        oppFallback.classList.add('hit-flash');
        if (window.playHitSound) window.playHitSound();
        setTimeout(() => {
          oppSprite.classList.remove('hit-flash');
          oppFallback.classList.remove('hit-flash');
        }, 400);

        updateHpBars();
        const critText = isCrit ? ' <span style="color:#ffd700;">¡Golpe crítico! 💥</span>' : '';
        logBox.innerHTML = `¡Tu <strong>${battleState.player.name}</strong> usó <em>${move.name}</em>!${critText} Causó <strong>${finalDamage}</strong> de daño.`;

        // Check if Opponent Faints
        if (battleState.opp.hp <= 0) {
          setTimeout(handleVictory, 800);
          return;
        }

        // Opponent Turn after short delay
        setTimeout(executeOpponentTurn, 900);
      }, 250);
    } catch (err) {
      console.error('Error en turno jugador:', err);
      battleState.turnBusy = false;
      setMovesDisabled(false);
    }
  }

  function executeOpponentTurn() {
    if (!battleState || battleState.opp.hp <= 0) return;

    try {
      const oppMoves = (battleState.opp.moves && battleState.opp.moves.length > 0) ? battleState.opp.moves : [
        { name: 'Golpe Ágil', power: 45, type: 'Fauna' }
      ];
      const move = oppMoves[Math.floor(Math.random() * oppMoves.length)];

      oppSprite.classList.add('attack-lunge');
      oppFallback.classList.add('attack-lunge');
      setTimeout(() => {
        oppSprite.classList.remove('attack-lunge');
        oppFallback.classList.remove('attack-lunge');
      }, 350);

      const isCrit = Math.random() < 0.15;
      const variance = 0.88 + Math.random() * 0.24;
      const power = Math.max(20, Number(move.power) || 50);
      const playerCp = Math.max(500, Number(battleState.player.cp) || 2500);
      const oppCp = Math.max(500, Number(battleState.opp.cp) || 2500);
      const baseDamage = (power * 0.38 * (oppCp / playerCp)) * variance;
      const finalDamage = Math.max(12, Math.round(baseDamage * (isCrit ? 1.35 : 1.0)));

      battleState.player.hp = Math.max(0, battleState.player.hp - finalDamage);

      setTimeout(() => {
        mySprite.classList.add('hit-flash');
        playerFallback.classList.add('hit-flash');
        if (window.playHitSound) window.playHitSound();
        setTimeout(() => {
          mySprite.classList.remove('hit-flash');
          playerFallback.classList.remove('hit-flash');
        }, 400);

        updateHpBars();
        const critText = isCrit ? ' <span style="color:#ef4444;">¡Golpe certero! ⚡</span>' : '';
        logBox.innerHTML = `¡El <strong>${battleState.opp.name}</strong> de ${battleState.trainer} usó <em>${move.name}</em>!${critText} Recibiste <strong>${finalDamage}</strong> de daño.`;

        // Check if Player Faints
        if (battleState.player.hp <= 0) {
          setTimeout(handleDefeat, 800);
          return;
        }

        // Turn complete: re-enable player moves
        battleState.turnBusy = false;
        setMovesDisabled(false);
      }, 250);
    } catch (err) {
      console.error('Error en turno oponente:', err);
      if (battleState) {
        battleState.turnBusy = false;
        setMovesDisabled(false);
      }
    }
  }

  function handleVictory() {
    if (window.playVictorySound) window.playVictorySound();
    resultOverlay.hidden = false;

    if (battleState.isWild && battleState.wildData) {
      logBox.innerHTML = `¡${battleState.opp.name} se debilitó y fue adoptado! 🎉`;
      modal.querySelector('#result-title').innerHTML = '<i class="ti ti-trophy"></i> ¡MASCOTA ADOPTADA! 🏆';
      modal.querySelector('#result-title').style.color = '#ffd700';
      modal.querySelector('#result-desc').textContent = `¡Derrotaste a ${battleState.opp.name} en la arena! Se une a tu granja de GitAnimals con CP ${battleState.opp.cp}.`;

      // Auto-catch upon victory
      if (window.addPokemonToPokedex) {
        window.addPokemonToPokedex(battleState.wildData, battleState.spawnId);
      }
      if (window.show) {
        window.show(`🏆 ¡Victoria! ${battleState.opp.name} adoptado tras la batalla.`);
      }
    } else {
      logBox.innerHTML = `¡${battleState.opp.name} del oponente se debilitó! ¡Has ganado el duelo! 🏆`;
      modal.querySelector('#result-title').innerHTML = '<i class="ti ti-trophy"></i> ¡VICTORIA ÉPICA! 🏆';
      modal.querySelector('#result-title').style.color = '#ffd700';
      modal.querySelector('#result-desc').textContent = `Derrotaste a ${battleState.trainer} y su ${battleState.opp.name}. Tu ${battleState.player.name} demostró gran poder en la arena.`;

      // Win counter bump
      const scoreEl = document.querySelector('#score');
      if (scoreEl) {
        scoreEl.textContent = (Number(scoreEl.textContent) || 0) + 1;
      }

      if (window.show) {
        window.show(`🏆 ¡Victoria! Venciste a ${battleState.trainer} en el duelo.`);
      }
    }
  }

  function handleDefeat() {
    logBox.innerHTML = `¡Tu ${battleState.player.name} se ha debilitado! ${battleState.trainer} ganó esta ronda.`;
    resultOverlay.hidden = false;
    modal.querySelector('#result-title').innerHTML = '<i class="ti ti-swords"></i> ¡BUENA PELEA! 🥊';
    modal.querySelector('#result-title').style.color = '#f87171';
    modal.querySelector('#result-desc').textContent = `${battleState.trainer} se llevó la victoria por poco. ¡Entrena en las plazas de la ciudad y tómate la revancha!`;

    if (window.show) {
      window.show(`🥊 Buena batalla con ${battleState.trainer}. ¡Pide la revancha!`);
    }
  }

  // Hook battle button in footer dock
  function hookDockBattle() {
    const dockBattleBtn = document.querySelector('#battle-btn');
    if (dockBattleBtn) {
      dockBattleBtn.onclick = () => {
        if (window.playClickSound) window.playClickSound();
        startBattle('Camila_Maipu');
      };
    }
  }
  hookDockBattle();
})();
