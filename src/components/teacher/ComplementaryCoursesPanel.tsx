
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ExternalLink, Calendar, Eye } from "lucide-react";
import { useComplementaryCourses, ComplementaryCourse } from "@/hooks/teacher/useComplementaryCourses";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import AddComplementaryCourseModal from "./modals/AddComplementaryCourseModal";
import EditComplementaryCourseModal from "./modals/EditComplementaryCourseModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ComplementaryCoursesProps {
  setIsAddCourseOpen: (open: boolean) => void;
}

const ComplementaryCoursesPanel: React.FC<ComplementaryCoursesProps> = ({
  setIsAddCourseOpen
}) => {
  const { courses, isLoading, error, deleteCourse, isDeleting } = useComplementaryCourses();
  const [editingCourse, setEditingCourse] = useState<ComplementaryCourse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditCourse = (course: ComplementaryCourse) => {
    setEditingCourse(course);
    setIsEditModalOpen(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    deleteCourse(courseId);
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 border rounded-md bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
        <p className="text-destructive-foreground font-medium">Erro ao carregar cursos complementares</p>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum curso complementar criado
          </h3>
          <p className="text-gray-500 mb-4">
            Crie seu primeiro curso complementar para compartilhar conteúdo adicional com seus alunos.
          </p>
          <Button onClick={() => setIsAddCourseOpen(true)}>
            Criar Primeiro Curso
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const videoId = getYouTubeVideoId(course.youtube_url);
          const thumbnailUrl = videoId 
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : null;

          return (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {thumbnailUrl && (
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img 
                    src={thumbnailUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(course.youtube_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver no YouTube
                    </Button>
                  </div>
                </div>
              )}
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <Badge variant={course.is_active ? "default" : "secondary"}>
                    {course.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar className="h-3 w-3" />
                  {new Date(course.created_at).toLocaleDateString('pt-BR')}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditCourse(course)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir curso complementar</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o curso "{course.title}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <EditComplementaryCourseModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        course={editingCourse}
      />
    </div>
  );
};

export default ComplementaryCoursesPanel;
