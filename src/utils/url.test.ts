import { describe, it, expect, beforeEach } from 'vitest';
import { readUrlState, writeUrlState } from './url';

describe('url state', () => {
  beforeEach(() => {
    globalThis.history.replaceState(null, '', '/');
  });

  it('reads empty state when no params', () => {
    expect(readUrlState()).toEqual({ lineId: undefined, serviceId: undefined });
  });

  it('reads lineId from url', () => {
    globalThis.history.replaceState(null, '', '/?linea=450');
    expect(readUrlState()).toEqual({ lineId: 450, serviceId: undefined });
  });

  it('reads lineId + serviceId', () => {
    globalThis.history.replaceState(null, '', '/?linea=450&svc=abc-123');
    expect(readUrlState()).toEqual({ lineId: 450, serviceId: 'abc-123' });
  });

  it('ignores invalid lineId', () => {
    globalThis.history.replaceState(null, '', '/?linea=foo');
    expect(readUrlState().lineId).toBeUndefined();
  });

  it('writes lineId to url', () => {
    writeUrlState({ lineId: 451 });
    expect(globalThis.location.search).toBe('?linea=451');
  });

  it('writes both params', () => {
    writeUrlState({ lineId: 452, serviceId: 'svc-x' });
    expect(globalThis.location.search).toBe('?linea=452&svc=svc-x');
  });

  it('clears params when undefined', () => {
    globalThis.history.replaceState(null, '', '/?linea=450&svc=abc');
    writeUrlState({});
    expect(globalThis.location.search).toBe('');
  });
});
