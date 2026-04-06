import { Route, Trash2, Edit, MapPin } from 'lucide-react';
import { Route as RouteType } from '../types/bus';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface AdminRouteListProps {
  routes: RouteType[];
  onEdit?: (route: RouteType) => void;
  onDelete?: (routeId: string) => void;
}

export function AdminRouteList({ routes, onEdit, onDelete }: AdminRouteListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Rutas Registradas</h3>
        <Badge variant="outline">{routes.length} rutas</Badge>
      </div>

      {routes.length === 0 ? (
        <Card className="p-8 text-center">
          <Route className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No hay rutas registradas</p>
          <p className="text-sm text-slate-400 mt-1">
            Comienza creando una nueva ruta
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {routes.map((route) => (
            <Card key={route.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${route.color || '#3B82F6'}20` }}>
                  <Route className="w-6 h-6" style={{ color: route.color || '#3B82F6' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-lg">Ruta {route.number || 'N/A'}</span>
                        <Badge style={{ backgroundColor: route.color || '#3B82F6', color: 'white' }}>
                          {route.name || 'Sin nombre'}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        {route.frequency || 'N/A'} • {route.operatingHours || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs text-slate-600 mb-1">Paradas ({route.stops?.length || 0})</div>
                    <div className="flex flex-wrap gap-1">
                      {route.stops?.slice(0, 5).map((stop, index) => (
                        <Badge key={stop.id} variant="outline" className="text-xs">
                          {stop.name}
                        </Badge>
                      ))}
                      {route.stops?.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{(route.stops?.length || 0) - 5} más
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(route)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(route.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}