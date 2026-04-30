import type { BoatLine, LatLng } from '../types';
import { findNearestRoutes, type RouteMatch } from '../map/mapManager';

interface SearchCallbacks {
  onResultSelect: (serviceId: string) => void;
  onSearch: (point: LatLng, label: string) => void;
  onClear: () => void;
  onMapClick: (point: LatLng) => void;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

type GeocodeOutcome =
  | { ok: true; results: NominatimResult[] }
  | { ok: false; reason: 'network' | 'http' };

const NOMINATIM_BBOX = '-58.95,-34.50,-58.50,-34.10';

async function geocodeAutocomplete(query: string): Promise<GeocodeOutcome> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&bounded=1&viewbox=${NOMINATIM_BBOX}&limit=5&accept-language=es`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'TransporteTigre/1.0' },
    });
    if (!res.ok) return { ok: false, reason: 'http' };
    const results = (await res.json()) as NominatimResult[];
    return { ok: true, results };
  } catch {
    return { ok: false, reason: 'network' };
  }
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function resolveService(
  serviceId: string,
  lines: BoatLine[],
): { line: BoatLine; serviceType: string; destination: string } | null {
  for (const line of lines) {
    for (const svc of line.services) {
      if (svc.id === serviceId) {
        const ida = svc.schedules.find((s) => s.direction === 'ida');
        return { line, serviceType: svc.type, destination: ida?.destination ?? '' };
      }
    }
  }
  return null;
}

function dedupeByLine(
  matches: RouteMatch[],
  lines: BoatLine[],
): (RouteMatch & { line: BoatLine; serviceType: string; destination: string })[] {
  const seen = new Map<
    number,
    RouteMatch & { line: BoatLine; serviceType: string; destination: string }
  >();
  for (const m of matches) {
    const resolved = resolveService(m.serviceId, lines);
    if (!resolved) continue;
    const lineId = resolved.line.id;
    const existing = seen.get(lineId);
    if (!existing || m.distance < existing.distance) {
      seen.set(lineId, { ...m, ...resolved });
    }
  }
  return [...seen.values()].sort((a, b) => a.distance - b.distance);
}

function renderResultsList(
  resultsDiv: HTMLDivElement,
  deduped: (RouteMatch & { line: BoatLine; serviceType: string; destination: string })[],
  callbacks: SearchCallbacks,
) {
  if (deduped.length === 0) {
    resultsDiv.innerHTML = `
      <div class="results-card backdrop-blur-md rounded-xl border border-gray-200/60 dark:border-[#1f2d3d]/60 p-5 text-center" style="background: var(--bg-elevated-soft);">
        <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#1c2a3a] flex items-center justify-center mx-auto mb-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-gray-400 dark:text-gray-500">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <p class="text-sm text-gray-700 dark:text-gray-200 font-semibold">No hay lanchas cercanas</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">La ubicación está muy lejos de las rutas fluviales</p>
      </div>
    `;
    resultsDiv.classList.remove('hidden');
    return;
  }

  resultsDiv.innerHTML = `
    <div class="results-card backdrop-blur-md rounded-xl border border-gray-200/60 dark:border-[#1f2d3d]/60 overflow-hidden max-h-64 overflow-y-auto" style="background: var(--bg-elevated-soft);">
      <div class="px-3.5 py-2 border-b border-gray-100 dark:border-[#1f2d3d] bg-gray-50/80 dark:bg-[#1c2a3a]/60">
        <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Lanchas cercanas</p>
      </div>
      <div id="search-results-list"></div>
    </div>
  `;
  resultsDiv.classList.remove('hidden');

  const list = resultsDiv.querySelector('#search-results-list')!;
  for (const m of deduped) {
    const item = document.createElement('button');
    item.className =
      'result-item w-full flex items-center gap-3 px-3.5 py-2.5 text-left border-b border-gray-50 dark:border-[#1f2d3d]/60 last:border-0 cursor-pointer';
    item.innerHTML = `
      <div class="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0" style="background-color: ${m.line.color}; font-family: 'JetBrains Mono', monospace;">
        ${m.line.id}
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">${m.serviceType}</div>
        <div class="text-xs text-gray-400 dark:text-gray-500 truncate">${m.destination}</div>
      </div>
      <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 shrink-0 tabular-nums" style="font-family: 'JetBrains Mono', monospace; font-size: 0.7rem;">${formatDistance(m.distance)}</div>
    `;
    item.addEventListener('click', () => {
      callbacks.onResultSelect(m.serviceId);
      resultsDiv.classList.add('hidden');
    });
    list.appendChild(item);
  }
}

export function createSearchBar(
  container: HTMLElement,
  lines: BoatLine[],
  callbacks: SearchCallbacks,
): { showResultsForPoint: (point: LatLng) => void; destroy: () => void } {
  const wrapper = document.createElement('div');
  wrapper.className = 'absolute top-3 left-3 right-14 z-[1000] flex flex-col gap-2';
  wrapper.innerHTML = `
    <div class="relative">
      <div class="relative flex gap-1.5">
        <div class="relative flex-1">
          <input id="search-input" type="text"
            placeholder="Buscar ubicación en el delta..."
            class="search-input w-full pl-10 pr-9 py-2.5 backdrop-blur-md rounded-xl border border-gray-200/60 dark:border-[#1f2d3d]/60 text-sm text-gray-800 dark:text-gray-100 focus:outline-none font-medium"
            style="box-shadow: var(--search-shadow); background: var(--bg-elevated-soft);"
            aria-label="Buscar ubicación en el delta"
            autocomplete="off" />
          <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <button type="button" id="search-clear" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hidden cursor-pointer p-0.5 rounded-md hover:bg-gray-100 dark:hover:bg-[#1c2a3a] transition-colors" title="Limpiar" aria-label="Limpiar búsqueda">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <button type="button" id="geo-locate" class="shrink-0 w-10 h-10.5 flex items-center justify-center rounded-xl border border-gray-200/60 dark:border-[#1f2d3d]/60 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1c2a3a] transition-colors cursor-pointer" style="background: var(--bg-elevated-soft); box-shadow: var(--search-shadow);" title="Mi ubicación" aria-label="Buscar mi ubicación">
          <svg id="geo-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 2v3"></path>
            <path d="M12 19v3"></path>
            <path d="M2 12h3"></path>
            <path d="M19 12h3"></path>
          </svg>
        </button>
      </div>
      <div id="autocomplete-list" class="hidden absolute left-0 right-0 top-full mt-1.5 backdrop-blur-md rounded-xl border border-gray-200/60 dark:border-[#1f2d3d]/60 overflow-hidden z-10" style="box-shadow: var(--search-shadow); background: var(--bg-elevated-soft);"></div>
    </div>
    <div id="search-results" class="hidden"></div>
  `;
  container.appendChild(wrapper);

  const input = wrapper.querySelector('#search-input') as HTMLInputElement;
  const clearBtn = wrapper.querySelector('#search-clear') as HTMLButtonElement;
  const resultsDiv = wrapper.querySelector('#search-results') as HTMLDivElement;
  const autocompleteList = wrapper.querySelector('#autocomplete-list') as HTMLDivElement;
  const geoBtn = wrapper.querySelector('#geo-locate') as HTMLButtonElement;
  const geoIcon = wrapper.querySelector('#geo-icon') as SVGElement;

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function hideAutocomplete() {
    autocompleteList.classList.add('hidden');
    autocompleteList.innerHTML = '';
  }

  function performSearch(point: LatLng, label: string) {
    hideAutocomplete();
    callbacks.onSearch(point, label);
    const matches = findNearestRoutes(point, 20, 8);
    const deduped = dedupeByLine(matches, lines);
    renderResultsList(resultsDiv, deduped, callbacks);
  }

  // Autocomplete on typing
  input.addEventListener('input', () => {
    const val = input.value.trim();
    clearBtn.classList.toggle('hidden', val === '');

    if (debounceTimer) clearTimeout(debounceTimer);

    if (val.length < 3) {
      hideAutocomplete();
      return;
    }

    debounceTimer = setTimeout(async () => {
      const outcome = await geocodeAutocomplete(val);
      if (input.value.trim() !== val) {
        hideAutocomplete();
        return;
      }
      if (!outcome.ok) {
        autocompleteList.innerHTML = `
          <div class="px-3.5 py-3 text-center">
            <p class="text-xs text-red-600 dark:text-red-400 font-semibold">No se pudo conectar al servicio de búsqueda</p>
            <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Revisá tu conexión e intentá de nuevo</p>
          </div>
        `;
        autocompleteList.classList.remove('hidden');
        return;
      }
      const results = outcome.results;
      if (results.length === 0) {
        hideAutocomplete();
        return;
      }

      autocompleteList.innerHTML = '';
      for (const r of results) {
        const parts = r.display_name.split(',');
        const main = parts[0];
        const sub = parts.slice(1, 3).join(',').trim();
        const item = document.createElement('button');
        item.className =
          'autocomplete-item w-full text-left px-3.5 py-2.5 border-b border-gray-50 dark:border-[#1f2d3d]/60 last:border-0 cursor-pointer';
        item.innerHTML = `
          <div class="text-sm text-gray-800 dark:text-gray-100 truncate font-medium">${main}</div>
          <div class="text-xs text-gray-400 dark:text-gray-500 truncate">${sub}</div>
        `;
        item.addEventListener('click', () => {
          input.value = main;
          const point: LatLng = [Number.parseFloat(r.lat), Number.parseFloat(r.lon)];
          performSearch(point, main);
        });
        autocompleteList.appendChild(item);
      }
      autocompleteList.classList.remove('hidden');
    }, 400);
  });

  // Submit on enter
  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      hideAutocomplete();

      resultsDiv.innerHTML = `
        <div class="results-card backdrop-blur-md rounded-xl border border-gray-200/60 dark:border-[#1f2d3d]/60 p-5 text-center" style="background: var(--bg-elevated-soft);">
          <div class="animate-spin inline-block w-5 h-5 border-2 border-gray-200 dark:border-[#1f2d3d] border-t-gray-600 dark:border-t-gray-300 rounded-full mb-2"></div>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Buscando...</p>
        </div>
      `;
      resultsDiv.classList.remove('hidden');

      const outcome = await geocodeAutocomplete(val);
      if (!outcome.ok) {
        resultsDiv.innerHTML = `
          <div class="results-card backdrop-blur-md rounded-xl border border-red-300 dark:border-red-900/60 p-5 text-center" style="background: var(--bg-elevated-soft);">
            <p class="text-sm text-red-600 dark:text-red-400 font-semibold">Error de conexión</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">No se pudo conectar a OpenStreetMap. Revisá tu conexión.</p>
          </div>
        `;
        return;
      }
      const results = outcome.results;
      if (results.length === 0) {
        resultsDiv.innerHTML = `
          <div class="results-card backdrop-blur-md rounded-xl border border-gray-200/60 dark:border-[#1f2d3d]/60 p-5 text-center" style="background: var(--bg-elevated-soft);">
            <p class="text-sm text-gray-700 dark:text-gray-200 font-semibold">No se encontró la ubicación</p>
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Probá con otro nombre o dirección del delta</p>
          </div>
        `;
        return;
      }

      const first = results[0];
      input.value = first.display_name.split(',')[0];
      performSearch(
        [Number.parseFloat(first.lat), Number.parseFloat(first.lon)],
        first.display_name.split(',')[0],
      );
    }
  });

  // Close autocomplete when clicking outside
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target as Node)) {
      hideAutocomplete();
    }
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.add('hidden');
    resultsDiv.classList.add('hidden');
    resultsDiv.innerHTML = '';
    hideAutocomplete();
    callbacks.onClear();
  });

  function setGeoLoading(loading: boolean) {
    geoBtn.disabled = loading;
    geoIcon.classList.toggle('animate-spin', loading);
  }

  function showGeoError(message: string) {
    resultsDiv.innerHTML = `
      <div class="results-card backdrop-blur-md rounded-xl border border-amber-300 dark:border-amber-900/60 p-4 text-center" style="background: var(--bg-elevated-soft);">
        <p class="text-sm text-amber-700 dark:text-amber-400 font-semibold">No se pudo obtener tu ubicación</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${message}</p>
      </div>
    `;
    resultsDiv.classList.remove('hidden');
  }

  geoBtn.addEventListener('click', () => {
    if (!('geolocation' in navigator)) {
      showGeoError('Tu navegador no soporta geolocalización');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        const point: LatLng = [pos.coords.latitude, pos.coords.longitude];
        input.value = 'Mi ubicación';
        clearBtn.classList.remove('hidden');
        hideAutocomplete();
        callbacks.onSearch(point, 'Mi ubicación');
        const matches = findNearestRoutes(point, 20, 8);
        const deduped = dedupeByLine(matches, lines);
        renderResultsList(resultsDiv, deduped, callbacks);
      },
      (err) => {
        setGeoLoading(false);
        let msg = 'Error desconocido al obtener tu ubicación.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Permiso denegado. Habilitalo en la configuración del navegador.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Tu posición no está disponible en este momento.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Se agotó el tiempo de espera. Intentá de nuevo.';
        }
        showGeoError(msg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  });

  // Public method for map click pin drop
  function showResultsForPoint(point: LatLng) {
    input.value = `${point[0].toFixed(5)}, ${point[1].toFixed(5)}`;
    clearBtn.classList.remove('hidden');
    hideAutocomplete();
    callbacks.onSearch(point, 'Ubicación seleccionada');
    const matches = findNearestRoutes(point, 20, 8);
    const deduped = dedupeByLine(matches, lines);
    renderResultsList(resultsDiv, deduped, callbacks);
  }

  return {
    showResultsForPoint,
    destroy() {
      wrapper.remove();
    },
  };
}
