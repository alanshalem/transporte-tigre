import type { Service } from '../types';

export const linea455Services: Service[] = [
  {
    id: '455-troncal',
    type: 'TRONCAL',
    schedules: [
      {
        direction: 'ida',
        origin: 'Muelle Isleño Escobar',
        destination: 'C. De la Serna - El Tropezón',
        times: {
          lunes: ['8:00', '16:00'],
          martes: ['8:00', '16:00'],
          miercoles: ['8:00', '16:00'],
          jueves: ['8:00', '16:00'],
          viernes: ['8:00', '16:00'],
          sabado: ['7:30', '8:30', '10:30', '14:30', '15:30', '16:30', '17:30'],
          domingo: ['7:30', '8:30', '10:30', '14:30', '15:30', '16:30', '17:30'],
          feriados: ['7:30', '8:30', '10:30', '14:30', '15:30', '16:30', '17:30'],
        },
      },
      {
        direction: 'vuelta',
        origin: 'C. De la Serna - El Tropezón',
        destination: 'Muelle Isleño Escobar',
        times: {
          lunes: ['8:40', '16:30'],
          martes: ['8:40', '16:30'],
          miercoles: ['8:40', '16:30'],
          jueves: ['8:40', '16:30'],
          viernes: ['8:40', '16:30'],
          sabado: ['8:00', '9:00', '11:00', '15:00', '16:00', '17:00', '18:00'],
          domingo: ['8:00', '9:00', '11:00', '15:00', '16:00', '17:00', '18:00'],
          feriados: ['8:00', '9:00', '11:00', '15:00', '16:00', '17:00', '18:00'],
        },
      },
    ],
    route:
      'Muelle Municipal Camino Isleño - Río Paraná de las Palmas hasta Canal Gobernador de la Serna - El Tropezón.',
    duration: '00:30 / 00:40 HS',
    routeCoordinates: [],
  },
  {
    id: '455-fraccionado',
    type: 'FRACCIONADO',
    schedules: [
      {
        direction: 'ida',
        origin: 'Muelle Isleño Escobar',
        destination: 'Hospital Boca Carabelas',
        times: {
          lunes: ['11:30', '14:00', '17:30', '18:30'],
          martes: ['11:30', '14:00', '17:30', '18:30'],
          miercoles: ['11:30', '14:00', '17:30', '18:30'],
          jueves: ['11:30', '14:00', '17:30', '18:30'],
          viernes: ['11:30', '14:00', '17:30', '18:30'],
          sabado: ['9:30', '11:30', '13:30', '19:00'],
          domingo: ['9:30', '11:30', '13:30', '19:00'],
          feriados: ['9:30', '11:30', '13:30', '19:00'],
        },
      },
      {
        direction: 'vuelta',
        origin: 'Hospital Boca Carabelas',
        destination: 'Muelle Isleño Escobar',
        times: {
          lunes: ['11:45', '14:15', '18:45'],
          martes: ['11:45', '14:15', '18:45'],
          miercoles: ['11:45', '14:15', '18:45'],
          jueves: ['11:45', '14:15', '18:45'],
          viernes: ['11:45', '14:15', '18:45'],
          sabado: ['9:15', '9:45', '11:45', '13:45', '19:20'],
          domingo: ['9:15', '9:45', '11:45', '13:45', '19:20'],
          feriados: ['9:15', '9:45', '11:45', '13:45', '19:20'],
        },
      },
    ],
    route:
      'Muelle Municipal Camino Isleño - Río Paraná de las Palmas hasta Hospital Boca Carabelas.',
    duration: '00:15 HS',
    routeCoordinates: [],
  },
  {
    id: '455-ramal1',
    type: 'RAMAL 1',
    schedules: [
      {
        direction: 'ida',
        origin: 'Muelle Isleño Escobar',
        destination: 'Arroyo Fermín Isla Cardales',
        times: {
          lunes: ['14:30'],
          martes: ['14:30'],
          miercoles: ['14:30'],
          jueves: ['14:30'],
          viernes: ['14:30'],
          sabado: ['7:30', '8:30', '9:30', '14:30', '16:30', '17:30'],
          domingo: ['7:30', '8:30', '9:30', '14:30', '16:30', '17:30'],
          feriados: ['7:30', '8:30', '9:30', '14:30', '16:30', '17:30'],
        },
      },
      {
        direction: 'vuelta',
        origin: 'Arroyo Fermín Isla Cardales',
        destination: 'Muelle Isleño Escobar',
        times: {
          lunes: ['15:00'],
          martes: ['15:00'],
          miercoles: ['15:00'],
          jueves: ['15:00'],
          viernes: ['15:00'],
          sabado: ['8:00', '9:00', '10:00', '15:00', '17:00', '18:00'],
          domingo: ['8:00', '9:00', '10:00', '15:00', '17:00', '18:00'],
          feriados: ['8:00', '9:00', '10:00', '15:00', '17:00', '18:00'],
        },
      },
    ],
    route:
      'Muelle Municipal Camino Isleño - Río Paraná de las Palmas aguas arriba hasta Arroyo Fermín (Isla Cardales).',
    duration: '00:30 HS',
    routeCoordinates: [],
  },
];
