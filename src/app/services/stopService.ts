import { BusStop } from '../types/bus';

const STOPS_KEY = 'bus_tracker_stops';

// Simulated database for bus stops
export const stopService = {
  // Get all stops
  getAllStops: (): BusStop[] => {
    const stopsJson = localStorage.getItem(STOPS_KEY);
    return stopsJson ? JSON.parse(stopsJson) : [];
  },

  // Get stop by ID
  getStopById: (id: string): BusStop | null => {
    const stops = stopService.getAllStops();
    return stops.find(stop => stop.id === id) || null;
  },

  // Create new stop
  createStop: (stopData: Omit<BusStop, 'id'>): BusStop => {
    const stops = stopService.getAllStops();

    // Validate unique name (optional, but good practice)
    if (stops.find(s => s.name === stopData.name)) {
      throw new Error('El nombre de la parada ya existe');
    }

    const newStop: BusStop = {
      id: `stop-${Date.now()}`,
      ...stopData,
    };

    stops.push(newStop);
    localStorage.setItem(STOPS_KEY, JSON.stringify(stops));

    return newStop;
  },

  // Update stop
  updateStop: (id: string, stopData: Partial<Omit<BusStop, 'id'>>): BusStop | null => {
    const stops = stopService.getAllStops();
    const index = stops.findIndex(stop => stop.id === id);

    if (index === -1) {
      throw new Error('Parada no encontrada');
    }

    // Validate unique name if changing
    if (stopData.name && stops.find(s => s.name === stopData.name && s.id !== id)) {
      throw new Error('El nombre de la parada ya existe');
    }

    stops[index] = { ...stops[index], ...stopData };
    localStorage.setItem(STOPS_KEY, JSON.stringify(stops));

    return stops[index];
  },

  // Delete stop
  deleteStop: (id: string): boolean => {
    const stops = stopService.getAllStops();
    const filteredStops = stops.filter(stop => stop.id !== id);

    if (filteredStops.length === stops.length) {
      throw new Error('Parada no encontrada');
    }

    localStorage.setItem(STOPS_KEY, JSON.stringify(filteredStops));
    return true;
  },

  // Initialize with mock data if empty
  initializeMockData: (mockStops: BusStop[]): void => {
    const stops = stopService.getAllStops();
    if (stops.length === 0) {
      localStorage.setItem(STOPS_KEY, JSON.stringify(mockStops));
    }
  },
};