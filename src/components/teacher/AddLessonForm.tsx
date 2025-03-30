
import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter,
  SheetClose 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface AddLessonFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLesson: (lesson: NewLesson) => void;
  availableClasses: string[];
}

interface NewLesson {
  title: string;
  description: string;
  youtubeUrl: string;
  date: string;
  class: string;
  visibility: 'all' | 'class_only';
}

const AddLessonForm: React.FC<AddLessonFormProps> = ({ 
  isOpen, 
  onOpenChange, 
  onAddLesson, 
  availableClasses 
}) => {
  const [newLesson, setNewLesson] = useState<NewLesson>({
    title: '',
    description: '',
    youtubeUrl: '',
    date: '',
    class: availableClasses[0] || '',
    visibility: 'class_only'
  });

  // Função para validar URL do YouTube
  const isValidYoutubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  };

  const handleAddLesson = () => {
    if (!newLesson.title || !newLesson.youtubeUrl || !newLesson.date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidYoutubeUrl(newLesson.youtubeUrl)) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida do YouTube.",
        variant: "destructive"
      });
      return;
    }

    onAddLesson(newLesson);
    
    // Reset form
    setNewLesson({
      title: '',
      description: '',
      youtubeUrl: '',
      date: '',
      class: availableClasses[0] || '',
      visibility: 'class_only'
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Adicionar Nova Aula</SheetTitle>
          <SheetDescription>
            Adicione uma nova aula em vídeo para seus alunos.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Aula *</Label>
            <Input 
              id="title" 
              placeholder="Digite o título da aula" 
              value={newLesson.title}
              onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input 
              id="description" 
              placeholder="Descrição breve do conteúdo" 
              value={newLesson.description}
              onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube-url">Link do YouTube *</Label>
            <Input 
              id="youtube-url" 
              placeholder="https://youtube.com/watch?v=..." 
              value={newLesson.youtubeUrl}
              onChange={(e) => setNewLesson({...newLesson, youtubeUrl: e.target.value})}
            />
            <p className="text-xs text-gray-500">Cole o link do vídeo não listado do YouTube</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Data da Aula *</Label>
            <Input 
              id="date" 
              type="date" 
              value={newLesson.date}
              onChange={(e) => setNewLesson({...newLesson, date: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="class">Turma *</Label>
            <Select 
              value={newLesson.class} 
              onValueChange={(value) => setNewLesson({...newLesson, class: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.map(className => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibilidade *</Label>
            <Select 
              value={newLesson.visibility} 
              onValueChange={(value: 'all' | 'class_only') => 
                setNewLesson({...newLesson, visibility: value})
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a visibilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class_only">Apenas para a turma selecionada</SelectItem>
                <SelectItem value="all">Para todas as turmas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancelar</Button>
          </SheetClose>
          <Button onClick={handleAddLesson}>Adicionar Aula</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddLessonForm;
