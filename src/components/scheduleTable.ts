import type { Service, BoatLine } from '../types';
import { DAYS, DAY_LABELS } from '../types';
import { getCalendarDayKey, isNextDeparture } from '../utils/schedule';

export function renderScheduleTable(
  container: HTMLElement,
  service: Service,
  line: BoatLine,
): void {
  container.innerHTML = '';

  const now = new Date();
  const currentDay = getCalendarDayKey(now);

  // Service header
  const header = document.createElement('div');
  header.className = 'flex items-center gap-3 mb-5';
  header.innerHTML = `
    <div class="w-3.5 h-3.5 rounded-full shrink-0 ring-4 ring-opacity-15" style="background-color: ${line.color}; --tw-ring-color: ${line.color}40;"></div>
    <div>
      <h3 class="font-bold text-gray-900 dark:text-gray-100 text-sm tracking-tight">${line.name} — ${service.type}</h3>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-medium">Duración aprox: ${service.duration}</p>
    </div>
  `;
  container.appendChild(header);

  // Schedule tables
  for (const schedule of service.schedules) {
    const section = document.createElement('div');
    section.className = 'mb-5';

    const isIda = schedule.direction === 'ida';

    const dirLabel = document.createElement('div');
    dirLabel.className = 'flex items-center gap-2 mb-2';
    dirLabel.innerHTML = `
      <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
        isIda ? 'dir-badge-ida' : 'dir-badge-vuelta'
      }">${isIda ? 'IDA' : 'VUELTA'}</span>
      <span class="text-xs text-gray-400 dark:text-gray-500 font-medium truncate">${schedule.origin} → ${schedule.destination}</span>
    `;
    section.appendChild(dirLabel);

    // Table
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'overflow-x-auto rounded-xl border border-gray-200/80 dark:border-[#1f2d3d]/80';

    const table = document.createElement('table');
    table.className = 'schedule-table w-full';

    // Header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    for (const day of DAYS) {
      const th = document.createElement('th');
      const isCurrent = day === currentDay;
      th.className = `px-2 py-2.5 text-center border-b border-gray-200/80 dark:border-[#1f2d3d]/80 ${
        isCurrent ? 'text-white' : 'text-gray-500 dark:text-gray-400 bg-gray-50/80 dark:bg-[#1c2a3a]/60'
      }`;
      if (isCurrent) {
        th.style.backgroundColor = line.color;
      }
      th.textContent = DAY_LABELS[day];
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const maxRows = Math.max(...DAYS.map(d => schedule.times[d]?.length || 0), 1);

    const tbody = document.createElement('tbody');
    for (let i = 0; i < maxRows; i++) {
      const row = document.createElement('tr');
      row.className = i % 2 === 0 ? 'bg-white dark:bg-[#13202e]' : 'bg-gray-50/40 dark:bg-[#1c2a3a]/40';

      for (const day of DAYS) {
        const td = document.createElement('td');
        const isCurrent = day === currentDay;
        const time = schedule.times[day]?.[i] || '';
        const isNext = !!time && isNextDeparture(service, line, schedule.direction, time, day, now);
        td.className = `px-2 py-1.5 text-center border-b border-gray-100/80 dark:border-[#1f2d3d]/60 whitespace-nowrap ${
          isCurrent ? 'current-day font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'
        }`;
        td.textContent = time || '—';
        if (!time) td.classList.add('text-gray-300', 'dark:text-gray-600');
        if (isNext) {
          td.classList.add('next-departure');
          td.style.setProperty('--next-color', line.color);
          td.setAttribute('aria-label', `Próxima salida a las ${time}`);
          td.title = 'Próxima salida';
        }
        row.appendChild(td);
      }
      tbody.appendChild(row);
    }

    if (maxRows === 0) {
      const row = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = DAYS.length;
      td.className = 'px-4 py-4 text-center text-gray-400 dark:text-gray-500 text-sm';
      td.textContent = 'Sin horarios disponibles';
      row.appendChild(td);
      tbody.appendChild(row);
    }

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    section.appendChild(tableWrapper);
    container.appendChild(section);
  }

  // Route description
  const routeInfo = document.createElement('div');
  routeInfo.className = 'route-info-box mt-4 p-3.5 rounded-xl';
  routeInfo.innerHTML = `
    <p class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em] mb-1.5">Recorrido</p>
    <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">${service.route}</p>
    ${service.notes ? `<p class="text-xs text-amber-700 dark:text-amber-400 mt-2 leading-relaxed font-medium">ℹ️ ${service.notes}</p>` : ''}
  `;
  container.appendChild(routeInfo);
}
