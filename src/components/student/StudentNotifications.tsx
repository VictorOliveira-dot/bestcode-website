
import React from "react";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface StudentNotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const StudentNotifications: React.FC<StudentNotificationsProps> = ({
  notifications,
  onMarkAsRead
}) => {
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Bell className="h-5 w-5 text-bestcode-600" />
          Notificações
        </CardTitle>
        <span className="text-sm text-gray-500">
          {notifications.filter(n => !n.read).length} não lidas
        </span>
      </CardHeader>
      <CardContent>
        {sortedNotifications.length > 0 ? (
          <div className="space-y-3 max-h-[350px] sm:max-h-[400px] overflow-y-auto pr-2">
            {sortedNotifications.map(notification => (
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
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            Nenhuma notificação disponível
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentNotifications;
