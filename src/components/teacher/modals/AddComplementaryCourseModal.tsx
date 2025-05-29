
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useComplementaryCourses, CreateCourseData } from "@/hooks/teacher/useComplementaryCourses";

interface AddComplementaryCourseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddComplementaryCourseModal: React.FC<AddComplementaryCourseModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const { createCourse, isCreating } = useComplementaryCourses();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCourseData>();

  const onSubmit = async (data: CreateCourseData) => {
    createCourse(data);
    reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Adicionar Curso Complementar</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Curso*</Label>
            <Input
              id="title"
              {...register("title", { 
                required: "Título é obrigatório",
                minLength: { value: 3, message: "Título deve ter pelo menos 3 caracteres" }
              })}
              placeholder="Ex: Introdução ao React"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição*</Label>
            <Textarea
              id="description"
              {...register("description", { 
                required: "Descrição é obrigatória",
                minLength: { value: 10, message: "Descrição deve ter pelo menos 10 caracteres" }
              })}
              placeholder="Descreva o que os alunos aprenderão neste curso complementar..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">URL do YouTube*</Label>
            <Input
              id="youtubeUrl"
              {...register("youtubeUrl", { 
                required: "URL do YouTube é obrigatória",
                pattern: {
                  value: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/).+/,
                  message: "URL do YouTube inválida"
                }
              })}
              placeholder="https://youtube.com/watch?v=..."
            />
            {errors.youtubeUrl && (
              <p className="text-sm text-red-600">{errors.youtubeUrl.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Criando..." : "Criar Curso"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddComplementaryCourseModal;
