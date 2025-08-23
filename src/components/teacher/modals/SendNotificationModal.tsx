import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell } from "lucide-react";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendNotificationModal({ isOpen, onClose }: SendNotificationModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("all");
  const [selectedClass, setSelectedClass] = useState("");

  const { teacherClasses } = useTeacherData();
  const { 
    sendNotificationToClass, 
    sendNotificationToAllClasses,
    isSendingToClass,
    isSendingToAll
  } = useNotifications();

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      return;
    }

    if (recipient === "class" && !selectedClass) {
      return;
    }

    try {
      if (recipient === "all") {
        await sendNotificationToAllClasses({ title, message });
      } else {
        await sendNotificationToClass({ 
          title, 
          message, 
          classId: selectedClass 
        });
      }

      // Reset form
      setTitle("");
      setMessage("");
      setRecipient("all");
      setSelectedClass("");
      onClose();
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const isPending = isSendingToClass || isSendingToAll;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Enviar Notificação
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Título da notificação"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              placeholder="Digite a mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Destinatários</Label>
            <RadioGroup 
              value={recipient} 
              onValueChange={setRecipient}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">Todas as turmas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="class" id="class" />
                <Label htmlFor="class">Turma específica</Label>
              </div>
            </RadioGroup>
          </div>

          {recipient === "class" && (
            <div className="space-y-2">
              <Label>Selecione a turma</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {teacherClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSend}
            disabled={
              !title.trim() || 
              !message.trim() || 
              (recipient === "class" && !selectedClass) ||
              isPending
            }
          >
            {isPending ? "Enviando..." : "Enviar Notificação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}