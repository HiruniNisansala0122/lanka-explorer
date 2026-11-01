// ===== 1. MOBILE MENU (Week 02) =====
// Week 02: appearance stays in CSS; JavaScript changes the menu state only.
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('header nav');
if (menuToggle && nav) {
  document.querySelector('header').classList.add('menu-ready');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      setMenu(false);
      menuToggle.focus();
    }
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  window.matchMedia('(max-width: 768px)').addEventListener('change', () => setMenu(false));
}

// ===== 1b. DARK MODE =====
const THEME_KEY = 'lankaExplorerTheme';
function preferredTheme() { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
function applyTheme(theme) {
  const dark = theme === 'dark';
  document.body.classList.toggle('dark', dark);
  document.querySelectorAll('.theme-toggle').forEach(button => {
    button.textContent = dark ? 'Light mode' : 'Dark mode';
    button.setAttribute('aria-pressed', String(dark));
  });
}
function initTheme() {
  applyTheme(readStorage(THEME_KEY) || preferredTheme());
  document.querySelector('.theme-toggle')?.addEventListener('click', () => {
    const theme = document.body.classList.contains('dark') ? 'light' : 'dark';
    writeStorage(THEME_KEY, theme); applyTheme(theme);
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!readStorage(THEME_KEY)) applyTheme(preferredTheme());
  });
}

// ===== 2. LOAD DATA =====
async function loadDestinations() {
  const response = await fetch('data/destinations.json');
  if (!response.ok) throw new Error(`Could not load destinations (status ${response.status})`);
  const places = await response.json();
  if (!Array.isArray(places)) throw new Error('Destination data must be an array.');
  return places;
}

// ===== 3. HELPER FUNCTIONS =====
function formatFee(fee) {
  if (fee === 0) return 'Free';
  else return 'USD ' + fee;
}
function getPriceLabel(fee) {
  if (fee === 0) return 'Free';
  else if (fee <= 15) return 'Budget';
  else if (fee <= 30) return 'Mid-range';
  else return 'Premium';
}
function getCategoryClass(category) {
  switch (category) {
    case 'Heritage': return 'badge-heritage';
    case 'Beach': return 'badge-beach';
    case 'Nature': return 'badge-nature';
    case 'Wildlife': return 'badge-wildlife';
    default: return 'badge-other';
  }
}
// Escape strings before inserting JSON content in an HTML template.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function createCard(place) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.fee = place.entryFeeUSD;
  card.innerHTML = `
    <img src="${escapeHTML(place.imageSmall || place.image)}" alt="${escapeHTML(place.name)}" width="600" height="400" loading="lazy">
    <h3>${escapeHTML(place.name)}</h3>
    <p class="meta"><span class="badge ${getCategoryClass(place.category)}">${escapeHTML(place.category)}</span> ${escapeHTML(place.district)} District</p>
    <p>${escapeHTML(place.description)}</p>
    <p class="fee">Entry: ${formatFee(place.entryFeeUSD)}${place.entryFeeUSD > 0 ? " · " + getPriceLabel(place.entryFeeUSD) : ""}</p>
    <a href="details.html?id=${encodeURIComponent(place.id)}">View details</a>`;
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'card-trip'; button.dataset.tripId = place.id;
  const added = isInTrip(place.id);
  button.textContent = added ? '✓ In My Trip (remove)' : 'Add to My Trip';
  button.setAttribute('aria-pressed', String(added)); button.classList.toggle('added', added);
  card.appendChild(button);
  return card;
}
function showLoadError(container, text) {
  container.querySelectorAll('.no-results,.card,.error,.loading').forEach(el => el.remove());
  const message = document.createElement('p');
  message.className = 'error';
  message.textContent = text + ' Please refresh and run this site through Live Server.';
  container.appendChild(message);
}

function showLoading(element, text) {
  element.innerHTML = `<div class="loading" role="status"><span class="spinner" aria-hidden="true"></span><span>${escapeHTML(text)}</span></div>`;
}
function showError(element, text) {
  element.innerHTML = `<p class="error" role="status">${escapeHTML(text)}</p>`;
}

