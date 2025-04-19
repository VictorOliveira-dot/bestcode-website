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
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Endereço de e-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['student', 'teacher', 'admin'], {
    required_error: "Por favor selecione um tipo de usuário",
  }),
});

const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'student',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      console.log('Registrando com os dados:', { 
        name: values.name, 
        email: values.email,
        role: values.role
        // Senha não logada por segurança
      });
      
      const result = await register(values.email, values.password, { 
        name: values.name,
        role: values.role
      });
      
      if (result) {
        console.log('Registro bem-sucedido, redirecionando...');
        toast({
          title: 'Registro bem-sucedido',
          description: 'Sua conta foi criada. Você será redirecionado para o dashboard.',
        });
        
        // Dar tempo para o toast ser visto
        setTimeout(() => {
          // Redirecionar baseado no papel do usuário
          switch(values.role) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'teacher':
              navigate('/teacher/dashboard');
              break;
            default:
              navigate('/student/dashboard');
              break;
          }
        }, 1500);
      }
    } catch (error: any) {
      console.error('Falha no registro:', error);
      toast({
        variant: 'destructive',
        title: 'Falha no registro',
        description: error.message || 'Ocorreu um erro durante o registro.',
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
          
          <EmailField control={form.control} />
          <PasswordField control={form.control} />
          
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
