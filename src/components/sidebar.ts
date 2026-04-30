import type { BoatLine, Service } from '../types';

interface SidebarCallbacks {
  onLineSelect: (line: BoatLine) => void;
  onServiceSelect: (service: Service, line: BoatLine) => void;
}

export function renderSidebar(
  container: HTMLElement,
  lines: BoatLine[],
  selectedLine: BoatLine | null,
  selectedService: Service | null,
  callbacks: SidebarCallbacks,
): void {
  container.innerHTML = '';

  // ── Header ──
  const header = document.createElement('div');
  header.className = 'px-5 py-4 border-b border-gray-100';
  header.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #0B3954, #1a5f8a);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 20a2 2 0 0 0 2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 0 2 2"></path>
          <path d="M7 20h10"></path>
          <path d="M12 2v4"></path>
          <path d="M2 16h20"></path>
        </svg>
      </div>
      <div>
        <h1 class="text-base font-bold text-gray-900 leading-tight tracking-tight">Transporte Fluvial</h1>
        <p class="text-xs text-gray-400 font-medium">Delta del Tigre</p>
      </div>
    </div>
  `;
  container.appendChild(header);

  // ── Lines grid ──
  const linesSection = document.createElement('div');
  linesSection.className = 'p-4 pb-3';

  const linesTitle = document.createElement('h2');
  linesTitle.className = 'text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-3';
  linesTitle.textContent = 'Líneas';
  linesSection.appendChild(linesTitle);

  const linesGrid = document.createElement('div');
  linesGrid.className = 'grid grid-cols-3 gap-2';

  for (const line of lines) {
    const btn = document.createElement('button');
    const isSelected = selectedLine?.id === line.id;
    btn.className = `line-btn px-3 py-2.5 rounded-xl text-sm font-bold cursor-pointer border-2 ${
      isSelected
        ? 'line-btn--active text-white'
        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`;
    if (isSelected) {
      btn.style.backgroundColor = line.color;
      btn.style.borderColor = line.color;
    }
    btn.textContent = `${line.id}`;
    btn.addEventListener('click', () => callbacks.onLineSelect(line));
    linesGrid.appendChild(btn);
  }

  linesSection.appendChild(linesGrid);
  container.appendChild(linesSection);

  // ── Selected line details ──
  if (selectedLine) {
    const lineInfo = document.createElement('div');
    lineInfo.className = 'px-4 pb-2';

    const companyBadge = document.createElement('div');
    companyBadge.className = 'flex items-center gap-2 mb-0.5';
    companyBadge.innerHTML = `
      <div class="w-2 h-2 rounded-full shrink-0" style="background-color: ${selectedLine.color}"></div>
      <span class="text-xs text-gray-500 truncate font-medium">${selectedLine.company}</span>
    `;
    lineInfo.appendChild(companyBadge);

    const departure = document.createElement('p');
    departure.className = 'text-xs text-gray-400 ml-4 pl-0.5 flex items-center gap-1';
    departure.innerHTML = `
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="shrink-0">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      ${selectedLine.departurePoint}
    `;
    lineInfo.appendChild(departure);

    container.appendChild(lineInfo);

    // Holiday note
    if (selectedLine.holidayNote) {
      const note = document.createElement('div');
      note.className = 'holiday-note mx-4 mb-3 p-3 rounded-xl';
      note.innerHTML = `
        <p class="text-xs text-amber-800 leading-relaxed font-medium">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-block mr-1 -mt-0.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          ${selectedLine.holidayNote}
        </p>
      `;
      container.appendChild(note);
    }

    // ── Services list ──
    const servicesSection = document.createElement('div');
    servicesSection.className = 'px-4 pb-5';

    const servicesTitle = document.createElement('h2');
    servicesTitle.className = 'text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-2';
    servicesTitle.textContent = `Servicios (${selectedLine.services.length})`;
    servicesSection.appendChild(servicesTitle);

    const servicesList = document.createElement('div');
    servicesList.className = 'flex flex-col gap-1';

    for (const service of selectedLine.services) {
      const isServiceSelected = selectedService?.id === service.id;
      const serviceBtn = document.createElement('button');
      serviceBtn.className = `service-item w-full text-left px-3 py-2.5 rounded-xl cursor-pointer border ${
        isServiceSelected
          ? 'service-item--active border-transparent text-white'
          : 'border-transparent bg-gray-50/80 hover:bg-gray-100/80'
      }`;
      if (isServiceSelected) {
        serviceBtn.style.backgroundColor = selectedLine.color;
      }

      const ida = service.schedules.find(s => s.direction === 'ida');
      const destination = ida ? ida.destination : '';

      serviceBtn.innerHTML = `
        <div class="font-semibold text-sm ${isServiceSelected ? '' : 'text-gray-800'}">${service.type}</div>
        <div class="text-xs mt-0.5 ${isServiceSelected ? 'text-white/75' : 'text-gray-400'} truncate flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="shrink-0">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
          ${destination}
        </div>
      `;
      serviceBtn.addEventListener('click', () => callbacks.onServiceSelect(service, selectedLine));
      servicesList.appendChild(serviceBtn);
    }

    servicesSection.appendChild(servicesList);
    container.appendChild(servicesSection);
  }
}
