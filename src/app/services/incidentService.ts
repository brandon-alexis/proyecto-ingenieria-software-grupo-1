export type IncidentType = 'mechanical' | 'traffic' | 'passenger' | 'driver' | 'other';

export interface Incident {
  id: string;
  type: IncidentType;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'resolved';
  reportedBy: string; // user ID
  busId?: string;
  driverId?: string;
  stopId?: string;
  routeId?: string;
  location?: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface IncidentReport {
  type: IncidentType;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  busId?: string;
  driverId?: string;
  stopId?: string;
  routeId?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

// Simulated incident service
export const incidentService = {
  // Get all incidents
  getAllIncidents: (): Incident[] => {
    const incidents = localStorage.getItem('bus_tracker_incidents');
    return incidents ? JSON.parse(incidents) : [];
  },

  // Get incident by ID
  getIncidentById: (id: string): Incident | null => {
    const incidents = incidentService.getAllIncidents();
    return incidents.find(incident => incident.id === id) || null;
  },

  // Report new incident
  reportIncident: (report: IncidentReport, reportedBy: string): Incident => {
    const incidents = incidentService.getAllIncidents();

    const newIncident: Incident = {
      id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...report,
      status: 'reported',
      reportedBy,
      timestamp: new Date().toISOString(),
    };

    incidents.push(newIncident);
    localStorage.setItem('bus_tracker_incidents', JSON.stringify(incidents));

    return newIncident;
  },

  // Update incident status
  updateIncidentStatus: (id: string, status: Incident['status'], resolution?: string): Incident | null => {
    const incidents = incidentService.getAllIncidents();
    const incident = incidents.find(i => i.id === id);

    if (!incident) return null;

    incident.status = status;
    if (status === 'resolved') {
      incident.resolvedAt = new Date().toISOString();
      incident.resolution = resolution;
    }

    localStorage.setItem('bus_tracker_incidents', JSON.stringify(incidents));
    return incident;
  },

  // Get incidents by status
  getIncidentsByStatus: (status: Incident['status']): Incident[] => {
    const incidents = incidentService.getAllIncidents();
    return incidents.filter(incident => incident.status === status);
  },

  // Get incidents by type
  getIncidentsByType: (type: IncidentType): Incident[] => {
    const incidents = incidentService.getAllIncidents();
    return incidents.filter(incident => incident.type === type);
  },

  // Get incidents by bus
  getIncidentsByBus: (busId: string): Incident[] => {
    const incidents = incidentService.getAllIncidents();
    return incidents.filter(incident => incident.busId === busId);
  },

  // Get incidents by driver
  getIncidentsByDriver: (driverId: string): Incident[] => {
    const incidents = incidentService.getAllIncidents();
    return incidents.filter(incident => incident.driverId === driverId);
  },

  // Get active incidents (not resolved)
  getActiveIncidents: (): Incident[] => {
    const incidents = incidentService.getAllIncidents();
    return incidents.filter(incident => incident.status !== 'resolved');
  },

  // Get incident statistics
  getIncidentStats: (): {
    total: number;
    byType: Record<IncidentType, number>;
    byStatus: Record<Incident['status'], number>;
    bySeverity: Record<Incident['severity'], number>;
  } => {
    const incidents = incidentService.getAllIncidents();

    const byType: Record<IncidentType, number> = {
      mechanical: 0,
      traffic: 0,
      passenger: 0,
      driver: 0,
      other: 0,
    };

    const byStatus: Record<Incident['status'], number> = {
      reported: 0,
      investigating: 0,
      resolved: 0,
    };

    const bySeverity: Record<Incident['severity'], number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    incidents.forEach(incident => {
      byType[incident.type]++;
      byStatus[incident.status]++;
      bySeverity[incident.severity]++;
    });

    return {
      total: incidents.length,
      byType,
      byStatus,
      bySeverity,
    };
  },

  // Validate incident report
  validateIncidentReport: (report: IncidentReport): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!report.description.trim()) {
      errors.push('La descripción es requerida');
    }

    if (report.description.length < 10) {
      errors.push('La descripción debe tener al menos 10 caracteres');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};