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

// Test users for direct validation
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Check for existing session on component load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          return;
        }
        
        if (data.session) {
          console.log("Session exists:", data.session.user.id);
          
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.session.user.id)
            .single();
          
          if (userData) {
            redirectBasedOnRole(userData.role);
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      }
    };
    
    checkSession();
  }, [navigate]);
  
  // Function to redirect based on role
  const redirectBasedOnRole = (role: string) => {
    if (role === "teacher") {
      navigate("/teacher/dashboard");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  // Function to check if this is a test user
  const isTestUser = (email: string, password: string) => {
    return TEST_USERS.some(user => 
      user.email.toLowerCase() === email.toLowerCase() && 
      user.password === password
    );
  };

  // Function to attempt direct login with Supabase
  const tryDirectLogin = async (email: string, password: string) => {
    try {
      console.log(`Attempting direct login with: ${email}`);
      
      // Clear any previous auth state
      await supabase.auth.signOut();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
        // Removed redirectTo option as it's causing TypeScript error
      });
      
      if (error) {
        console.error("Direct login error:", error);
        throw error;
      }
      
      console.log("Direct login successful:", data);
      return data;
    } catch (err) {
      console.error("Error in direct login attempt:", err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setErrorMessage(null);
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        setErrorMessage("Please fill in all fields");
        toast({
          variant: "destructive",
          title: "Required fields",
          description: "Please fill in all fields.",
        });
        return;
      }
      
      // Standardize email format
      const cleanEmail = email.trim().toLowerCase();
      console.log(`Login attempt with email: ${cleanEmail}`);
      
      // Log if this is a test user
      if (isTestUser(cleanEmail, password)) {
        console.log("Valid test user detected!");
      } else {
        console.log("NOT a known test user");
      }
      
      // Try direct login first (bypassing hooks for debugging)
      try {
        const directLoginData = await tryDirectLogin(cleanEmail, password);
        
        if (directLoginData) {
          console.log("Direct login successful, attempting with auth hook");
          
          // If direct login worked, try with auth hook
          try {
            const userData = await login(cleanEmail, password);
            
            if (userData) {
              toast({
                title: "Login successful",
                description: `Welcome, ${userData.name || userData.email}!`,
              });
              
              redirectBasedOnRole(userData.role);
              return;
            }
          } catch (hookError: any) {
            console.error("Hook login error after successful direct login:", hookError);
            setErrorMessage(`Authentication succeeded but profile retrieval failed: ${hookError.message}`);
            
            // Still redirect based on user role from direct login
            if (directLoginData.user) {
              const { data: roleData } = await supabase
                .from('users')
                .select('role')
                .eq('id', directLoginData.user.id)
                .single();
                
              if (roleData) {
                redirectBasedOnRole(roleData.role);
                return;
              }
            }
          }
        }
      } catch (directError: any) {
        console.error("Direct login error:", directError);
        
        if (isTestUser(cleanEmail, password)) {
          setErrorMessage("Test account credentials are valid but authentication failed. This might be a server issue.");
          toast({
            variant: "destructive",
            title: "Authentication error",
            description: "Test credentials are valid but authentication failed. Please contact technical support.",
          });
        } else {
          setErrorMessage("Invalid credentials. Please check your email and password.");
          toast({
            variant: "destructive",
            title: "Invalid credentials",
            description: "Email or password is incorrect. Please verify and try again.",
          });
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      setErrorMessage(error.message || "Login failed. Please try again.");
      toast({
        variant: "destructive",
        title: "Login error",
        description: error.message || "Invalid credentials. Check your email and password and try again.",
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
            
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                <p className="font-medium">Error: {errorMessage}</p>
                <p className="mt-1 text-xs">If using a test account, make sure to type the credentials exactly as shown below.</p>
              </div>
            )}
            
            <LoginFormActions isLoading={isLoading} />
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h3 className="text-sm font-bold text-yellow-800">Test accounts:</h3>
              <ul className="mt-2 text-sm text-yellow-700 list-disc pl-5">
                <li><strong>Admin:</strong> admin@bestcode.com / admin123</li>
                <li><strong>Professor:</strong> professor@bestcode.com / teacher123</li>
                <li><strong>Aluno:</strong> aluno@bestcode.com / student123</li>
              </ul>
              <p className="mt-2 text-xs text-yellow-600 italic">Make sure to type the credentials exactly as shown above.</p>
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
