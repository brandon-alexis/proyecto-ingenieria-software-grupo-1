import { useState } from 'react';
import { Route as RouteType } from '../types/bus';
import { Calculator, Plus, Trash2, DollarSign, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TransportExpensePlannerProps {
  routes: RouteType[];
}

interface ExpensePlan {
  id: string;
  route: RouteType;
  frequency: 'daily' | 'weekly' | 'monthly';
  tripsPerPeriod: number;
}

export function TransportExpensePlanner({ routes }: TransportExpensePlannerProps) {
  const [plans, setPlans] = useState<ExpensePlan[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteType | null>(null);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [tripsPerPeriod, setTripsPerPeriod] = useState<number>(1);

  const addPlan = () => {
    if (!selectedRoute) return;

    const newPlan: ExpensePlan = {
      id: Date.now().toString(),
      route: selectedRoute,
      frequency,
      tripsPerPeriod,
    };

    setPlans([...plans, newPlan]);
    setSelectedRoute(null);
    setTripsPerPeriod(1);
  };

  const removePlan = (planId: string) => {
    setPlans(plans.filter(plan => plan.id !== planId));
  };

  const calculateMonthlyCost = (plan: ExpensePlan): number => {
    const tripCost = plan.route.fare;
    const tripsPerMonth = plan.frequency === 'daily'
      ? plan.tripsPerPeriod * 30
      : plan.frequency === 'weekly'
      ? plan.tripsPerPeriod * 4
      : plan.tripsPerPeriod;

    return tripCost * tripsPerMonth;
  };

  const totalMonthlyCost = plans.reduce((total, plan) => total + calculateMonthlyCost(plan), 0);

  const availableRoutes = routes.filter(route =>
    !plans.some(plan => plan.route.id === route.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg sm:text-xl font-bold">Planificador de Gastos</h2>
      </div>

      {/* Add Plan Section */}
      <Card className="p-4 relative z-50">
        <h3 className="text-base font-semibold mb-3">Agregar Ruta</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-50">
          <div className="relative z-50">
            <Label htmlFor="route-select" className="text-sm">Ruta</Label>
            <Select
              value={selectedRoute?.id || ''}
              onValueChange={(value) => {
                const route = routes.find(r => r.id === value);
                setSelectedRoute(route || null);
              }}
            >
              <SelectTrigger className="h-9 text-sm relative z-50">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="relative z-[9999]">
                {availableRoutes.map(route => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.number} - {route.name} (${route.fare.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="frequency" className="text-sm">Frecuencia</Label>
            <Select value={frequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFrequency(value)}>
              <SelectTrigger className="h-9 text-sm relative z-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="relative z-[9999]">
                <SelectItem value="daily">Diaria</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="trips" className="text-sm">Viajes</Label>
            <Input
              id="trips"
              type="number"
              min="1"
              value={tripsPerPeriod}
              onChange={(e) => setTripsPerPeriod(Number(e.target.value))}
              className="h-9 text-sm"
            />
          </div>

          <div className="flex items-end">
            <Button onClick={addPlan} disabled={!selectedRoute} className="w-full h-9 text-sm">
              <Plus className="w-3 h-3 mr-1" />
              Agregar
            </Button>
          </div>
        </div>
      </Card>

      {/* Plans List */}
      {plans.length > 0 && (
        <Card className="p-4">
          <h3 className="text-base font-semibold mb-3">Mis Planes</h3>
          <div className="space-y-2">
            {plans.map(plan => (
              <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold truncate">{plan.route.number}</span>
                    <span className="text-gray-600 text-xs truncate">{plan.route.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    <span>{plan.tripsPerPeriod} {plan.frequency === 'daily' ? 'diarios' : plan.frequency === 'weekly' ? 'semanales' : 'mensuales'}</span>
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <div className="font-semibold text-sm">${calculateMonthlyCost(plan).toFixed(2)}</div>
                  <div className="text-xs text-gray-500">/mes</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removePlan(plan.id)}
                  className="text-red-600 hover:text-red-700 ml-2 h-8 w-8 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Summary */}
      {plans.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-blue-900">Costo Total</h3>
              <p className="text-xs sm:text-sm text-blue-700">Estimado mensual</p>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold text-blue-900">${totalMonthlyCost.toFixed(2)}</div>
              <div className="text-xs sm:text-sm text-blue-700">por mes</div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-white rounded text-xs">
              <div className="font-semibold text-sm">{plans.length}</div>
              <div className="text-gray-600">Rutas</div>
            </div>
            <div className="text-center p-2 bg-white rounded text-xs">
              <div className="font-semibold text-sm">{plans.reduce((total, plan) => {
                const tripsPerMonth = plan.frequency === 'daily'
                  ? plan.tripsPerPeriod * 30
                  : plan.frequency === 'weekly'
                  ? plan.tripsPerPeriod * 4
                  : plan.tripsPerPeriod;
                return total + tripsPerMonth;
              }, 0)}</div>
              <div className="text-gray-600">Viajes/mes</div>
            </div>
            <div className="text-center p-2 bg-white rounded text-xs">
              <div className="font-semibold text-sm">${(totalMonthlyCost / 30).toFixed(2)}</div>
              <div className="text-gray-600">Diario</div>
            </div>
          </div>
        </Card>
      )}

      {plans.length === 0 && (
        <Card className="p-6 text-center text-gray-500">
          <Calculator className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Sin planes de transporte</p>
          <p className="text-xs mt-1">Agrega rutas para comenzar</p>
        </Card>
      )}
    </div>
  );
}