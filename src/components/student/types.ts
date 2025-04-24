
export type Enrollment = {
  id: string;
  class_id: string;
  name: string;
  description: string;
  start_date: string;
  teacher_id: string | null;
};

export type LessonData = {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  class: string;
  class_id: string;
  visibility: 'all' | 'class_only';
};

export type ProgressData = {
  lesson_id: string;
  student_id: string;
  watch_time_minutes: number;
  progress: number;
  status: 'completed' | 'in_progress' | 'not_started';
  last_watched: string;
};

export type NotificationData = {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  user_id: string;
};
