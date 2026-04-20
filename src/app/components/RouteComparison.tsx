import { Route as RouteType } from '../types/bus';
import { DollarSign, Clock, MapPin } from 'lucide-react';
import { Card } from './ui/card';

interface RouteComparisonProps {
  routes: RouteType[];
  onClose: () => void;
}

export function RouteComparison({ routes, onClose }: RouteComparisonProps) {
  if (routes.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Comparación de Costos de Rutas</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {routes.map(route => (
            <Card key={route.id} className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-4 h-4 rounded-full mt-1"
                  style={{ backgroundColor: route.color }}
                />
                <div>
                  <h3 className="font-semibold text-lg">{route.number}</h3>
                  <p className="text-sm text-gray-600">{route.name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-lg">${route.fare.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{route.stops.length} paradas</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{route.frequency}</span>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  Horario: {route.operatingHours}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {routes.length > 1 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Resumen de Costos</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Costo más bajo:</span> ${Math.min(...routes.map(r => r.fare)).toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Costo más alto:</span> ${Math.max(...routes.map(r => r.fare)).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}