
import { useSupabaseBase } from './useSupabaseBase';
import { supabase } from '@/lib/supabase';

export const useSupabaseLessons = () => {
  const { loading, error, setLoading, setError } = useSupabaseBase();

  // Function to fetch lessons
  const fetchLessons = async (classId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('lessons')
        .select('*')
        .order('order', { ascending: true });
        
      if (classId) {
        query = query.eq('class_id', classId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Function to update lesson progress
  const updateLessonProgress = async (
    studentId: string, 
    lessonId: string, 
    watchTimeMinutes: number, 
    progress: number
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if record already exists
      const { data: existingData, error: fetchError } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      
      const status = progress >= 100 ? 'completed' : 'in_progress';
      const now = new Date().toISOString();
      
      if (existingData) {
        // Update existing progress
        const { error } = await supabase
          .from('lesson_progress')
          .update({
            watch_time_minutes: watchTimeMinutes,
            progress,
            status,
            last_watched: now,
            updated_at: now
          })
          .eq('id', existingData.id);
          
        if (error) throw error;
      } else {
        // Create new progress
        const { error } = await supabase
          .from('lesson_progress')
          .insert([{
            student_id: studentId,
            lesson_id: lessonId,
            watch_time_minutes: watchTimeMinutes,
            progress,
            status,
            last_watched: now
          }]);
          
        if (error) throw error;
      }
      
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch lesson progress
  const fetchLessonProgress = async (studentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('student_id', studentId);
        
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchLessons,
    updateLessonProgress,
    fetchLessonProgress,
    loading,
    error
  };
};
