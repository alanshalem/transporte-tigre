export interface UrlState {
  lineId?: number;
  serviceId?: string;
}

export function readUrlState(): UrlState {
  const params = new URLSearchParams(globalThis.location.search);
  const lineRaw = params.get('linea');
  const lineId = lineRaw ? Number.parseInt(lineRaw, 10) : undefined;
  const serviceId = params.get('svc') ?? undefined;
  return {
    lineId: Number.isFinite(lineId) ? lineId : undefined,
    serviceId,
  };
}

export function writeUrlState(state: UrlState): void {
  const params = new URLSearchParams(globalThis.location.search);
  if (state.lineId === undefined) {
    params.delete('linea');
  } else {
    params.set('linea', String(state.lineId));
  }
  if (state.serviceId) {
    params.set('svc', state.serviceId);
  } else {
    params.delete('svc');
  }
  const qs = params.toString();
  const url = qs ? `${globalThis.location.pathname}?${qs}` : globalThis.location.pathname;
  globalThis.history.replaceState(null, '', url);
}
