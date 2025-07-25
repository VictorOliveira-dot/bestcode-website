
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, UserPlus, Users, BookOpen } from "lucide-react";
import LessonsPanel from "./LessonsPanel";
import ClassManagement from "./ClassManagement";
import AllClassesView from "./AllClassesView";
import StudentProgress from "./StudentProgress";
import ComplementaryCoursesPanel from "./ComplementaryCoursesPanel";
import { EnrollStudentToClassModal } from "./modals/EnrollStudentToClassModal";
import AddComplementaryCourseModal from "./modals/AddComplementaryCourseModal";
import { useTeacherData } from "@/hooks/teacher/useTeacherData";

interface DashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lessons: any[];
  availableClasses: any[];
  setIsAddLessonOpen: (open: boolean) => void;
  handleDeleteLesson: (lessonId: string) => void;
  handleEditLesson: (lessonId: string, updatedLesson: any) => void;
  isLoading: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  setActiveTab,
  lessons,
  availableClasses,
  setIsAddLessonOpen,
  handleDeleteLesson,
  handleEditLesson,
  isLoading
}) => {
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const { allStudents } = useTeacherData();

  // Estudantes disponíveis para vincular
  const availableStudents = Array.isArray(allStudents) ? allStudents.map(student => ({
    id: student.id,
    name: student.name,
    email: student.email
  })) : [];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 space-y-6 flex flex-col gap-3">
      <TabsList className="flex gap-4 w-full grid grid-cols-4 bg-bestcode-600 text-white">
        <TabsTrigger value="lessons">Aulas</TabsTrigger>
        <TabsTrigger value="classes">Minhas Turmas</TabsTrigger>
        <TabsTrigger value="allClasses">Todas as Turmas</TabsTrigger>
        {/* <TabsTrigger value="complementary">Cursos Extras</TabsTrigger> */}
        <TabsTrigger value="students">Alunos</TabsTrigger>
      </TabsList>

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

      <TabsContent value="complementary" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Cursos Complementares
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Crie conteúdo adicional que será visível para todos os alunos
                </p>
              </div>
              <Button onClick={() => setIsAddCourseOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Curso
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ComplementaryCoursesPanel 
              setIsAddCourseOpen={setIsAddCourseOpen}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="students" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestão de Alunos
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

      <EnrollStudentToClassModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        availableStudents={availableStudents}
      />

      <AddComplementaryCourseModal
        isOpen={isAddCourseOpen}
        onOpenChange={setIsAddCourseOpen}
      />
    </Tabs>
  );
};

export default DashboardContent;
