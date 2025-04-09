
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
    // Get classes where the current teacher is the teacher_id
    const { data, error } = await supabase
      .from('classes')
      .select(`
        id,
        name,
        description,
        start_date
      `)
      .eq('teacher_id', teacherId);
    
    if (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
    
    if (!data) return [];
    
    console.log("Classes fetched:", data.length);
    
    // Get student counts for each class separately
    const classesWithStudents: ClassInfo[] = await Promise.all(
      data.map(async (cls) => {
        try {
          const { count, error: countError } = await supabase
            .from('enrollments')
            .select('id', { count: 'exact', head: true })
            .eq('class_id', cls.id);
          
          if (countError) throw countError;
          
          return {
            id: cls.id,
            name: cls.name,
            description: cls.description,
            startDate: cls.start_date,
            studentsCount: count || 0
          };
        } catch (err) {
          // If there's an error counting students, return 0
          console.error("Error counting students for class:", cls.id, err);
          return {
            id: cls.id,
            name: cls.name,
            description: cls.description,
            startDate: cls.start_date,
            studentsCount: 0
          };
        }
      })
    );
    
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
    // Insert new class into the database
    const { data, error } = await supabase
      .from('classes')
      .insert([{
        name: classData.name,
        description: classData.description,
        start_date: classData.startDate,
        teacher_id: teacherId
      }])
      .select()
      .single();
    
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
      .from('classes')
      .delete()
      .eq('id', classId)
      .eq('teacher_id', teacherId);
    
    if (error) {
      console.error("Error deleting class:", error);
      throw error;
    }
  } catch (error: any) {
    console.error("Error in deleteClass:", error);
    throw new Error(`Erro ao remover turma: ${error.message || error}`);
  }
};
