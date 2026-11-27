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

  let angle = 0;
  let lastMessageId = null;
  const processedEvents = new Set();
  let pendingMessage = '¡Wena vecinos! Aquí Camila caminando por la Plaza de Maipú 👋';

  // Offer ride
  try {
    await fetch(`${BASE}/api/rides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': BASE, 'Cookie': session.cookie },
      body: JSON.stringify({
        room: ROOM,
        id: session.user.id,
        action: 'offer',
        origin: 'Plaza de Maipú',
        destination: 'Plaza Arica',
        seats: 3,
        contribution: 'Conversable / buena onda'
      })
    });
    console.log('[BOT] Aventón ofrecido en la sala.');
  } catch (e) {
    console.error('[BOT] Error ofreciendo aventón:', e.message);
  }

  // Walking & Interaction loop
  setInterval(async () => {
    try {
      // Natural circular walking path around Plaza de Maipú (~35m radius)
      angle += 0.08;
      const rMeters = 30 + Math.sin(angle * 2) * 8;
      const dLat = (rMeters * Math.cos(angle)) / 111320;
      const dLng = (rMeters * Math.sin(angle)) / (111320 * Math.cos(PLAZA.lat * Math.PI / 180));
      const currentLat = PLAZA.lat + dLat;
      const currentLng = PLAZA.lng + dLng;

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
                  pendingMessage = `¡Aquí buscando Pokémon en las calles y viendo las ferias navideñas! 🎄✨`;
                } else if (event.type === 'rey') {
                  pendingMessage = `¡Todo bacán mi rey! ¿Pillaste algún Pokémon raro por acá? 👑`;
                } else if (event.type === 'necesidad') {
                  pendingMessage = `Necesito un pancito de pascua y unas Pokébolas en la feria jaja ☕`;
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
            } else if (lower.includes('pokemon') || lower.includes('pokémon') || lower.includes('pikachu')) {
              pendingMessage = `¡Sí! Recién vi un Pikachu y un Eevee por la esquina 🔴`;
            } else if (lower.includes('navidad') || lower.includes('feria')) {
              pendingMessage = `¿Viste que abrieron la Feria Navideña 2026 en la plaza? ¡Está genial! 🎄`;
            } else {
              pendingMessage = `¡Buenísima ${latest.name}! Vamos a explorar la ciudad 🚶‍♀️`;
            }
          }
        }
      }
    } catch (err) {
      console.error('[BOT] Error en ciclo:', err.message);
    }
  }, 2200);
}

main().catch(console.error);
