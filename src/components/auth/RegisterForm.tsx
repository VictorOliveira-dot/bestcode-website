
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

const formSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Endereço de e-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['student', 'teacher', 'admin'], {
    required_error: "Por favor selecione um tipo de usuário",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'student',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Usar a função de registro do contexto Auth que usa o Supabase
      const result = await registerUser({
        email: values.email, 
        password: values.password,
        name: values.name,
        role: values.role
      });
      
      if (result.success) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Você será redirecionado para a página de pagamento.",
          variant: "default"
        });
        
        // Redirecionar para checkout após registro bem-sucedido
        setTimeout(() => {
          navigate('/checkout');
        }, 1500);
      } else {
        toast({
          title: "Erro no cadastro",
          description: result.message || "Não foi possível criar sua conta. Por favor, tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Erro no registro:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro ao processar seu cadastro. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <input placeholder="Seu nome" {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bestcode-500 focus:border-transparent" />
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
                  <input type="email" placeholder="seu@email.com" {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bestcode-500 focus:border-transparent" />
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
                  <input type="password" placeholder="Senha segura" {...field} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bestcode-500 focus:border-transparent" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Usuário</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de usuário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Estudante</SelectItem>
                    <SelectItem value="teacher">Professor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full bg-bestcode-600 hover:bg-bestcode-700" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Registrar'}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="text-sm font-medium text-yellow-800">Contas de teste disponíveis:</h3>
        <ul className="mt-2 text-sm text-yellow-700 list-disc pl-5">
          <li><strong>Admin:</strong> admin@bestcode.com (Senha: admin123)</li>
          <li><strong>Professor:</strong> professor@bestcode.com (Senha: teacher123)</li>
          <li><strong>Aluno:</strong> aluno@bestcode.com (Senha: student123)</li>
        </ul>
      </div>
    </div>
  );
};

export default RegisterForm;
