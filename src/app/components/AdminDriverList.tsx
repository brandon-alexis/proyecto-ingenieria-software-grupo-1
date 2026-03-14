import { UserCircle, Trash2, Edit, Phone, Mail } from 'lucide-react';
import { Driver } from '../types/bus';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface AdminDriverListProps {
  drivers: Driver[];
  onEdit?: (driver: Driver) => void;
  onDelete?: (driverId: string) => void;
}

export function AdminDriverList({ drivers, onEdit, onDelete }: AdminDriverListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Conductores Registrados</h3>
        <Badge variant="outline">{drivers.length} conductores</Badge>
      </div>

      {drivers.length === 0 ? (
        <Card className="p-8 text-center">
          <UserCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No hay conductores registrados</p>
          <p className="text-sm text-slate-400 mt-1">
            Comienza registrando un nuevo conductor
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {drivers.map((driver) => (
            <Card key={driver.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCircle className="w-6 h-6 text-green-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{driver.name}</h4>
                      <div className="text-sm text-slate-600">
                        Licencia: <span className="font-medium">{driver.licenseNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{driver.email}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2 bg-slate-50 rounded text-xs text-slate-600">
                    ID: {driver.id}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(driver)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(driver.id)}
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
