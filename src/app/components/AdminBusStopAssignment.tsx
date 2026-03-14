import { useState } from 'react';
import { Bus as BusType, BusStop } from '../types/bus';
import { Bus, MapPin, Plus, X, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface AdminBusStopAssignmentProps {
  buses: BusType[];
  stops: BusStop[];
  onAssignStops: (busId: string, stopIds: string[]) => void;
}

export function AdminBusStopAssignment({
  buses,
  stops,
  onAssignStops,
}: AdminBusStopAssignmentProps) {
  const [selectedBusId, setSelectedBusId] = useState<string>('');
  const [selectedStopId, setSelectedStopId] = useState<string>('');
  const [assignedStops, setAssignedStops] = useState<string[]>([]);

  const selectedBus = buses.find(b => b.id === selectedBusId);

  // Load assigned stops when bus is selected
  const handleBusSelect = (busId: string) => {
    setSelectedBusId(busId);
    const bus = buses.find(b => b.id === busId);
    setAssignedStops(bus?.assignedStops || []);
  };

  // Add stop to route
  const handleAddStop = () => {
    if (selectedStopId && !assignedStops.includes(selectedStopId)) {
      const newStops = [...assignedStops, selectedStopId];
      setAssignedStops(newStops);
      setSelectedStopId('');
    }
  };

  // Remove stop from route
  const handleRemoveStop = (stopId: string) => {
    setAssignedStops(assignedStops.filter(id => id !== stopId));
  };

  // Move stop up in order
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newStops = [...assignedStops];
      [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
      setAssignedStops(newStops);
    }
  };

  // Move stop down in order
  const handleMoveDown = (index: number) => {
    if (index < assignedStops.length - 1) {
      const newStops = [...assignedStops];
      [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
      setAssignedStops(newStops);
    }
  };

  // Save assignment
  const handleSave = () => {
    if (selectedBusId) {
      onAssignStops(selectedBusId, assignedStops);
    }
  };

  const getStopById = (stopId: string) => stops.find(s => s.id === stopId);
  const availableStops = stops.filter(stop => !assignedStops.includes(stop.id));

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <MapPin className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="font-semibold text-xl">Asignar Paradas a Bus</h2>
          <p className="text-sm text-slate-600">
            Configure el recorrido del bus seleccionando sus paradas
          </p>
        </div>
      </div>

      {/* Bus Selection */}
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Seleccionar Bus <span className="text-red-500">*</span>
          </label>
          <Select value={selectedBusId} onValueChange={handleBusSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar un bus..." />
            </SelectTrigger>
            <SelectContent>
              {buses.map((bus) => (
                <SelectItem key={bus.id} value={bus.id}>
                  <div className="flex items-center gap-2">
                    <Bus className="w-4 h-4" />
                    Bus {bus.number} - {bus.licensePlate}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedBus && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Bus className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">
                Bus {selectedBus.number}
              </span>
            </div>
            <div className="text-sm text-blue-700">
              Placa: {selectedBus.licensePlate} | Tipo:{' '}
              {selectedBus.type === 'express' ? 'Expreso' : 
               selectedBus.type === 'local' ? 'Local' : 'Shuttle'}
            </div>
          </div>
        )}
      </div>

      {selectedBusId && (
        <>
          {/* Add Stop Section */}
          <div className="space-y-4 mb-6">
            <div className="flex gap-2">
              <div className="flex-1">
                <Select value={selectedStopId} onValueChange={setSelectedStopId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar parada para agregar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStops.map((stop) => (
                      <SelectItem key={stop.id} value={stop.id}>
                        {stop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddStop}
                disabled={!selectedStopId}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>

          {/* Assigned Stops List */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Recorrido del Bus</h3>
              <Badge variant="outline">
                {assignedStops.length} paradas
              </Badge>
            </div>

            {assignedStops.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">
                  No hay paradas asignadas
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Agregue paradas al recorrido
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {assignedStops.map((stopId, index) => {
                  const stop = getStopById(stopId);
                  if (!stop) return null;

                  return (
                    <div
                      key={stopId}
                      className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{stop.name}</div>
                        <div className="text-xs text-slate-500">
                          {stop.address || `${stop.location.lat}, ${stop.location.lng}`}
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === assignedStops.length - 1}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveStop(stopId)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full"
            disabled={assignedStops.length === 0}
          >
            Guardar Recorrido
          </Button>
        </>
      )}

      {!selectedBusId && (
        <div className="text-center py-8 text-slate-500">
          Seleccione un bus para configurar su recorrido
        </div>
      )}
    </Card>
  );
}
