import type { BoatLine } from '../types';
import { linea450Services } from './linea450';
import { linea451Services } from './linea451';
import { linea452Services } from './linea452';
import { linea453Services } from './linea453';
import { linea454Services } from './linea454';
import { linea455Services } from './linea455';

export const boatLines: BoatLine[] = [
  {
    id: 450,
    name: 'Línea 450',
    company: 'Francisco Buiatti e Hijos S.A.',
    departurePoint: 'Est. Fluvial Tigre',
    color: '#E63946',
    services: linea450Services,
  },
  {
    id: 451,
    name: 'Línea 451',
    company: 'Interisleña S.A.C.I.',
    departurePoint: 'Est. Fluvial Tigre',
    color: '#457B9D',
    services: linea451Services,
    holidayNote:
      'Si el feriado cae día lunes, se repiten los horarios del día domingo. Si el feriado cae día viernes, se repiten los horarios del día sábado.',
  },
  {
    id: 452,
    name: 'Línea 452',
    company: 'Interisleña S.A.C.I.',
    departurePoint: 'Est. Fluvial Tigre',
    color: '#2A9D8F',
    services: linea452Services,
    holidayNote:
      'Si el feriado cae día lunes, se repiten los horarios del día domingo. Si el feriado cae día viernes, se repiten los horarios del día sábado.',
  },
  {
    id: 453,
    name: 'Línea 453',
    company: 'Delta Argentino S.R.L.',
    departurePoint: 'Est. Fluvial Tigre',
    color: '#E9C46A',
    services: linea453Services,
  },
  {
    id: 454,
    name: 'Línea 454',
    company: 'El León SRL',
    departurePoint: 'Est. Fluvial Tigre',
    color: '#F4A261',
    services: linea454Services,
    holidayNote:
      'Si el feriado cae día lunes, se repiten los horarios del día domingo. Si el feriado cae día viernes, se repiten los horarios del día sábado.',
  },
  {
    id: 455,
    name: 'Línea 455',
    company: 'Hugo Alberto Pflugger',
    departurePoint: 'Muelle Isleño Escobar',
    color: '#264653',
    services: linea455Services,
  },
];
