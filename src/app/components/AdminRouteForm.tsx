import { useState } from 'react';
import { Route, Save, X } from 'lucide-react';
import { BusStop } from '../types/bus';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface AdminRouteFormProps {
  stops: BusStop[];
  onSubmit: (routeData: {
    name: string;
    number: string;
    stops: BusStop[];
    color: string;
    frequency: string;
    operatingHours: string;
  }) => void;
  onCancel?: () => void;
}

export function AdminRouteForm({ stops, onSubmit, onCancel }: AdminRouteFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    selectedStopIds: [] as string[],
    color: '#3B82F6',
    frequency: 'Every 15 minutes',
    operatingHours: '5:00 AM - 11:00 PM',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la ruta es requerido';
    }

    if (!formData.number.trim()) {
      newErrors.number = 'El número de ruta es requerido';
    }

    if (formData.selectedStopIds.length < 2) {
      newErrors.stops = 'Debe seleccionar al menos 2 paradas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const selectedStops = formData.selectedStopIds.map(id => stops?.find(s => s.id === id)!).filter(Boolean);

      onSubmit({
        name: formData.name,
        number: formData.number,
        stops: selectedStops,
        color: formData.color,
        frequency: formData.frequency,
        operatingHours: formData.operatingHours,
      });

      // Reset form
      setFormData({
        name: '',
        number: '',
        selectedStopIds: [],
        color: '#3B82F6',
        frequency: 'Every 15 minutes',
        operatingHours: '5:00 AM - 11:00 PM',
      });
      setErrors({});
    }
  };

  const handleStopToggle = (stopId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedStopIds: prev.selectedStopIds.includes(stopId)
        ? prev.selectedStopIds.filter(id => id !== stopId)
        : [...prev.selectedStopIds, stopId]
    }));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Route className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="font-semibold text-xl">Crear Nueva Ruta</h2>
          <p className="text-sm text-slate-600">Complete la información de la ruta</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Route Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre de la Ruta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ej: Express Downtown - Airport"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Route Number */}
          <div className="space-y-2">
            <Label htmlFor="number">
              Número de Ruta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="number"
              placeholder="Ej: A42"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className={errors.number ? 'border-red-500' : ''}
            />
            {errors.number && (
              <p className="text-sm text-red-500">{errors.number}</p>
            )}
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">Color de la Ruta</Label>
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Frecuencia</Label>
            <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Every 5 minutes">Cada 5 minutos</SelectItem>
                <SelectItem value="Every 10 minutes">Cada 10 minutos</SelectItem>
                <SelectItem value="Every 15 minutes">Cada 15 minutos</SelectItem>
                <SelectItem value="Every 20 minutes">Cada 20 minutos</SelectItem>
                <SelectItem value="Every 30 minutes">Cada 30 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Operating Hours */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="operatingHours">Horario de Operación</Label>
            <Input
              id="operatingHours"
              placeholder="Ej: 5:00 AM - 11:00 PM"
              value={formData.operatingHours}
              onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
            />
          </div>
        </div>

        {/* Stops Selection */}
        <div className="space-y-2">
          <Label>
            Paradas de la Ruta <span className="text-red-500">*</span>
          </Label>
          <div className="max-h-48 overflow-y-auto border rounded p-3 space-y-2">
            {stops?.map((stop) => (
              <label key={stop.id} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={formData.selectedStopIds.includes(stop.id)}
                  onChange={() => handleStopToggle(stop.id)}
                  className="rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">{stop.name}</div>
                  <div className="text-sm text-slate-600">{stop.address}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.stops && (
            <p className="text-sm text-red-500">{errors.stops}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Crear Ruta
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}