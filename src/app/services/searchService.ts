import { Route, BusStop, Bus } from '../types/bus';
import { geolocationService } from './geolocationService';

export interface SearchCriteria {
  origin?: string; // stop name or location
  destination?: string; // stop name or location
  originLocation?: { lat: number; lng: number };
  destinationLocation?: { lat: number; lng: number };
  maxTransfers?: number;
  preferredTime?: Date;
  busType?: 'express' | 'local' | 'shuttle';
}

export interface SearchResult {
  route: Route;
  originStop: BusStop;
  destinationStop: BusStop;
  distance: number; // in meters
  estimatedDuration: number; // in minutes
  transfers: number;
  availableBuses: Bus[];
}

// Simulated route search service
export const searchService = {
  // Search routes by criteria
  searchRoutes: (criteria: SearchCriteria, availableRoutes: Route[], availableStops: BusStop[], availableBuses: Bus[]): SearchResult[] => {
    const results: SearchResult[] = [];

    // Find origin and destination stops
    let originStops: BusStop[] = [];
    let destinationStops: BusStop[] = [];

    if (criteria.origin) {
      originStops = availableStops.filter(stop =>
        stop.name.toLowerCase().includes(criteria.origin!.toLowerCase())
      );
    } else if (criteria.originLocation) {
      const nearest = geolocationService.findNearestStop(criteria.originLocation, availableStops);
      originStops = nearest ? [nearest] : [];
    }

    if (criteria.destination) {
      destinationStops = availableStops.filter(stop =>
        stop.name.toLowerCase().includes(criteria.destination!.toLowerCase())
      );
    } else if (criteria.destinationLocation) {
      const nearest = geolocationService.findNearestStop(criteria.destinationLocation, availableStops);
      destinationStops = nearest ? [nearest] : [];
    }

    // Find routes that connect origin to destination
    for (const route of availableRoutes) {
      for (const originStop of originStops) {
        for (const destStop of destinationStops) {
          const result = searchService.evaluateRouteConnection(
            route,
            originStop,
            destStop,
            availableBuses
          );

          if (result) {
            results.push(result);
          }
        }
      }
    }

    // Sort by duration
    return results.sort((a, b) => a.estimatedDuration - b.estimatedDuration);
  },

  // Evaluate if a route connects two stops
  evaluateRouteConnection: (route: Route, originStop: BusStop, destStop: BusStop, availableBuses: Bus[]): SearchResult | null => {
    const originIndex = route.stops.findIndex(s => s.id === originStop.id);
    const destIndex = route.stops.findIndex(s => s.id === destStop.id);

    if (originIndex === -1 || destIndex === -1 || originIndex >= destIndex) {
      return null;
    }

    // Calculate distance and duration for this segment
    const segmentStops = route.stops.slice(originIndex, destIndex + 1);
    const segments = geolocationService.calculateRouteSegments(segmentStops);
    const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
    const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);

    // Find available buses for this route
    const routeBuses = availableBuses.filter(bus =>
      bus.assignedStops?.some(stopId => route.stops.some(s => s.id === stopId))
    );

    return {
      route,
      originStop,
      destinationStop: destStop,
      distance: totalDistance,
      estimatedDuration: totalDuration,
      transfers: 0, // Direct route
      availableBuses: routeBuses,
    };
  },

  // Search stops by name or location
  searchStops: (query: string, availableStops: BusStop[]): BusStop[] => {
    const lowerQuery = query.toLowerCase();
    return availableStops.filter(stop =>
      stop.name.toLowerCase().includes(lowerQuery) ||
      (stop.address && stop.address.toLowerCase().includes(lowerQuery)) ||
      stop.amenities.some(amenity => amenity.toLowerCase().includes(lowerQuery))
    );
  },

  // Get nearby stops
  getNearbyStops: (location: { lat: number; lng: number }, radiusMeters: number, availableStops: BusStop[]): BusStop[] => {
    return availableStops.filter(stop => {
      const distance = geolocationService.calculateDistance(location, stop.location);
      return distance <= radiusMeters;
    }).sort((a, b) => {
      const distA = geolocationService.calculateDistance(location, a.location);
      const distB = geolocationService.calculateDistance(location, b.location);
      return distA - distB;
    });
  },

  // Get route details
  getRouteDetails: (routeId: string, availableRoutes: Route[]): Route | null => {
    return availableRoutes.find(route => route.id === routeId) || null;
  },

  // Get stop details
  getStopDetails: (stopId: string, availableStops: BusStop[]): BusStop | null => {
    return availableStops.find(stop => stop.id === stopId) || null;
  },

  // Validate search criteria
  validateSearchCriteria: (criteria: SearchCriteria): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!criteria.origin && !criteria.originLocation) {
      errors.push('Debe especificar un origen');
    }

    if (!criteria.destination && !criteria.destinationLocation) {
      errors.push('Debe especificar un destino');
    }

    if (criteria.originLocation && criteria.destinationLocation) {
      const distance = geolocationService.calculateDistance(
        criteria.originLocation,
        criteria.destinationLocation
      );

      if (distance < 100) {
        errors.push('El origen y destino están muy cerca');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};