import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lesson, NewLesson } from "@/components/student/types/lesson";
import { Class } from "@/hooks/teacher/useDashboardData";

export const addLesson = async (
  newLesson: NewLesson,
  teacherId: string,
  availableClasses: Class[],
  currentLessons: Lesson[]
): Promise<Lesson[]> => {
  try {
    // console.log("Adding lesson:", newLesson);
    
    // Generate a mock ID for the new lesson
    const mockId = Math.random().toString(36).substring(2, 11);
    
    // Find the class name from the class ID
    const classInfo = availableClasses.find(c => c.id === newLesson.classId);
    
    // Create the new lesson object
    const lesson: Lesson = {
      id: mockId,
      title: newLesson.title,
      description: newLesson.description,
      youtubeUrl: newLesson.youtubeUrl,
      date: newLesson.date,
      class: classInfo?.name || "Unknown Class",
      class_id: newLesson.classId,
      visibility: newLesson.visibility || 'class_only'
    };
    
    // Add the new lesson to the current lessons array
    const updatedLessons = [...currentLessons, lesson];
    
    // Show a success message
    toast({
      title: "Aula adicionada",
      description: "A nova aula foi adicionada com sucesso.",
    });
    
    return updatedLessons;
  } catch (error: any) {
    
    toast({
      title: "Erro ao adicionar aula",
      description: error.message || "Ocorreu um erro ao adicionar a aula.",
      variant: "destructive",
    });
    throw error;
  }
};

export const deleteLesson = async (
  id: string,
  currentLessons: Lesson[]
): Promise<Lesson[]> => {
  try {
    // console.log("Deleting lesson:", id);
    
    // Remove the lesson from the current lessons array
    const updatedLessons = currentLessons.filter(lesson => lesson.id !== id);
    
    // Show a success message
    toast({
      title: "Aula removida",
      description: "A aula foi removida com sucesso.",
    });
    
    return updatedLessons;
  } catch (error: any) {
    
    toast({
      title: "Erro ao remover aula",
      description: error.message || "Ocorreu um erro ao remover a aula.",
      variant: "destructive",
    });
    throw error;
  }
};

export const editLesson = async (
  id: string,
  updatedLesson: NewLesson,
  availableClasses: Class[],
  currentLessons: Lesson[]
): Promise<Lesson[]> => {
  try {
    // Find the class name from the class ID
    const classInfo = availableClasses.find(c => c.id === updatedLesson.classId);
    
    // Find and update the lesson
    const updatedLessons = currentLessons.map(lesson => {
      if (lesson.id === id) {
        return {
          ...lesson,
          title: updatedLesson.title,
          description: updatedLesson.description,
          youtubeUrl: updatedLesson.youtubeUrl,
          class: classInfo?.name || lesson.class,
          class_id: updatedLesson.classId,
          visibility: updatedLesson.visibility
        };
      }
      return lesson;
    });
    
    // Show a success message
    toast({
      title: "Aula atualizada",
      description: "A aula foi atualizada com sucesso.",
    });
    
    return updatedLessons;
  } catch (error: any) {
    
    toast({
      title: "Erro ao atualizar aula",
      description: error.message || "Ocorreu um erro ao atualizar a aula.",
      variant: "destructive",
    });
    throw error;
  }
};
