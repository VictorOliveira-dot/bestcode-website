
export interface LessonProgress {
  lessonId: string;
  watchTimeMinutes: number;
  lastWatched: string | null;
  progress: number; // Percentage of completion
  status: 'completed' | 'in_progress' | 'not_started';
}

export interface StudentLessonProps {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  class: string;
  visibility: 'all' | 'class_only';
}

export interface StudentNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}
