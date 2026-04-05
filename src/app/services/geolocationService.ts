import { BusStop, Bus } from '../types/bus';

export interface Location {
  lat: number;
  lng: number;
}

export interface RouteSegment {
  from: Location;
  to: Location;
  distance: number; // in meters
  duration: number; // in minutes
}

// Simulated geolocation service
export const geolocationService = {
  // Calculate distance between two points using Haversine formula
  calculateDistance: (point1: Location, point2: Location): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.lat * Math.PI) / 180;
    const φ2 = (point2.lat * Math.PI) / 180;
    const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
    const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  },

  // Calculate ETA between two points (simplified: assumes average speed)
  calculateETA: (from: Location, to: Location, averageSpeedKmh: number = 30): number => {
    const distanceKm = geolocationService.calculateDistance(from, to) / 1000;
    return Math.round((distanceKm / averageSpeedKmh) * 60); // ETA in minutes
  },

  // Get current user location (simulated)
  getCurrentUserLocation: (): Promise<Location> => {
    return new Promise((resolve) => {
      // Simulate getting user location
      setTimeout(() => {
        // Mock location near NYC
        resolve({
          lat: 40.7128 + (Math.random() - 0.5) * 0.01,
          lng: -74.006 + (Math.random() - 0.5) * 0.01,
        });
      }, 1000);
    });
  },

  // Update bus location (simulate movement)
  updateBusLocation: (bus: Bus, targetStop: BusStop): Bus => {
    const currentLocation = bus.currentLocation;
    const targetLocation = targetStop.location;

    // Calculate direction vector
    const distance = geolocationService.calculateDistance(currentLocation, targetLocation);
    if (distance < 50) { // Close enough to stop
      return {
        ...bus,
        currentLocation: targetLocation,
        status: 'arriving' as const,
      };
    }

    // Move bus towards target (simulate small movement)
    const speed = 0.001; // degrees per update
    const deltaLat = (targetLocation.lat - currentLocation.lat) * speed;
    const deltaLng = (targetLocation.lng - currentLocation.lng) * speed;

    const newLocation = {
      lat: currentLocation.lat + deltaLat,
      lng: currentLocation.lng + deltaLng,
    };

    // Calculate new ETA
    const eta = geolocationService.calculateETA(newLocation, targetLocation);

    return {
      ...bus,
      currentLocation: newLocation,
      estimatedArrival: eta > 0 ? `${eta} min` : 'Arriving',
      status: eta < 5 ? 'arriving' as const : bus.status,
    };
  },

  // Find nearest stop to a location
  findNearestStop: (location: Location, stops: BusStop[]): BusStop | null => {
    if (stops.length === 0) return null;

    let nearest = stops[0];
    let minDistance = geolocationService.calculateDistance(location, nearest.location);

    for (const stop of stops) {
      const distance = geolocationService.calculateDistance(location, stop.location);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = stop;
      }
    }

    return nearest;
  },

  // Calculate route segments with ETAs
  calculateRouteSegments: (stops: BusStop[]): RouteSegment[] => {
    const segments: RouteSegment[] = [];
    for (let i = 0; i < stops.length - 1; i++) {
      const from = stops[i].location;
      const to = stops[i + 1].location;
      const distance = geolocationService.calculateDistance(from, to);
      const duration = geolocationService.calculateETA(from, to);

      segments.push({
        from,
        to,
        distance,
        duration,
      });
    }
    return segments;
  },

  // Check if user is within range of a stop (for notifications)
  isUserNearStop: (userLocation: Location, stop: BusStop, thresholdMeters: number = 200): boolean => {
    const distance = geolocationService.calculateDistance(userLocation, stop.location);
    return distance <= thresholdMeters;
  },
};