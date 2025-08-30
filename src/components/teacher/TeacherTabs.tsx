import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, Users, Settings, Plus } from "lucide-react";
import AllStudentsTab from "./AllStudentsTab";
import StudentProgressTracker from "./StudentProgress";
import { SendNotificationModal } from "./modals/SendNotificationModal";
import NotificationsTab from "./NotificationsTab";

interface TeacherTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TeacherTabs = ({ activeTab, setActiveTab }: TeacherTabsProps) => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="grid w-full sm:w-auto grid-cols-3 lg:grid-cols-3">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Progresso dos Alunos</span>
              <span className="sm:hidden">Progresso</span>
            </TabsTrigger>
            <TabsTrigger value="all-students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Todos os Alunos</span>
              <span className="sm:hidden">Alunos</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificações</span>
              <span className="sm:hidden">Notific.</span>
            </TabsTrigger>
          </TabsList>

          <Button 
            onClick={() => setShowNotificationModal(true)}
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Enviar Notificação</span>
            <span className="sm:hidden">Notificar</span>
          </Button>
        </div>

        <TabsContent value="students" className="mt-0">
          <StudentProgressTracker />
        </TabsContent>

        <TabsContent value="all-students" className="mt-0">
          <AllStudentsTab />
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <NotificationsTab />
        </TabsContent>
      </Tabs>

      <SendNotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </>
  );
};

export default TeacherTabs;