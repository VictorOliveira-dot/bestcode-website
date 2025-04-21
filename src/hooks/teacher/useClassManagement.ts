
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { ClassInfo } from '@/components/teacher/ClassItem';
import { toast } from '@/hooks/use-toast';

// Mock data for classes
const MOCK_CLASSES: ClassInfo[] = [
  {
    id: "class1",
    name: "Desenvolvimento Web Full Stack",
    description: "Aprenda desenvolvimento web do zero ao avançado",
    startDate: "2023-06-01",
    studentsCount: 15
  },
  {
    id: "class2",
    name: "QA e Testes Automáticos",
    description: "Curso completo sobre testes e automação",
    startDate: "2023-07-15",
    studentsCount: 8
  }
];

export const useClassManagement = () => {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setClasses(MOCK_CLASSES);
    } catch (err: any) {
      setError('Failed to load classes');
      toast({
        title: 'Error loading classes',
        description: 'There was a problem loading your classes',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'teacher' || user?.role === 'admin') {
      fetchClasses();
    }
  }, [user]);

  const handleAddClass = async (classData: { name: string; description: string; startDate: string }) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newClass: ClassInfo = {
        id: Date.now().toString(),
        name: classData.name,
        description: classData.description,
        startDate: classData.startDate,
        studentsCount: 0
      };
      
      setClasses(prev => [...prev, newClass]);
      
      toast({
        title: 'Class added',
        description: 'New class was successfully created'
      });
      
      return true;
    } catch (err: any) {
      toast({
        title: 'Error adding class',
        description: 'There was a problem creating the class',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClass = async (classData: ClassInfo) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClasses(prev => 
        prev.map(c => c.id === classData.id ? classData : c)
      );
      
      toast({
        title: 'Class updated',
        description: 'Class was successfully updated'
      });
      
      return true;
    } catch (err: any) {
      toast({
        title: 'Error updating class',
        description: 'There was a problem updating the class',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return false;
    }
    
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClasses(prev => prev.filter(c => c.id !== classId));
      
      toast({
        title: 'Class deleted',
        description: 'Class was successfully deleted'
      });
      
      return true;
    } catch (err: any) {
      toast({
        title: 'Error deleting class',
        description: 'There was a problem deleting the class',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    classes,
    isLoading,
    error,
    fetchClasses,
    handleAddClass,
    handleEditClass,
    handleDeleteClass
  };
};
