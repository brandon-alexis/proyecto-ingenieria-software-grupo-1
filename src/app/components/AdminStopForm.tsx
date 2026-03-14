import { useState } from 'react';
import { MapPin, Save, X } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface AdminStopFormProps {
  onSubmit: (stopData: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    amenities: string[];
  }) => void;
  onCancel?: () => void;
}

export function AdminStopForm({ onSubmit, onCancel }: AdminStopFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    amenities: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la parada es requerido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.lat || isNaN(parseFloat(formData.lat))) {
      newErrors.lat = 'Latitud inválida';
    } else {
      const lat = parseFloat(formData.lat);
      if (lat < -90 || lat > 90) {
        newErrors.lat = 'Latitud debe estar entre -90 y 90';
      }
    }

    if (!formData.lng || isNaN(parseFloat(formData.lng))) {
      newErrors.lng = 'Longitud inválida';
    } else {
      const lng = parseFloat(formData.lng);
      if (lng < -180 || lng > 180) {
        newErrors.lng = 'Longitud debe estar entre -180 y 180';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      const amenitiesList = formData.amenities
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      onSubmit({
        name: formData.name,
        address: formData.address,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        amenities: amenitiesList,
      });

      // Reset form
      setFormData({
        name: '',
        address: '',
        lat: '',
        lng: '',
        amenities: '',
      });
      setErrors({});
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <MapPin className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="font-semibold text-xl">Registrar Nueva Parada</h2>
          <p className="text-sm text-slate-600">Complete la información de la parada</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Stop Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Nombre de la Parada <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Ej: Centro Comercial Plaza"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">
            Dirección <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            placeholder="Ej: Av. Principal 123"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        {/* Location Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lat">
              Latitud <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lat"
              type="number"
              step="any"
              placeholder="Ej: 40.7128"
              value={formData.lat}
              onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
              className={errors.lat ? 'border-red-500' : ''}
            />
            {errors.lat && (
              <p className="text-sm text-red-500">{errors.lat}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lng">
              Longitud <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lng"
              type="number"
              step="any"
              placeholder="Ej: -74.0060"
              value={formData.lng}
              onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
              className={errors.lng ? 'border-red-500' : ''}
            />
            {errors.lng && (
              <p className="text-sm text-red-500">{errors.lng}</p>
            )}
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-2">
          <Label htmlFor="amenities">
            Comodidades (separadas por comas)
          </Label>
          <Input
            id="amenities"
            placeholder="Ej: Banco, Cafetería, WiFi"
            value={formData.amenities}
            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
          />
          <p className="text-xs text-slate-500">
            Ingrese las comodidades disponibles separadas por comas
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Guardar Parada
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
