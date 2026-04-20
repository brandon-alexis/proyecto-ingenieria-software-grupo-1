import { Route as RouteType } from '../types/bus';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { Button } from './ui/button';

interface RouteSelectorProps {
  routes: RouteType[];
  selectedRoutes: RouteType[];
  onSelectRoutes: (routes: RouteType[]) => void;
  onCompare: () => void;
}

export function RouteSelector({ routes, selectedRoutes, onSelectRoutes, onCompare }: RouteSelectorProps) {
  const handleRouteToggle = (route: RouteType) => {
    const isSelected = selectedRoutes.some(r => r.id === route.id);
    if (isSelected) {
      onSelectRoutes(selectedRoutes.filter(r => r.id !== route.id));
    } else {
      onSelectRoutes([...selectedRoutes, route]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Rutas</h3>
        {selectedRoutes.length > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={() => onSelectRoutes([])}
              variant="outline"
              size="sm"
            >
              Limpiar ({selectedRoutes.length})
            </Button>
            <Button
              onClick={onCompare}
              size="sm"
              disabled={selectedRoutes.length < 2}
            >
              Comparar Costos
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {routes.map(route => {
          const isSelected = selectedRoutes.some(r => r.id === route.id);
          return (
            <div
              key={route.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
              onClick={() => handleRouteToggle(route)}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleRouteToggle(route)}
                  className="mt-1"
                />
                <div
                  className="w-1 h-full rounded-full mt-1"
                  style={{ backgroundColor: route.color, minHeight: '3rem' }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{route.number}</span>
                    <span className="text-sm text-slate-600">{route.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{route.stops.length} paradas</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{route.frequency}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>${route.fare.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {route.operatingHours}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
