export type DayOfWeek = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo' | 'feriados';

export const DAYS: DayOfWeek[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo', 'feriados'];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  lunes: 'Lun',
  martes: 'Mar',
  miercoles: 'Mié',
  jueves: 'Jue',
  viernes: 'Vie',
  sabado: 'Sáb',
  domingo: 'Dom',
  feriados: 'Fer',
};

export type Direction = 'ida' | 'vuelta';

export interface ScheduleDirection {
  direction: Direction;
  origin: string;
  destination: string;
  times: Record<DayOfWeek, string[]>;
}

export interface Service {
  id: string;
  type: string;
  schedules: ScheduleDirection[];
  route: string;
  duration: string;
  notes?: string;
  routeCoordinates: [number, number][][];
}

export interface BoatLine {
  id: number;
  name: string;
  company: string;
  departurePoint: string;
  color: string;
  services: Service[];
  holidayNote?: string;
}

export type LatLng = [number, number];
