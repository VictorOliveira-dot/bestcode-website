
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Lesson, LessonProgress } from "../types/lesson";
import { Notification } from "../types/notification";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useStudentDashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [studentClass, setStudentClass] = useState("");
  const { user } = useAuth();
  
  // Fetch data from Supabase
  useEffect(() => {
    if (!user) return;
    
    const fetchStudentData = async () => {
      try {
        console.log("Fetching student data with user ID:", user.id);
        
        // First, get the student's class by checking enrollments
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('class_id, classes(name)')
          .eq('student_id', user.id)
          .single();
          
        if (enrollmentError && enrollmentError.code !== 'PGRST116') {
          console.error('Error fetching enrollment:', enrollmentError);
          toast({
            title: "Erro ao carregar dados da turma",
            description: "Não foi possível obter dados da sua turma.",
            variant: "destructive",
          });
        }
        
        let classId = null;
        if (enrollmentData) {
          classId = enrollmentData.class_id;
          setStudentClass(enrollmentData.classes?.name || "Não definida");
        } else {
          setStudentClass("Não definida");
        }
        
        // Fetch lessons - RLS will automatically filter lessons the user has access to
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select('*');
          
        if (lessonsError) {
          console.error('Error fetching lessons:', lessonsError);
          toast({
            title: "Erro ao carregar aulas",
            description: "Não foi possível carregar as aulas disponíveis.",
            variant: "destructive",
          });
        } else if (lessonsData) {
          // Transform lessons data to match our Lesson type
          const formattedLessons: Lesson[] = lessonsData.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            date: lesson.date,
            class: studentClass, // Use the class name we fetched earlier
            youtubeUrl: lesson.youtube_url,
            visibility: lesson.visibility === 'all' ? 'all' : 'class_only'
          }));
          
          setLessons(formattedLessons);
        }
        
        // Fetch lesson progress - RLS will automatically filter for current user
        const { data: progressData, error: progressError } = await supabase
          .from('lesson_progress')
          .select('*');
          
        if (progressError) {
          console.error('Error fetching lesson progress:', progressError);
        } else if (progressData) {
          // Transform progress data to match our LessonProgress type
          const formattedProgress: LessonProgress[] = progressData.map(progress => ({
            lessonId: progress.lesson_id,
            progress: progress.progress,
            status: progress.status as 'completed' | 'in_progress' | 'not_started',
            lastWatched: progress.last_watched,
            watchTimeMinutes: progress.watch_time_minutes
          }));
          
          setLessonProgress(formattedProgress);
        }
        
        // Fetch notifications - RLS will automatically filter for current user
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .order('date', { ascending: false });
          
        if (notificationsError) {
          console.error('Error fetching notifications:', notificationsError);
        } else if (notificationsData) {
          // Transform notifications data to match our Notification type
          const formattedNotifications: Notification[] = notificationsData.map(notification => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            date: notification.date,
            read: notification.read
          }));
          
          setNotifications(formattedNotifications);
        }
      } catch (error: any) {
        console.error("Error fetching student data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Ocorreu um erro ao carregar seus dados.",
          variant: "destructive",
        });
      }
    };
    
    fetchStudentData();
  }, [user]);

  // Update lesson progress
  const updateLessonProgress = async (lessonId: string, watchTimeMinutes: number, progress: number) => {
    if (!user) return;
    
    try {
      const status = progress >= 100 ? 'completed' : 'in_progress';
      const now = new Date().toISOString();
      
      // Find existing progress or create a new entry
      const existingIndex = lessonProgress.findIndex(p => p.lessonId === lessonId);
      
      if (existingIndex >= 0) {
        // Update in Supabase
        const { error } = await supabase
          .from('lesson_progress')
          .update({
            watch_time_minutes: watchTimeMinutes,
            progress: progress,
            status: status,
            last_watched: now
          })
          .eq('student_id', user.id)
          .eq('lesson_id', lessonId);
          
        if (error) throw error;
        
        // Update local state
        const updatedProgress = [...lessonProgress];
        updatedProgress[existingIndex] = {
          ...updatedProgress[existingIndex],
          watchTimeMinutes,
          progress,
          status,
          lastWatched: now
        };
        
        setLessonProgress(updatedProgress);
      } else {
        // Create new record in Supabase
        const { data, error } = await supabase
          .from('lesson_progress')
          .insert([{
            student_id: user.id,
            lesson_id: lessonId,
            watch_time_minutes: watchTimeMinutes,
            progress: progress,
            status: status,
            last_watched: now
          }])
          .select()
          .single();
          
        if (error) throw error;
        
        // Add to local state
        if (data) {
          setLessonProgress([...lessonProgress, {
            lessonId: data.lesson_id,
            watchTimeMinutes: data.watch_time_minutes,
            progress: data.progress,
            status: data.status as 'completed' | 'in_progress' | 'not_started',
            lastWatched: data.last_watched
          }]);
        }
      }
    } catch (error: any) {
      console.error("Error updating lesson progress:", error);
      toast({
        title: "Erro ao atualizar progresso",
        description: error.message || "Não foi possível salvar seu progresso.",
        variant: "destructive",
      });
    }
  };

  // Mark notification as read
  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar a notificação como lida.",
        variant: "destructive",
      });
    }
  };

  // Calculate student stats
  const getStudentStats = () => {
    const completedLessons = lessonProgress.filter(progress => progress.status === 'completed').length;
    const inProgressLessons = lessonProgress.filter(progress => progress.status === 'in_progress').length;
    const availableLessons = lessons.length;
    
    // Calculate overall progress percentage
    const overallProgress = availableLessons > 0 
      ? Math.round((completedLessons / availableLessons) * 100) 
      : 0;

    return {
      completedLessons,
      inProgressLessons,
      availableLessons,
      overallProgress
    };
  };

  return {
    lessons,
    lessonProgress,
    notifications,
    studentClass,
    updateLessonProgress,
    handleMarkNotificationAsRead,
    stats: getStudentStats()
  };
}
