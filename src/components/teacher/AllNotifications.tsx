import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { Notification } from "../../components/student/types/notification";

interface AllNotificationsTabProps {
  notifications?: Notification[]; // opcional
}

const AllNotificationsTab: React.FC<AllNotificationsTabProps> = ({
  notifications = [], // valor padrão array vazio
}) => {
  const [searchNotifications, setSearchNotifications] = useState("");

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

  const filteredNotifications = sortedNotifications.filter(n =>
    n.title.toLowerCase().includes(searchNotifications.toLowerCase()) ||
    n.message.toLowerCase().includes(searchNotifications.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todas as notificações</CardTitle>
        
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Buscar por notificação"
          value={searchNotifications}
          onChange={(e) => setSearchNotifications(e.target.value)}
        />
        <div className="rounded-md border mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((n) => (
                <TableRow key={n.id}>
                  <TableCell>{n.title}</TableCell>
                  <TableCell>{n.message}</TableCell>
                  <TableCell>{new Date(n.date).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllNotificationsTab;