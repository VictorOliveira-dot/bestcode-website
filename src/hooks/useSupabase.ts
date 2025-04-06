
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função genérica para buscar dados
  const fetchData = async <T>(table: string, query?: any): Promise<T[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .match(query || {});

      if (error) throw error;
      return data as T[];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Função para autenticação por email e senha
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Função para cadastro de usuário
  const register = async (email: string, password: string, userData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // Primeiro registra o usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Depois insere os dados adicionais na tabela users
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            { 
              id: authData.user.id,
              email,
              ...userData
            }
          ]);
          
        if (profileError) throw profileError;
      }
      
      return authData;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Função para recuperar informações do usuário logado
  const getCurrentUser = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Erro ao buscar usuário:', err.message);
      return null;
    }
  };

  // Função para logout
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar aulas (lessons)
  const fetchLessons = async (classId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('lessons')
        .select('*')
        .order('order', { ascending: true });
        
      if (classId) {
        query = query.eq('class_id', classId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar progresso de aula
  const updateLessonProgress = async (studentId: string, lessonId: string, watchTimeMinutes: number, progress: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Verificar se já existe registro
      const { data: existingData, error: fetchError } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)
        .maybeSingle();
        
      if (fetchError) throw fetchError;
      
      const status = progress >= 100 ? 'completed' : 'in_progress';
      const now = new Date().toISOString();
      
      if (existingData) {
        // Atualiza progresso existente
        const { error } = await supabase
          .from('lesson_progress')
          .update({
            watch_time_minutes: watchTimeMinutes,
            progress,
            status,
            last_watched: now,
            updated_at: now
          })
          .eq('id', existingData.id);
          
        if (error) throw error;
      } else {
        // Cria novo progresso
        const { error } = await supabase
          .from('lesson_progress')
          .insert([{
            student_id: studentId,
            lesson_id: lessonId,
            watch_time_minutes: watchTimeMinutes,
            progress,
            status,
            last_watched: now
          }]);
          
        if (error) throw error;
      }
      
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar progresso de aulas
  const fetchLessonProgress = async (studentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('student_id', studentId);
        
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar notificações
  const fetchNotifications = async (userId: string, unreadOnly = false) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });
        
      if (unreadOnly) {
        query = query.eq('read', false);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Função para marcar notificação como lida
  const markNotificationAsRead = async (notificationId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchData,
    loading,
    error,
    login,
    register,
    logout,
    getCurrentUser,
    fetchLessons,
    updateLessonProgress,
    fetchLessonProgress,
    fetchNotifications,
    markNotificationAsRead
  };
};
