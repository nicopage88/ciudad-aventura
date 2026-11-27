(()=>{
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'battle.css';
  document.head.append(style);

  // Helper URLs
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
        <span id="battle-title">⚔️ ARENA POKÉMON · DUELO CON CAMILA</span>
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
  btnRematch.onclick = () => startBattle();

  // Find best Pokémon from user Pokédex
  function getBestUserPokemon() {
    const pokedex = window.getPokedex ? window.getPokedex() : {};
    const caught = Object.values(pokedex).filter(p => p && (p.count > 0 || typeof p === 'object'));
    if (caught.length === 0) return { ...DEFAULT_STARTER };

    // Sort by CP descending
    caught.sort((a, b) => (b.cp || b.baseCp || 1000) - (a.cp || a.baseCp || 1000));
    const best = caught[0];
    const catalog = window.WILD_POKEMON ? window.WILD_POKEMON.find(w => w.id === best.id) : null;

    const moves = (best.moves && best.moves.length > 0) ? best.moves : (catalog?.moves || DEFAULT_STARTER.moves);
    const cp = best.cp || catalog?.baseCp || 2500;
    const maxHp = best.hp || catalog?.hp || 200;
    const level = Math.min(60, Math.max(30, Math.round(cp / 55)));

    return {
      id: best.id,
      name: best.name || catalog?.name || 'Compañero',
      type: best.type || catalog?.type || 'Normal',
      level,
      cp,
      maxHp,
      moves
    };
  }

  function startBattle(opponentTrainer = 'Camila_Maipu') {
    resultOverlay.hidden = true;
    const isCamila = opponentTrainer.includes('Camila');

    // Pick Camila's Pokémon
    const oppBase = CAMILA_TEAM[Math.floor(Math.random() * CAMILA_TEAM.length)];
    const myBase = getBestUserPokemon();

    battleState = {
      isCamila,
      trainer: isCamila ? 'Camila' : opponentTrainer,
      turnBusy: false,
      opp: {
        ...oppBase,
        hp: oppBase.maxHp
      },
      player: {
        ...myBase,
        hp: myBase.maxHp
      }
    };

    // Update Opponent HUD
    oppName.textContent = battleState.opp.name;
    oppLvl.textContent = `Nv. ${battleState.opp.level}`;
    oppTrainer.textContent = `Entrenadora: ${battleState.trainer}`;
    oppCp.textContent = `CP ${battleState.opp.cp}`;
    oppSprite.src = getAnimatedSprite(battleState.opp.id);
    updateHpBars();

    // Update Player HUD
    myName.textContent = battleState.player.name;
    myLvl.textContent = `Nv. ${battleState.player.level}`;
    myCp.textContent = `CP ${battleState.player.cp}`;
    mySprite.src = getAnimatedSprite(battleState.player.id);
    updateHpBars();

    // Render Moves
    renderMoveButtons();

    logBox.textContent = `¡Comienza el duelo! ${battleState.trainer} saca a ${battleState.opp.name} (CP ${battleState.opp.cp}). ¡Elige tu movimiento!`;
    modal.hidden = false;

    if (window.playCry) {
      window.playCry(battleState.opp.id);
    }

    // Send friendly room message from Camila if in room
    if (isCamila && window.show) {
      window.show(`⚔️ ¡Entraste en combate Pokémon con Camila!`);
    }
  }
  window.startPokemonBattle = startBattle;

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

    const oppMoves = battleState.opp.moves;
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
    logBox.textContent = `¡${battleState.opp.name} del oponente se debilitó! ¡Has ganado el combate! 🏆`;
    resultOverlay.hidden = false;
    modal.querySelector('#result-title').textContent = '¡VICTORIA ÉPICA! 🏆';
    modal.querySelector('#result-title').style.color = '#ffd700';
    modal.querySelector('#result-desc').textContent = `Derrotaste a ${battleState.trainer} y su ${battleState.opp.name}. Tu ${battleState.player.name} demostró gran poderío en la arena de Maipú.`;

    if (window.show) {
      window.show(`🏆 ¡Victoria! Venciste al ${battleState.opp.name} de ${battleState.trainer}.`);
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
  const dockBattleBtn = document.querySelector('#battle-btn');
  if (dockBattleBtn) {
    dockBattleBtn.onclick = () => startBattle('Camila_Maipu');
  }
})();
