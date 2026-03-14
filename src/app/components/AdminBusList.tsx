import { Bus, Trash2, Edit, UserCircle, MapPin } from 'lucide-react';
import { Bus as BusType, BusStop } from '../types/bus';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface AdminBusListProps {
  buses: BusType[];
  stops?: BusStop[];
  onEdit?: (bus: BusType) => void;
  onDelete?: (busId: string) => void;
}

export function AdminBusList({ buses, stops = [], onEdit, onDelete }: AdminBusListProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'express':
        return 'bg-blue-100 text-blue-800';
      case 'local':
        return 'bg-purple-100 text-purple-800';
      case 'shuttle':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStopNames = (stopIds: string[] | undefined) => {
    if (!stopIds || stopIds.length === 0) return [];
    return stopIds.map(id => stops.find(s => s.id === id)?.name || id).filter(Boolean);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Buses Registrados</h3>
        <Badge variant="outline">{buses.length} buses</Badge>
      </div>

      {buses.length === 0 ? (
        <Card className="p-8 text-center">
          <Bus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No hay buses registrados</p>
          <p className="text-sm text-slate-400 mt-1">
            Comienza registrando un nuevo bus
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {buses.map((bus) => (
            <Card key={bus.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Bus className="w-6 h-6 text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg">Bus {bus.number}</span>
                        <Badge className={getTypeColor(bus.type)}>
                          {bus.type === 'express' ? 'Expreso' : 
                           bus.type === 'local' ? 'Local' : 'Shuttle'}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        Placa: <span className="font-medium">{bus.licensePlate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-slate-50 rounded p-2">
                      <div className="text-xs text-slate-600">Código ID</div>
                      <div className="font-medium text-sm">{bus.id}</div>
                    </div>
                    <div className="bg-slate-50 rounded p-2">
                      <div className="text-xs text-slate-600">Capacidad</div>
                      <div className="font-medium text-sm">{bus.capacity} pasajeros</div>
                    </div>
                  </div>

                  {bus.driver && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                      <UserCircle className="w-4 h-4 text-green-600" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-green-900">
                          {bus.driver.name}
                        </div>
                        <div className="text-xs text-green-700">
                          Licencia: {bus.driver.licenseNumber}
                        </div>
                      </div>
                    </div>
                  )}

                  {!bus.driver && (
                    <div className="text-sm text-slate-500 p-2 bg-yellow-50 rounded border border-yellow-200 mb-2">
                      Sin conductor asignado
                    </div>
                  )}

                  {bus.assignedStops && bus.assignedStops.length > 0 && (
                    <div className="mt-2 p-2 bg-purple-50 rounded border border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-900">
                          Recorrido ({bus.assignedStops.length} paradas)
                        </span>
                      </div>
                      <div className="text-xs text-purple-700">
                        {getStopNames(bus.assignedStops).slice(0, 3).join(' → ')}
                        {bus.assignedStops.length > 3 && ' ...'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(bus)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(bus.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}