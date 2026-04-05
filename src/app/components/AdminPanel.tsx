import { useState } from "react";
import {
  Settings,
  Bus,
  UserCircle,
  Plus,
  X,
  MapPin,
  Route,
} from "lucide-react";
import { Bus as BusType, Driver, BusStop, Route as RouteType } from "../types/bus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { AdminBusForm } from "./AdminBusForm";
import { AdminDriverForm } from "./AdminDriverForm";
import { AdminStopForm } from "./AdminStopForm";
import { AdminRouteForm } from "./AdminRouteForm";
import { AdminBusList } from "./AdminBusList";
import { AdminDriverList } from "./AdminDriverList";
import { AdminStopList } from "./AdminStopList";
import { AdminRouteList } from "./AdminRouteList";
import { AdminBusStopAssignment } from "./AdminBusStopAssignment";

interface AdminPanelProps {
  buses: BusType[];
  drivers: Driver[];
  stops: BusStop[];
  routes: RouteType[];
  onAddBus: (busData: {
    number: string;
    licensePlate: string;
    capacity: number;
    type: "express" | "local" | "shuttle";
    driverId?: string;
  }) => void;
  onAddDriver: (driverData: {
    name: string;
    licenseNumber: string;
    phone: string;
    email: string;
  }) => void;
  onAddStop: (stopData: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    amenities: string[];
  }) => void;
  onAddRoute: (routeData: {
    name: string;
    number: string;
    stops: BusStop[];
    color: string;
    frequency: string;
    operatingHours: string;
  }) => void;
  onAssignStops: (busId: string, stopIds: string[]) => void;
  onDeleteBus?: (busId: string) => void;
  onDeleteDriver?: (driverId: string) => void;
  onDeleteStop?: (stopId: string) => void;
  onDeleteRoute?: (routeId: string) => void;
  onClose?: () => void;
}

export function AdminPanel({
  buses,
  drivers,
  stops,
  routes,
  onAddBus,
  onAddDriver,
  onAddStop,
  onAddRoute,
  onAssignStops,
  onDeleteBus,
  onDeleteDriver,
  onDeleteStop,
  onDeleteRoute,
  onClose,
}: AdminPanelProps) {
  const [showBusForm, setShowBusForm] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [showStopForm, setShowStopForm] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);

  const handleBusSubmit = (busData: any) => {
    onAddBus(busData);
    setShowBusForm(false);
  };

  const handleDriverSubmit = (driverData: any) => {
    onAddDriver(driverData);
    setShowDriverForm(false);
  };

  const handleStopSubmit = (stopData: any) => {
    onAddStop(stopData);
    setShowStopForm(false);
  };

  const handleRouteSubmit = (routeData: any) => {
    onAddRoute(routeData);
    setShowRouteForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[1100] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="font-semibold text-xl">
                  Panel de Administración
                </h1>
                <p className="text-sm text-slate-600">
                  Gestión de buses, conductores y paradas
                </p>
              </div>
            </div>
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="buses" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="buses" className="flex items-center gap-2">
                <Bus className="w-4 h-4" />
                Buses
              </TabsTrigger>
              <TabsTrigger value="drivers" className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Conductores
              </TabsTrigger>
              <TabsTrigger value="stops" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Paradas
              </TabsTrigger>
              <TabsTrigger value="routes" className="flex items-center gap-2">
                <Route className="w-4 h-4" />
                Rutas
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Asignaciones
              </TabsTrigger>
            </TabsList>

            {/* Buses Tab */}
            <TabsContent value="buses" className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => setShowBusForm(!showBusForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {showBusForm ? "Ocultar Formulario" : "Nuevo Bus"}
                </Button>
              </div>

              {showBusForm && (
                <AdminBusForm
                  drivers={drivers}
                  onSubmit={handleBusSubmit}
                  onCancel={() => setShowBusForm(false)}
                />
              )}

              <AdminBusList
                buses={buses}
                stops={stops}
                onDelete={onDeleteBus}
              />
            </TabsContent>

            {/* Drivers Tab */}
            <TabsContent value="drivers" className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => setShowDriverForm(!showDriverForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {showDriverForm ? "Ocultar Formulario" : "Nuevo Conductor"}
                </Button>
              </div>

              {showDriverForm && (
                <AdminDriverForm
                  onSubmit={handleDriverSubmit}
                  onCancel={() => setShowDriverForm(false)}
                />
              )}

              <AdminDriverList drivers={drivers} onDelete={onDeleteDriver} />
            </TabsContent>

            {/* Stops Tab */}
            <TabsContent value="stops" className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => setShowStopForm(!showStopForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {showStopForm ? "Ocultar Formulario" : "Nueva Parada"}
                </Button>
              </div>

              {showStopForm && (
                <AdminStopForm
                  onSubmit={handleStopSubmit}
                  onCancel={() => setShowStopForm(false)}
                />
              )}

              <AdminStopList stops={stops} onDelete={onDeleteStop} />
            </TabsContent>

            {/* Routes Tab */}
            <TabsContent value="routes" className="space-y-6">
              <div className="flex justify-end">
                <Button onClick={() => setShowRouteForm(!showRouteForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {showRouteForm ? "Ocultar Formulario" : "Nueva Ruta"}
                </Button>
              </div>

              {showRouteForm && (
                <AdminRouteForm
                  stops={stops}
                  onSubmit={handleRouteSubmit}
                  onCancel={() => setShowRouteForm(false)}
                />
              )}

              <AdminRouteList
                routes={routes}
                onDelete={onDeleteRoute}
              />
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent value="assignments" className="space-y-6">
              <AdminBusStopAssignment
                buses={buses}
                stops={stops}
                onAssignStops={onAssignStops}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Stats Footer */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-blue-600">
                {buses.length}
              </div>
              <div className="text-sm text-slate-600">Buses Registrados</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-green-600">
                {drivers.length}
              </div>
              <div className="text-sm text-slate-600">
                Conductores Registrados
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-red-600">
                {stops.length}
              </div>
              <div className="text-sm text-slate-600">Paradas Registradas</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-purple-600">
                {routes.length}
              </div>
              <div className="text-sm text-slate-600">Rutas Registradas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
