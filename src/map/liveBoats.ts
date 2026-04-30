import type { BoatLine, DayOfWeek, LatLng } from '../types';

export interface ActiveBoat {
  lineId: number;
  lineColor: string;
  serviceId: string;
  serviceType: string;
  direction: 'ida' | 'vuelta';
  progress: number;
  position: LatLng;
  departureTime: string;
  destination: string;
}

function parseDuration(durationStr: string): number {
  const match = durationStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 120;
  return Number.parseInt(match[1]) * 60 + Number.parseInt(match[2]);
}

function parseTime(timeStr: string): number {
  const parts = timeStr.split(':');
  return Number.parseInt(parts[0]) * 60 + Number.parseInt(parts[1]);
}

function getCurrentDayKey(): DayOfWeek {
  const dayMap: DayOfWeek[] = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  return dayMap[new Date().getDay()];
}

function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
}

export function interpolateRoute(route: LatLng[], progress: number): LatLng {
  if (route.length === 0) return [0, 0];
  if (route.length === 1 || progress <= 0) return route[0];
  if (progress >= 1) return route[route.length - 1];

  const distances: number[] = [0];
  let totalDist = 0;
  for (let i = 1; i < route.length; i++) {
    const dx = route[i][0] - route[i - 1][0];
    const dy = route[i][1] - route[i - 1][1];
    totalDist += Math.sqrt(dx * dx + dy * dy);
    distances.push(totalDist);
  }

  if (totalDist === 0) return route[0];

  const targetDist = progress * totalDist;

  for (let i = 1; i < distances.length; i++) {
    if (distances[i] >= targetDist) {
      const segLen = distances[i] - distances[i - 1];
      const segProgress = segLen > 0 ? (targetDist - distances[i - 1]) / segLen : 0;
      return [
        route[i - 1][0] + (route[i][0] - route[i - 1][0]) * segProgress,
        route[i - 1][1] + (route[i][1] - route[i - 1][1]) * segProgress,
      ];
    }
  }

  return route[route.length - 1];
}

export function getActiveBoats(
  lines: BoatLine[],
  routeData: Record<string, LatLng[][]>,
): ActiveBoat[] {
  const currentDay = getCurrentDayKey();
  const currentMinutes = getCurrentMinutes();
  const boats: ActiveBoat[] = [];

  for (const line of lines) {
    for (const service of line.services) {
      const durationMinutes = parseDuration(service.duration);
      const routePaths = routeData[service.id];
      if (!routePaths || routePaths.length === 0) continue;

      const fullRoute = routePaths.flat();
      if (fullRoute.length < 2) continue;

      for (const schedule of service.schedules) {
        const times = schedule.times[currentDay];
        if (!times) continue;

        for (const timeStr of times) {
          if (!timeStr) continue;
          const departureMinutes = parseTime(timeStr);
          const elapsed = currentMinutes - departureMinutes;

          if (elapsed >= 0 && elapsed <= durationMinutes) {
            const progress = elapsed / durationMinutes;
            const route = schedule.direction === 'vuelta'
              ? [...fullRoute].reverse()
              : fullRoute;
            const position = interpolateRoute(route, progress);

            boats.push({
              lineId: line.id,
              lineColor: line.color,
              serviceId: service.id,
              serviceType: service.type,
              direction: schedule.direction,
              progress,
              position,
              departureTime: timeStr,
              destination: schedule.destination,
            });
          }
        }
      }
    }
  }

  return boats;
}
