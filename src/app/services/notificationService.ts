export type NotificationType = 'delay' | 'arrival' | 'incident' | 'payment' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
  busId?: string;
  stopId?: string;
  routeId?: string;
}

export interface AlertData {
  busId?: string;
  stopId?: string;
  routeId?: string;
  type: NotificationType;
  title: string;
  message: string;
}

// Simulated notification service
export const notificationService = {
  // Get notifications for a user
  getNotifications: (userId: string): Notification[] => {
    const notifications = localStorage.getItem(`notifications_${userId}`);
    return notifications ? JSON.parse(notifications) : [];
  },

  // Add new notification
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification => {
    const newNotification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };

    const notifications = notificationService.getNotifications(notification.userId);
    notifications.unshift(newNotification); // Add to beginning
    localStorage.setItem(`notifications_${notification.userId}`, JSON.stringify(notifications));

    return newNotification;
  },

  // Mark notification as read
  markAsRead: (userId: string, notificationId: string): boolean => {
    const notifications = notificationService.getNotifications(userId);
    const notification = notifications.find(n => n.id === notificationId);

    if (notification) {
      notification.read = true;
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
      return true;
    }

    return false;
  },

  // Delete notification
  deleteNotification: (userId: string, notificationId: string): boolean => {
    const notifications = notificationService.getNotifications(userId);
    const filtered = notifications.filter(n => n.id !== notificationId);

    if (filtered.length < notifications.length) {
      localStorage.setItem(`notifications_${userId}`, JSON.stringify(filtered));
      return true;
    }

    return false;
  },

  // Create delay alert
  createDelayAlert: (busId: string, delayMinutes: number, reason?: string): AlertData => {
    return {
      busId,
      type: 'delay',
      title: 'Retraso en bus',
      message: `El bus tiene un retraso de ${delayMinutes} minutos${reason ? `. Razón: ${reason}` : ''}`,
    };
  },

  // Create arrival alert
  createArrivalAlert: (busId: string, stopId: string, minutesAway: number): AlertData => {
    return {
      busId,
      stopId,
      type: 'arrival',
      title: 'Bus llegando',
      message: `El bus llegará en ${minutesAway} minutos`,
    };
  },

  // Create incident alert
  createIncidentAlert: (busId: string, description: string): AlertData => {
    return {
      busId,
      type: 'incident',
      title: 'Incidente reportado',
      message: `Se ha reportado un incidente: ${description}`,
    };
  },

  // Create payment alert
  createPaymentAlert: (amount: number, success: boolean): AlertData => {
    return {
      type: 'payment',
      title: success ? 'Pago exitoso' : 'Pago fallido',
      message: success ? `Pago de $${amount} procesado correctamente` : `El pago de $${amount} ha fallado`,
    };
  },

  // Get unread count
  getUnreadCount: (userId: string): number => {
    const notifications = notificationService.getNotifications(userId);
    return notifications.filter(n => !n.read).length;
  },

  // Send notification to user (wrapper for addNotification)
  sendNotification: (userId: string, alertData: AlertData): Notification => {
    return notificationService.addNotification({
      userId,
      ...alertData,
    });
  },

  // Bulk send notifications (for broadcasts)
  sendBulkNotifications: (userIds: string[], alertData: AlertData): Notification[] => {
    return userIds.map(userId => notificationService.sendNotification(userId, alertData));
  },
};