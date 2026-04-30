import type { DayOfWeek, Service, BoatLine } from '../types';
import { isHolidaySync } from './holidays';

const WEEKDAY_KEYS: DayOfWeek[] = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
];

export function getEffectiveDayKey(date: Date, line?: BoatLine): DayOfWeek {
  if (isHolidaySync(date)) {
    if (line?.holidayNote) {
      const dow = date.getDay();
      if (dow === 1) return 'domingo';
      if (dow === 5) return 'sabado';
    }
    return 'feriados';
  }
  return WEEKDAY_KEYS[date.getDay()];
}

export function getCalendarDayKey(date: Date): DayOfWeek {
  if (isHolidaySync(date)) return 'feriados';
  return WEEKDAY_KEYS[date.getDay()];
}

interface NextDeparture {
  serviceId: string;
  direction: 'ida' | 'vuelta';
  time: string;
  minutesUntil: number;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map((n) => Number.parseInt(n, 10));
  return h * 60 + m;
}

export function getNextDepartureForService(
  service: Service,
  line: BoatLine,
  now: Date = new Date(),
): NextDeparture | null {
  const dayKey = getEffectiveDayKey(now, line);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  let best: NextDeparture | null = null;
  for (const sched of service.schedules) {
    const times = sched.times[dayKey] ?? [];
    for (const t of times) {
      if (!t) continue;
      const mins = timeToMinutes(t);
      const diff = mins - nowMinutes;
      if (diff < 0) continue;
      if (!best || diff < best.minutesUntil) {
        best = {
          serviceId: service.id,
          direction: sched.direction,
          time: t,
          minutesUntil: diff,
        };
      }
    }
  }
  return best;
}

export function isNextDeparture(
  service: Service,
  line: BoatLine,
  direction: 'ida' | 'vuelta',
  time: string,
  dayKey: DayOfWeek,
  now: Date = new Date(),
): boolean {
  const todayKey = getEffectiveDayKey(now, line);
  if (dayKey !== todayKey) return false;
  const next = getNextDepartureForService(service, line, now);
  if (!next) return false;
  return next.time === time && next.direction === direction;
}
