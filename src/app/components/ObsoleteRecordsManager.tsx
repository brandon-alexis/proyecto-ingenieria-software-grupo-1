import { useState } from 'react';
import { Bus as BusType, Driver, BusStop, Route as RouteType } from '../types/bus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertCircle, Trash2, Flag, Archive, Check, X } from 'lucide-react';

interface ObsoleteRecord {
  id: string;
  name: string;
  type: 'bus' | 'driver' | 'stop' | 'route';
  createdDate: string;
  reason: string;
}

interface ObsoleteRecordsManagerProps {
  buses: BusType[];
  drivers: Driver[];
  stops: BusStop[];
  routes: RouteType[];
  obsoleteMarks: Map<string, ObsoleteRecord>;
  onMarkObsolete: (id: string, type: 'bus' | 'driver' | 'stop' | 'route', name: string, reason: string) => void;
  onUnmarkObsolete: (id: string) => void;
  onDeleteBus: (busId: string) => void;
  onDeleteDriver: (driverId: string) => void;
  onDeleteStop: (stopId: string) => void;
  onDeleteRoute: (routeId: string) => void;
}

export function ObsoleteRecordsManager({
  buses,
  drivers,
  stops,
  routes,
  obsoleteMarks,
  onMarkObsolete,
  onUnmarkObsolete,
  onDeleteBus,
  onDeleteDriver,
  onDeleteStop,
  onDeleteRoute,
}: ObsoleteRecordsManagerProps) {
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [recordType, setRecordType] = useState<'bus' | 'driver' | 'stop' | 'route'>('bus');
  const [selectedId, setSelectedId] = useState<string>('');
  const [deletionReason, setDeletionReason] = useState<string>('');

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRecords(newSelected);
  };

  const handleMarkObsolete = () => {
    if (!selectedId) {
      alert('Por favor selecciona un registro');
      return;
    }

    let name = '';
    switch (recordType) {
      case 'bus':
        name = buses.find(b => b.id === selectedId)?.number || '';
        break;
      case 'driver':
        name = drivers.find(d => d.id === selectedId)?.name || '';
        break;
      case 'stop':
        name = stops.find(s => s.id === selectedId)?.name || '';
        break;
      case 'route':
        name = routes.find(r => r.id === selectedId)?.number || '';
        break;
    }

    if (name) {
      onMarkObsolete(selectedId, recordType, name, deletionReason);
      setSelectedId('');
      setDeletionReason('');
    }
  };

  const deleteSelectedRecords = () => {
    selectedRecords.forEach(recordId => {
      const record = obsoleteMarks.get(recordId);
      if (record) {
        switch (record.type) {
          case 'bus':
            onDeleteBus(record.id);
            break;
          case 'driver':
            onDeleteDriver(record.id);
            break;
          case 'stop':
            onDeleteStop(record.id);
            break;
          case 'route':
            onDeleteRoute(record.id);
            break;
        }
      }
      onUnmarkObsolete(recordId);
    });
    setSelectedRecords(new Set());
  };

  const getObsoleteBuses = () => buses.filter(b => obsoleteMarks.has(b.id));
  const getObsoleteDrivers = () => drivers.filter(d => obsoleteMarks.has(d.id));
  const getObsoleteStops = () => stops.filter(s => obsoleteMarks.has(s.id));
  const getObsoleteRoutes = () => routes.filter(r => obsoleteMarks.has(r.id));

  const getAvailableBuses = () => buses.filter(b => !obsoleteMarks.has(b.id));
  const getAvailableDrivers = () => drivers.filter(d => !obsoleteMarks.has(d.id));
  const getAvailableStops = () => stops.filter(s => !obsoleteMarks.has(s.id));
  const getAvailableRoutes = () => routes.filter(r => !obsoleteMarks.has(r.id));

  const totalObsolete = obsoleteMarks.size;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Archive className="w-6 h-6 text-amber-600" />
        <h2 className="text-2xl font-bold">Gestor de Registros Obsoletos</h2>
      </div>

      {/* Mark as Obsolete Form */}
      <Card className="p-4 sm:p-6 bg-blue-50 border-blue-200 z-40 relative">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">Marcar Registro como Obsoleto</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative z-30">
            <Label htmlFor="record-type" className="text-xs sm:text-sm">Tipo de Registro</Label>
            <Select value={recordType} onValueChange={(value: any) => {
              setRecordType(value);
              setSelectedId('');
            }}>
              <SelectTrigger className="mt-1 z-50 relative">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                <SelectItem value="bus">Buses</SelectItem>
                <SelectItem value="driver">Conductores</SelectItem>
                <SelectItem value="stop">Paradas</SelectItem>
                <SelectItem value="route">Rutas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative z-30">
            <Label htmlFor="record-id" className="text-xs sm:text-sm">Seleccionar Registro</Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="mt-1 z-50 relative">
                <SelectValue placeholder="Elige uno..." />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {recordType === 'bus' && getAvailableBuses().map(bus => (
                  <SelectItem key={bus.id} value={bus.id}>{bus.number}</SelectItem>
                ))}
                {recordType === 'driver' && getAvailableDrivers().map(driver => (
                  <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
                ))}
                {recordType === 'stop' && getAvailableStops().map(stop => (
                  <SelectItem key={stop.id} value={stop.id}>{stop.name}</SelectItem>
                ))}
                {recordType === 'route' && getAvailableRoutes().map(route => (
                  <SelectItem key={route.id} value={route.id}>{route.number}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1 relative z-30">
            <Label htmlFor="reason" className="text-xs sm:text-sm">Razón (opcional)</Label>
            <Input
              id="reason"
              placeholder="Por qué es obsoleto"
              value={deletionReason}
              onChange={(e) => setDeletionReason(e.target.value)}
              className="mt-1 text-xs sm:text-sm relative z-20"
            />
          </div>

          <Button
            onClick={handleMarkObsolete}
            disabled={!selectedId}
            className="bg-blue-600 hover:bg-blue-700 text-white mt-auto relative z-30"
          >
            <Flag className="w-4 h-4 mr-1" />
            Marcar Obsoleto
          </Button>
        </div>
      </Card>

      {totalObsolete === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No hay registros marcados como obsoletos</p>
        </Card>
      ) : (
        <>
          {/* Summary */}
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-amber-900">Registros Obsoletos Detectados</h3>
                <p className="text-sm text-amber-700">{totalObsolete} registros marcados para limpieza</p>
              </div>
              <div className="text-3xl font-bold text-amber-600">{totalObsolete}</div>
            </div>
          </Card>

          {/* Bulk Actions */}
          {totalObsolete > 0 && (
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="space-y-3">
                <h3 className="font-semibold text-red-900">Acciones Masivas</h3>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => setSelectedRecords(new Set(obsoleteMarks.keys()))}
                    variant="outline"
                    size="sm"
                  >
                    Seleccionar Todo
                  </Button>
                  <Button
                    onClick={() => setSelectedRecords(new Set())}
                    variant="outline"
                    size="sm"
                  >
                    Deseleccionar Todo
                  </Button>
                  <Button
                    onClick={deleteSelectedRecords}
                    disabled={selectedRecords.size === 0}
                    className="bg-red-600 hover:bg-red-700 text-white ml-auto"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar Seleccionados ({selectedRecords.size})
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Tabs for different record types */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-5">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                Todos ({totalObsolete})
              </TabsTrigger>
              <TabsTrigger value="buses" className="text-xs sm:text-sm">
                Buses ({getObsoleteBuses().length})
              </TabsTrigger>
              <TabsTrigger value="drivers" className="text-xs sm:text-sm">
                Conductores ({getObsoleteDrivers().length})
              </TabsTrigger>
              <TabsTrigger value="stops" className="text-xs sm:text-sm">
                Paradas ({getObsoleteStops().length})
              </TabsTrigger>
              <TabsTrigger value="routes" className="text-xs sm:text-sm">
                Rutas ({getObsoleteRoutes().length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-2">
              {Array.from(obsoleteMarks.values()).length === 0 ? (
                <Card className="p-4 text-center text-gray-500">
                  <p>No hay registros marcados en esta categoría</p>
                </Card>
              ) : (
                Array.from(obsoleteMarks.values()).map(record => (
                  <Card key={record.id} className="p-3 border-amber-200 bg-amber-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedRecords.has(record.id)}
                        onChange={() => toggleSelection(record.id)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Flag className="w-4 h-4 text-amber-600" />
                          <span className="font-semibold text-sm sm:text-base">{record.name}</span>
                          <span className="text-xs bg-amber-200 px-2 py-1 rounded">{record.type}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {record.reason && <p>Razón: {record.reason}</p>}
                          {record.createdDate && <p>Marcado: {record.createdDate}</p>}
                        </div>
                      </div>
                      <Button
                        onClick={() => onUnmarkObsolete(record.id)}
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="buses" className="space-y-2">
              {getObsoleteBuses().length === 0 ? (
                <Card className="p-4 text-center text-gray-500">
                  <p>No hay buses marcados como obsoletos</p>
                </Card>
              ) : (
                getObsoleteBuses().map(bus => {
                  const record = obsoleteMarks.get(bus.id);
                  return (
                    <Card key={bus.id} className="p-3 border-amber-200 bg-amber-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedRecords.has(bus.id)}
                          onChange={() => toggleSelection(bus.id)}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm sm:text-base">{bus.number}</span>
                            <span className="text-xs text-gray-600">{bus.licensePlate}</span>
                          </div>
                          <p className="text-xs text-gray-600">{bus.type} - Capacidad: {bus.capacity}</p>
                          {record?.reason && <p className="text-xs text-amber-700 mt-1">Razón: {record.reason}</p>}
                        </div>
                        <Button
                          onClick={() => onUnmarkObsolete(bus.id)}
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="drivers" className="space-y-2">
              {getObsoleteDrivers().length === 0 ? (
                <Card className="p-4 text-center text-gray-500">
                  <p>No hay conductores marcados como obsoletos</p>
                </Card>
              ) : (
                getObsoleteDrivers().map(driver => {
                  const record = obsoleteMarks.get(driver.id);
                  return (
                    <Card key={driver.id} className="p-3 border-amber-200 bg-amber-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedRecords.has(driver.id)}
                          onChange={() => toggleSelection(driver.id)}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm sm:text-base">{driver.name}</span>
                          </div>
                          <p className="text-xs text-gray-600">{driver.licenseNumber}</p>
                          {record?.reason && <p className="text-xs text-amber-700 mt-1">Razón: {record.reason}</p>}
                        </div>
                        <Button
                          onClick={() => onUnmarkObsolete(driver.id)}
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="stops" className="space-y-2">
              {getObsoleteStops().length === 0 ? (
                <Card className="p-4 text-center text-gray-500">
                  <p>No hay paradas marcadas como obsoletas</p>
                </Card>
              ) : (
                getObsoleteStops().map(stop => {
                  const record = obsoleteMarks.get(stop.id);
                  return (
                    <Card key={stop.id} className="p-3 border-amber-200 bg-amber-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedRecords.has(stop.id)}
                          onChange={() => toggleSelection(stop.id)}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm sm:text-base">{stop.name}</span>
                          </div>
                          <p className="text-xs text-gray-600">{stop.address}</p>
                          {record?.reason && <p className="text-xs text-amber-700 mt-1">Razón: {record.reason}</p>}
                        </div>
                        <Button
                          onClick={() => onUnmarkObsolete(stop.id)}
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="routes" className="space-y-2">
              {getObsoleteRoutes().length === 0 ? (
                <Card className="p-4 text-center text-gray-500">
                  <p>No hay rutas marcadas como obsoletas</p>
                </Card>
              ) : (
                getObsoleteRoutes().map(route => {
                  const record = obsoleteMarks.get(route.id);
                  return (
                    <Card key={route.id} className="p-3 border-amber-200 bg-amber-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedRecords.has(route.id)}
                          onChange={() => toggleSelection(route.id)}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm sm:text-base">{route.number}</span>
                            <span className="text-xs text-gray-600">{route.name}</span>
                          </div>
                          <p className="text-xs text-gray-600">{route.stops.length} paradas</p>
                          {record?.reason && <p className="text-xs text-amber-700 mt-1">Razón: {record.reason}</p>}
                        </div>
                        <Button
                          onClick={() => onUnmarkObsolete(route.id)}
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
