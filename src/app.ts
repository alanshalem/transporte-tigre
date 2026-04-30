import type { BoatLine, Service } from './types';
import { boatLines } from './data/lines';
import { renderSidebar } from './components/sidebar';
import { renderScheduleTable } from './components/scheduleTable';
import { MapManager, getRouteData } from './map/mapManager';
import { createSearchBar } from './components/searchBar';
import { getActiveBoats } from './map/liveBoats';

interface AppState {
  selectedLine: BoatLine | null;
  selectedService: Service | null;
  sidebarOpen: boolean;
  scheduleCollapsed: boolean;
  liveBoatsEnabled: boolean;
}

export function createApp(root: HTMLElement): void {
  const state: AppState = {
    selectedLine: null,
    selectedService: null,
    sidebarOpen: false,
    scheduleCollapsed: false,
    liveBoatsEnabled: true,
  };

  const mapManager = new MapManager();

  root.innerHTML = `
    <div class="flex h-full relative">
      <!-- Mobile toggle -->
      <button id="sidebar-toggle" class="md:hidden fixed top-4 left-4 z-50 bg-white/95 backdrop-blur-sm shadow-lg rounded-xl p-2.5 border border-gray-200/60 hover:bg-white transition-all duration-200 active:scale-95" aria-label="Toggle sidebar">
        <svg id="toggle-icon-open" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg id="toggle-icon-close" class="hidden text-gray-700" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Mobile overlay -->
      <div id="sidebar-overlay" class="hidden sidebar-overlay fixed inset-0 z-30 md:hidden"></div>

      <!-- Sidebar -->
      <aside id="sidebar" class="bg-white border-r border-gray-200/80 shrink-0 overflow-y-auto sidebar-scroll
        fixed md:relative inset-y-0 left-0 z-40 sidebar-slide -translate-x-full md:translate-x-0"
        style="width: var(--sidebar-width); max-width: 340px;">
      </aside>

      <!-- Main content -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Map -->
        <div id="map-container" class="flex-1 relative">
          <div id="map" class="absolute inset-0"></div>
          <!-- Live boats toggle -->
          <button id="live-boats-toggle" class="boat-toggle boat-toggle--active absolute bottom-4 right-4 z-[1000] bg-white border border-gray-200/60 rounded-xl px-3 py-2 flex items-center gap-2 cursor-pointer" title="Lanchas en tiempo real">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 20a2 2 0 0 0 2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 0 2 2"></path>
              <path d="M7 20h10"></path>
              <path d="M12 2v4"></path>
              <path d="M2 16h20"></path>
            </svg>
            <span class="text-xs font-semibold" id="live-boats-label">EN VIVO</span>
            <span class="text-[10px] font-bold bg-white/20 rounded px-1.5 py-0.5" id="live-boats-count">0</span>
          </button>
          <div id="empty-state" class="empty-state absolute inset-0 flex items-center justify-center pointer-events-none z-[500]">
            <div class="bg-white/92 backdrop-blur-md rounded-2xl p-8 text-center max-w-xs mx-4" style="box-shadow: var(--search-shadow);">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0B3954" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12C2 7 6.5 3 12 3s10 4 10 9-4.5 9-10 9S2 17 2 12z"></path>
                  <path d="M12 3v18"></path>
                  <path d="M2 12h20"></path>
                  <path d="M4.5 7h15"></path>
                  <path d="M4.5 17h15"></path>
                </svg>
              </div>
              <h3 class="text-base font-bold text-gray-900 mb-1.5">Explorá el Delta</h3>
              <p class="text-sm text-gray-500 leading-relaxed">Seleccioná una línea para ver recorridos, o tocá el mapa para encontrar lanchas cercanas</p>
            </div>
          </div>
        </div>

        <!-- Schedule panel -->
        <div id="schedule-panel" class="hidden schedule-panel border-t border-gray-200/80 bg-white overflow-hidden">
          <button id="schedule-toggle" class="schedule-toggle-btn w-full flex items-center justify-between px-5 py-2.5 bg-white cursor-pointer border-b border-gray-100">
            <div class="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Horarios y recorrido</span>
            </div>
            <svg id="schedule-chevron" class="schedule-chevron text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div id="schedule-body" class="overflow-y-auto" style="max-height: 42vh;">
            <div id="schedule-content" class="p-5 max-w-4xl"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const sidebarEl = document.getElementById('sidebar')!;
  const schedulePanel = document.getElementById('schedule-panel')!;
  const scheduleContent = document.getElementById('schedule-content')!;
  const scheduleBody = document.getElementById('schedule-body')!;
  const scheduleToggle = document.getElementById('schedule-toggle')!;
  const scheduleChevron = document.getElementById('schedule-chevron')!;
  const emptyState = document.getElementById('empty-state')!;
  const sidebarToggle = document.getElementById('sidebar-toggle')!;
  const sidebarOverlay = document.getElementById('sidebar-overlay')!;
  const toggleIconOpen = document.getElementById('toggle-icon-open')!;
  const toggleIconClose = document.getElementById('toggle-icon-close')!;

  // Schedule collapse toggle
  scheduleToggle.addEventListener('click', () => {
    state.scheduleCollapsed = !state.scheduleCollapsed;
    scheduleBody.classList.toggle('hidden', state.scheduleCollapsed);
    scheduleChevron.classList.toggle('schedule-chevron--collapsed', state.scheduleCollapsed);
    setTimeout(() => mapManager.invalidateSize(), 100);
  });

  // Init map
  mapManager.init('map');

  // Search bar
  const mapContainer = document.getElementById('map-container')!;
  const searchBar = createSearchBar(mapContainer, boatLines, {
    onSearch(point, label) {
      mapManager.showSearchMarker(point, label);
      schedulePanel.classList.add('hidden');
    },
    onResultSelect(serviceId) {
      for (const line of boatLines) {
        for (const svc of line.services) {
          if (svc.id === serviceId) {
            state.selectedService = svc;
            state.selectedLine = line;
            mapManager.showRoute(svc.id, line.color);
            if (state.sidebarOpen) toggleSidebar();
            update();
            return;
          }
        }
      }
    },
    onClear() {
      mapManager.clearSearch();
    },
    onMapClick() { /* handled via setMapClickHandler */ },
  });

  // Map click → drop pin and find nearby routes
  mapManager.setMapClickHandler((latlng) => {
    searchBar.showResultsForPoint(latlng);
    schedulePanel.classList.add('hidden');
    emptyState.classList.add('hidden');
  });

  function toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
    if (state.sidebarOpen) {
      sidebarEl.classList.remove('-translate-x-full');
      sidebarEl.classList.add('translate-x-0');
      sidebarOverlay.classList.remove('hidden');
      toggleIconOpen.classList.add('hidden');
      toggleIconClose.classList.remove('hidden');
    } else {
      sidebarEl.classList.add('-translate-x-full');
      sidebarEl.classList.remove('translate-x-0');
      sidebarOverlay.classList.add('hidden');
      toggleIconOpen.classList.remove('hidden');
      toggleIconClose.classList.add('hidden');
    }
  }

  sidebarToggle.addEventListener('click', toggleSidebar);
  sidebarOverlay.addEventListener('click', toggleSidebar);

  function update() {
    renderSidebar(sidebarEl, boatLines, state.selectedLine, state.selectedService, {
      onLineSelect(line) {
        if (state.selectedLine?.id === line.id) {
          state.selectedLine = null;
          state.selectedService = null;
        } else {
          state.selectedLine = line;
          state.selectedService = null;
        }
        mapManager.resetView();
        update();
      },
      onServiceSelect(service, line) {
        state.selectedService = service;
        state.selectedLine = line;
        state.scheduleCollapsed = false;
        mapManager.showRoute(service.id, line.color);
        if (state.sidebarOpen) {
          toggleSidebar();
        }
        update();
      },
    });

    // Schedule panel
    if (state.selectedService && state.selectedLine) {
      schedulePanel.classList.remove('hidden');
      emptyState.classList.add('hidden');
      scheduleBody.classList.toggle('hidden', state.scheduleCollapsed);
      scheduleChevron.classList.toggle('schedule-chevron--collapsed', state.scheduleCollapsed);
      renderScheduleTable(scheduleContent, state.selectedService, state.selectedLine);
    } else {
      schedulePanel.classList.add('hidden');
      // Hide empty state once any line is selected
      if (state.selectedLine) {
        emptyState.classList.add('hidden');
      } else {
        emptyState.classList.remove('hidden');
      }
    }

    setTimeout(() => mapManager.invalidateSize(), 100);
  }

  // ── Live boats ──
  const liveToggle = document.getElementById('live-boats-toggle')!;
  const liveCount = document.getElementById('live-boats-count')!;

  function updateLiveBoats() {
    if (!state.liveBoatsEnabled) {
      mapManager.clearBoats();
      liveCount.textContent = '0';
      return;
    }
    const boats = getActiveBoats(boatLines, getRouteData());
    mapManager.showBoats(boats);
    liveCount.textContent = `${boats.length}`;
  }

  liveToggle.addEventListener('click', () => {
    state.liveBoatsEnabled = !state.liveBoatsEnabled;
    liveToggle.classList.toggle('boat-toggle--active', state.liveBoatsEnabled);
    updateLiveBoats();
  });

  // Update boats every 15 seconds
  updateLiveBoats();
  setInterval(updateLiveBoats, 15000);

  update();
}
