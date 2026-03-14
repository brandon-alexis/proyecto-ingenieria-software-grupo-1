import { Bus as BusIcon, MapPin, Navigation } from 'lucide-react';
import { Bus, BusStop, Route } from '../types/bus';

interface BusMapProps {
  buses: Bus[];
  stops: BusStop[];
  selectedRoute: Route | null;
  selectedBus: Bus | null;
  onStopClick: (stop: BusStop) => void;
  onBusClick: (bus: Bus) => void;
  showAllRoutes?: boolean;
  allStops?: BusStop[];
}

export function BusMap({ 
  buses, 
  stops, 
  selectedRoute, 
  selectedBus,
  onStopClick, 
  onBusClick,
  showAllRoutes = false,
  allStops = []
}: BusMapProps) {
  // Calculate bounds for the map view
  const allPoints = stops.map(s => s.location);
  const minLat = Math.min(...allPoints.map(p => p.lat));
  const maxLat = Math.max(...allPoints.map(p => p.lat));
  const minLng = Math.min(...allPoints.map(p => p.lng));
  const maxLng = Math.max(...allPoints.map(p => p.lng));

  const normalizeX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * 90 + 5;
  const normalizeY = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * 90 + 5;

  // Get route for selected bus
  const getBusRoute = (bus: Bus) => {
    if (!bus.assignedStops || bus.assignedStops.length === 0) return null;
    return bus.assignedStops.map(stopId => allStops.find(s => s.id === stopId)).filter(Boolean) as BusStop[];
  };

  return (
    <div className="relative w-full h-full bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
      {/* Grid background */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />

      {/* Route lines for selected route */}
      {selectedRoute && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {selectedRoute.stops.map((stop, index) => {
            if (index === selectedRoute.stops.length - 1) return null;
            const nextStop = selectedRoute.stops[index + 1];
            return (
              <line
                key={`${stop.id}-${nextStop.id}`}
                x1={`${normalizeX(stop.location.lng)}%`}
                y1={`${normalizeY(stop.location.lat)}%`}
                x2={`${normalizeX(nextStop.location.lng)}%`}
                y2={`${normalizeY(nextStop.location.lat)}%`}
                stroke={selectedRoute.color}
                strokeWidth="3"
                strokeDasharray="8,4"
                opacity="0.6"
              />
            );
          })}
        </svg>
      )}

      {/* Route lines for selected bus */}
      {selectedBus && !selectedRoute && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {(() => {
            const busRoute = getBusRoute(selectedBus);
            if (!busRoute) return null;
            return busRoute.map((stop, index) => {
              if (index === busRoute.length - 1) return null;
              const nextStop = busRoute[index + 1];
              return (
                <line
                  key={`${stop.id}-${nextStop.id}`}
                  x1={`${normalizeX(stop.location.lng)}%`}
                  y1={`${normalizeY(stop.location.lat)}%`}
                  x2={`${normalizeX(nextStop.location.lng)}%`}
                  y2={`${normalizeY(nextStop.location.lat)}%`}
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                  opacity="0.6"
                />
              );
            });
          })()}
        </svg>
      )}

      {/* Show all bus routes if enabled */}
      {showAllRoutes && !selectedRoute && !selectedBus && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {buses.map((bus, busIndex) => {
            const busRoute = getBusRoute(bus);
            if (!busRoute) return null;
            const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
            const color = colors[busIndex % colors.length];
            return busRoute.map((stop, index) => {
              if (index === busRoute.length - 1) return null;
              const nextStop = busRoute[index + 1];
              return (
                <line
                  key={`${bus.id}-${stop.id}-${nextStop.id}`}
                  x1={`${normalizeX(stop.location.lng)}%`}
                  y1={`${normalizeY(stop.location.lat)}%`}
                  x2={`${normalizeX(nextStop.location.lng)}%`}
                  y2={`${normalizeY(nextStop.location.lat)}%`}
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray="6,3"
                  opacity="0.4"
                />
              );
            });
          })}
        </svg>
      )}

      {/* Bus stops */}
      {stops.map(stop => {
        const isOnSelectedRoute = selectedRoute?.stops.some(s => s.id === stop.id);
        return (
          <button
            key={stop.id}
            onClick={() => onStopClick(stop)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{
              left: `${normalizeX(stop.location.lng)}%`,
              top: `${normalizeY(stop.location.lat)}%`,
              zIndex: 10
            }}
          >
            <div className={`p-2 rounded-full transition-all ${
              isOnSelectedRoute 
                ? 'bg-blue-500 shadow-lg scale-110' 
                : 'bg-white border-2 border-slate-300 hover:border-blue-500 hover:shadow-md'
            }`}>
              <MapPin className={`w-4 h-4 ${isOnSelectedRoute ? 'text-white' : 'text-slate-700'}`} />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {stop.name}
            </div>
          </button>
        );
      })}

      {/* Buses */}
      {buses.map(bus => {
        const shouldShow = !selectedRoute || selectedRoute.number === bus.number;
        if (!shouldShow) return null;
        
        return (
          <button
            key={bus.id}
            onClick={() => onBusClick(bus)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group animate-pulse"
            style={{
              left: `${normalizeX(bus.currentLocation.lng)}%`,
              top: `${normalizeY(bus.currentLocation.lat)}%`,
              zIndex: 20
            }}
          >
            <div className={`p-2.5 rounded-full shadow-lg ${
              bus.status === 'on-time' ? 'bg-green-500' :
              bus.status === 'delayed' ? 'bg-red-500' :
              bus.status === 'arriving' ? 'bg-yellow-500' :
              'bg-slate-500'
            }`}>
              <BusIcon className="w-5 h-5 text-white" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 bg-white px-1.5 py-0.5 rounded text-xs font-semibold border border-slate-200">
              {bus.number}
            </div>
          </button>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs" style={{ zIndex: 30 }}>
        <div className="font-semibold mb-2">Map Legend</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>On Time</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span>Arriving</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span>Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-slate-700" />
            <span>Bus Stop</span>
          </div>
        </div>
      </div>

      {/* Compass */}
      <div className="absolute top-4 right-4 bg-white rounded-full shadow-lg p-2" style={{ zIndex: 30 }}>
        <Navigation className="w-5 h-5 text-slate-700" />
      </div>
    </div>
  );
}