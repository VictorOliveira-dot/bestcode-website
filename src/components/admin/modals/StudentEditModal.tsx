
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudentDetails } from "@/hooks/admin/useStudentDetails";
import { useAdminStats } from "@/hooks/admin/useAdminStats";

interface StudentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (values: { classId: string, status: string }) => Promise<void>;
  studentId: string | null;
}

export function StudentEditModal({ isOpen, onClose, onConfirm, studentId }: StudentEditModalProps) {
  const { data: studentDetails } = useStudentDetails(studentId);
  const { allClasses } = useAdminStats();
  
  const form = useForm({
    defaultValues: {
      classId: "",
      status: "",
    }
  });

  useEffect(() => {
    if (studentDetails?.current_classes && studentDetails.current_classes.length > 0) {
      const firstClass = studentDetails.current_classes[0];
      form.setValue("classId", firstClass.class_id);
      form.setValue("status", firstClass.status);
    }
  }, [studentDetails, form]);

  const handleSubmit = async (values: { classId: string, status: string }) => {
    await onConfirm(values);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar Matrícula</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turma</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {allClasses.map((cls) => (
                          <SelectItem key={cls.class_id} value={cls.class_id}>
                            {cls.class_name} - {cls.teacher_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
