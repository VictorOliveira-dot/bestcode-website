
import React from "react";
import NotificationItem from "./NotificationItem";
import { Notification } from "./types/notification";

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onMarkAsRead
}) => {
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedNotifications.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">
        Nenhuma notificação disponível
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[350px] sm:max-h-[400px] overflow-y-auto pr-2">
      {sortedNotifications.map(notification => (
        <NotificationItem 
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
};

export default NotificationsList;
