import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { AlertTriangle, Plus, X } from 'lucide-react';
import { incidentService, Incident } from '../services/incidentService';
import { sileo } from 'sileo';

interface DriverIncidentPanelProps {
  currentUser: User | null;
}

export function DriverIncidentPanel({ currentUser }: DriverIncidentPanelProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'accident' as 'accident' | 'mechanical' | 'traffic' | 'passenger' | 'other',
    severity: 'medium' as 'low' | 'medium' | 'high',
    busId: '',
    location: '',
  });
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (currentUser) {
      const driverIncidents = incidentService.getIncidentsByReporter(currentUser.id);
      setIncidents(driverIncidents);
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.title || !formData.description) {
      setSubmitError('Por favor completa todos los campos requeridos');
      sileo.error({
        title: 'Error de Validación',
        description: 'Por favor completa todos los campos requeridos',
      });
      return;
    }

    try {
      const newIncident = incidentService.createIncident({
        ...formData,
        reportedBy: currentUser?.id || '',
        timestamp: new Date().toISOString(),
        status: 'open',
      });

      setIncidents([...incidents, newIncident]);
      setFormData({
        title: '',
        description: '',
        category: 'accident',
        severity: 'medium',
        busId: '',
        location: '',
      });
      setShowForm(false);
      sileo.success({
        title: 'Incidente Reportado',
        description: 'El incidente ha sido reportado exitosamente',
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Error al crear el reporte');
      sileo.error({
        title: 'Error al Reportar',
        description: error instanceof Error ? error.message : 'Error al crear el reporte',
      });
    }
  };

  const handleResolveIncident = (incidentId: string) => {
    const updated = incidentService.updateIncidentStatus(incidentId, 'resolved');
    if (updated) {
      setIncidents(incidents.map(i => i.id === incidentId ? updated : i));
    }
  };

  const handleDeleteIncident = (incidentId: string) => {
    incidentService.deleteIncident(incidentId);
    setIncidents(incidents.filter(i => i.id !== incidentId));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'accident':
        return '🚗';
      case 'mechanical':
        return '⚙️';
      case 'traffic':
        return '🚦';
      case 'passenger':
        return '👤';
      default:
        return '📋';
    }
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Reportar Incidente
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Breve descripción del incidente"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Descripción Detallada <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="description"
                placeholder="Explica qué sucedió..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="accident">Accidente</option>
                  <option value="mechanical">Mecánico</option>
                  <option value="traffic">Tráfico</option>
                  <option value="passenger">Pasajero</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severidad</Label>
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

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                type="text"
                placeholder="Calle y número (opcional)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="busId">ID del Bus</Label>
              <Input
                id="busId"
                type="text"
                placeholder="ID del bus (opcional)"
                value={formData.busId}
                onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Enviar Reporte
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Mis Reportes</h2>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Reporte
        </Button>
      </div>

      {incidents.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-slate-600">No tienes reportes de incidentes aún</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {incidents.map(incident => (
            <Card key={incident.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-2xl">{getCategoryEmoji(incident.category)}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{incident.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{incident.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(incident.severity)}`}>
                    {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs pt-2 border-t">
                  <div>
                    <p className="text-slate-600">Categoría:</p>
                    <p className="font-semibold capitalize">{incident.category}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Estado:</p>
                    <p className="font-semibold capitalize">{incident.status}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Fecha:</p>
                    <p className="font-semibold">{new Date(incident.timestamp).toLocaleDateString()}</p>
                  </div>
                  {incident.location && (
                    <div>
                      <p className="text-slate-600">Ubicación:</p>
                      <p className="font-semibold">{incident.location}</p>
                    </div>
                  )}
                </div>

                {incident.status !== 'resolved' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleResolveIncident(incident.id)}
                      size="sm"
                      className="flex-1"
                    >
                      Marcar Resuelto
                    </Button>
                    <Button
                      onClick={() => handleDeleteIncident(incident.id)}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
