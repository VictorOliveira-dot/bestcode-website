
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

export interface StripePayment {
  id: string;
  user_id: string;
  stripe_payment_id: string;
  payment_amount: number;
  payment_status: string;
  payment_date: string;
  payment_method: string;
}

export const useStripeRevenue = () => {
  const { user, loading: authLoading } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['stripe-revenue'],
    queryFn: async () => {
      try {
        // console.log("Fetching Stripe revenue data");
        
        const { data: paymentsData, error } = await supabase
          .from('user_payments')
          .select('*')
          .eq('payment_status', 'completed')
          .order('payment_date', { ascending: false });

        if (error) {
          console.error("Error fetching payments:", error);
          throw error;
        }

        // console.log("Payments data fetched:", paymentsData);
        
        const totalRevenue = paymentsData?.reduce((sum, payment) => {
          return sum + (payment.payment_amount || 0);
        }, 0) || 0;

        return {
          payments: paymentsData || [],
          totalRevenue
        };
      } catch (err: any) {
        console.error("Error fetching stripe revenue:", err);
        toast({
          title: "Erro ao carregar receita",
          description: err.message || "Não foi possível carregar os dados de receita",
          variant: "destructive"
        });
        throw err;
      }
    },
    enabled: !authLoading && user?.role === 'admin'
  });

  return {
    data: data?.payments || [],
    totalRevenue: data?.totalRevenue || 0,
    isLoading,
    error
  };
};
