
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";
import LoginFormHeader from "./LoginFormHeader";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import LoginFormActions from "./LoginFormActions";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset form and error states on component mount
    setEmail("");
    setPassword("");
    setErrorMessage(null);
  }, []);

  // Redirect authenticated user to their respective dashboard
  useEffect(() => {
    if (user) {
      console.log("User authenticated, redirecting based on role:", user.role);
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (user.role === "student") {
        navigate("/student/dashboard");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Avoid double submission
    if (isLoading || loading) return;

    // Clear previous error
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Log form submission
      console.log("Submitting login form for:", email);
      
      // Basic validation
      if (!email.trim() || !password.trim()) {
        setErrorMessage("Please fill in all fields");
        toast({
          variant: "destructive",
          title: "Required fields",
          description: "Please fill in all fields.",
        });
        setIsLoading(false);
        return;
      }

      // Use real Supabase authentication via context
      console.log("Attempting login with Supabase...");
      const result = await login(email, password);
      
      console.log("Login result:", result);
      
      if (result.success) {
        toast({
          title: "Login successful!",
          description: "You have been authenticated.",
          variant: "default",
        });
        // The effect above will redirect user to appropriate dashboard
      } else {
        // Display specific error message returned by login function
        setErrorMessage(result.message || "Invalid login. Please try again.");
        toast({
          variant: "destructive",
          title: "Could not log in",
          description: result.message || "Invalid login. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      setErrorMessage(error.message || "Login failed. Please try again.");
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: error.message || "An error occurred during login. Try again.",
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
              disabled={isLoading || loading}
            />
            <PasswordField
              password={password}
              setPassword={setPassword}
              onForgotPassword={() => setIsForgotPasswordOpen(true)}
              disabled={isLoading || loading}
            />
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                <p className="font-medium">Error: {errorMessage}</p>
              </div>
            )}
            <LoginFormActions isLoading={isLoading || loading} />
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
