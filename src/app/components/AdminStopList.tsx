import { MapPin, Trash2, Edit } from 'lucide-react';
import { BusStop } from '../types/bus';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface AdminStopListProps {
  stops: BusStop[];
  onEdit?: (stop: BusStop) => void;
  onDelete?: (stopId: string) => void;
}

export function AdminStopList({ stops, onEdit, onDelete }: AdminStopListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Paradas Registradas</h3>
        <Badge variant="outline">{stops.length} paradas</Badge>
      </div>

      {stops.length === 0 ? (
        <Card className="p-8 text-center">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No hay paradas registradas</p>
          <p className="text-sm text-slate-400 mt-1">
            Comienza registrando una nueva parada
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {stops.map((stop) => (
            <Card key={stop.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{stop.name}</h4>
                      {stop.address && (
                        <div className="text-sm text-slate-600 mt-1">
                          {stop.address}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-slate-50 rounded p-2">
                      <div className="text-xs text-slate-600">Latitud</div>
                      <div className="font-medium text-sm">{stop.location.lat.toFixed(6)}</div>
                    </div>
                    <div className="bg-slate-50 rounded p-2">
                      <div className="text-xs text-slate-600">Longitud</div>
                      <div className="font-medium text-sm">{stop.location.lng.toFixed(6)}</div>
                    </div>
                  </div>

                  {stop.amenities && stop.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {stop.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 p-2 bg-slate-50 rounded text-xs text-slate-600">
                    ID: {stop.id}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(stop)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(stop.id)}
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
