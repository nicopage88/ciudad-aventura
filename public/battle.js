// Pokémon Battle Arena System for Ciudad Aventura
(()=>{
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'battle.css';
  document.head.append(style);

  // Helper URLs (Showdown Fast Edge CDN + PokeAPI Multi-tier fallback)
  const getOpponentSprite = (name, id) => {
    const slug = String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return `https://play.pokemonshowdown.com/sprites/ani/${slug}.gif`;
  };
  const getPlayerBackSprite = (name, id) => {
    const slug = String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return `https://play.pokemonshowdown.com/sprites/ani-back/${slug}.gif`;
  };
  const getAnimatedSprite = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
  const getStaticSprite = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  // Camila's Battle Team (Los más perrones de Maipú)
  const CAMILA_TEAM = [
    {
      id: 448,
      name: 'Lucario',
      type: 'Lucha/Acero',
      level: 48,
      cp: 2750,
      maxHp: 210,
      moves: [
        { name: 'Esfera Aural', power: 65, type: 'Lucha' },
        { name: 'Puño Incremento', power: 45, type: 'Lucha' },
        { name: 'Contraataque', power: 55, type: 'Lucha' },
        { name: 'A Bocajarro', power: 85, type: 'Lucha' }
      ]
    },
    {
      id: 6,
      name: 'Charizard',
      type: 'Fuego/Volador',
      level: 50,
      cp: 2880,
      maxHp: 220,
      moves: [
        { name: 'Lanzallamas', power: 68, type: 'Fuego' },
        { name: 'Garra Dragón', power: 52, type: 'Dragón' },
        { name: 'Giro Fuego', power: 42, type: 'Fuego' },
        { name: 'Anillo Ígneo', power: 90, type: 'Fuego' }
      ]
    },
    {
      id: 94,
      name: 'Gengar',
      type: 'Fantasma/Veneno',
      level: 46,
      cp: 2650,
      maxHp: 195,
      moves: [
        { name: 'Bola Sombra', power: 65, type: 'Fantasma' },
        { name: 'Bomba Lodo', power: 55, type: 'Veneno' },
        { name: 'Garra Umbría', power: 45, type: 'Fantasma' },
        { name: 'Come Sueños', power: 80, type: 'Psíquico' }
      ]
    }
  ];

  // Default starter partner for players who haven't caught Pokémon yet
  const DEFAULT_STARTER = {
    id: 6,
    name: 'Charizard',
    type: 'Fuego/Volador',
    level: 50,
    cp: 2880,
    maxHp: 220,
    moves: [
      { name: 'Lanzallamas', power: 68, type: 'Fuego' },
      { name: 'Garra Dragón', power: 52, type: 'Dragón' },
      { name: 'Giro Fuego', power: 42, type: 'Fuego' },
      { name: 'Anillo Ígneo', power: 90, type: 'Fuego' }
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
        <span id="battle-title">⚔️ ARENA POKÉMON · COMBATE</span>
        <button class="battle-close-btn" id="battle-close" type="button" aria-label="Cerrar arena">✕</button>
      </div>

      <div class="battle-field" id="battle-field">
        <!-- Opponent (Top Right) -->
        <div class="battle-opponent-wrap">
          <div class="battle-hud" id="opponent-hud">
            <div class="hud-title-row">
              <span class="hud-name" id="opp-name">Lucario</span>
              <span class="hud-level" id="opp-lvl">Nv. 48</span>
            </div>
            <div class="hud-hp-bar-bg">
              <div class="hud-hp-fill" id="opp-hp-fill" style="width: 100%;"></div>
            </div>
            <div class="hud-info-row">
              <span id="opp-trainer">Entrenadora: Camila</span>
              <span id="opp-cp">CP 2750</span>
            </div>
          </div>
          <div class="opponent-stage">
            <img class="opponent-sprite-img" id="opp-sprite" alt="Oponente">
          </div>
        </div>

        <!-- Player (Bottom Left) -->
        <div class="battle-player-wrap">
          <div class="player-stage">
            <img class="player-sprite-img" id="player-sprite" alt="Tu Pokémon">
          </div>
          <div class="battle-hud" id="player-hud">
            <div class="hud-title-row">
              <span class="hud-name" id="my-poke-name">Charizard</span>
              <span class="hud-level" id="my-poke-lvl">Nv. 50</span>
            </div>
            <div class="hud-hp-bar-bg">
              <div class="hud-hp-fill" id="my-hp-fill" style="width: 100%;"></div>
            </div>
            <div class="hud-info-row">
              <span id="my-hp-text">220 / 220 HP</span>
              <span id="my-poke-cp">CP 2880</span>
            </div>
          </div>
        </div>

        <div id="battle-result" class="battle-result-overlay" hidden>
          <div class="result-title" id="result-title">¡VICTORIA! 🎉</div>
          <p class="result-message" id="result-desc"></p>
          <div class="result-btn-row">
            <button class="result-btn btn-rematch" id="btn-rematch">⚔️ Revancha</button>
            <button class="result-btn btn-quit" id="btn-quit">Volver al Mapa</button>
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

  // Player elements
  const myName = modal.querySelector('#my-poke-name');
  const myLvl = modal.querySelector('#my-poke-lvl');
  const myHpFill = modal.querySelector('#my-hp-fill');
  const myHpText = modal.querySelector('#my-hp-text');
  const myCp = modal.querySelector('#my-poke-cp');
  const mySprite = modal.querySelector('#player-sprite');

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
      startBattle('Camila_Maipu');
    }
  };

  // Find best Pokémon from user Pokédex (Robust data sanitizer)
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
      const name = val.name || catalog?.name || `Pokémon #${id}`;
      const type = val.type || catalog?.type || 'Normal';
      const cp = Number(val.cp || catalog?.baseCp || 1800);
      const hp = Number(val.hp || catalog?.hp || 190);
      const moves = (val.moves && val.moves.length > 0) ? val.moves : (catalog?.moves || [
        { name: 'Placaje', power: 45, type: 'Normal' },
        { name: 'Ataque Rápido', power: 50, type: 'Normal' },
        { name: 'Golpe Cabeza', power: 65, type: 'Normal' },
        { name: 'Hiperrayo', power: 85, type: 'Normal' }
      ]);
      const level = Math.min(60, Math.max(25, Math.round(cp / 55)));
      list.push({ id, name, type, cp, maxHp: hp, hp, level, moves });
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

      const cp = Number(wildData.cp || wildData.baseCp || 1800);
      const hp = Number(wildData.hp || 190);
      const level = Math.min(60, Math.max(20, Math.round(cp / 55)));
      const moves = (wildData.moves && wildData.moves.length > 0) ? wildData.moves : [
        { name: 'Placaje Salvaje', power: 45, type: 'Normal' },
        { name: 'Ataque Furia', power: 55, type: 'Normal' },
        { name: 'Mordisco', power: 65, type: 'Siniestro' },
        { name: 'Hiperrayo', power: 85, type: 'Normal' }
      ];

      oppData = {
        id: wildData.id,
        name: wildData.name,
        type: wildData.type || 'Normal',
        level,
        cp,
        maxHp: hp,
        hp,
        moves
      };
      trainerLabel = 'Pokémon Salvaje';
      arenaTitle.textContent = `⚔️ ARENA · COMBATE CON ${wildData.name.toUpperCase()} SALVAJE`;
    } else {
      // Pick Camila or other online trainer
      const oppBase = CAMILA_TEAM[Math.floor(Math.random() * CAMILA_TEAM.length)];
      oppData = { ...oppBase, hp: oppBase.maxHp };
      trainerLabel = isCamila ? 'Entrenadora: Camila' : `Entrenador: ${target}`;
      arenaTitle.textContent = isCamila ? '⚔️ ARENA POKÉMON · DUELO CON CAMILA' : `⚔️ ARENA · DUELO CON ${target}`;
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
    oppName.textContent = battleState.opp.name;
    oppLvl.textContent = `Nv. ${battleState.opp.level}`;
    oppTrainer.textContent = trainerLabel;
    oppCp.textContent = `CP ${battleState.opp.cp}`;
    oppSprite.src = getOpponentSprite(battleState.opp.name, battleState.opp.id);
    oppSprite.onerror = () => {
      oppSprite.onerror = () => { oppSprite.src = getStaticSprite(battleState.opp.id); };
      oppSprite.src = getAnimatedSprite(battleState.opp.id);
    };
    updateHpBars();

    // Update Player HUD
    myName.textContent = battleState.player.name;
    myLvl.textContent = `Nv. ${battleState.player.level}`;
    myCp.textContent = `CP ${battleState.player.cp}`;
    mySprite.src = getPlayerBackSprite(battleState.player.name, battleState.player.id);
    mySprite.onerror = () => {
      mySprite.onerror = () => { mySprite.src = getStaticSprite(battleState.player.id); };
      mySprite.src = getAnimatedSprite(battleState.player.id);
    };
    updateHpBars();

    // Render Moves
    renderMoveButtons();

    if (isWild) {
      logBox.textContent = `¡Un ${battleState.opp.name} salvaje (CP ${battleState.opp.cp}) ruge en la arena! ¡Elige tu ataque!`;
    } else {
      logBox.textContent = `¡Comienza el duelo! ${battleState.trainer} saca a ${battleState.opp.name} (CP ${battleState.opp.cp}). ¡Elige tu movimiento!`;
    }

    modal.hidden = false;

    if (window.playCry) {
      window.playCry(battleState.opp.id);
    }

    if (isCamila && window.show) {
      window.show(`⚔️ ¡Entraste en combate Pokémon con Camila!`);
    } else if (isWild && window.show) {
      window.show(`⚔️ ¡Combatiendo contra ${battleState.opp.name} salvaje!`);
    }
  }

  // Public Battle Launcher APIs
  window.startPokemonBattle = (target = 'Camila_Maipu', opts = {}) => startBattle(target, opts);
  window.startPokemonBattleWithWild = (wildData, spawnId = null) => startBattle(wildData, { isWild: true, spawnId });

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
          <span>${move.type}</span>
          <span>Poder: ${move.power}</span>
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

    if (window.playClickSound) window.playClickSound();

    // Player attack animation
    mySprite.classList.add('attack-lunge');
    setTimeout(() => mySprite.classList.remove('attack-lunge'), 350);

    // Calculate damage
    const isCrit = Math.random() < 0.20;
    const variance = 0.9 + Math.random() * 0.25;
    const power = move.power || 50;
    const baseDamage = (power * 0.42 * (battleState.player.cp / battleState.opp.cp)) * variance;
    const finalDamage = Math.max(15, Math.round(baseDamage * (isCrit ? 1.4 : 1.0)));

    battleState.opp.hp = Math.max(0, battleState.opp.hp - finalDamage);

    setTimeout(() => {
      oppSprite.classList.add('hit-flash');
      if (window.playHitSound) window.playHitSound();
      setTimeout(() => oppSprite.classList.remove('hit-flash'), 400);

      updateHpBars();
      const critText = isCrit ? ' ¡Golpe crítico! 💥' : '';
      logBox.textContent = `¡Tu ${battleState.player.name} usó ${move.name}!${critText} Causó ${finalDamage} de daño.`;

      // Check if Opponent Faints
      if (battleState.opp.hp <= 0) {
        setTimeout(handleVictory, 800);
        return;
      }

      // Opponent Turn after short delay
      setTimeout(executeOpponentTurn, 900);
    }, 250);
  }

  function executeOpponentTurn() {
    if (!battleState || battleState.opp.hp <= 0) return;

    const oppMoves = (battleState.opp.moves && battleState.opp.moves.length > 0) ? battleState.opp.moves : [
      { name: 'Golpe', power: 45, type: 'Normal' }
    ];
    const move = oppMoves[Math.floor(Math.random() * oppMoves.length)];

    oppSprite.classList.add('attack-lunge');
    setTimeout(() => oppSprite.classList.remove('attack-lunge'), 350);

    const isCrit = Math.random() < 0.15;
    const variance = 0.88 + Math.random() * 0.24;
    const power = move.power || 50;
    const baseDamage = (power * 0.38 * (battleState.opp.cp / battleState.player.cp)) * variance;
    const finalDamage = Math.max(14, Math.round(baseDamage * (isCrit ? 1.35 : 1.0)));

    battleState.player.hp = Math.max(0, battleState.player.hp - finalDamage);

    setTimeout(() => {
      mySprite.classList.add('hit-flash');
      if (window.playHitSound) window.playHitSound();
      setTimeout(() => mySprite.classList.remove('hit-flash'), 400);

      updateHpBars();
      const critText = isCrit ? ' ¡Fue súper efectivo! ⚡' : '';
      logBox.textContent = `¡El ${battleState.opp.name} de ${battleState.trainer} usó ${move.name}!${critText} Recibiste ${finalDamage} de daño.`;

      // Check if Player Faints
      if (battleState.player.hp <= 0) {
        setTimeout(handleDefeat, 800);
        return;
      }

      // Turn complete: re-enable player moves
      battleState.turnBusy = false;
      setMovesDisabled(false);
    }, 250);
  }

  function handleVictory() {
    if (window.playVictorySound) window.playVictorySound();
    resultOverlay.hidden = false;

    if (battleState.isWild && battleState.wildData) {
      logBox.textContent = `¡${battleState.opp.name} se debilitó y fue capturado! 🎉`;
      modal.querySelector('#result-title').textContent = '¡POKÉMON CAPTURADO! 🏆';
      modal.querySelector('#result-title').style.color = '#ffd700';
      modal.querySelector('#result-desc').textContent = `¡Derrotaste a ${battleState.opp.name} en la arena! Se rinde ante tu poder y se sumó a tu Mochila con CP ${battleState.opp.cp}.`;

      // Auto-catch upon victory
      if (window.addPokemonToPokedex) {
        window.addPokemonToPokedex(battleState.wildData, battleState.spawnId);
      }
      if (window.show) {
        window.show(`🏆 ¡Victoria! ${battleState.opp.name} capturado tras la batalla.`);
      }
    } else {
      logBox.textContent = `¡${battleState.opp.name} del oponente se debilitó! ¡Has ganado el combate! 🏆`;
      modal.querySelector('#result-title').textContent = '¡VICTORIA ÉPICA! 🏆';
      modal.querySelector('#result-title').style.color = '#ffd700';
      modal.querySelector('#result-desc').textContent = `Derrotaste a ${battleState.trainer} y su ${battleState.opp.name}. Tu ${battleState.player.name} demostró gran poderío en la arena.`;

      if (window.show) {
        window.show(`🏆 ¡Victoria! Venciste al ${battleState.opp.name} de ${battleState.trainer}.`);
      }
    }
  }

  function handleDefeat() {
    logBox.textContent = `¡Tu ${battleState.player.name} se ha debilitado! ${battleState.trainer} ganó esta ronda.`;
    resultOverlay.hidden = false;
    modal.querySelector('#result-title').textContent = '¡BUENA PELEA! 🥊';
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
