
export interface StudentProgress {
  id: string;
  name: string;
  email: string;
  className: string;
  lastActivity: string;
  completedLessons: number;
  totalLessons: number;
  progress: number; // Percentage of completion
}

export interface LessonStatus {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'in_progress' | 'not_started';
  watchTimeMinutes: number;
  lastWatch: string | null;
}
