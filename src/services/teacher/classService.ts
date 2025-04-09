
import { supabase } from "@/integrations/supabase/client";
import { ClassInfo } from "@/components/teacher/ClassItem";

// Helper function to validate UUID or numeric ID
const isValidUserID = (id: string) => {
  // Accept either UUID format or numeric IDs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const numericRegex = /^\d+$/;
  return uuidRegex.test(id) || numericRegex.test(id);
};

/**
 * Fetches classes from Supabase for a specific teacher
 */
export const fetchClassesForTeacher = async (teacherId: string): Promise<ClassInfo[]> => {
  console.log("Fetching classes for teacher ID:", teacherId);
  
  if (!teacherId) {
    console.error("No teacher ID provided");
    throw new Error("ID do professor não fornecido");
  }
  
  // Validate that the teacher ID is in acceptable format
  if (!isValidUserID(teacherId)) {
    console.error("Invalid teacher ID format. Expected UUID or numeric ID, got:", teacherId);
    throw new Error("ID do professor em formato inválido");
  }
  
  try {
    let classesWithStudents: ClassInfo[] = [];
    
    // For numeric IDs, we need to use direct table queries instead of RPC functions
    if (/^\d+$/.test(teacherId)) {
      // First get the classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name, description, start_date')
        .eq('teacher_id', teacherId);
      
      if (classesError) {
        console.error("Error fetching classes:", classesError);
        throw classesError;
      }
      
      if (!classesData || !Array.isArray(classesData)) return [];
      
      console.log("Classes fetched:", classesData.length);
      
      // For each class, count the students
      const classesPromises = classesData.map(async (cls) => {
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('student_id', { count: 'exact', head: true })
          .eq('class_id', cls.id);
        
        return {
          id: cls.id,
          name: cls.name,
          description: cls.description,
          startDate: cls.start_date,
          studentsCount: enrollmentsData?.length || 0
        };
      });
      
      classesWithStudents = await Promise.all(classesPromises);
    } else {
      // Use RPC function for UUID format (original implementation with type assertion)
      const { data, error } = await supabase
        .rpc('get_teacher_classes', { teacher_id: teacherId }) as any;
      
      if (error) {
        console.error("Error fetching classes:", error);
        throw error;
      }
      
      if (!data || !Array.isArray(data)) return [];
      
      console.log("Classes fetched:", data.length);
      
      // Format the data to match the ClassInfo interface
      classesWithStudents = data.map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        description: cls.description,
        startDate: cls.start_date,
        studentsCount: cls.students_count || 0
      }));
    }
    
    return classesWithStudents;
  } catch (error: any) {
    console.error("Error in fetchClassesForTeacher:", error);
    throw new Error(`Erro ao buscar turmas: ${error.message || error}`);
  }
};

/**
 * Adds a new class to Supabase
 */
export const addClass = async (
  teacherId: string,
  classData: { name: string; description: string; startDate: string }
): Promise<ClassInfo> => {
  console.log("Adding class for teacher ID:", teacherId, "with data:", classData);
  
  if (!teacherId) {
    throw new Error("ID do professor não fornecido. O usuário deve estar logado como professor.");
  }
  
  // Validate that the teacher ID is in acceptable format
  if (!isValidUserID(teacherId)) {
    console.error("Invalid teacher ID format. Expected UUID or numeric ID, got:", teacherId);
    throw new Error("ID do professor em formato inválido");
  }
  
  try {
    let newClass;
    
    // For numeric IDs, we need to use direct table inserts instead of RPC functions
    if (/^\d+$/.test(teacherId)) {
      const { data, error } = await supabase
        .from('classes')
        .insert({
          name: classData.name,
          description: classData.description,
          start_date: classData.startDate,
          teacher_id: teacherId
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error adding class:", error);
        throw error;
      }
      
      newClass = data;
    } else {
      // Use a direct RPC call to avoid the RLS policy recursion issue - with type assertion
      const { data, error } = await supabase
        .rpc('create_class', { 
          p_name: classData.name,
          p_description: classData.description,
          p_start_date: classData.startDate,
          p_teacher_id: teacherId
        }) as any;
      
      if (error) {
        console.error("Error adding class:", error);
        throw error;
      }
      
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("Nenhum dado retornado do banco de dados");
      }
      
      newClass = data[0];
    }
    
    console.log("Class added successfully:", newClass);
    
    // Return the new class with student count 0
    return {
      id: newClass.id,
      name: newClass.name,
      description: newClass.description,
      startDate: newClass.start_date,
      studentsCount: 0
    };
  } catch (error: any) {
    console.error("Error in addClass:", error);
    throw new Error(`Erro ao adicionar turma: ${error.message || error}`);
  }
};

/**
 * Updates an existing class in Supabase
 */
export const updateClass = async (
  teacherId: string,
  classData: ClassInfo
): Promise<void> => {
  if (!teacherId) {
    throw new Error("ID do professor não fornecido. O usuário deve estar logado como professor.");
  }
  
  // Validate that the teacher ID is in acceptable format
  if (!isValidUserID(teacherId)) {
    console.error("Invalid teacher ID format. Expected UUID or numeric ID, got:", teacherId);
    throw new Error("ID do professor em formato inválido");
  }
  
  try {
    // For numeric IDs, we need to use direct table updates instead of RPC functions
    if (/^\d+$/.test(teacherId)) {
      const { error } = await supabase
        .from('classes')
        .update({
          name: classData.name,
          description: classData.description,
          start_date: classData.startDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', classData.id)
        .eq('teacher_id', teacherId);
      
      if (error) {
        console.error("Error updating class:", error);
        throw error;
      }
    } else {
      const { error } = await supabase
        .rpc('update_class', { 
          p_class_id: classData.id,
          p_name: classData.name,
          p_description: classData.description,
          p_start_date: classData.startDate,
          p_teacher_id: teacherId
        }) as any;
      
      if (error) {
        console.error("Error updating class:", error);
        throw error;
      }
    }
  } catch (error: any) {
    console.error("Error in updateClass:", error);
    throw new Error(`Erro ao atualizar turma: ${error.message || error}`);
  }
};

/**
 * Deletes a class from Supabase
 */
export const deleteClass = async (
  teacherId: string,
  classId: string
): Promise<void> => {
  if (!teacherId) {
    throw new Error("ID do professor não fornecido. O usuário deve estar logado como professor.");
  }
  
  // Validate that the teacher ID is in acceptable format
  if (!isValidUserID(teacherId)) {
    console.error("Invalid teacher ID format. Expected UUID or numeric ID, got:", teacherId);
    throw new Error("ID do professor em formato inválido");
  }
  
  try {
    // For numeric IDs, we need to use direct table deletes instead of RPC functions
    if (/^\d+$/.test(teacherId)) {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId)
        .eq('teacher_id', teacherId);
      
      if (error) {
        console.error("Error deleting class:", error);
        throw error;
      }
    } else {
      const { error } = await supabase
        .rpc('delete_class', { 
          p_class_id: classId,
          p_teacher_id: teacherId
        }) as any;
      
      if (error) {
        console.error("Error deleting class:", error);
        throw error;
      }
    }
  } catch (error: any) {
    console.error("Error in deleteClass:", error);
    throw new Error(`Erro ao remover turma: ${error.message || error}`);
  }
};
