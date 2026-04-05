import { Bus } from '../types/bus';
import { geolocationService } from './geolocationService';

const BUSES_KEY = 'bus_tracker_buses';

// Simulated database for buses
export const busService = {
  // ... existing methods ...

  // Update bus location in real-time
  updateBusLocation: (busId: string): Bus | null => {
    const buses = busService.getAllBuses();
    const bus = buses.find(b => b.id === busId);
    
    if (!bus || !bus.assignedStops || bus.assignedStops.length === 0) {
      return null;
    }

    // Find next stop (simplified: assume sequential)
    const nextStopId = bus.nextStop || bus.assignedStops[0];
    const stops = JSON.parse(localStorage.getItem('bus_tracker_stops') || '[]');
    const nextStop = stops.find((s: any) => s.id === nextStopId);

    if (!nextStop) return bus;

    const updatedBus = geolocationService.updateBusLocation(bus, nextStop);
    
    // Update in storage
    const updatedBuses = buses.map(b => b.id === busId ? updatedBus : b);
    localStorage.setItem(BUSES_KEY, JSON.stringify(updatedBuses));

    return updatedBus;
  },

  // Get buses near a location
  getBusesNearLocation: (location: { lat: number; lng: number }, radiusMeters: number = 1000): Bus[] => {
    const buses = busService.getAllBuses();
    return buses.filter(bus => {
      const distance = geolocationService.calculateDistance(location, bus.currentLocation);
      return distance <= radiusMeters;
    });
  },

  // Get real-time occupancy (simulate updates)
  updateOccupancy: (busId: string): Bus | null => {
    const buses = busService.getAllBuses();
    const bus = buses.find(b => b.id === busId);
    
    if (!bus) return null;

    // Simulate occupancy change
    const change = Math.random() > 0.5 ? 1 : -1;
    const newOccupancy = Math.max(0, Math.min(bus.capacity, bus.currentOccupancy + change));

    const updatedBus = { ...bus, currentOccupancy: newOccupancy };
    const updatedBuses = buses.map(b => b.id === busId ? updatedBus : b);
    localStorage.setItem(BUSES_KEY, JSON.stringify(updatedBuses));

    return updatedBus;
  },

  // Initialize with mock data
  initializeMockData: (mockBuses: Bus[]): void => {
    localStorage.setItem(BUSES_KEY, JSON.stringify(mockBuses));
  },

  // Get all buses
  getAllBuses: (): Bus[] => {
    const busesJson = localStorage.getItem(BUSES_KEY);
    return busesJson ? JSON.parse(busesJson) : [];
  },

  // Create new bus
  createBus: (busData: Omit<Bus, 'id'>): Bus => {
    const buses = busService.getAllBuses();
    const newBus: Bus = {
      ...busData,
      id: `bus-${Date.now()}`,
    };
    buses.push(newBus);
    localStorage.setItem(BUSES_KEY, JSON.stringify(buses));
    return newBus;
  },

  // Update bus
  updateBus: (busId: string, updates: Partial<Bus>): Bus | null => {
    const buses = busService.getAllBuses();
    const busIndex = buses.findIndex(b => b.id === busId);
    
    if (busIndex === -1) return null;
    
    buses[busIndex] = { ...buses[busIndex], ...updates };
    localStorage.setItem(BUSES_KEY, JSON.stringify(buses));
    return buses[busIndex];
  },

  // Delete bus
  deleteBus: (busId: string): boolean => {
    const buses = busService.getAllBuses();
    const filteredBuses = buses.filter(b => b.id !== busId);
    
    if (filteredBuses.length === buses.length) return false;
    
    localStorage.setItem(BUSES_KEY, JSON.stringify(filteredBuses));
    return true;
  },

  // Get bus by ID
  getBusById: (busId: string): Bus | null => {
    const buses = busService.getAllBuses();
    return buses.find(b => b.id === busId) || null;
  },
};