import { useState } from 'react';
import { AlertTriangle, Send, X } from 'lucide-react';
import { incidentService } from '../services/incidentService';
import { authService } from '../services/authService';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface IncidentReportFormProps {
  busId?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export function IncidentReportForm({
  busId,
  onSubmit,
  onCancel
}: IncidentReportFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'accident' as 'accident' | 'mechanical' | 'traffic' | 'passenger' | 'other',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high',
    location: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = authService.getCurrentUser();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

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
      const incident = incidentService.createIncident({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        severity: formData.severity,
        busId: busId || formData.title,
        location: formData.location,
        status: 'open',
        reportedBy: currentUser.id,
        timestamp: new Date().toISOString(),
      });

      alert('Incidente reportado exitosamente');

      // Reset form
      setFormData({
        title: '',
        category: 'accident',
        description: '',
        severity: 'medium',
        location: '',
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
        <div className="space-y-2">
          <Label htmlFor="title">
            Título <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Resumen breve del incidente"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Incident Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Categoría <span className="text-red-500">*</span>
            </Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="accident">Accidente</option>
              <option value="mechanical">Problema Mecánico</option>
              <option value="traffic">Congestión de Tráfico</option>
              <option value="passenger">Problema con Pasajero</option>
              <option value="other">Otro</option>
            </select>
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label htmlFor="severity">
              Severidad <span className="text-red-500">*</span>
            </Label>
            <select
              id="severity"
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Descripción Detallada <span className="text-red-500">*</span>
          </Label>
          <textarea
            id="description"
            placeholder="Describe el incidente en detalle..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación (Opcional)</Label>
          <Input
            id="location"
            type="text"
            placeholder="Calle y número"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        {/* Context Info */}
        {busId && (
          <div className="bg-slate-50 p-3 rounded border">
            <p className="text-sm text-slate-600">
              <strong>Bus reportado:</strong> {busId}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
          </Button>
        </div>
      </form>
    </Card>
  );
}