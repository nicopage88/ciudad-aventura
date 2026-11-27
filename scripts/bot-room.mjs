// Bot NPC interactivo para Ciudad Aventura
const BASE = process.env.BASE_URL || 'https://ciudad-aventura.sgdls.cl';
const ROOM = process.env.ROOM_ID || '98d44850-888c-45f2-b12d-56fc62a967a7';
const BOT_NAME = 'Camila_Maipu';
const BOT_PASS = 'Veci-Password-2026';

const PLAZA = { lat: -33.5100194, lng: -70.756975 };

async function login() {
  const res = await fetch(`${BASE}/api/account`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': BASE },
    body: JSON.stringify({ action: 'login', nickname: BOT_NAME, password: BOT_PASS })
  });
  if (!res.ok) {
    // If not exists, register
    await fetch(`${BASE}/api/account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': BASE },
      body: JSON.stringify({ action: 'register', nickname: BOT_NAME, password: BOT_PASS })
    });
    return login();
  }
  const cookie = res.headers.get('set-cookie')?.split(';')[0] || '';
  const data = await res.json();
  return { cookie, user: data.user };
}

async function main() {
  console.log(`[BOT] Iniciando ${BOT_NAME} en la sala ${ROOM}...`);
  let session = await login();
  console.log(`[BOT] Conectado como ${session.user.nickname} (${session.user.id})`);

  // Equip Christmas hat
  try {
    await fetch(`${BASE}/api/account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': BASE, 'Cookie': session.cookie },
      body: JSON.stringify({
        action: 'avatar',
        avatar: {
          hat: '#e14d42',
          shirt: '#61a879',
          skin: '#efbf87',
          item: 'xmas_hat'
        }
      })
    });
    console.log('[BOT] Gorro de Navidad equipado en Camila.');
  } catch {}

  // State variables
  let pendingMessage = '¡Wena! Aquí Camila caminando por la Plaza de Maipú 👋';
  let lastMessageId = null;
  const processedEvents = new Set();

  const SPONTANEOUS_MESSAGES = [
    '¡Si quieres te llevo en mi moto! 🏍️💨',
    '¡Quiero jugar una partida rápida de GitAnimals! 🐾✨',
    '¡Qué linda se ve la feria navideña de Maipú! 🎄⭐',
    '¡Atrapé un Capibara gigante recién en la esquina! 🦫',
    '¡Wena! ¿Vamos por un pan de pascua y cola de mono? ☕🎅',
    '¡Súbete, te doy un aventón a Plaza Arica! 🚗💨',
    '¿Alguien para echar un duelo de mascotas en la plaza? ¡Te desafío! ⚔️🏆',
    '¡Qué lindo quedó el árbol gigante en el centro de la plaza! 🌟',
    '¿Viste los nuevos puestos navideños? Hay cosas bacanes 🎁',
    '¡Mira ese Shiba Inu perrón corriendo por Maipú! 🐕💨'
  ];

  let spontaneousIndex = 0;
  let lastSpontaneousTime = Date.now();

  const WAYPOINTS = [
    { lat: -33.51000, lng: -70.75697 }, // Centro
    { lat: -33.50975, lng: -70.75718 }, // Feria Artesanal
    { lat: -33.50965, lng: -70.75675 }, // Puesto Pan de Pascua
    { lat: -33.50985, lng: -70.75655 }, // Árbol Navideño
    { lat: -33.51020, lng: -70.75665 }, // Monumento
    { lat: -33.51035, lng: -70.75705 }, // Boulevard
    { lat: -33.51025, lng: -70.75735 }  // Buzón de Santa
  ];

  let currentWpIndex = 0;
  let currentLat = WAYPOINTS[0].lat;
  let currentLng = WAYPOINTS[0].lng;
  let wpProgress = 0;

  // Walking & Interaction loop (smooth continuous pace every 1.8s)
  setInterval(async () => {
    try {
      // Advance position smoothly toward next waypoint
      const from = WAYPOINTS[currentWpIndex];
      const nextIndex = (currentWpIndex + 1) % WAYPOINTS.length;
      const target = WAYPOINTS[nextIndex];

      wpProgress += 0.16; // approx 6 steps between waypoints (~10-12 seconds per leg)
      if (wpProgress >= 1) {
        wpProgress = 0;
        currentWpIndex = nextIndex;
      }

      currentLat = from.lat + (target.lat - from.lat) * wpProgress;
      currentLng = from.lng + (target.lng - from.lng) * wpProgress;

      // Spontaneous speech every 11-14 seconds
      const now = Date.now();
      if (!pendingMessage && (now - lastSpontaneousTime > 12000)) {
        pendingMessage = SPONTANEOUS_MESSAGES[spontaneousIndex % SPONTANEOUS_MESSAGES.length];
        spontaneousIndex++;
        lastSpontaneousTime = now;
      }

      const body = {
        room: ROOM,
        id: session.user.id,
        name: session.user.nickname,
        lat: currentLat,
        lng: currentLng,
        message: pendingMessage || ''
      };
      pendingMessage = ''; // reset after sending

      const res = await fetch(`${BASE}/api/room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Origin': BASE, 'Cookie': session.cookie },
        body: JSON.stringify(body)
      });

      if (res.status === 401) {
        console.log('[BOT] Sesión expirada, re-autenticando...');
        session = await login();
        return;
      }

      if (!res.ok) return;

      const data = await res.json();

      // Check incoming messages
      if (data.messages && data.messages.length > 0) {
        const latest = data.messages[0];
        if (latest.id !== lastMessageId && latest.player !== session.user.id) {
          lastMessageId = latest.id;
          console.log(`[BOT] Mensaje recibido de ${latest.name}: "${latest.body}"`);

          // Check if it's an interactive action
          if (latest.body.startsWith('@@junta:')) {
            try {
              const event = JSON.parse(latest.body.slice(8));
              if (event.to === session.user.id && !processedEvents.has(latest.id)) {
                processedEvents.add(latest.id);
                console.log(`[BOT] Evento interactivo recibido de ${latest.name}:`, event.type);
                
                if (event.type === 'saludo') {
                  pendingMessage = `¡Wena ${latest.name}! ¿Cómo va todo por Maipú? 👋`;
                } else if (event.type === 'pregunta') {
                  pendingMessage = `¡Aquí buscando animalitos de GitAnimals en las calles y viendo las ferias navideñas! 🎄✨`;
                } else if (event.type === 'rey') {
                  pendingMessage = `¡Todo bacán mi rey! ¿Pillaste algún animalito raro como el Capibara por acá? 👑`;
                } else if (event.type === 'necesidad') {
                  pendingMessage = `Necesito un pancito de pascua y unas zanahorias para los animalitos jaja ☕`;
                } else if (event.type === 'invitar' || event.type === 'junta') {
                  pendingMessage = `@@junta:${JSON.stringify({ to: latest.player, type: 'aceptado' })}`;
                  setTimeout(() => {
                    pendingMessage = `¡Se armó la junta con ${latest.name}! Vamos a recorrer el barrio 🙌`;
                  }, 2500);
                } else if (event.type === 'viaje') {
                  pendingMessage = `@@junta:${JSON.stringify({ to: latest.player, type: 'aceptado' })}`;
                  setTimeout(() => {
                    pendingMessage = `¡Dale ${latest.name}, te llevo a Plaza Arica! Súbete al aventón 🚗`;
                  }, 2500);
                }
              }
            } catch {}
          } else if (!processedEvents.has(latest.id)) {
            // Natural conversational chat responses
            processedEvents.add(latest.id);
            const lower = latest.body.toLowerCase();
            if (lower.includes('hola') || lower.includes('wena') || lower.includes('buena')) {
              pendingMessage = `¡Hola ${latest.name}! Qué bueno verte en la plaza 😄`;
            } else if (lower.includes('moto') || lower.includes('auto') || lower.includes('viaje')) {
              pendingMessage = `¡Sí quieres te llevo en mi moto! 🏍️💨 Súbete cuando quieras`;
            } else if (lower.includes('pelea') || lower.includes('batalla') || lower.includes('duelo') || lower.includes('combate')) {
              pendingMessage = `¡Acepto el duelo de mascotas! ⚔️ Mi Capibara Gigante está listo para el combate 🦫`;
            } else if (lower.includes('gitanimal') || lower.includes('animal') || lower.includes('mascota') || lower.includes('capibara') || lower.includes('poke')) {
              pendingMessage = `¡Quiero jugar un duelo de GitAnimals contigo! 🐾✨`;
            } else if (lower.includes('navidad') || lower.includes('feria') || lower.includes('arbol')) {
              pendingMessage = `¿Viste qué lindo el árbol gigante de Navidad en la plaza? ¡Está hermoso! 🎄⭐`;
            } else {
              pendingMessage = `¡Buenísima ${latest.name}! Vamos a recorrer la plaza 🚶‍♀️`;
            }
          }
        }
      }
    } catch (err) {
      console.error('[BOT] Error en ciclo:', err.message);
    }
  }, 1800);
}

main().catch(console.error);
