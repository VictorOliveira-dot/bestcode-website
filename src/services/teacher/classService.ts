
import { supabase } from "@/integrations/supabase/client";
import { ClassInfo } from "@/components/teacher/ClassItem";

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

export const fetchClassesForTeacher = async (teacherId: string): Promise<ClassInfo[]> => {
  console.log(`Fetching classes for teacher ID: ${teacherId} (mock implementation)`);
  
  // In a real implementation, this would fetch data from the backend
  // For now, return mock data
  
  // Simulate an API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return MOCK_CLASSES;
};

export const addClass = async (
  teacherId: string,
  classData: { name: string; description: string; startDate: string }
): Promise<ClassInfo> => {
  console.log(`Adding class for teacher ID: ${teacherId}`, classData);
  
  // Simulate an API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create a new class with a mock ID
  const newClass: ClassInfo = {
    id: `class${Date.now()}`,
    name: classData.name,
    description: classData.description,
    startDate: classData.startDate,
    studentsCount: 0
  };
  
  return newClass;
};

export const updateClass = async (
  teacherId: string,
  classData: ClassInfo
): Promise<void> => {
  console.log(`Updating class for teacher ID: ${teacherId}`, classData);
  
  // Simulate an API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would update the class in the backend
  return;
};

export const deleteClass = async (
  teacherId: string,
  classId: string
): Promise<void> => {
  console.log(`Deleting class ID: ${classId} for teacher ID: ${teacherId}`);
  
  // Simulate an API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would delete the class from the backend
  return;
};
