import type { Service } from '../types';

export const linea451Services: Service[] = [
  {
    id: '451-troncal',
    type: 'TRONCAL',
    schedules: [
      {
        direction: 'ida',
        origin: 'Est. Fluvial Tigre',
        destination: 'Paraná Mini',
        times: {
          lunes: ['7:00', '14:15'],
          martes: ['7:00', '14:15'],
          miercoles: ['7:00'],
          jueves: ['7:00', '14:15'],
          viernes: ['7:00', '19:00'],
          sabado: ['7:00', '17:00'],
          domingo: ['7:00', '17:00', '19:30'],
          feriados: [],
        },
      },
      {
        direction: 'vuelta',
        origin: 'Paraná Mini',
        destination: 'Est. Fluvial Tigre',
        times: {
          lunes: ['4:00', '14:30'],
          martes: ['4:00'],
          miercoles: ['4:00', '14:30'],
          jueves: ['4:00', '14:30'],
          viernes: ['4:00', '16:00'],
          sabado: ['4:00', '9:30', '18:00'],
          domingo: ['9:30', '14:30', '18:00'],
          feriados: [],
        },
      },
    ],
    route:
      'Río Tigre - Río Luján - Río Sarmiento - Río Capitán - Cruce Río Paraná de las Palmas - Arroyo Paycarabí - Arroyo Estudiante - Arroyo Felicaria hasta el Río de la Plata - Casa Borges - Arroyo Felicaria - Paraná Mini',
    duration: '02:30 / 03:00 HS',
    notes:
      'Feriados: Si el feriado cae día lunes, se repiten los horarios del día domingo. Si el feriado cae día viernes, se repiten los horarios del día sábado.',
    routeCoordinates: [],
  },
  {
    id: '451-ramal1',
    type: 'RAMAL 1',
    schedules: [
      {
        direction: 'ida',
        origin: 'Est. Fluvial Tigre',
        destination: 'Paraná Mini',
        times: {
          lunes: [],
          martes: ['14:15'],
          miercoles: [],
          jueves: ['14:15'],
          viernes: [],
          sabado: ['10:30', '14:15'],
          domingo: ['10:30'],
          feriados: [],
        },
      },
      {
        direction: 'vuelta',
        origin: 'Paraná Mini',
        destination: 'Est. Fluvial Tigre',
        times: {
          lunes: [],
          martes: ['4:00'],
          miercoles: [],
          jueves: ['4:00'],
          viernes: [],
          sabado: ['16:30'],
          domingo: ['16:30'],
          feriados: [],
        },
      },
    ],
    route:
      'Río Tigre - Río Luján, Río Sarmiento - Río Capitán - Cruce Río Paraná de las Palmas - Arroyo Paycarabí - Arroyo Estudiante - Arroyo Fredes - Desvío muelle Las Cañas - Arroyo Fredes',
    duration: '02:30 HS',
    notes:
      'Va por Felicaria hasta Hostería Los Pecanes. Feriados: Si el feriado cae día lunes, se repiten los horarios del día domingo. Si el feriado cae día viernes, se repiten los horarios del día sábado.',
    routeCoordinates: [],
  },
];
