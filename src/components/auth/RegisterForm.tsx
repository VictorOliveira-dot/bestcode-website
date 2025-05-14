
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';

const formSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Endereço de e-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser, login } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Always register as student - hardcoded
      const registerResult = await registerUser({
        email: values.email,
        password: values.password,
        name: values.name,
        role: 'student'
      });
      
      if (!registerResult.success) {
        throw new Error(registerResult.message || "Erro no registro");
      }
      
      // Após registro bem-sucedido, fazer login automaticamente
      const loginResult = await login(values.email, values.password);
      
      if (!loginResult.success) {
        throw new Error("Registro realizado, mas não foi possível fazer login automaticamente. Por favor, faça login manualmente.");
      }
      
      toast.success("Registro realizado com sucesso!", {
        description: "Complete seu perfil para continuar.",
      });
      
      // Redirecionar para a página de enrollment com um pequeno delay para garantir que o estado de autenticação esteja atualizado
      setTimeout(() => {
        navigate('/enrollment');
      }, 800);
      
    } catch (error: any) {
      console.error('Erro no registro:', error);
      toast.error(error.message || "Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="space-y-4"
        >
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <input 
                      placeholder="Seu nome" 
                      {...field} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bestcode-500 focus:border-transparent" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <input 
                      type="email" 
                      placeholder="seu@email.com" 
                      {...field} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bestcode-500 focus:border-transparent" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <input 
                      type="password" 
                      placeholder="Senha segura" 
                      {...field} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bestcode-500 focus:border-transparent" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div>
            <Button 
              type="submit" 
              className="w-full bg-bestcode-600 hover:bg-bestcode-700" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : 'Registrar e prosseguir para inscrição'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
