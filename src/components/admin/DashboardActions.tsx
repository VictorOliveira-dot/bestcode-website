
import React from "react";
import { Card } from "@/components/ui/card";
import AddTeacherDialog from "./teacher/AddTeacherDialog";
import AddClassDialog from "./class/AddClassDialog";
import AddAdminDialog from "./admin/AddAdminDialog";

interface DashboardActionsProps {
  onTeacherAdded: () => void;
  onClassAdded: () => void;
  onAdminAdded: () => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({
  onTeacherAdded,
  onClassAdded,
  onAdminAdded,
}) => {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
        <AddTeacherDialog onTeacherAdded={onTeacherAdded} />
        <AddClassDialog onClassAdded={onClassAdded} />
        <AddAdminDialog onAdminAdded={onAdminAdded} />
      </div>
    </Card>
  );
};

export default DashboardActions;
