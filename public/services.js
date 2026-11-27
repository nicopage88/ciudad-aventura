(()=>{
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'services.css';
  document.head.append(style);

  // Weather condition map (WMO weather codes)
  function parseWeather(code, isDay) {
    if (code === 0) return { text: isDay ? 'Soleado y despejado' : 'Noche despejada', icon: isDay ? '☀️' : '🌙' };
    if (code <= 3) return { text: isDay ? 'Parcialmente nublado' : 'Noche con nubes', icon: isDay ? '⛅' : '☁️' };
    if (code <= 48) return { text: 'Niebla en la ciudad', icon: '🌫️' };
    if (code <= 55) return { text: 'Llovizna suave', icon: '🌦️' };
    if (code <= 65) return { text: 'Lluvia en Santiago', icon: '🌧️' };
    if (code <= 77) return { text: 'Aguanieve / Nieve', icon: '❄️' };
    if (code <= 82) return { text: 'Chubascos', icon: '🌧️' };
    return { text: 'Tormenta eléctrica', icon: '⛈️' };
  }

  // Floating Weather Widget on Map
  const weatherWidget = document.createElement('div');
  weatherWidget.id = 'weather-hud-widget';
  weatherWidget.className = 'weather-hud-widget';
  weatherWidget.innerHTML = `
    <span class="weather-icon" id="w-icon">⛅</span>
    <span class="weather-temp" id="w-temp">Cargando...</span>
    <span id="w-city">Maipú</span>
  `;
  document.querySelector('.map-wrap')?.append(weatherWidget);

  // Services Dashboard Modal Shell
  const modal = document.createElement('div');
  modal.id = 'services-modal';
  modal.className = 'services-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="services-dialog" role="dialog" aria-modal="true" aria-label="Servicios Públicos de Chile">
      <div class="services-header">
        <span>🇨🇱 SERVICIOS PÚBLICOS DE CHILE</span>
        <button class="services-close-btn" id="serv-close" type="button" aria-label="Cerrar">✕</button>
      </div>
      <p class="services-subtitle">
        Datos públicos oficiales y en tiempo real integrados a Ciudad Aventura desde el <a href="https://juanbrujo.github.io/listado-apis-publicas-en-chile/" target="_blank" rel="noopener noreferrer">Listado de APIs Públicas en Chile (Juan Brujo)</a>.
      </p>

      <div class="services-grid">
        <!-- Clima en Vivo -->
        <div class="service-card" id="card-clima">
          <div class="service-card-head">
            <span>🌤️ CLIMA Y TIEMPO (MAIPÚ / SANTIAGO RM)</span>
            <span class="service-badge">En vivo</span>
          </div>
          <div class="weather-details-row">
            <div class="weather-main-stat">
              <span class="weather-big-icon" id="modal-w-icon">☀️</span>
              <div>
                <span class="weather-big-temp" id="modal-w-temp">--°C</span>
                <div style="font-size: 0.78rem; font-weight: 800; color: #0284c7;" id="modal-w-desc">Cargando clima...</div>
              </div>
            </div>
            <div class="weather-stats-list">
              <div>💧 Humedad: <strong id="modal-w-hum">--%</strong></div>
              <div>💨 Viento: <strong id="modal-w-wind">-- km/h</strong></div>
              <div>🌡️ Sensación: <strong id="modal-w-sens">--°C</strong></div>
              <div>📍 Estación: <strong>Maipú Centro</strong></div>
            </div>
          </div>
          <button class="thought-chip" id="btn-toggle-night" style="width: 100%; text-align: center;">🌙 Alternar ambiente de noche/día en el mapa</button>
        </div>

        <!-- Indicadores Económicos -->
        <div class="service-card" id="card-econ">
          <div class="service-card-head">
            <span>📈 INDICADORES ECONÓMICOS DE CHILE (MINDICADOR.CL)</span>
            <span class="service-badge">Hoy</span>
          </div>
          <div class="econ-grid" id="econ-grid">
            <div class="econ-item"><span class="econ-label">UF</span><span class="econ-val" id="val-uf">...</span></div>
            <div class="econ-item"><span class="econ-label">DÓLAR OBS.</span><span class="econ-val" id="val-dolar">...</span></div>
            <div class="econ-item"><span class="econ-label">UTM</span><span class="econ-val" id="val-utm">...</span></div>
            <div class="econ-item"><span class="econ-label">EURO</span><span class="econ-val" id="val-euro">...</span></div>
          </div>
        </div>

        <!-- Sismos Chile -->
        <div class="service-card" id="card-sismos">
          <div class="service-card-head">
            <span>🌋 ÚLTIMOS SISMOS EN CHILE (CENTRO SISMOLÓGICO)</span>
            <span class="service-badge">api.gael.cloud</span>
          </div>
          <div class="sismos-list" id="sismos-list">
            <div style="font-size: 0.75rem; color: #64748b;">Consultando últimos sismos...</div>
          </div>
        </div>

        <!-- Feriados -->
        <div class="service-card" id="card-feriados">
          <div class="service-card-head">
            <span>📅 PRÓXIMO FERIADO OFICIAL CHILE 2026</span>
            <span class="service-badge">FeriadosApp</span>
          </div>
          <div id="feriado-info" style="font-size: 0.8rem; color: #1e293b; background: #fff; padding: 8px 10px; border-radius: 8px; border: 1.5px solid #e2e8f0;">
            Consultando calendario de feriados...
          </div>
        </div>
      </div>

      <div style="margin-top: 16px; text-align: center;">
        <button class="fair-goto-btn" style="width: 100%; padding: 10px;" id="serv-done">Cerrar Servicios</button>
      </div>
    </div>
  `;
  document.body.append(modal);

  const btnClose = modal.querySelector('#serv-close');
  const btnDone = modal.querySelector('#serv-done');

  function openServicesModal() {
    if (window.playClickSound) window.playClickSound();
    modal.hidden = false;
    fetchServicesData();
  }
  window.openServicesModal = openServicesModal;

  function closeServicesModal() {
    modal.hidden = true;
  }

  btnClose.onclick = closeServicesModal;
  btnDone.onclick = closeServicesModal;
  weatherWidget.onclick = openServicesModal;

  // Night Ambient Overlay on Map
  let nightOverlay = null;
  function setNightAmbiance(isNight) {
    const mapWrap = document.querySelector('.map-wrap');
    if (!mapWrap) return;
    if (isNight) {
      if (!nightOverlay) {
        nightOverlay = document.createElement('div');
        nightOverlay.className = 'weather-night-ambient';
        mapWrap.append(nightOverlay);
      }
    } else {
      if (nightOverlay) {
        nightOverlay.remove();
        nightOverlay = null;
      }
    }
  }

  modal.querySelector('#btn-toggle-night').onclick = () => {
    setNightAmbiance(!nightOverlay);
    if (window.show) window.show(nightOverlay ? '🌙 Modo noche activado en el mapa.' : '☀️ Modo día activado en el mapa.');
  };

  // Fetch Clima en Vivo
  async function fetchWeather() {
    try {
      const lat = window.pos?.lat || -33.51;
      const lng = window.pos?.lng || -70.76;
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${lng.toFixed(2)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=America%2FSantiago`);
      if (!res.ok) return;
      const data = await res.json();
      const cur = data.current;
      if (!cur) return;

      const condition = parseWeather(cur.weather_code, cur.is_day);

      // Update Map Widget
      weatherWidget.querySelector('#w-icon').textContent = condition.icon;
      weatherWidget.querySelector('#w-temp').textContent = `${Math.round(cur.temperature_2m)}°C`;
      weatherWidget.title = `Clima actual en Maipú: ${condition.text} (${Math.round(cur.temperature_2m)}°C)`;

      // Update Modal
      modal.querySelector('#modal-w-icon').textContent = condition.icon;
      modal.querySelector('#modal-w-temp').textContent = `${Math.round(cur.temperature_2m)}°C`;
      modal.querySelector('#modal-w-desc').textContent = condition.text;
      modal.querySelector('#modal-w-hum').textContent = `${cur.relative_humidity_2m}%`;
      modal.querySelector('#modal-w-wind').textContent = `${cur.wind_speed_10m} km/h`;
      modal.querySelector('#modal-w-sens').textContent = `${Math.round(cur.apparent_temperature)}°C`;

      // Apply night ambient if currently night in Santiago
      if (cur.is_day === 0) {
        setNightAmbiance(true);
      }
    } catch {}
  }

  // Fetch Chilean Economic Indicators (mindicador.cl)
  async function fetchIndicators() {
    try {
      const res = await fetch('https://mindicador.cl/api');
      if (!res.ok) return;
      const data = await res.json();

      const fmt = (v) => `$${Math.round(v).toLocaleString('es-CL')}`;
      modal.querySelector('#val-uf').textContent = data.uf ? fmt(data.uf.valor) : '$41.419';
      modal.querySelector('#val-dolar').textContent = data.dolar ? fmt(data.dolar.valor) : '$1.037';
      modal.querySelector('#val-utm').textContent = data.utm ? fmt(data.utm.valor) : '$66.628';
      modal.querySelector('#val-euro').textContent = data.euro ? fmt(data.euro.valor) : '$1.085';
    } catch {}
  }

  // Fetch Sismos Chile (api.gael.cloud)
  async function fetchSismos() {
    try {
      const res = await fetch('https://api.gael.cloud/general/public/sismos');
      if (!res.ok) return;
      const data = await res.json();
      if (!Array.isArray(data)) return;

      const top3 = data.slice(0, 3);
      const list = modal.querySelector('#sismos-list');
      list.replaceChildren();

      top3.forEach(s => {
        const item = document.createElement('div');
        item.className = 'sismo-item';
        item.innerHTML = `
          <div>
            <span class="sismo-mag">M ${s.Magnitud}</span>
            <span class="sismo-loc">${s.RefGeografica}</span>
          </div>
          <span class="sismo-time">Prof: ${s.Profundidad} km · ${s.Fecha.slice(11, 16)} hrs</span>
        `;
        list.append(item);
      });
    } catch {}
  }

  // Fetch Holidays (api.boostr.cl)
  async function fetchHolidays() {
    try {
      const res = await fetch('https://api.boostr.cl/holidays.json');
      if (!res.ok) return;
      const data = await res.json();
      const list = data.data;
      if (!Array.isArray(list) || list.length === 0) return;

      const next = list[0];
      const ferInfo = modal.querySelector('#feriado-info');
      ferInfo.innerHTML = `
        <strong>🎉 ${next.title}</strong> (${next.date})<br>
        <span style="color: #64748b; font-size: 0.75rem;">Tipo: ${next.type} · ${next.extra || 'Feriado Nacional de Chile'}</span>
      `;
    } catch {}
  }

  function fetchServicesData() {
    fetchWeather();
    fetchIndicators();
    fetchSismos();
    fetchHolidays();
  }

  // Initial load
  fetchWeather();
  setInterval(fetchWeather, 300000); // refresh weather every 5 mins

  // Hook footer dock button
  const dockBtn = document.querySelector('#services-btn');
  if (dockBtn) {
    dockBtn.onclick = openServicesModal;
  }
})();
