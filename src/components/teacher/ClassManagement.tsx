
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";

interface ClassInfo {
  id: string;
  name: string;
  description: string;
  startDate: string;
  studentsCount: number;
}

const ClassManagement = () => {
  const [classes, setClasses] = useState<ClassInfo[]>(() => {
    const savedClasses = localStorage.getItem('teacher_classes');
    return savedClasses ? JSON.parse(savedClasses) : [
      {
        id: '1',
        name: 'QA-01',
        description: 'Turma de Quality Assurance - Básico',
        startDate: '2023-05-15',
        studentsCount: 12
      },
      {
        id: '2',
        name: 'QA-02',
        description: 'Turma de Quality Assurance - Avançado',
        startDate: '2023-07-10',
        studentsCount: 8
      },
      {
        id: '3',
        name: 'DEV-01',
        description: 'Turma de Desenvolvimento Frontend',
        startDate: '2023-04-05',
        studentsCount: 15
      },
      {
        id: '4',
        name: 'DEV-02',
        description: 'Turma de Desenvolvimento Backend',
        startDate: '2023-06-20',
        studentsCount: 10
      }
    ];
  });

  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    startDate: '',
  });

  // Save classes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('teacher_classes', JSON.stringify(classes));
  }, [classes]);

  const handleAddClass = () => {
    if (!newClass.name || !newClass.description || !newClass.startDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const classWithId = {
      ...newClass,
      id: Date.now().toString(),
      studentsCount: 0 // New class starts with 0 students
    };

    setClasses([...classes, classWithId]);
    setNewClass({ name: '', description: '', startDate: '' });
    setIsAddClassOpen(false);
    
    toast({
      title: "Turma adicionada",
      description: "A turma foi adicionada com sucesso."
    });
  };

  const handleEditClass = () => {
    if (!selectedClass || !selectedClass.name || !selectedClass.description || !selectedClass.startDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const updatedClasses = classes.map(c => 
      c.id === selectedClass.id ? selectedClass : c
    );

    setClasses(updatedClasses);
    setIsEditClassOpen(false);
    
    toast({
      title: "Turma atualizada",
      description: "A turma foi atualizada com sucesso."
    });
  };

  const handleDeleteClass = (id: string) => {
    const updatedClasses = classes.filter(c => c.id !== id);
    setClasses(updatedClasses);
    
    toast({
      title: "Turma removida",
      description: "A turma foi removida com sucesso."
    });
  };

  const openEditDialog = (classInfo: ClassInfo) => {
    setSelectedClass(classInfo);
    setIsEditClassOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciamento de Turmas</h2>
        <Button onClick={() => setIsAddClassOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Turma
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Data de Início</TableHead>
            <TableHead>Alunos</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classInfo) => (
            <TableRow key={classInfo.id}>
              <TableCell className="font-medium">{classInfo.name}</TableCell>
              <TableCell>{classInfo.description}</TableCell>
              <TableCell>{new Date(classInfo.startDate).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>{classInfo.studentsCount} alunos</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openEditDialog(classInfo)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteClass(classInfo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Class Dialog */}
      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Turma</DialogTitle>
            <DialogDescription>
              Preencha os detalhes para criar uma nova turma.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Turma *</Label>
              <Input 
                id="name" 
                value={newClass.name}
                onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                placeholder="Ex: QA-03"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Input 
                id="description" 
                value={newClass.description}
                onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                placeholder="Ex: Turma de Quality Assurance - Intermediário"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input 
                id="startDate" 
                type="date" 
                value={newClass.startDate}
                onChange={(e) => setNewClass({...newClass, startDate: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClassOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddClass}>Adicionar Turma</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={isEditClassOpen} onOpenChange={setIsEditClassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Turma</DialogTitle>
            <DialogDescription>
              Atualize os detalhes da turma.
            </DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome da Turma *</Label>
                <Input 
                  id="edit-name" 
                  value={selectedClass.name}
                  onChange={(e) => setSelectedClass({...selectedClass, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição *</Label>
                <Input 
                  id="edit-description" 
                  value={selectedClass.description}
                  onChange={(e) => setSelectedClass({...selectedClass, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Data de Início *</Label>
                <Input 
                  id="edit-startDate" 
                  type="date" 
                  value={selectedClass.startDate}
                  onChange={(e) => setSelectedClass({...selectedClass, startDate: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditClassOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditClass}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassManagement;
