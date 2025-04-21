
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { ClassInfo } from '@/components/teacher/ClassItem';
import { toast } from '@/hooks/use-toast';

export const useClassManagement = () => {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchClasses = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.rpc('get_teacher_classes', {
        teacher_id: user.id
      });
      
      if (error) throw error;
      
      setClasses(data || []);
    } catch (err: any) {
      console.error('Error fetching classes:', err);
      setError(err.message || 'Failed to load classes');
      toast({
        title: 'Error loading classes',
        description: err.message || 'There was a problem loading your classes',
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
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const result = await supabase.rpc('create_class', {
        p_name: classData.name,
        p_description: classData.description,
        p_start_date: classData.startDate,
        p_teacher_id: user.id
      });
      
      if (result.error) throw result.error;
      
      // Refresh classes list
      await fetchClasses();
      
      toast({
        title: 'Class added',
        description: 'New class was successfully created'
      });
      
      return true;
    } catch (err: any) {
      console.error('Error adding class:', err);
      toast({
        title: 'Error adding class',
        description: err.message || 'There was a problem creating the class',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClass = async (classData: ClassInfo) => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const result = await supabase.rpc('update_class', {
        p_class_id: classData.id,
        p_name: classData.name,
        p_description: classData.description,
        p_start_date: classData.startDate,
        p_teacher_id: user.id
      });
      
      if (result.error) throw result.error;
      
      // Update local state
      setClasses(classes.map(c => 
        c.id === classData.id ? classData : c
      ));
      
      toast({
        title: 'Class updated',
        description: 'Class was successfully updated'
      });
      
      return true;
    } catch (err: any) {
      console.error('Error updating class:', err);
      toast({
        title: 'Error updating class',
        description: err.message || 'There was a problem updating the class',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!user || !window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return false;
    }
    
    setIsLoading(true);
    
    try {
      const result = await supabase.rpc('delete_class', {
        p_class_id: classId,
        p_teacher_id: user.id
      });
      
      if (result.error) throw result.error;
      
      // Update local state
      setClasses(classes.filter(c => c.id !== classId));
      
      toast({
        title: 'Class deleted',
        description: 'Class was successfully deleted'
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting class:', err);
      toast({
        title: 'Error deleting class',
        description: err.message || 'There was a problem deleting the class',
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
