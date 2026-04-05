import { Route, BusStop } from '../types/bus';
import { stopService } from './stopService';
import { geolocationService } from './geolocationService';

const ROUTES_KEY = 'bus_tracker_routes';

// Simulated database for routes
export const routeService = {
  // ... existing methods ...

  // Calculate ETA for a route segment
  calculateETA: (routeId: string, fromStopId: string, toStopId: string): number | null => {
    const route = routeService.getRouteById(routeId);
    if (!route) return null;

    const fromIndex = route.stops.findIndex(s => s.id === fromStopId);
    const toIndex = route.stops.findIndex(s => s.id === toStopId);

    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return null;

    const segmentStops = route.stops.slice(fromIndex, toIndex + 1);
    const segments = geolocationService.calculateRouteSegments(segmentStops);
    return segments.reduce((sum, seg) => sum + seg.duration, 0);
  },

  // Get route capacity info
  getRouteCapacity: (routeId: string): { totalCapacity: number; availableSeats: number; occupancyRate: number } | null => {
    // This would need integration with bus service
    // For now, return mock data
    return {
      totalCapacity: 60,
      availableSeats: 25,
      occupancyRate: 58,
    };
  },

  // Get real-time route status
  getRouteStatus: (routeId: string): {
    status: 'on-time' | 'delayed' | 'disrupted';
    averageDelay: number;
    activeBuses: number;
  } | null => {
    // Mock implementation
    return {
      status: 'on-time',
      averageDelay: 2,
      activeBuses: 3,
    };
  },

  // Get route schedule
  getRouteSchedule: (routeId: string): Array<{ time: string; frequency: number }> => {
    // Mock schedule
    return [
      { time: '05:00', frequency: 30 },
      { time: '06:00', frequency: 15 },
      { time: '07:00', frequency: 10 },
      { time: '08:00', frequency: 15 },
      { time: '09:00', frequency: 20 },
    ];
  },

  // Initialize with mock data
  initializeMockData: (mockRoutes: Route[]): void => {
    localStorage.setItem(ROUTES_KEY, JSON.stringify(mockRoutes));
  },

  // Get all routes
  getAllRoutes: (): Route[] => {
    const routesJson = localStorage.getItem(ROUTES_KEY);
    return routesJson ? JSON.parse(routesJson) : [];
  },

  // Get route by ID
  getRouteById: (id: string): Route | null => {
    const routes = routeService.getAllRoutes();
    return routes.find(route => route.id === id) || null;
  },

  // Create new route
  createRoute: (routeData: Omit<Route, 'id'>): Route => {
    const routes = routeService.getAllRoutes();
    const newRoute: Route = {
      ...routeData,
      id: `route-${Date.now()}`,
    };
    routes.push(newRoute);
    localStorage.setItem(ROUTES_KEY, JSON.stringify(routes));
    return newRoute;
  },

  // Update route
  updateRoute: (id: string, routeData: Partial<Omit<Route, 'id'>>): Route | null => {
    const routes = routeService.getAllRoutes();
    const index = routes.findIndex(route => route.id === id);

    if (index === -1) {
      throw new Error('Ruta no encontrada');
    }

    routes[index] = { ...routes[index], ...routeData };
    localStorage.setItem(ROUTES_KEY, JSON.stringify(routes));

    return routes[index];
  },

  // Delete route
  deleteRoute: (id: string): boolean => {
    const routes = routeService.getAllRoutes();
    const filteredRoutes = routes.filter(route => route.id !== id);

    if (filteredRoutes.length === routes.length) {
      throw new Error('Ruta no encontrada');
    }

    localStorage.setItem(ROUTES_KEY, JSON.stringify(filteredRoutes));
    return true;
  },
};