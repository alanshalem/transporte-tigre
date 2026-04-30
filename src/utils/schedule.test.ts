import { describe, it, expect } from 'vitest';
import { getNextDepartureForService, getCalendarDayKey } from './schedule';
import type { BoatLine, Service } from '../types';

const fakeLine: BoatLine = {
  id: 999,
  name: 'Test',
  company: 'Test Co',
  departurePoint: 'Origin',
  color: '#000',
  services: [],
};

const fakeService: Service = {
  id: 'svc-1',
  type: 'Test service',
  schedules: [
    {
      direction: 'ida',
      origin: 'A',
      destination: 'B',
      times: {
        lunes: ['08:00', '14:00', '18:00'],
        martes: ['08:00'],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: [],
        domingo: [],
        feriados: [],
      },
    },
    {
      direction: 'vuelta',
      origin: 'B',
      destination: 'A',
      times: {
        lunes: ['10:00', '16:00'],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: [],
        domingo: [],
        feriados: [],
      },
    },
  ],
  route: '',
  duration: '02:00',
  routeCoordinates: [],
};

describe('getNextDepartureForService', () => {
  it('finds next departure for a Monday morning', () => {
    // Monday 2026-04-27 09:00
    const now = new Date(2026, 3, 27, 9, 0);
    const next = getNextDepartureForService(fakeService, fakeLine, now);
    expect(next?.time).toBe('10:00');
    expect(next?.direction).toBe('vuelta');
  });

  it('finds next ida when before any vuelta', () => {
    const now = new Date(2026, 3, 27, 7, 0);
    const next = getNextDepartureForService(fakeService, fakeLine, now);
    expect(next?.time).toBe('08:00');
    expect(next?.direction).toBe('ida');
  });

  it('returns null when no more departures today', () => {
    const now = new Date(2026, 3, 27, 23, 0);
    const next = getNextDepartureForService(fakeService, fakeLine, now);
    expect(next).toBeNull();
  });

  it('picks up second-to-last departure correctly', () => {
    const now = new Date(2026, 3, 27, 17, 0);
    const next = getNextDepartureForService(fakeService, fakeLine, now);
    expect(next?.time).toBe('18:00');
    expect(next?.direction).toBe('ida');
  });
});

describe('getCalendarDayKey', () => {
  it('returns lunes on Monday', () => {
    expect(getCalendarDayKey(new Date(2026, 3, 27))).toBe('lunes');
  });

  it('returns sabado on Saturday', () => {
    expect(getCalendarDayKey(new Date(2026, 3, 25))).toBe('sabado');
  });

  it('returns domingo on Sunday', () => {
    expect(getCalendarDayKey(new Date(2026, 3, 26))).toBe('domingo');
  });
});
