
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";

// Define form schema
const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

// Default values
const defaultValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
};

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Define form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  // Handle form submission
  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      // Register user
      const result = await register({
        email: values.email,
        password: values.password,
        name: values.name,
        role: "student", // Default role for new users
      });

      if (result.success) {
        toast.success("Conta criada com sucesso!", {
          description: "Você será redirecionado para completar seu cadastro.",
        });

        // Let's wait a moment to ensure auth state is updated properly
        setTimeout(() => {
          navigate("/inscricao", { replace: true });
        }, 1500);
      } else {
        
        toast.error("Falha no cadastro", {
          description: result.message || "Ocorreu um erro durante o cadastro",
        });
      }
    } catch (error: any) {
      
      toast.error("Erro no cadastro", {
        description: error.message || "Ocorreu um erro inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite seu nome completo" 
                      {...field} 
                      autoComplete="name"
                      disabled={isLoading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="exemplo@email.com" 
                      {...field} 
                      type="email"
                      autoComplete="email"
                      disabled={isLoading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="••••••••" 
                      {...field} 
                      type="password"
                      autoComplete="new-password"
                      disabled={isLoading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
