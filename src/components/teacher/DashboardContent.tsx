import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Video, Users } from "lucide-react";
import ClassManagement from "./ClassManagement";
import StudentProgressTracker from "./StudentProgress";
import LessonsPanel from "./LessonsPanel";
import { Skeleton } from "@/components/ui/skeleton";

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
  availableClasses: any[];
  setIsAddLessonOpen: (isOpen: boolean) => void;
  handleDeleteLesson: (id: string) => void;
  handleEditLesson: (id: string, updatedLesson: any) => void;
  isLoading?: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  setActiveTab,
  lessons,
  availableClasses,
  setIsAddLessonOpen,
  handleDeleteLesson,
  handleEditLesson,
  isLoading = false
}) => {
  return (
    <div className="mt-8">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 md:p-6">
          <div>
            <CardTitle>Painel de Gestão</CardTitle>
            <CardDescription>Gerenciamento completo do curso</CardDescription>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            {activeTab === "lessons" && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full md:w-auto"
                onClick={() => setIsAddLessonOpen(true)}
              >
                <Video className="h-4 w-4" />
                Nova Aula
              </Button>
            )}
            {activeTab === "classes" && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full md:w-auto"
                onClick={() => {}} // This button wasn't doing anything
              >
                <Users className="h-4 w-4" />
                Gerenciar Turmas
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          <Tabs defaultValue="lessons" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex flex-row mb-4 md:w-auto rounded-none md:rounded-md border-b md:border-0">
              <TabsTrigger 
                value="lessons" 
                className="flex-1 md:flex-none py-3 md:py-1.5 rounded-none md:rounded-md border-b-2 border-transparent data-[state=active]:border-bestcode-600 md:data-[state=active]:border-transparent"
              >
                Aulas
              </TabsTrigger>
              <TabsTrigger 
                value="classes" 
                className="flex-1 md:flex-none py-3 md:py-1.5 rounded-none md:rounded-md border-b-2 border-transparent data-[state=active]:border-bestcode-600 md:data-[state=active]:border-transparent"
              >
                Turmas
              </TabsTrigger>
              <TabsTrigger 
                value="students" 
                className="flex-1 md:flex-none py-3 md:py-1.5 rounded-none md:rounded-md border-b-2 border-transparent data-[state=active]:border-bestcode-600 md:data-[state=active]:border-transparent"
              >
                Alunos
              </TabsTrigger>
            </TabsList>
            
            <div className="p-4 md:p-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <TabsContent value="lessons" className="mt-0">
                    <LessonsPanel 
                      lessons={lessons} 
                      availableClasses={availableClasses} 
                      onDeleteLesson={handleDeleteLesson} 
                      onEditLesson={handleEditLesson}
                    />
                  </TabsContent>
                  
                  <TabsContent value="classes" className="mt-0">
                    <ClassManagement />
                  </TabsContent>
                  
                  <TabsContent value="students" className="mt-0">
                    <StudentProgressTracker />
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
