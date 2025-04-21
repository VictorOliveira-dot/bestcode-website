
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";
import LoginFormHeader from "./LoginFormHeader";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import LoginFormActions from "./LoginFormActions";
import { supabase } from "@/integrations/supabase/client";

// Lista de usuários de teste - isso ajudará com a validação direta
const TEST_USERS = [
  { email: 'admin@bestcode.com', password: 'admin123', role: 'admin' },
  { email: 'professor@bestcode.com', password: 'teacher123', role: 'teacher' },
  { email: 'aluno@bestcode.com', password: 'student123', role: 'student' }
];

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Verificar se há uma sessão ativa ao carregar o componente
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("Sessão já existe:", data.session.user.id);
        
        // Se já tiver uma sessão, redirecione com base no papel do usuário
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
        
        if (userData) {
          redirectBasedOnRole(userData.role);
        }
      }
    };
    
    checkSession();
  }, [navigate]);
  
  // Função para redirecionar com base no papel/role
  const redirectBasedOnRole = (role: string) => {
    if (role === "teacher") {
      navigate("/teacher/dashboard");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  // Função para verificar se é um usuário de teste
  const isTestUser = (email: string, password: string) => {
    return TEST_USERS.some(user => 
      user.email.toLowerCase() === email.toLowerCase() && 
      user.password === password
    );
  };

  // Função para tentar login diretamente com Supabase
  const tryDirectLogin = async (email: string, password: string) => {
    console.log(`Tentando login direto com: ${email}`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Erro no login direto:", error);
      throw error;
    }
    
    console.log("Login direto bem-sucedido:", data);
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos.",
        });
        return;
      }
      
      // Limpa o email e converte para minúsculas para consistência
      const cleanEmail = email.trim().toLowerCase();
      console.log(`Tentando login com email: ${cleanEmail}`);
      
      // Se for um usuário de teste, mostramos informações adicionais para ajudar no diagnóstico
      if (isTestUser(cleanEmail, password)) {
        console.log("Detectado usuário de teste válido!");
      } else {
        console.log("NÃO é um usuário de teste conhecido");
      }
      
      // Tentativa direta para diagnosticar problemas
      try {
        await tryDirectLogin(cleanEmail, password);
        
        // Se chegou aqui, o login direto funcionou
        console.log("Login direto bem-sucedido, tentando com o hook de autenticação");
        
        // Se o login direto funcionou, tente com o hook de autenticação
        const userData = await login(cleanEmail, password);
        
        if (userData) {
          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo(a), ${userData.name || userData.email}!`,
          });
          
          redirectBasedOnRole(userData.role);
        } else {
          throw new Error("Login direto funcionou, mas o hook de autenticação falhou");
        }
      } catch (directError: any) {
        console.error("Erro no login direto:", directError);
        
        // Se for um usuário de teste e o login falhou, temos um problema mais profundo
        if (isTestUser(cleanEmail, password)) {
          toast({
            variant: "destructive",
            title: "Erro de autenticação",
            description: "Os dados de teste são válidos, mas a autenticação falhou. Entre em contato com o suporte técnico.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Credenciais inválidas",
            description: "E-mail ou senha incorretos. Por favor, verifique e tente novamente.",
          });
        }
      }
    } catch (error: any) {
      console.error("Erro de login:", error);
      
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.message || "Credenciais inválidas. Verifique seu email e senha e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <LoginFormHeader />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <EmailField 
              email={email}
              setEmail={setEmail}
              disabled={isLoading}
            />
            
            <PasswordField
              password={password}
              setPassword={setPassword}
              onForgotPassword={() => setIsForgotPasswordOpen(true)}
              disabled={isLoading}
            />
            
            <LoginFormActions isLoading={isLoading} />
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-sm font-bold text-yellow-800">Contas de teste:</h3>
              <ul className="mt-2 text-sm text-yellow-700 list-disc pl-5">
                <li><strong>Admin:</strong> admin@bestcode.com / admin123</li>
                <li><strong>Professor:</strong> professor@bestcode.com / teacher123</li>
                <li><strong>Aluno:</strong> aluno@bestcode.com / student123</li>
              </ul>
              <p className="mt-2 text-xs text-yellow-600 italic">Certifique-se de digitar as credenciais exatamente como mostradas acima.</p>
            </div>
          </form>
        </CardContent>
      </Card>

      <ForgotPasswordModal 
        isOpen={isForgotPasswordOpen} 
        onClose={() => setIsForgotPasswordOpen(false)} 
      />
    </>
  );
};

export default LoginForm;
