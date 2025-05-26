
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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllClasses } from "@/hooks/admin/useAllClasses";

interface StudentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (values: { classId: string, status: string }) => Promise<void>;
  studentDetails: {
    current_classes: Array<{
      class_id: string;
      class_name: string;
      status: string;
    }> | null;
  } | null;
}

export function StudentEditModal({ isOpen, onClose, onConfirm, studentDetails }: StudentEditModalProps) {
  const form = useForm({
    defaultValues: {
      classId: "",
      status: "",
    }
  });

  const { allClasses, isLoading: classesLoading } = useAllClasses();

  // Reset form when modal opens with student data
  useEffect(() => {
    if (isOpen && studentDetails?.current_classes?.length) {
      const firstClass = studentDetails.current_classes[0];
      form.reset({
        classId: firstClass.class_id,
        status: firstClass.status,
      });
    }
  }, [isOpen, studentDetails, form]);

  const handleSubmit = async (values: { classId: string, status: string }) => {
    await onConfirm(values);
    onClose();
  };

  // Return null if studentDetails is null
  if (!studentDetails) return null;

  // Ensure current_classes is always an array even if it's null
  const currentClasses = studentDetails.current_classes || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar Matrícula do Aluno</DialogTitle>
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
                      disabled={classesLoading}
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status da Matrícula</FormLabel>
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
                </FormItem>
              )}
            />

            {currentClasses.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium mb-2">Turma atual:</p>
                <p className="text-sm">{currentClasses[0].class_name}</p>
                <p className="text-sm text-muted-foreground">Status: {currentClasses[0].status}</p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={classesLoading}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
