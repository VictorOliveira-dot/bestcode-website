
import { useSupabaseBase } from './useSupabaseBase';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseNotifications = () => {
  const { loading, error, setLoading, setError } = useSupabaseBase();

  // Function to fetch notifications
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

  // Function to mark notification as read
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
    fetchNotifications,
    markNotificationAsRead,
    loading,
    error
  };
};
