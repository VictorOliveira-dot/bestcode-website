
import React from "react";
import StudentLessonItem from "./StudentLessonItem";
import { Lesson, LessonProgress } from "./types/lesson";

interface LessonsListProps {
  lessons: Lesson[];
  getLessonProgress: (lessonId: string) => LessonProgress;
  onLessonClick: (lesson: Lesson) => void;
  emptyMessage: string;
}

const LessonsList: React.FC<LessonsListProps> = ({
  lessons,
  getLessonProgress,
  onLessonClick,
  emptyMessage
}) => {
  if (lessons.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lessons.map(lesson => (
        <StudentLessonItem
          key={lesson.id}
          lesson={lesson}
          progress={getLessonProgress(lesson.id)}
          onClick={() => onLessonClick(lesson)}
        />
      ))}
    </div>
  );
};

export default LessonsList;
