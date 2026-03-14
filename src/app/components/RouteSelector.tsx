import { Route as RouteType } from '../types/bus';
import { MapPin, Clock } from 'lucide-react';

interface RouteSelectorProps {
  routes: RouteType[];
  selectedRoute: RouteType | null;
  onSelectRoute: (route: RouteType | null) => void;
}

export function RouteSelector({ routes, selectedRoute, onSelectRoute }: RouteSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Routes</h3>
        {selectedRoute && (
          <button
            onClick={() => onSelectRoute(null)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear selection
          </button>
        )}
      </div>
      <div className="space-y-2">
        {routes.map(route => (
          <button
            key={route.id}
            onClick={() => onSelectRoute(route.id === selectedRoute?.id ? null : route)}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              selectedRoute?.id === route.id
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div 
                className="w-1 h-full rounded-full mt-1"
                style={{ backgroundColor: route.color, minHeight: '3rem' }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{route.number}</span>
                  <span className="text-sm text-slate-600">{route.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{route.stops.length} stops</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{route.frequency}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {route.operatingHours}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
