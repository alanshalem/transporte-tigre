export type Theme = 'light' | 'dark';

interface Origin {
  x: number;
  y: number;
}

const STORAGE_KEY = 'tigre-theme';
const listeners = new Set<(t: Theme) => void>();

export function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage may be unavailable (private mode, etc.)
  }
  listeners.forEach((fn) => fn(theme));
}

export function setTheme(theme: Theme, origin?: Origin): void {
  const reduceMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startViewTransition = (
    document as Document & {
      startViewTransition?: (cb: () => void) => unknown;
    }
  ).startViewTransition;

  if (origin) {
    document.documentElement.style.setProperty('--theme-x', `${origin.x}px`);
    document.documentElement.style.setProperty('--theme-y', `${origin.y}px`);
  }

  if (typeof startViewTransition === 'function' && !reduceMotion) {
    startViewTransition.call(document, () => applyTheme(theme));
  } else {
    applyTheme(theme);
  }
}

export function toggleTheme(origin?: Origin): void {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark', origin);
}

export function subscribeTheme(fn: (t: Theme) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
