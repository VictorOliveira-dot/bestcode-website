import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Lock, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  
  const token = searchParams.get('token');

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      toast({
        variant: "destructive",
        title: "Link inválido",
        description: "O link de redefinição de senha é inválido."
      });
    } else {
      setTokenValid(true);
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return;
    
    setIsSubmitting(true);
    
    try {
      const { data: success, error } = await supabase.rpc('reset_password_with_token', {
        p_token: token,
        p_new_password: data.password
      });

      if (error) throw error;

      toast({
        title: "Senha redefinida com sucesso",
        description: "Sua senha foi redefinida. Você pode fazer login com a nova senha."
      });
      
      navigate('/login');
      
    } catch (error: any) {
      
      toast({
        variant: "destructive",
        title: "Erro ao redefinir senha",
        description: error.message === 'Token inválido ou expirado' 
          ? "O link de redefinição expirou ou é inválido. Solicite um novo." 
          : "Não foi possível redefinir sua senha. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle>Link Inválido</CardTitle>
              <CardDescription>
                O link de redefinição de senha é inválido ou expirou.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full"
              >
                Voltar ao Login
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Lock className="h-12 w-12 text-bestcode-600" />
            </div>
            <CardTitle>Redefinir Senha</CardTitle>
            <CardDescription>
              Digite sua nova senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Digite sua nova senha"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          placeholder="Confirme sua nova senha"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-bestcode-600 hover:bg-bestcode-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;