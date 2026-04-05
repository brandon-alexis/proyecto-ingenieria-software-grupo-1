import { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { notificationService, Notification } from '../services/notificationService';
import { authService } from '../services/authService';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (currentUser && isOpen) {
      loadNotifications();
    }
  }, [currentUser, isOpen]);

  const loadNotifications = () => {
    if (!currentUser) return;
    const userNotifications = notificationService.getNotifications(currentUser.id);
    setNotifications(userNotifications);
  };

  const handleMarkAsRead = (notificationId: string) => {
    if (!currentUser) return;
    notificationService.markAsRead(currentUser.id, notificationId);
    loadNotifications();
  };

  const handleDelete = (notificationId: string) => {
    if (!currentUser) return;
    notificationService.deleteNotification(currentUser.id, notificationId);
    loadNotifications();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'delay':
        return '⏰';
      case 'arrival':
        return '🚌';
      case 'incident':
        return '⚠️';
      case 'payment':
        return '💳';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'delay':
        return 'text-orange-600';
      case 'arrival':
        return 'text-green-600';
      case 'incident':
        return 'text-red-600';
      case 'payment':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[1200] flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold">Notificaciones</h2>
              {notifications.filter(n => !n.read).length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay notificaciones</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${
                  notification.read ? 'bg-slate-50 border-slate-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm ${getNotificationColor(notification.type)}`}>
                      {notification.title}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-1 h-6 w-6"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(notification.id)}
                      className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}