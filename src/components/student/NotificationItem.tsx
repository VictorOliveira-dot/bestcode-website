
import React from "react";
import { Notification } from "./types/notification";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead
}) => {
  return (
    <div 
      key={notification.id}
      className={`p-3 border rounded-md ${notification.read ? 'bg-gray-50' : 'bg-white border-l-4 border-l-bestcode-600'}`}
      onClick={() => !notification.read && onMarkAsRead(notification.id)}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
        <h4 className="font-medium">{notification.title}</h4>
        <span className="text-xs text-gray-500 sm:ml-2 flex-shrink-0">
          {new Date(notification.date).toLocaleDateString('pt-BR')}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
      {!notification.read && (
        <div className="mt-2 text-right">
          <span className="text-xs text-bestcode-600 cursor-pointer hover:underline">
            Marcar como lida
          </span>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
