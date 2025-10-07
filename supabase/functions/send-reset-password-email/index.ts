import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordEmailRequest {
  email: string;
  token: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, token }: ResetPasswordEmailRequest = await req.json();

    console.log('Enviando email de recuperação para:', email);

    // Use the production domain from environment variable or fallback
    const baseUrl = Deno.env.get("SITE_URL") || "https://bestcodeacademy.com.br";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;
    
    console.log('Reset URL gerada:', resetUrl);

    const emailResponse = await resend.emails.send({
      from: "BestCode <onboarding@resend.dev>",
      to: [email],
      subject: "Redefinição de Senha - BestCode",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .header {
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                padding: 40px 20px;
                text-align: center;
                color: white;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
              }
              .content {
                padding: 40px 30px;
              }
              .content p {
                margin: 0 0 20px;
                font-size: 16px;
              }
              .button {
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                font-size: 16px;
                margin: 20px 0;
                transition: opacity 0.2s;
              }
              .button:hover {
                opacity: 0.9;
              }
              .alert {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 14px;
                color: #856404;
              }
              .footer {
                background: #f8f9fa;
                padding: 30px;
                text-align: center;
                font-size: 14px;
                color: #6c757d;
                border-top: 1px solid #dee2e6;
              }
              .footer a {
                color: #6366f1;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Redefinição de Senha</h1>
              </div>
              
              <div class="content">
                <p>Olá,</p>
                
                <p>Recebemos uma solicitação para redefinir a senha da sua conta na <strong>BestCode</strong>.</p>
                
                <p>Para criar uma nova senha, clique no botão abaixo:</p>
                
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Redefinir Minha Senha</a>
                </div>
                
                <p>Ou copie e cole este link no seu navegador:</p>
                <p style="background: #f8f9fa; padding: 12px; border-radius: 4px; word-break: break-all; font-size: 14px; color: #6c757d;">
                  ${resetUrl}
                </p>
                
                <div class="alert">
                  ⏰ <strong>Atenção:</strong> Este link é válido por apenas 1 hora por questões de segurança.
                </div>
                
                <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
                  Se você não solicitou esta redefinição de senha, ignore este email. Sua senha permanecerá inalterada.
                </p>
              </div>
              
              <div class="footer">
                <p><strong>BestCode</strong> - Plataforma de Ensino</p>
                <p>
                  Precisa de ajuda? 
                  <a href="mailto:suporte@bestcode.com.br">Entre em contato conosco</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email enviado com sucesso:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, messageId: emailResponse.data?.id }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Erro ao enviar email"
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
