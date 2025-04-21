
import { useState, useEffect } from "react";
import { User } from "@/contexts/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Lesson, LessonProgress } from "../types/lesson";
import { Notification } from "../types/notification";
import { useAuth } from "@/contexts/auth";

export const useStudentDashboard = () => {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [studentClass, setStudentClass] = useState<string>("");
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. Fetch student's class
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select(`
            class_id,
            classes (
              id,
              name
            )
          `)
          .eq('student_id', user.id)
          .single();

        if (enrollmentError) throw enrollmentError;

        const classInfo = enrollmentData?.classes;
        const className = classInfo ? (classInfo as any).name : "No Class Assigned";
        const classId = classInfo ? (classInfo as any).id : null;
        
        setStudentClass(className);

        // 2. Fetch available lessons for the student's class
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select(`
            id,
            title,
            description,
            youtube_url,
            date,
            class_id,
            visibility
          `)
          .eq('class_id', classId);

        if (lessonsError) throw lessonsError;

        // 3. Fetch lesson progress
        const { data: progressData, error: progressError } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('student_id', user.id);

        if (progressError) throw progressError;

        // 4. Fetch notifications
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (notificationsError) throw notificationsError;

        // Format lessons data
        const formattedLessons = lessonsData.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          youtubeUrl: lesson.youtube_url,
          date: lesson.date,
          class: className,
          class_id: lesson.class_id,
          visibility: lesson.visibility as 'all' | 'class_only'
        }));

        // Format lesson progress data
        const formattedProgress: LessonProgress[] = [];
        
        // Make sure we have a progress entry for every lesson
        formattedLessons.forEach(lesson => {
          const existingProgress = progressData?.find(p => p.lesson_id === lesson.id);
          
          if (existingProgress) {
            formattedProgress.push({
              lessonId: existingProgress.lesson_id,
              watchTimeMinutes: existingProgress.watch_time_minutes,
              lastWatched: existingProgress.last_watched,
              progress: existingProgress.progress,
              status: existingProgress.status as 'completed' | 'in_progress' | 'not_started'
            });
          } else {
            // Create default progress for lessons without progress data
            formattedProgress.push({
              lessonId: lesson.id,
              watchTimeMinutes: 0,
              lastWatched: null,
              progress: 0,
              status: 'not_started'
            });
          }
        });

        // Format notifications
        const formattedNotifications = notificationsData?.map(notification => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          date: notification.date || notification.created_at,
          read: notification.read
        })) || [];

        setLessons(formattedLessons);
        setLessonProgress(formattedProgress);
        setNotifications(formattedNotifications);
      } catch (err: any) {
        console.error("Error fetching student dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const stats = {
    inProgressLessons: lessonProgress.filter(l => l.status === "in_progress").length,
    completedLessons: lessonProgress.filter(l => l.status === "completed").length,
    overallProgress: Math.round(
      (lessonProgress.reduce((acc, lesson) => acc + lesson.progress, 0) / 
      (lessonProgress.length * 100 || 1)) * 100
    ),
    availableLessons: lessons.length,
  };

  const updateLessonProgress = async (lessonId: string, watchTimeMinutes: number, progress: number) => {
    if (!user) return;
    
    try {
      const newStatus = progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "not_started";
      
      // Check if a progress record already exists
      const { data: existingProgress } = await supabase
        .from('lesson_progress')
        .select('id')
        .eq('lesson_id', lessonId)
        .eq('student_id', user.id)
        .single();
        
      if (existingProgress) {
        // Update existing record
        await supabase
          .from('lesson_progress')
          .update({
            watch_time_minutes: watchTimeMinutes,
            progress: progress,
            status: newStatus,
            last_watched: new Date().toISOString()
          })
          .eq('lesson_id', lessonId)
          .eq('student_id', user.id);
      } else {
        // Insert new record
        await supabase
          .from('lesson_progress')
          .insert({
            lesson_id: lessonId,
            student_id: user.id,
            watch_time_minutes: watchTimeMinutes,
            progress: progress,
            status: newStatus,
            last_watched: new Date().toISOString()
          });
      }
      
      // Update local state
      setLessonProgress(prev => prev.map(item => {
        if (item.lessonId === lessonId) {
          return {
            ...item,
            watchTimeMinutes,
            progress,
            status: newStatus as 'completed' | 'in_progress' | 'not_started',
            lastWatched: new Date().toISOString()
          };
        }
        return item;
      }));

      toast({
        title: "Progress updated",
        description: `Your progress in the lesson was updated to ${progress}%.`,
      });
    } catch (err: any) {
      console.error("Error updating lesson progress:", err);
      toast({
        title: "Error",
        description: "Failed to update lesson progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMarkNotificationAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);
        
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id 
            ? { ...notif, read: true } 
            : notif
        )
      );
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
      toast({
        title: "Error",
        description: "Failed to mark notification as read. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    lessons,
    lessonProgress,
    notifications,
    studentClass,
    updateLessonProgress,
    handleMarkNotificationAsRead,
    stats,
    isLoading,
    error
  };
};
