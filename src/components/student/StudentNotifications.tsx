
import React from "react";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationsList from "./NotificationsList";
import { Notification } from "./types/notification";

interface StudentNotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const StudentNotifications: React.FC<StudentNotificationsProps> = ({
  notifications,
  onMarkAsRead
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Bell className="h-5 w-5 text-bestcode-600" />
          Notificações
        </CardTitle>
        <span className="text-sm text-gray-500">
          {unreadCount} não lidas
        </span>
      </CardHeader>
      <CardContent>
        <NotificationsList 
          notifications={notifications}
          onMarkAsRead={onMarkAsRead}
        />
      </CardContent>
    </Card>
  );
};

export default StudentNotifications;
