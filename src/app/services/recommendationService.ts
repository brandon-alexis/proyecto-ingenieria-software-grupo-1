import { Route, BusStop, Bus } from '../types/bus';
import { geolocationService } from './geolocationService';

export interface RouteRecommendation {
  route: Route;
  estimatedDuration: number;
  estimatedCost: number;
  transfers: number;
  reliability: number; // 0-100
  reason: string;
}

export interface TripRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  preferredTime?: Date;
  maxTransfers?: number;
  maxWalkingDistance?: number; // in meters
}

// Simulated route recommendation service
export const recommendationService = {
  // Get route recommendations
  getRouteRecommendations: (tripRequest: TripRequest, availableRoutes: Route[], availableBuses: Bus[]): RouteRecommendation[] => {
    const recommendations: RouteRecommendation[] = [];

    for (const route of availableRoutes) {
      const recommendation = recommendationService.evaluateRoute(tripRequest, route, availableBuses);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    }

    // Sort by score (lower duration + cost + transfers)
    return recommendations.sort((a, b) => {
      const scoreA = a.estimatedDuration + a.estimatedCost + (a.transfers * 10);
      const scoreB = b.estimatedDuration + b.estimatedCost + (b.transfers * 10);
      return scoreA - scoreB;
    });
  },

  // Evaluate a single route
  evaluateRoute: (tripRequest: TripRequest, route: Route, availableBuses: Bus[]): RouteRecommendation | null => {
    const { origin, destination } = tripRequest;

    // Find closest stops on route
    const originStop = geolocationService.findNearestStop(origin, route.stops);
    const destinationStop = geolocationService.findNearestStop(destination, route.stops);

    if (!originStop || !destinationStop) return null;

    // Check if stops are in order
    const originIndex = route.stops.findIndex(s => s.id === originStop.id);
    const destIndex = route.stops.findIndex(s => s.id === destinationStop.id);

    if (originIndex >= destIndex) return null;

    // Calculate partial route
    const partialStops = route.stops.slice(originIndex, destIndex + 1);
    const segments = geolocationService.calculateRouteSegments(partialStops);
    const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);

    // Calculate cost
    const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0) / 1000;
    const cost = totalDistance * 0.5 + 2.5; // Simplified pricing

    // Check bus availability
    const routeBuses = availableBuses.filter(bus => bus.assignedStops?.some(stopId => route.stops.some(s => s.id === stopId)));
    const reliability = routeBuses.length > 0 ? 85 : 45; // Higher if buses are assigned

    // Determine reason
    let reason = 'Ruta directa disponible';
    if (routeBuses.length === 0) {
      reason = 'Ruta disponible pero sin buses asignados actualmente';
    }

    return {
      route,
      estimatedDuration: totalDuration,
      estimatedCost: Math.round(cost * 100) / 100,
      transfers: 0, // Direct route
      reliability,
      reason,
    };
  },

  // Get alternative routes (with transfers)
  getAlternativeRoutes: (tripRequest: TripRequest, availableRoutes: Route[], availableBuses: Bus[]): RouteRecommendation[] => {
    // For simplicity, return direct routes for now
    // In a real implementation, this would calculate multi-leg journeys
    return recommendationService.getRouteRecommendations(tripRequest, availableRoutes, availableBuses);
  },

  // Get fastest route
  getFastestRoute: (tripRequest: TripRequest, availableRoutes: Route[], availableBuses: Bus[]): RouteRecommendation | null => {
    const recommendations = recommendationService.getRouteRecommendations(tripRequest, availableRoutes, availableBuses);
    return recommendations.length > 0 ? recommendations[0] : null;
  },

  // Get cheapest route
  getCheapestRoute: (tripRequest: TripRequest, availableRoutes: Route[], availableBuses: Bus[]): RouteRecommendation | null => {
    const recommendations = recommendationService.getRouteRecommendations(tripRequest, availableRoutes, availableBuses);
    const sortedByCost = recommendations.sort((a, b) => a.estimatedCost - b.estimatedCost);
    return sortedByCost.length > 0 ? sortedByCost[0] : null;
  },

  // Get routes by time preference
  getRoutesByTime: (preferredTime: Date, availableRoutes: Route[]): RouteRecommendation[] => {
    // Simplified: return all routes (in real app, filter by schedule)
    return availableRoutes.map(route => ({
      route,
      estimatedDuration: 30, // Mock
      estimatedCost: 5.0, // Mock
      transfers: 0,
      reliability: 80,
      reason: 'Ruta disponible en horario solicitado',
    }));
  },
};