// ===== 4. HOME PAGE =====
async function initHomePage() {
  const section = document.querySelector('#featured');
  if (!section) return;
  const loading = document.createElement('div'); section.appendChild(loading); showLoading(loading, 'Loading featured destinations…');
  try {
    const destinations = await loadDestinations();
    loading.remove();
    section.querySelectorAll('.no-results,.card,.error,.loading').forEach(el => el.remove());
    const featured = destinations.filter(place => place.featured === true);
    for (const place of featured) section.appendChild(createCard(place));
    if (!featured.length) {
      const message = document.createElement('p');
      message.className = 'no-results'; message.textContent = 'No featured destinations yet.';
      section.appendChild(message);
    }
  } catch (error) {
    showLoadError(section, 'Featured destinations could not be loaded.');
  }
}

// ===== 5. DESTINATIONS PAGE =====
async function initDestinationsPage() {
  const list = document.querySelector('#destination-list');
  if (!list) return;
  const search = document.querySelector('#search');
  const category = document.querySelector('#category');
  const sort = document.querySelector('#sort');
  const count = document.querySelector('#result-count');
  let allDestinations = [];
  showLoading(list, 'Loading destinations…');
  try {
    allDestinations = await loadDestinations();
  } catch (error) {
    showLoadError(list, 'Sorry, destinations could not be loaded.');
    count.textContent = 'Destinations unavailable.';
    showError(document.querySelector('#all-map'), 'Map unavailable because destination data could not be loaded.');
    return;
  }
  function updateList() {
    const text = search.value.trim().toLowerCase();
    const results = allDestinations.filter(place => {
      const matchesSearch = [place.name,place.district,place.description].some(value => value.toLowerCase().includes(text));
      return matchesSearch && (category.value === 'all' || place.category === category.value);
    });
    if (sort.value === 'fee-low') results.sort((a,b) => a.entryFeeUSD-b.entryFeeUSD || a.name.localeCompare(b.name));
    else if (sort.value === 'fee-high') results.sort((a,b) => b.entryFeeUSD-a.entryFeeUSD || a.name.localeCompare(b.name));
    else results.sort((a,b) => a.name.localeCompare(b.name));
    list.querySelectorAll('.card,.no-results,.error,.loading').forEach(el => el.remove());
    if (!results.length) {
      const message = document.createElement('p');
      message.className = 'no-results'; message.textContent = 'No destinations match your search.';
      list.appendChild(message);
    }
    for (const place of results) list.appendChild(createCard(place));
    count.textContent = `Showing ${results.length} of ${allDestinations.length} destinations`;
    showAllDestinationsMap(results);
    showCardFees();
  }
  search.addEventListener('input',updateList);
  category.addEventListener('change',updateList);
  sort.addEventListener('change',updateList);
  document.querySelector('#clear-filters').addEventListener('click', () => {
    search.value = ''; category.value = 'all'; sort.value = 'name'; updateList(); search.focus();
  });
  updateList();
}

