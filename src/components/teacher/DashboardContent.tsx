
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Video, Users } from "lucide-react";
import ClassManagement from "./ClassManagement";
import StudentProgressTracker from "./StudentProgress";
import LessonsPanel from "./LessonsPanel";

interface Lesson {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  class: string;
  visibility: 'all' | 'class_only';
}

interface DashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lessons: Lesson[];
  availableClasses: string[];
  setIsAddLessonOpen: (isOpen: boolean) => void;
  handleDeleteLesson: (id: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  setActiveTab,
  lessons,
  availableClasses,
  setIsAddLessonOpen,
  handleDeleteLesson
}) => {
  return (
    <div className="mt-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Painel de Gestão</CardTitle>
            <CardDescription>Gerenciamento completo do curso</CardDescription>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {activeTab === "lessons" && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full sm:w-auto"
                onClick={() => setIsAddLessonOpen(true)}
              >
                <Video className="h-4 w-4" />
                Nova Aula
              </Button>
            )}
            {activeTab === "classes" && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full sm:w-auto"
                onClick={() => setActiveTab("classes")}
              >
                <Users className="h-4 w-4" />
                Gerenciar Turmas
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lessons" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full sm:w-auto flex flex-col sm:flex-row gap-2 sm:gap-0">
              <TabsTrigger value="lessons" className="w-full sm:w-auto">Aulas</TabsTrigger>
              <TabsTrigger value="classes" className="w-full sm:w-auto">Turmas</TabsTrigger>
              <TabsTrigger value="students" className="w-full sm:w-auto">Alunos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lessons">
              <LessonsPanel 
                lessons={lessons} 
                availableClasses={availableClasses} 
                onDeleteLesson={handleDeleteLesson} 
              />
            </TabsContent>
            
            <TabsContent value="classes">
              <ClassManagement />
            </TabsContent>
            
            <TabsContent value="students">
              <StudentProgressTracker />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
