export interface BusStop {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  address?: string;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
}

export interface BusRoute {
  busId: string;
  stops: string[]; // Array of stop IDs in order
  estimatedDurations: number[]; // Duration in minutes between stops
}

export interface Bus {
  id: string;
  number: string;
  licensePlate: string;
  capacity: number;
  currentOccupancy: number;
  status: 'on-time' | 'delayed' | 'arriving' | 'departed';
  currentLocation: {
    lat: number;
    lng: number;
  };
  nextStop: string;
  estimatedArrival: string;
  type: 'express' | 'local' | 'shuttle';
  driver?: Driver;
  assignedStops?: string[]; // Array of stop IDs assigned to this bus
}

export interface Route {
  id: string;
  name: string;
  number: string;
  stops: BusStop[];
  color: string;
  frequency: string;
  operatingHours: string;
  fare: number; // Cost in currency units
}