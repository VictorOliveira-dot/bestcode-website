
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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import TestAccountInfo from './TestAccountInfo';

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
                  <Input placeholder="Seu nome" {...field} />
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
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Registrar'}
          </Button>
        </form>
      </Form>
      
      <TestAccountInfo />
    </div>
  );
};

export default RegisterForm;