// ===== 5b. API: WEATHER (Open-Meteo) =====
async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Request failed (status ${response.status})`);
  return response.json();
}
function describeWeather(code) {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if ([45,48].includes(code)) return 'Foggy';
  if ([51,53,55,56,57].includes(code)) return 'Drizzle';
  if ([61,63,65,66,67].includes(code)) return 'Rain';
  if ([71,73,75,77,85,86].includes(code)) return 'Snow';
  if ([80,81,82].includes(code)) return 'Rain showers';
  if ([95,96,99].includes(code)) return 'Thunderstorm';
  return 'Mixed conditions';
}
function weatherIcon(code) {
  const text = describeWeather(code);
  if (text.includes('clear') || text === 'Clear sky') return '☀️';
  if (text === 'Thunderstorm') return '⛈️';
  if (text.includes('Rain') || text === 'Drizzle') return '🌧️';
  if (text === 'Snow') return '❄️';
  if (text === 'Foggy') return '🌫️';
  return '⛅';
}
async function showWeather(place) {
  const box = document.querySelector('#weather');
  if (!box) return;
  showLoading(box, 'Loading weather…');
  const params = new URLSearchParams({latitude:place.lat, longitude:place.lng,
    current:'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone:'Asia/Colombo', forecast_days:3});
  try {
    const data = await fetchJson('https://api.open-meteo.com/v1/forecast?' + params);
    const {current, daily} = data;
    if (!Number.isFinite(current?.temperature_2m) || daily?.time?.length !== 3) throw new Error('Incomplete weather data');
    const forecast = daily.time.map((date,i) => {
      const label = new Date(date+'T12:00:00+05:30').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'Asia/Colombo'});
      return `<div class="forecast-day"><strong>${label}</strong><p><span aria-hidden="true">${weatherIcon(daily.weather_code[i])}</span> ${describeWeather(daily.weather_code[i])}</p><p>${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°C</p><p>Rain: ${daily.precipitation_probability_max[i] ?? '—'}%</p></div>`;
    }).join('');
    box.innerHTML = `<div class="weather-now"><p class="temp">${Math.round(current.temperature_2m)}°C</p><p><span aria-hidden="true">${weatherIcon(current.weather_code)}</span> ${describeWeather(current.weather_code)}</p><p>Humidity ${current.relative_humidity_2m}% · Wind ${current.wind_speed_10m} km/h</p><p class="meta">Updated ${escapeHTML(current.time.replace('T',' '))} · Sri Lanka time · Open-Meteo</p></div><div class="forecast">${forecast}</div>`;
  } catch (error) {
    showError(box, 'Weather is unavailable right now. Please try again later.');
  }
}

// ===== 5c. API: CURRENCY (Frankfurter) =====
let usdToLkrRate = null;
let usdToLkrDate = '';
let rateRequest = null;
async function getUsdToLkrRate() {
  if (usdToLkrRate !== null) return usdToLkrRate;
  if (!rateRequest) {
    rateRequest = fetchJson('https://api.frankfurter.dev/v2/rate/USD/LKR').then(data => {
      if (!Number.isFinite(data.rate) || data.rate <= 0 || data.base !== 'USD' || data.quote !== 'LKR') throw new Error('Invalid rate');
      usdToLkrRate = data.rate; usdToLkrDate = data.date;
      return usdToLkrRate;
    }).catch(error => { rateRequest = null; throw error; });
  }
  return rateRequest;
}
function formatLkr(amount) { return 'Rs. ' + Math.round(amount).toLocaleString('en-LK'); }
async function showFeeInLkr(place) {
  const box = document.querySelector('#fee-lkr');
  if (!box || place.entryFeeUSD === 0) return;
  showLoading(box, 'Converting to LKR…');
  try {
    const rate = await getUsdToLkrRate();
    box.textContent = ` ≈ ${formatLkr(place.entryFeeUSD * rate)} (rate dated ${usdToLkrDate})`;
    box.title = `1 USD = ${rate} LKR. Latest available reference rate; bank rates may differ.`;
  } catch (error) { box.textContent = ' · LKR conversion unavailable'; }
}
async function showCardFees() {
  const cards = document.querySelectorAll('#destination-list .card');
  if (!cards.length) return;
  try {
    const rate = await getUsdToLkrRate();
    document.querySelectorAll('#destination-list .card').forEach(card => {
      const fee = Number(card.dataset.fee);
      if (fee > 0 && !card.querySelector('.card-lkr')) {
        const text = document.createElement('span'); text.className = 'card-lkr';
        text.textContent = ` ≈ ${formatLkr(fee * rate)}`;
        text.title = `Latest reference rate dated ${usdToLkrDate}`;
        card.querySelector('.fee').appendChild(text);
      }
    });
  } catch (error) { /* USD prices remain useful when currency service is unavailable. */ }
}

// ===== 5d. API: MAPS (Leaflet + OpenStreetMap) =====
let allDestinationsMap = null;
let destinationMarkers = null;
function addBaseLayer(map, box) {
  const status = document.createElement('p'); status.className = 'map-status'; status.setAttribute('role','status');
  status.textContent = 'Loading map tiles…'; box.after(status);
  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  let failed = false;
  tiles.on('tileerror', () => { failed = true; status.textContent = 'Some map tiles are unavailable. Pins and destination links are still usable.'; });
  tiles.on('load', () => { if (!failed) status.textContent = ''; });
  tiles.addTo(map);
}
function showMap(place) {
  const box = document.querySelector('#map');
  if (!box) return;
  if (typeof L === 'undefined') { showError(box, 'The map could not be loaded. Please refresh to try again.'); return; }
  try {
    box.textContent = '';
    const map = L.map(box).setView([place.lat,place.lng],13);
    addBaseLayer(map,box);
    L.marker([place.lat,place.lng]).addTo(map).bindPopup(`<strong>${escapeHTML(place.name)}</strong><br>${escapeHTML(place.district)} District`).openPopup();
  } catch (error) { showError(box, 'The map is unavailable right now.'); }
}
function showAllDestinationsMap(destinations) {
  const box = document.querySelector('#all-map');
  if (!box) return;
  if (typeof L === 'undefined') { showError(box, 'The map could not be loaded. Destination search still works.'); return; }
  try {
    if (!allDestinationsMap) {
      box.textContent = '';
      allDestinationsMap = L.map(box).setView([7.8,80.8],7);
      addBaseLayer(allDestinationsMap,box);
      destinationMarkers = L.layerGroup().addTo(allDestinationsMap);
    }
    destinationMarkers.clearLayers();
    for (const place of destinations) {
      L.marker([place.lat,place.lng]).addTo(destinationMarkers).bindPopup(`<strong>${escapeHTML(place.name)}</strong><br>${escapeHTML(place.category)}<br><a href="details.html?id=${encodeURIComponent(place.id)}">View details</a>`);
    }
    box.dataset.markerCount = destinations.length;
    document.querySelector('#map-results').textContent = destinations.length ? `${destinations.length} matching destinations on the map.` : 'No matching destinations on the map.';
    if (destinations.length) allDestinationsMap.fitBounds(destinations.map(p=>[p.lat,p.lng]),{padding:[30,30],maxZoom:13});
  } catch (error) { showError(box, 'The destination map is unavailable right now.'); }
}

// ===== 5e. MY TRIP STORAGE (localStorage) =====
const TRIP_KEY = 'lankaExplorerTrip';
const TRAVELLERS_KEY = 'lankaExplorerTravellers';
const memoryStorage = {};
function readStorage(key) {
  if (Object.prototype.hasOwnProperty.call(memoryStorage, key)) return memoryStorage[key];
  try { return localStorage.getItem(key); }
  catch (error) { return memoryStorage[key] ?? null; }
}
function writeStorage(key, value) {
  try { localStorage.setItem(key, value); delete memoryStorage[key]; }
  catch (error) {
    memoryStorage[key] = value;
    const notice = document.querySelector('#storage-notice');
    if (notice) { notice.hidden = false; notice.textContent = 'Browser storage is unavailable. Changes work for this page only and may not survive navigation.'; }
  }
}
function getTrip() {
  try {
    const value = JSON.parse(readStorage(TRIP_KEY) || '[]');
    return Array.isArray(value) ? [...new Set(value.filter(id => Number.isInteger(id) && id > 0))] : [];
  } catch (error) { return []; }
}
function saveTrip(trip) {
  writeStorage(TRIP_KEY, JSON.stringify([...new Set(trip)]));
  updateTripCount();
  window.dispatchEvent(new Event('tripchange'));
}
function isInTrip(id) { return getTrip().includes(id); }
function addToTrip(id) {
  if (!Number.isInteger(id) || id < 1) return;
  const trip = getTrip();
  if (!trip.includes(id)) saveTrip([...trip,id]);
}
function removeFromTrip(id) { saveTrip(getTrip().filter(item => item !== id)); }
function updateTripCount() {
  const link = document.querySelector('nav a[href="trip.html"]');
  const count = getTrip().length;
  if (link) link.textContent = count ? `My Trip (${count})` : 'My Trip';
}
function refreshTripButtons() {
  document.querySelectorAll('[data-trip-id]').forEach(button => {
    const added = isInTrip(Number(button.dataset.tripId));
    button.textContent = added ? '✓ In My Trip (remove)' : 'Add to My Trip';
    button.classList.toggle('added', added);
    button.setAttribute('aria-pressed', String(added));
  });
}
function setupTripButton(place) {
  const button = document.querySelector('#add-to-trip');
  if (!button) return;
  button.disabled = false; button.hidden = false;
  button.dataset.tripId = place.id;
  refreshTripButtons();
}
// Delegation handles newly generated card buttons as well as the details button.
document.addEventListener('click', event => {
  const button = event.target.closest('button[data-trip-id]');
  if (!button) return;
  const id = Number(button.dataset.tripId);
  if (isInTrip(id)) removeFromTrip(id); else addToTrip(id);
});
window.addEventListener('tripchange', refreshTripButtons);
window.addEventListener('storage', event => {
  if (event.key === TRIP_KEY || event.key === TRAVELLERS_KEY || event.key === null) {
    updateTripCount(); window.dispatchEvent(new Event('tripchange'));
  }
  if (event.key === THEME_KEY || event.key === null) applyTheme(readStorage(THEME_KEY) || preferredTheme());
});

// ===== 6b. MY TRIP PAGE =====
async function initTripPage() {
  const tbody = document.querySelector('#trip-table tbody');
  if (!tbody) return;
  const summary = document.querySelector('#trip-summary');
  const input = document.querySelector('#travellers');
  const clear = document.querySelector('#clear-trip');
  const usd = document.querySelector('#total-usd');
  const lkr = document.querySelector('#total-lkr');
  const rateNote = document.querySelector('#trip-rate');
  showLoading(summary, 'Loading your trip…');
  let destinations;
  try { destinations = await loadDestinations(); }
  catch (error) { showError(summary, 'Your trip could not be loaded. Please refresh to try again.'); clear.hidden = true; return; }
  const knownIds = new Set(destinations.map(place => place.id));
  const clean = getTrip().filter(id => knownIds.has(id));
  if (clean.length !== getTrip().length) saveTrip(clean);
  let rate = null;
  let ratePending = true;
  function travellers() {
    const saved = Number(readStorage(TRAVELLERS_KEY));
    return Number.isInteger(saved) && saved >= 1 && saved <= 20 ? saved : 1;
  }
  input.value = travellers();
  function renderTrip() {
    const count = travellers();
    const places = getTrip().map(id => destinations.find(place => place.id === id)).filter(Boolean);
    tbody.replaceChildren();
    let perPerson = 0;
    for (const place of places) {
      perPerson += place.entryFeeUSD;
      const tr = document.createElement('tr');
      tr.innerHTML = `<th scope="row"><a href="details.html?id=${place.id}">${escapeHTML(place.name)}</a></th><td>${escapeHTML(place.category)}</td><td>${formatFee(place.entryFeeUSD)}</td><td>${place.entryFeeUSD === 0 ? 'Free' : rate ? formatLkr(place.entryFeeUSD * rate) : '—'}</td><td><button class="remove-trip" type="button" data-remove-id="${place.id}" aria-label="Remove ${escapeHTML(place.name)} from trip">Remove</button></td>`;
      tbody.appendChild(tr);
    }
    if (!places.length) tbody.innerHTML = '<tr><td colspan="5" class="no-results">Your trip is empty. <a href="destinations.html">Browse destinations</a> to add some.</td></tr>';
    usd.textContent = 'USD ' + (perPerson * count).toLocaleString('en-US',{maximumFractionDigits:2});
    lkr.textContent = perPerson === 0 ? 'Rs. 0' : rate ? formatLkr(perPerson * count * rate) : ratePending ? 'Converting…' : 'Unavailable';
    summary.textContent = `${places.length} destination${places.length === 1 ? '' : 's'} · ${count} traveller${count === 1 ? '' : 's'} · Entry fees only`;
    clear.hidden = !places.length;
    rateNote.textContent = rate ? `Latest reference rate: 1 USD = ${rate} LKR, dated ${usdToLkrDate}. Bank rates may differ.` : ratePending ? 'Loading LKR reference rate… USD totals are ready.' : 'Currency service unavailable. USD totals still work; reload to retry.';
    const highest = [...places].sort((a,b) => b.entryFeeUSD-a.entryFeeUSD)[0];
    document.querySelector('#trip-insight').textContent = highest && perPerson > 0 ? `Highest entry fee: ${highest.name} — ${formatFee(highest.entryFeeUSD)} per person (${Math.round(highest.entryFeeUSD/perPerson*100)}% of entry-fee budget).` : '';
  }
  input.addEventListener('input', () => {
    const value = Number(input.value);
    const valid = Number.isInteger(value) && value >= 1 && value <= 20;
    input.setAttribute('aria-invalid', String(!valid));
    document.querySelector('#traveller-error').textContent = valid ? '' : 'Enter a whole number from 1 to 20. Totals use the last valid value.';
    if (valid) { writeStorage(TRAVELLERS_KEY, String(value)); renderTrip(); }
  });
  tbody.addEventListener('click', event => {
    const button = event.target.closest('[data-remove-id]');
    if (button) removeFromTrip(Number(button.dataset.removeId));
  });
  clear.addEventListener('click', () => { if (window.confirm('Remove every destination from your trip?')) saveTrip([]); });
  window.addEventListener('tripchange', () => { input.value = travellers(); renderTrip(); });
  renderTrip();
  try { rate = await getUsdToLkrRate(); }
  catch (error) { /* Retain USD totals when the currency service is unavailable. */ }
  ratePending = false; renderTrip();
}

// ===== 6. DETAILS PAGE =====
async function initDetailsPage() {
  const container = document.querySelector('#destination');
  if (!container) return;
  const id = Number(new URLSearchParams(window.location.search).get('id'));
  showLoading(container, 'Loading destination…');
  try {
    const destinations = await loadDestinations();
    const place = destinations.find(p => p.id === id);
    if (!place) {
      container.innerHTML = '<h1>Destination not found</h1><p><a href="destinations.html">Back to all destinations</a></p>';
      document.querySelector('#add-to-trip').hidden = true;
      document.title = 'Destination not found | Lanka Explorer';
      document.querySelector('#weather').textContent = 'Choose a valid destination to see weather.';
      document.querySelector('#map').textContent = 'Choose a valid destination to see its map.';
      return;
    }
    document.title = `${place.name} | Lanka Explorer`;
    container.innerHTML = `
      <img src="${escapeHTML(place.imageLarge || place.image)}" alt="${escapeHTML(place.name)}" width="1200" height="800" fetchpriority="high">
      <h1>${escapeHTML(place.name)}</h1>
      <p class="meta"><span class="badge ${getCategoryClass(place.category)}">${escapeHTML(place.category)}</span> ${escapeHTML(place.district)} District</p>
      <p>${escapeHTML(place.description)}</p>
      <h2>Quick Facts</h2>
      <ul>
        <li><strong>Best time to visit:</strong> ${escapeHTML(place.bestTime)}</li>
        <li><strong>Entry fee:</strong> ${formatFee(place.entryFeeUSD)}<span id="fee-lkr"></span>${place.entryFeeUSD > 0 ? " (" + getPriceLabel(place.entryFeeUSD) + ")" : ""}</li>
        <li><strong>Coordinates:</strong> ${place.lat}, ${place.lng}</li>
      </ul>
      <p>Fees are indicative foreign-adult base prices. Paid excursions, taxes and transport may cost extra; confirm before travelling.</p>`;
    showWeather(place);
    showFeeInLkr(place);
    showMap(place);
    setupTripButton(place);
  } catch (error) {
    document.querySelector('#add-to-trip').hidden = true;
    container.innerHTML = '<h1>Destination unavailable</h1>';
    showLoadError(container, 'Sorry, this destination could not be loaded.');
    document.querySelector('#weather').textContent = 'Weather unavailable: destination data did not load.';
    document.querySelector('#map').textContent = 'Map unavailable: destination data did not load.';
  }
}

// ===== 7. ENQUIRY FORM =====
function initEnquiryForm() {
  const form = document.querySelector('#enquiry-form');
  if (!form) return;
  const message = document.querySelector('#form-message');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const date = form.querySelector('#date').value;
    const people = Number(form.querySelector('#people').value);
    const interests = form.querySelectorAll('input[name="interest"]:checked');
    const errors = [];
    if (name.length < 3) errors.push('Please enter your full name (at least 3 characters).');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address.');
    if (date) {
      const today = new Date(); today.setHours(0,0,0,0);
      const [year,month,day] = date.split('-').map(Number);
      if (new Date(year,month-1,day) < today) errors.push('The travel date cannot be in the past.');
    }
    if (!Number.isInteger(people) || people < 1 || people > 20) errors.push('Number of travellers must be a whole number between 1 and 20.');
    if (!interests.length) errors.push('Please choose at least one interest.');
    if (form.querySelector('#message').value.length > 500) errors.push('Message must be no longer than 500 characters.');
    message.replaceChildren();
    if (errors.length) {
      message.className = 'form-error';
      const ul = document.createElement('ul');
      errors.forEach(error => { const li = document.createElement('li'); li.textContent = error; ul.appendChild(li); });
      message.appendChild(ul);
    } else {
      message.className = 'form-success';
      message.textContent = `Thank you, ${name}! Your sample enquiry passed validation. Demo only: nothing has been sent or stored.`;
      form.reset();
    }
    message.focus();
  });
}

// ===== 8. START THE APP =====
initTheme();
updateTripCount();
initTripPage();
initHomePage();
initDestinationsPage();
initDetailsPage();
initEnquiryForm();
