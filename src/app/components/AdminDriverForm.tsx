import { useState } from 'react';
import { UserCircle, Save, X } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface AdminDriverFormProps {
  onSubmit: (driverData: {
    name: string;
    licenseNumber: string;
    phone: string;
    email: string;
  }) => void;
  onCancel?: () => void;
}

export function AdminDriverForm({ onSubmit, onCancel }: AdminDriverFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'El número de licencia es requerido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);

      // Reset form
      setFormData({
        name: '',
        licenseNumber: '',
        phone: '',
        email: '',
      });
      setErrors({});
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <UserCircle className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="font-semibold text-xl">Registrar Nuevo Conductor</h2>
          <p className="text-sm text-slate-600">Complete la información del conductor</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ej: Juan Pérez"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* License Number */}
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">
              Número de Licencia <span className="text-red-500">*</span>
            </Label>
            <Input
              id="licenseNumber"
              placeholder="Ej: DL-2023-001"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value.toUpperCase() })}
              className={errors.licenseNumber ? 'border-red-500' : ''}
            />
            {errors.licenseNumber && (
              <p className="text-sm text-red-500">{errors.licenseNumber}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Ej: +1234567890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Ej: conductor@empresa.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Guardar Conductor
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
