
import { supabase } from "@/integrations/supabase/client";
import { ClassInfo } from "@/components/teacher/ClassItem";

// Helper function to validate UUID
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
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
  
  // Validate that the teacher ID is in UUID format
  if (!isValidUUID(teacherId)) {
    console.error("Invalid teacher ID format. Expected UUID, got:", teacherId);
    throw new Error("ID do professor em formato inválido");
  }
  
  try {
    // Use a direct RPC call to avoid the RLS policy recursion issue - with type assertion
    const { data, error } = await supabase
      .rpc('get_teacher_classes', { teacher_id: teacherId }) as any;
    
    if (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
    
    if (!data || !Array.isArray(data)) return [];
    
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
  
  // Validate that the teacher ID is in UUID format
  if (!isValidUUID(teacherId)) {
    console.error("Invalid teacher ID format. Expected UUID, got:", teacherId);
    throw new Error("ID do professor em formato inválido");
  }
  
  try {
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
    
    const newClass = data[0];
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
  
  // Validate that the teacher ID is in UUID format
  if (!isValidUUID(teacherId)) {
    console.error("Invalid teacher ID format. Expected UUID, got:", teacherId);
    throw new Error("ID do professor em formato inválido");
  }
  
  try {
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
  
  // Validate that the teacher ID is in UUID format
  if (!isValidUUID(teacherId)) {
    console.error("Invalid teacher ID format. Expected UUID, got:", teacherId);
    throw new Error("ID do professor em formato inválido");
  }
  
  try {
    const { error } = await supabase
      .rpc('delete_class', { 
        p_class_id: classId,
        p_teacher_id: teacherId
      }) as any;
    
    if (error) {
      console.error("Error deleting class:", error);
      throw error;
    }
  } catch (error: any) {
    console.error("Error in deleteClass:", error);
    throw new Error(`Erro ao remover turma: ${error.message || error}`);
  }
};
