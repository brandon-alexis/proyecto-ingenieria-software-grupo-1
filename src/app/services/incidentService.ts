export type IncidentType = 'accident' | 'mechanical' | 'traffic' | 'passenger' | 'other';

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentType;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'investigating' | 'resolved';
  reportedBy: string; // user ID
  busId?: string;
  location?: string;
  timestamp: string;
  resolvedAt?: string;
}

export interface IncidentReport {
  title: string;
  description: string;
  category: IncidentType;
  severity: 'low' | 'medium' | 'high';
  busId?: string;
  location?: string;
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
      status: 'open',
      reportedBy,
      timestamp: new Date().toISOString(),
    };

    incidents.push(newIncident);
    localStorage.setItem('bus_tracker_incidents', JSON.stringify(incidents));

    return newIncident;
  },

  // Create new incident
  createIncident: (incident: Omit<Incident, 'id'>): Incident => {
    const incidents = incidentService.getAllIncidents();

    const newIncident: Incident = {
      ...incident,
      id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    incidents.push(newIncident);
    localStorage.setItem('bus_tracker_incidents', JSON.stringify(incidents));

    return newIncident;
  },

  // Delete incident
  deleteIncident: (id: string): boolean => {
    const incidents = incidentService.getAllIncidents();
    const filteredIncidents = incidents.filter(i => i.id !== id);
    
    if (filteredIncidents.length === incidents.length) return false;
    
    localStorage.setItem('bus_tracker_incidents', JSON.stringify(filteredIncidents));
    return true;
  },

  // Get incidents by reporter
  getIncidentsByReporter: (reporterId: string): Incident[] => {
    const incidents = incidentService.getAllIncidents();
    return incidents.filter(incident => incident.reportedBy === reporterId);
  },

  // Update incident status
  updateIncidentStatus: (id: string, status: Incident['status'], resolution?: string): Incident | null => {
    const incidents = incidentService.getAllIncidents();
    const incident = incidents.find(i => i.id === id);

    if (!incident) return null;

    incident.status = status;
    if (status === 'resolved') {
      incident.resolvedAt = new Date().toISOString();
    }

    localStorage.setItem('bus_tracker_incidents', JSON.stringify(incidents));
    return incident;
  },

  // Get incidents by status
  getIncidentsByStatus: (status: Incident['status']): Incident[] => {
    const incidents = incidentService.getAllIncidents();
    return incidents.filter(incident => incident.status === status);
  },

  // Get incidents by category
  getIncidentsByCategory: (category: IncidentType): Incident[] => {
    const incidents = incidentService.getAllIncidents();
    return incidents.filter(incident => incident.category === category);
  },

  // Get incidents by bus
  getIncidentsByBus: (busId: string): Incident[] => {
    const incidents = incidentService.getAllIncidents();
    return incidents.filter(incident => incident.busId === busId);
  },

  // Get active incidents (not resolved)
  getActiveIncidents: (): Incident[] => {
    const incidents = incidentService.getAllIncidents();
    return incidents.filter(incident => incident.status !== 'resolved');
  },

  // Get incident statistics
  getIncidentStats: (): {
    total: number;
    byCategory: Record<IncidentType, number>;
    byStatus: Record<Incident['status'], number>;
    bySeverity: Record<Incident['severity'], number>;
  } => {
    const incidents = incidentService.getAllIncidents();

    const byCategory: Record<IncidentType, number> = {
      accident: 0,
      mechanical: 0,
      traffic: 0,
      passenger: 0,
      other: 0,
    };

    const byStatus: Record<Incident['status'], number> = {
      open: 0,
      investigating: 0,
      resolved: 0,
    };

    const bySeverity: Record<Incident['severity'], number> = {
      low: 0,
      medium: 0,
      high: 0,
    };

    incidents.forEach(incident => {
      byCategory[incident.category]++;
      byStatus[incident.status]++;
      bySeverity[incident.severity]++;
    });

    return {
      total: incidents.length,
      byCategory,
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