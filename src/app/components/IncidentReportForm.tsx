import { useState } from 'react';
import { AlertTriangle, Send } from 'lucide-react';
import { incidentService, IncidentType } from '../services/incidentService';
import { authService } from '../services/authService';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface IncidentReportFormProps {
  busId?: string;
  driverId?: string;
  stopId?: string;
  routeId?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export function IncidentReportForm({
  busId,
  driverId,
  stopId,
  routeId,
  onSubmit,
  onCancel
}: IncidentReportFormProps) {
  const [formData, setFormData] = useState({
    type: 'other' as IncidentType,
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = authService.getCurrentUser();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Debe iniciar sesión para reportar incidentes');
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const validation = incidentService.validateIncidentReport({
        type: formData.type,
        description: formData.description,
        severity: formData.severity,
        busId,
        driverId,
        stopId,
        routeId,
      });

      if (!validation.valid) {
        setErrors({ description: validation.errors.join(', ') });
        return;
      }

      const incident = incidentService.reportIncident({
        type: formData.type,
        description: formData.description,
        severity: formData.severity,
        busId,
        driverId,
        stopId,
        routeId,
      }, currentUser.id);

      alert('Incidente reportado exitosamente');

      // Reset form
      setFormData({
        type: 'other',
        description: '',
        severity: 'medium',
      });
      setErrors({});

      onSubmit?.();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al reportar incidente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="font-semibold text-xl">Reportar Incidente</h2>
          <p className="text-sm text-slate-600">Ayúdanos a mejorar el servicio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Incident Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Tipo de Incidente <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value: IncidentType) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mechanical">Problema Mecánico</SelectItem>
                <SelectItem value="traffic">Tráfico</SelectItem>
                <SelectItem value="passenger">Problema con Pasajero</SelectItem>
                <SelectItem value="driver">Problema con Conductor</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label htmlFor="severity">
              Severidad <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.severity}
              onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') =>
                setFormData({ ...formData, severity: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Descripción <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe el incidente en detalle..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Context Info */}
        {(busId || driverId || stopId || routeId) && (
          <div className="bg-slate-50 p-3 rounded border">
            <p className="text-sm text-slate-600">
              <strong>Contexto del reporte:</strong>
              {busId && ` Bus ID: ${busId}`}
              {driverId && ` Conductor ID: ${driverId}`}
              {stopId && ` Parada ID: ${stopId}`}
              {routeId && ` Ruta ID: ${routeId}`}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Enviando...' : 'Reportar Incidente'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}