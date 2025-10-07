
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLessonNotifications } from "@/hooks/teacher/useLessonNotifications";

interface Class {
  id: string;
  name: string;
}

interface AddLessonFormProps {
  availableClasses: Class[];
  onSuccess?: () => void;
}

const AddLessonForm: React.FC<AddLessonFormProps> = ({ 
  availableClasses, 
  onSuccess 
}) => {
  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    date: getCurrentDate(),
    classId: "",
    visibility: "class_only"
  });

  const queryClient = useQueryClient();
  const { createLessonNotification } = useLessonNotifications();

  const createLessonMutation = useMutation({
    mutationFn: async (lessonData: typeof formData) => {
      
      const { data, error } = await supabase
        .rpc('create_lesson', {
          p_title: lessonData.title,
          p_description: lessonData.description,
          p_youtube_url: lessonData.youtubeUrl,
          p_date: lessonData.date,
          p_class_id: lessonData.classId,
          p_visibility: lessonData.visibility
        });

      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: async (lessonId) => {
      
      // Find the class name for the notification
      const selectedClass = availableClasses.find(cls => cls.id === formData.classId);
      
      if (selectedClass) {
        // Create notifications for students
        try {
          await createLessonNotification({
            lessonTitle: formData.title,
            className: selectedClass.name,
            classId: formData.classId
          });
        } catch (error) {
          // Don't fail the whole operation if notifications fail
        }
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["teacherLessons"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      
      toast({
        title: "Aula criada com sucesso!",
        description: "A aula foi adicionada e os alunos foram notificados.",
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        youtubeUrl: "",
        date: getCurrentDate(),
        classId: "",
        visibility: "class_only"
      });
      
      // Call success callback
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar aula",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (createLessonMutation.isPending) {
      return;
    }
    
    if (!formData.title || !formData.description || !formData.youtubeUrl || !formData.date || !formData.classId) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    createLessonMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título da Aula</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Digite o título da aula"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descreva o conteúdo da aula"
          required
        />
      </div>

      <div>
        <Label htmlFor="youtubeUrl">URL do YouTube</Label>
        <Input
          id="youtubeUrl"
          value={formData.youtubeUrl}
          onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
          required
        />
      </div>

      <div>
        <Label htmlFor="date">Data da Aula</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="classId">Turma</Label>
        <Select
          value={formData.classId}
          onValueChange={(value) => setFormData({ ...formData, classId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma turma" />
          </SelectTrigger>
          <SelectContent>
            {availableClasses.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="visibility">Visibilidade</Label>
        <Select
          value={formData.visibility}
          onValueChange={(value) => setFormData({ ...formData, visibility: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="class_only">Apenas para a turma</SelectItem>
            <SelectItem value="all">Para todas as turmas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={createLessonMutation.isPending}
      >
        {createLessonMutation.isPending ? "Criando..." : "Criar Aula"}
      </Button>
    </form>
  );
};

export default AddLessonForm;
