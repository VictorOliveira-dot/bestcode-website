
export interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  class: string;
  class_id?: string;
  visibility: 'all' | 'class_only';
}

export interface LessonProgress {
  lessonId: string;
  watchTimeMinutes: number;
  lastWatched: string | null;
  progress: number;
  status: 'completed' | 'in_progress' | 'not_started';
}

// Type for new lessons when adding
export interface NewLesson {
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  class_id: string;
  visibility: 'all' | 'class_only';
}
