// Argentine holidays via public API (api.argentinadatos.com), cached in localStorage.
// Falls back to a small hardcoded list of fixed holidays if the API is unreachable.

const CACHE_KEY = 'tigre-holidays';
const CACHE_TTL_DAYS = 30;

interface CachedHolidays {
  year: number;
  fetchedAt: number;
  dates: string[];
}

interface ApiHoliday {
  fecha: string;
  tipo: string;
  nombre: string;
}

const FIXED_FALLBACK = [
  '01-01',
  '03-24',
  '04-02',
  '05-01',
  '05-25',
  '06-20',
  '07-09',
  '12-08',
  '12-25',
];

function fmt(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function readCache(year: number): string[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed: CachedHolidays = JSON.parse(raw);
    if (parsed.year !== year) return null;
    const ageDays = (Date.now() - parsed.fetchedAt) / (1000 * 60 * 60 * 24);
    if (ageDays > CACHE_TTL_DAYS) return null;
    return parsed.dates;
  } catch {
    return null;
  }
}

function writeCache(year: number, dates: string[]): void {
  try {
    const payload: CachedHolidays = { year, fetchedAt: Date.now(), dates };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

let inflight: Promise<Set<string>> | null = null;
let cached: Set<string> | null = null;

export async function loadHolidays(year = new Date().getFullYear()): Promise<Set<string>> {
  if (cached) return cached;
  if (inflight) return inflight;

  inflight = (async () => {
    const fromCache = readCache(year);
    if (fromCache) {
      cached = new Set(fromCache);
      return cached;
    }

    try {
      const res = await fetch(`https://api.argentinadatos.com/v1/feriados/${year}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ApiHoliday[] = await res.json();
      const dates = data.map((h) => h.fecha);
      writeCache(year, dates);
      cached = new Set(dates);
      return cached;
    } catch {
      const fallback = FIXED_FALLBACK.map((md) => `${year}-${md}`);
      cached = new Set(fallback);
      return cached;
    }
  })();

  return inflight;
}

export function isHolidaySync(date: Date): boolean {
  if (!cached) return false;
  return cached.has(fmt(date));
}

export function isHoliday(date: Date): boolean {
  return isHolidaySync(date);
}
