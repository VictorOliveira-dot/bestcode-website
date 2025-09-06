import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTeacherNotifications } from "@/hooks/teacher/useTeacherNotifications";
import { Bell, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const NotificationsTab = () => {
  const [editingNotification, setEditingNotification] = useState<any>(null);
  const [deleteNotificationId, setDeleteNotificationId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const { 
    notifications, 
    isLoading, 
    deleteNotification,
    editNotification
  } = useTeacherNotifications();

  const handleEditClick = (notification: any) => {
    setEditingNotification(notification);
    setEditTitle(notification.title);
    setEditMessage(notification.message);
  };

  const handleSaveEdit = async () => {
    if (!editingNotification || !editTitle.trim() || !editMessage.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e mensagem são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      await editNotification({
        notificationId: editingNotification.id,
        title: editTitle.trim(),
        message: editMessage.trim()
      });
      
      setEditingNotification(null);
      setEditTitle("");
      setEditMessage("");
    } catch (error) {
      console.error('Erro ao editar notificação:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteNotificationId) return;

    try {
      await deleteNotification(deleteNotificationId);
      setDeleteNotificationId(null);
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações Enviadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações Enviadas ({notifications.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma notificação enviada ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{notification.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {format(new Date(notification.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(notification)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteNotificationId(notification.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm bg-muted/30 p-3 rounded">
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Notification Dialog */}
      <Dialog 
        open={!!editingNotification} 
        onOpenChange={(open) => {
          if (!open) {
            setEditingNotification(null);
            setEditTitle("");
            setEditMessage("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Notificação</DialogTitle>
            <DialogDescription>
              Edite o título e mensagem da notificação.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Digite o título da notificação"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem</label>
              <Textarea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                placeholder="Digite a mensagem da notificação"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNotification(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!deleteNotificationId} 
        onOpenChange={(open) => {
          if (!open) setDeleteNotificationId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir notificação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NotificationsTab;