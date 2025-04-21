
// Define types for lessons

export interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  class: string;
  class_id: string;
  visibility: 'all' | 'class_only';
}

export interface NewLesson {
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  classId: string;
  visibility: 'all' | 'class_only';
}
