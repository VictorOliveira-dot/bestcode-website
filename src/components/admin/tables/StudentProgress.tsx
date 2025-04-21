
import React from "react";
import { Progress } from "@/components/ui/progress";

interface StudentProgressProps {
  completedLessons: number;
  totalLessons: number;
  progress: number;
}

const StudentProgress: React.FC<StudentProgressProps> = ({
  completedLessons,
  totalLessons,
  progress
}) => {
  return (
    <div className="flex items-center gap-2">
      <Progress value={progress} className="w-[100px] h-2" />
      <span className="text-xs">
        {completedLessons}/{totalLessons} ({Math.round(progress)}%)
      </span>
    </div>
  );
};

export default StudentProgress;
