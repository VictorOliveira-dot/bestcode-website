
import { supabase } from "@/integrations/supabase/client";
import { ClassInfo } from "@/components/teacher/ClassItem";

/**
 * Fetches classes from Supabase for a specific teacher
 */
export const fetchClassesForTeacher = async (teacherId: string): Promise<ClassInfo[]> => {
  console.log("Fetching classes for teacher ID:", teacherId);
  
  if (!teacherId) {
    console.error("No teacher ID provided");
    throw new Error("ID do professor não fornecido");
  }
  
  try {
    // Use a direct RPC call to avoid the RLS policy recursion issue
    const { data, error } = await supabase
      .rpc('get_teacher_classes', { teacher_id: teacherId });
    
    if (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
    
    if (!data) return [];
    
    console.log("Classes fetched:", data.length);
    
    // Format the data to match the ClassInfo interface
    const classesWithStudents: ClassInfo[] = data.map((cls: any) => ({
      id: cls.id,
      name: cls.name,
      description: cls.description,
      startDate: cls.start_date,
      studentsCount: cls.students_count || 0
    }));
    
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
  
  try {
    // Use a direct RPC call to avoid the RLS policy recursion issue
    const { data, error } = await supabase
      .rpc('create_class', { 
        p_name: classData.name,
        p_description: classData.description,
        p_start_date: classData.startDate,
        p_teacher_id: teacherId
      });
    
    if (error) {
      console.error("Error adding class:", error);
      throw error;
    }
    
    if (!data) throw new Error("Nenhum dado retornado do banco de dados");
    
    console.log("Class added successfully:", data);
    
    // Return the new class with student count 0
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      startDate: data.start_date,
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
  
  try {
    const { error } = await supabase
      .rpc('update_class', { 
        p_class_id: classData.id,
        p_name: classData.name,
        p_description: classData.description,
        p_start_date: classData.startDate,
        p_teacher_id: teacherId
      });
    
    if (error) {
      console.error("Error updating class:", error);
      throw error;
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
  
  try {
    const { error } = await supabase
      .rpc('delete_class', { 
        p_class_id: classId,
        p_teacher_id: teacherId
      });
    
    if (error) {
      console.error("Error deleting class:", error);
      throw error;
    }
  } catch (error: any) {
    console.error("Error in deleteClass:", error);
    throw new Error(`Erro ao remover turma: ${error.message || error}`);
  }
};
