import type { BoatLine, Service } from '../types';
import { toggleTheme, getTheme } from '../theme';

interface SidebarCallbacks {
  onLineSelect: (line: BoatLine) => void;
  onServiceSelect: (service: Service, line: BoatLine) => void;
  onThemeChange?: () => void;
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
  const isDark = getTheme() === 'dark';
  const header = document.createElement('div');
  header.className = 'px-5 py-4 border-b border-gray-100 dark:border-[#1f2d3d]';
  header.innerHTML = `
    <div class="flex items-center gap-3">
      <img src="/logo.png" alt="Tigre" width="40" height="40" class="w-10 h-10 object-contain shrink-0" />
      <div class="flex-1 min-w-0">
        <h1 class="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight tracking-tight">Transporte Fluvial</h1>
        <p class="text-xs text-gray-400 dark:text-gray-500 font-medium">Delta del Tigre</p>
      </div>
      <button id="theme-toggle" type="button" class="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer border border-gray-200 dark:border-[#1f2d3d] hover:bg-gray-100 dark:hover:bg-[#1c2a3a] transition-colors text-gray-600 dark:text-gray-300" title="${isDark ? 'Modo claro' : 'Modo oscuro'}" aria-label="${isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}">
        ${isDark
          ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`
          : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
        }
      </button>
    </div>
  `;
  container.appendChild(header);

  const themeBtn = header.querySelector<HTMLButtonElement>('#theme-toggle');
  themeBtn?.addEventListener('click', () => {
    const rect = themeBtn.getBoundingClientRect();
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    callbacks.onThemeChange?.();
  });

  // ── Lines grid ──
  const linesSection = document.createElement('div');
  linesSection.className = 'p-4 pb-3';

  const linesTitle = document.createElement('h2');
  linesTitle.className = 'text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em] mb-3';
  linesTitle.textContent = 'Líneas';
  linesSection.appendChild(linesTitle);

  const linesGrid = document.createElement('div');
  linesGrid.className = 'grid grid-cols-3 gap-2';
  linesGrid.setAttribute('role', 'group');
  linesGrid.setAttribute('aria-label', 'Selección de línea');

  const lineButtons: HTMLButtonElement[] = [];
  for (const line of lines) {
    const btn = document.createElement('button');
    const isSelected = selectedLine?.id === line.id;
    btn.className = `line-btn px-3 py-2.5 rounded-xl text-sm font-bold cursor-pointer border-2 ${
      isSelected
        ? 'line-btn--active text-white'
        : 'bg-white dark:bg-[#1c2a3a] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-[#1f2d3d] hover:border-gray-300 dark:hover:border-[#2a3a4d] hover:shadow-sm'
    }`;
    if (isSelected) {
      btn.style.backgroundColor = line.color;
      btn.style.borderColor = line.color;
    }
    btn.textContent = `${line.id}`;
    btn.setAttribute('aria-label', `Línea ${line.id} — ${line.company}`);
    btn.setAttribute('aria-pressed', String(isSelected));
    btn.addEventListener('click', () => callbacks.onLineSelect(line));
    lineButtons.push(btn);
    linesGrid.appendChild(btn);
  }

  // Keyboard nav within lines grid (arrow keys move focus)
  for (let i = 0; i < lineButtons.length; i++) {
    lineButtons[i].addEventListener('keydown', (e) => {
      const k = e.key;
      if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(k)) return;
      e.preventDefault();
      let next = i;
      if (k === 'ArrowRight') next = (i + 1) % lineButtons.length;
      else if (k === 'ArrowLeft') next = (i - 1 + lineButtons.length) % lineButtons.length;
      else if (k === 'ArrowDown') next = Math.min(i + 3, lineButtons.length - 1);
      else if (k === 'ArrowUp') next = Math.max(i - 3, 0);
      lineButtons[next].focus();
    });
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
      <span class="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">${selectedLine.company}</span>
    `;
    lineInfo.appendChild(companyBadge);

    const departure = document.createElement('p');
    departure.className = 'text-xs text-gray-400 dark:text-gray-500 ml-4 pl-0.5 flex items-center gap-1';
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
        <p class="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
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
    servicesTitle.className = 'text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em] mb-2';
    servicesTitle.textContent = `Servicios (${selectedLine.services.length})`;
    servicesSection.appendChild(servicesTitle);

    const servicesList = document.createElement('div');
    servicesList.className = 'flex flex-col gap-1';
    servicesList.setAttribute('role', 'listbox');
    servicesList.setAttribute('aria-label', `Servicios de ${selectedLine.name}`);

    const serviceBtns: HTMLButtonElement[] = [];
    for (const service of selectedLine.services) {
      const isServiceSelected = selectedService?.id === service.id;
      const serviceBtn = document.createElement('button');
      serviceBtn.className = `service-item w-full text-left px-3 py-2.5 rounded-xl cursor-pointer border ${
        isServiceSelected
          ? 'service-item--active border-transparent text-white'
          : 'border-transparent bg-gray-50/80 dark:bg-[#1c2a3a]/60 hover:bg-gray-100/80 dark:hover:bg-[#1c2a3a]'
      }`;
      if (isServiceSelected) {
        serviceBtn.style.backgroundColor = selectedLine.color;
      }

      const ida = service.schedules.find(s => s.direction === 'ida');
      const destination = ida ? ida.destination : '';

      serviceBtn.setAttribute('role', 'option');
      serviceBtn.setAttribute('aria-selected', String(isServiceSelected));

      serviceBtn.innerHTML = `
        <div class="font-semibold text-sm ${isServiceSelected ? '' : 'text-gray-800 dark:text-gray-100'}">${service.type}</div>
        <div class="text-xs mt-0.5 ${isServiceSelected ? 'text-white/75' : 'text-gray-400 dark:text-gray-500'} truncate flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="shrink-0" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
          ${destination}
        </div>
      `;
      serviceBtn.addEventListener('click', () => callbacks.onServiceSelect(service, selectedLine));
      serviceBtns.push(serviceBtn);
      servicesList.appendChild(serviceBtn);
    }

    // Keyboard nav inside services list
    for (let i = 0; i < serviceBtns.length; i++) {
      serviceBtns[i].addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const next = e.key === 'ArrowDown'
            ? (i + 1) % serviceBtns.length
            : (i - 1 + serviceBtns.length) % serviceBtns.length;
          serviceBtns[next].focus();
        }
      });
    }

    servicesSection.appendChild(servicesList);
    container.appendChild(servicesSection);

    // PDF link to original line PDF
    const pdfLink = document.createElement('a');
    pdfLink.href = `/lineas/LINEA_${selectedLine.id}.pdf`;
    pdfLink.target = '_blank';
    pdfLink.rel = 'noopener noreferrer';
    pdfLink.className = 'mx-4 mb-5 px-3 py-2.5 rounded-xl flex items-center gap-2 border border-gray-200 dark:border-[#1f2d3d] hover:bg-gray-50 dark:hover:bg-[#1c2a3a] transition-colors text-xs text-gray-600 dark:text-gray-300';
    pdfLink.setAttribute('aria-label', `Ver PDF oficial de la línea ${selectedLine.id}`);
    pdfLink.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
      </svg>
      <span class="font-semibold">PDF oficial de la línea ${selectedLine.id}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-auto opacity-60" aria-hidden="true">
        <path d="M7 7h10v10"></path>
        <path d="M7 17 17 7"></path>
      </svg>
    `;
    container.appendChild(pdfLink);
  }
}
