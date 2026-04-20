import { Route as RouteType } from '../types/bus';
import { MapPin, Clock, DollarSign, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useState } from 'react';

interface RouteSelectorProps {
  routes: RouteType[];
  selectedRoutes: RouteType[];
  onSelectRoutes: (routes: RouteType[]) => void;
  onCompare: () => void;
  filters: {
    minFare: number;
    maxFare: number;
    minStops: number;
    maxStops: number;
  };
  onFiltersChange: (filters: {
    minFare: number;
    maxFare: number;
    minStops: number;
    maxStops: number;
  }) => void;
}

interface RouteSelectorProps {
  routes: RouteType[];
  selectedRoutes: RouteType[];
  onSelectRoutes: (routes: RouteType[]) => void;
  onCompare: () => void;
  filters: {
    minFare: number;
    maxFare: number;
    minStops: number;
    maxStops: number;
    maxFrequencyMinutes: number;
  };
  onFiltersChange: (filters: {
    minFare: number;
    maxFare: number;
    minStops: number;
    maxStops: number;
    maxFrequencyMinutes: number;
  }) => void;
}

export function RouteSelector({ routes, selectedRoutes, onSelectRoutes, onCompare, filters, onFiltersChange }: RouteSelectorProps) {
  const [showFilters, setShowFilters] = useState(false);

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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filtros
          </Button>
          {selectedRoutes.length > 0 && (
            <>
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
            </>
          )}
        </div>
      </div>

      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <CollapsibleContent className="space-y-4 p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minFare">Costo mínimo ($)</Label>
              <Input
                id="minFare"
                type="number"
                value={filters.minFare}
                onChange={(e) => onFiltersChange({ ...filters, minFare: Number(e.target.value) })}
                min={0}
                step={0.5}
              />
            </div>
            <div>
              <Label htmlFor="maxFare">Costo máximo ($)</Label>
              <Input
                id="maxFare"
                type="number"
                value={filters.maxFare}
                onChange={(e) => onFiltersChange({ ...filters, maxFare: Number(e.target.value) })}
                min={0}
                step={0.5}
              />
            </div>
            <div>
              <Label htmlFor="minStops">Mínimo paradas</Label>
              <Input
                id="minStops"
                type="number"
                value={filters.minStops}
                onChange={(e) => onFiltersChange({ ...filters, minStops: Number(e.target.value) })}
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="maxStops">Máximo paradas</Label>
              <Input
                id="maxStops"
                type="number"
                value={filters.maxStops}
                onChange={(e) => onFiltersChange({ ...filters, maxStops: Number(e.target.value) })}
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="maxFrequency">Frecuencia máxima (min)</Label>
              <Input
                id="maxFrequency"
                type="number"
                value={filters.maxFrequencyMinutes}
                onChange={(e) => onFiltersChange({ ...filters, maxFrequencyMinutes: Number(e.target.value) })}
                min={1}
              />
            </div>
          </div>
          <Button
            onClick={() => onFiltersChange({ minFare: 0, maxFare: 10, minStops: 0, maxStops: 20, maxFrequencyMinutes: 30 })}
            variant="outline"
            size="sm"
          >
            Restablecer Filtros
          </Button>
        </CollapsibleContent>
      </Collapsible>

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
