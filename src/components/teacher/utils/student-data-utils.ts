
import { StudentProgress, LessonStatus } from "../types/student";

export const generateStudentLessons = (studentId: string, students: StudentProgress[]): LessonStatus[] => {
  const student = students.find(s => s.id === studentId);
  if (!student) return [];

  const mockLessons: LessonStatus[] = [];
  const totalLessons = student.totalLessons;
  
  for (let i = 1; i <= totalLessons; i++) {
    let status: 'completed' | 'in_progress' | 'not_started';
    let watchTimeMinutes = 0;
    let lastWatch: string | null = null;
    
    if (i <= student.completedLessons) {
      status = 'completed';
      watchTimeMinutes = Math.floor(Math.random() * 30) + 15; // 15-45 minutes
      
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
      lastWatch = randomDate.toISOString();
    } else if (i === student.completedLessons + 1) {
      status = 'in_progress';
      watchTimeMinutes = Math.floor(Math.random() * 15); // 0-15 minutes
      
      lastWatch = student.lastActivity;
    } else {
      status = 'not_started';
      watchTimeMinutes = 0;
      lastWatch = null;
    }
    
    mockLessons.push({
      id: `${studentId}-lesson-${i}`,
      title: `Aula ${i}: ${i <= 3 ? 'Introdução' : i <= 7 ? 'Conceitos Básicos' : 'Avançado'} ${i}`,
      date: new Date(Date.now() - (totalLessons - i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status,
      watchTimeMinutes,
      lastWatch
    });
  }
  
  return mockLessons;
};
