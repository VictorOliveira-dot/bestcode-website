
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Lesson, NewLesson } from "@/components/student/types/lesson";
import { Class } from "@/hooks/teacher/useDashboardData";

export async function addLesson(newLesson: NewLesson, userId: string, availableClasses: Class[], lessons: Lesson[]) {
  try {
    // Find class name for display
    const classObj = availableClasses.find(c => c.id === newLesson.class_id);
    
    // Insert lesson into the database
    const { data, error } = await supabase
      .from('lessons')
      .insert([{
        title: newLesson.title,
        description: newLesson.description,
        youtube_url: newLesson.youtubeUrl,
        date: newLesson.date,
        class_id: newLesson.class_id,
        visibility: newLesson.visibility
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    if (data) {
      // Create the new lesson with ID
      const newLessonWithId: Lesson = {
        id: data.id,
        title: data.title,
        description: data.description,
        youtubeUrl: data.youtube_url,
        date: data.date,
        class: classObj?.name || 'Sem turma',
        class_id: data.class_id,
        visibility: data.visibility === 'all' ? 'all' : 'class_only'
      };
      
      toast({
        title: "Aula adicionada",
        description: "Aula foi adicionada com sucesso."
      });
      
      return [...lessons, newLessonWithId];
    }
    
    return lessons;
  } catch (error: any) {
    console.error("Error adding lesson:", error);
    toast({
      title: "Erro ao adicionar aula",
      description: error.message || "Ocorreu um erro ao adicionar a aula.",
      variant: "destructive",
    });
    
    return lessons;
  }
}

export async function deleteLesson(id: string, lessons: Lesson[]) {
  try {
    // Delete lesson from the database
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Remove lesson from local state
    const updatedLessons = lessons.filter(lesson => lesson.id !== id);
    
    toast({
      title: "Aula removida",
      description: "Aula foi removida com sucesso."
    });
    
    return updatedLessons;
  } catch (error: any) {
    console.error("Error deleting lesson:", error);
    toast({
      title: "Erro ao remover aula",
      description: error.message || "Ocorreu um erro ao remover a aula.",
      variant: "destructive",
    });
    
    return lessons;
  }
}
