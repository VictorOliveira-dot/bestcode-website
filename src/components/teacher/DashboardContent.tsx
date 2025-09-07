import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, UserPlus, Users, BookOpen, Bell, Settings } from "lucide-react";
import LessonsPanel from "./LessonsPanel";
import ClassManagement from "./ClassManagement";
import AllClassesView from "./AllClassesView";
import StudentProgress from "./StudentProgress";
import AllStudentsTab from "./AllStudentsTab";
import ComplementaryCoursesPanel from "./ComplementaryCoursesPanel";
import { EnrollStudentToClassModal } from "./modals/EnrollStudentToClassModal";
import { SendNotificationModal } from "./modals/SendNotificationModal";
import  AllNotificationsTab  from "./AllNotifications";
import AddComplementaryCourseModal from "./modals/AddComplementaryCourseModal";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";
import { useNavigate } from "react-router-dom";
import { Notification } from "../../components/student/types/notification"

interface DashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lessons: any[];
  availableClasses: any[];
  setIsAddLessonOpen: (open: boolean) => void;
  handleDeleteLesson: (lessonId: string) => void;
  handleEditLesson: (lessonId: string, updatedLesson: any) => void;
  isLoading: boolean;
  notifications: Notification[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  setActiveTab,
  lessons,
  availableClasses,
  setIsAddLessonOpen,
  handleDeleteLesson,
  handleEditLesson,
  isLoading,
  notifications
}) => {
  const navigate = useNavigate();
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const { allStudents } = useTeacherData();

  // Estudantes disponíveis para vincular
  const availableStudents = Array.isArray(allStudents) ? allStudents.map(student => ({
    id: student.id,
    name: student.name,
    email: student.email
  })) : [];

  return (
    <div className="space-y-6">
      {/* Botões de ação global */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
          <Button 
            onClick={() => setIsNotificationModalOpen(true)}
            className="flex items-center gap-2 flex-1 sm:flex-none"
            variant="outline"
            size="sm"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Enviar Notificação</span>
            <span className="sm:hidden">Notificar</span>
          </Button>
          <Button 
            onClick={() => navigate('/profile/edit')}
            className="flex items-center gap-2 flex-1 sm:flex-none"
            variant="outline"
            size="sm"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Editar Perfil</span>
            <span className="sm:hidden">Perfil</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 w-full">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full min-w-fit grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 bg-primary text-primary-foreground">
            <TabsTrigger value="lessons" className="text-xs sm:text-sm">Aulas</TabsTrigger>
            <TabsTrigger value="classes" className="text-xs sm:text-sm">Turmas</TabsTrigger>
            <TabsTrigger value="allClasses" className="hidden sm:flex text-xs sm:text-sm">Todas</TabsTrigger>
            <TabsTrigger value="all-students" className="text-xs sm:text-sm">Alunos</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notif.</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="lessons" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
                <div>
                  <CardTitle>Minhas Aulas</CardTitle>
                </div>
                <Button onClick={() => setIsAddLessonOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Aula
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <LessonsPanel
                lessons={lessons}
                availableClasses={availableClasses}
                onDeleteLesson={handleDeleteLesson}
                onEditLesson={handleEditLesson}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <ClassManagement />
        </TabsContent>

        <TabsContent value="allClasses" className="space-y-4">
          <AllClassesView />
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Status dos Alunos
                  </CardTitle>
                </div>
                <Button onClick={() => setIsEnrollModalOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Vincular Aluno à Turma
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <StudentProgress />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-students" className="space-y-4">
          <AllStudentsTab />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <TabsContent value="notifications" className="space-y-4">
              <AllNotificationsTab notifications={notifications}/>
            </TabsContent>
        </TabsContent>
      </Tabs>


      <EnrollStudentToClassModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        availableStudents={availableStudents}
      />

      <SendNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      <AddComplementaryCourseModal
        isOpen={isAddCourseOpen}
        onOpenChange={setIsAddCourseOpen}
      />
    </div>
  );
};

export default DashboardContent;