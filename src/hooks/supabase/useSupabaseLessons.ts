
import { useSupabaseBase } from './useSupabaseBase';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseLessons = () => {
  const { loading, error, setLoading, setError } = useSupabaseBase();

  // Function to fetch all lessons
  const fetchLessons = async (classFilter?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase.from('lessons').select('*');
      
      if (classFilter) {
        query = query.eq('class_id', classFilter);
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch lesson progress for a student
  const fetchLessonProgress = async (studentId: string, lessonId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('lesson_progress')
        .select('*')
        .eq('student_id', studentId);
        
      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
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

  // Function to update a student's lesson progress
  const updateLessonProgress = async (
    studentId: string, 
    lessonId: string, 
    progressData: {
      progress: number;
      watch_time_minutes: number;
      status: 'completed' | 'in_progress' | 'not_started';
    }
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if progress record exists
      const { data: existing } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)
        .single();
      
      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('lesson_progress')
          .update({
            progress: progressData.progress,
            watch_time_minutes: progressData.watch_time_minutes,
            status: progressData.status,
            last_watched: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('student_id', studentId)
          .eq('lesson_id', lessonId);
          
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('lesson_progress')
          .insert([{
            student_id: studentId,
            lesson_id: lessonId,
            progress: progressData.progress,
            watch_time_minutes: progressData.watch_time_minutes,
            status: progressData.status,
            last_watched: new Date().toISOString()
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

  // Function to add a new lesson
  const addLesson = async (lessonData: {
    title: string;
    description: string;
    youtube_url: string;
    date: string;
    class_id: string;
    visibility: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert([lessonData])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a lesson
  const deleteLesson = async (lessonId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);
        
      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchLessons,
    fetchLessonProgress,
    updateLessonProgress,
    addLesson,
    deleteLesson,
    loading,
    error
  };
};
