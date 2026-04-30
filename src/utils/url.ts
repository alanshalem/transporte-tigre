export interface UrlState {
  lineId?: number;
  serviceId?: string;
}

export function readUrlState(): UrlState {
  const params = new URLSearchParams(window.location.search);
  const lineRaw = params.get('linea');
  const lineId = lineRaw ? Number.parseInt(lineRaw, 10) : undefined;
  const serviceId = params.get('svc') ?? undefined;
  return {
    lineId: Number.isFinite(lineId) ? lineId : undefined,
    serviceId,
  };
}

export function writeUrlState(state: UrlState): void {
  const params = new URLSearchParams(window.location.search);
  if (state.lineId !== undefined) {
    params.set('linea', String(state.lineId));
  } else {
    params.delete('linea');
  }
  if (state.serviceId) {
    params.set('svc', state.serviceId);
  } else {
    params.delete('svc');
  }
  const qs = params.toString();
  const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}
