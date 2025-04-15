
import React from "react";
import { Card } from "@/components/ui/card";
import AddTeacherDialog from "./teacher/AddTeacherDialog";
import AddClassDialog from "./class/AddClassDialog";

interface DashboardActionsProps {
  onTeacherAdded: () => void;
  onClassAdded: () => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({
  onTeacherAdded,
  onClassAdded,
}) => {
  return (
    <Card className="p-4 mb-6 flex gap-4 items-center">
      <AddTeacherDialog onTeacherAdded={onTeacherAdded} />
      <AddClassDialog onClassAdded={onClassAdded} />
    </Card>
  );
};

export default DashboardActions;
