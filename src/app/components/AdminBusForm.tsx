import { useState, useEffect } from 'react';
import { Bus, Save, X } from 'lucide-react';
import { Driver } from '../types/bus';
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

interface AdminBusFormProps {
  drivers: Driver[];
  onSubmit: (busData: {
    number: string;
    licensePlate: string;
    capacity: number;
    type: 'express' | 'local' | 'shuttle';
    driverId?: string;
  }) => void;
  onCancel?: () => void;
  initialData?: {
    number: string;
    licensePlate: string;
    capacity: number;
    type: 'express' | 'local' | 'shuttle';
    driverId?: string;
  };
}

export function AdminBusForm({ drivers, onSubmit, onCancel, initialData }: AdminBusFormProps) {
  const [formData, setFormData] = useState({
    number: '',
    licensePlate: '',
    capacity: '',
    type: 'local' as 'express' | 'local' | 'shuttle',
    driverId: 'none',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        number: initialData.number,
        licensePlate: initialData.licensePlate,
        capacity: initialData.capacity.toString(),
        type: initialData.type,
        driverId: initialData.driverId || 'none',
      });
    } else {
      // Reset form when creating new bus
      setFormData({
        number: '',
        licensePlate: '',
        capacity: '',
        type: 'local',
        driverId: 'none',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.number.trim()) {
      newErrors.number = 'El número de bus es requerido';
    }

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'La placa es requerida';
    }

    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'La capacidad debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        number: formData.number,
        licensePlate: formData.licensePlate,
        capacity: parseInt(formData.capacity),
        type: formData.type,
        driverId: formData.driverId === 'none' ? undefined : formData.driverId,
      });

      // Reset form
      setFormData({
        number: '',
        licensePlate: '',
        capacity: '',
        type: 'local',
        driverId: 'none',
      });
      setErrors({});
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Bus className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="font-semibold text-xl">Registrar Nuevo Bus</h2>
          <p className="text-sm text-slate-600">Complete la información del bus</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bus Number */}
          <div className="space-y-2">
            <Label htmlFor="number">
              Número de Bus <span className="text-red-500">*</span>
            </Label>
            <Input
              id="number"
              placeholder="Ej: A42"
              value={formData.number}
              onChange={(e: any) => setFormData({ ...formData, number: e.target.value })}
              className={errors.number ? 'border-red-500' : ''}
            />
            {errors.number && (
              <p className="text-sm text-red-500">{errors.number}</p>
            )}
          </div>

          {/* License Plate */}
          <div className="space-y-2">
            <Label htmlFor="licensePlate">
              Placa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="licensePlate"
              placeholder="Ej: ABC-123"
              value={formData.licensePlate}
              onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
              className={errors.licensePlate ? 'border-red-500' : ''}
              />
            {errors.licensePlate && (
              <p className="text-sm text-red-500">{errors.licensePlate}</p>
            )}
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <Label htmlFor="capacity">
              Capacidad de Pasajeros <span className="text-red-500">*</span>
            </Label>
            <Input
              id="capacity"
              type="number"
              placeholder="Ej: 60"
              min="1"
              value={formData.capacity}
              onChange={(e: any) => setFormData({ ...formData, capacity: e.target.value })}
              className={errors.capacity ? 'border-red-500' : ''}
            />
            {errors.capacity && (
              <p className="text-sm text-red-500">{errors.capacity}</p>
            )}
          </div>

          {/* Bus Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Bus</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'express' | 'local' | 'shuttle') =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="express">Expreso</SelectItem>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="shuttle">Shuttle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Driver Assignment */}
        <div className="space-y-2">
          <Label htmlFor="driver">Conductor Asignado (Opcional)</Label>
          <Select
            value={formData.driverId}
            onValueChange={(value: any) => setFormData({ ...formData, driverId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar conductor..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin conductor asignado</SelectItem>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  {driver.name} - {driver.licenseNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Guardar Bus
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
