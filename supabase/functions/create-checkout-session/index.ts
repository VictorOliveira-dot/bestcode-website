
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Obter dados do request
    const { userId, applicationId, email, fullName } = await req.json();

    if (!userId || !applicationId || !email || !fullName) {
      throw new Error("Dados incompletos. Todos os campos são obrigatórios.");
    }

    // Inicializar Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2022-11-15",
    });

    console.log(`Criando sessão de checkout para o usuário: ${userId}, aplicação: ${applicationId}`);

    // Criar cliente Supabase com service role para operações de banco de dados
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Configurar dados do curso (valores fixos conforme solicitado)
    const course = {
      title: "Formação Completa em QA",
      finalPrice: 1797, // preço em reais
    };

    // Criar sessão de checkout no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: course.title,
              description: 'Curso completo de formação em Quality Assurance',
            },
            unit_amount: Math.round(course.finalPrice * 100), // Converter para centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get("origin")}/checkout?success=true`,
      cancel_url: `${req.headers.get("origin")}/checkout?canceled=true`,
      metadata: {
        userId: userId,
        applicationId: applicationId,
      },
    });

    // Salvar dados do checkout na tabela user_payments
    const { data: paymentData, error: paymentError } = await supabaseAdmin
      .from("user_payments")
      .insert({
        user_id: userId,
        application_id: applicationId,
        stripe_session_id: session.id,
        checkout_url: session.url,
        amount: course.finalPrice,
        status: "pending",
        created_at: new Date().toISOString(),
      });

    if (paymentError) {
      console.error("Erro ao salvar dados de pagamento:", paymentError);
      throw new Error("Erro ao salvar dados de pagamento");
    }

    console.log("Sessão de checkout criada com sucesso:", session.id);

    // Tentar enviar e-mail, mas não bloquear o fluxo se falhar
    try {
      // Construir dados para a função de e-mail
      const emailData = {
        to: email,
        subject: "Complete sua inscrição - BestCode Academy",
        templateData: {
          name: fullName,
          checkoutUrl: session.url,
          courseName: course.title,
          price: `R$ ${course.finalPrice.toFixed(2)}`,
        }
      };

      // URL da função de e-mail e chave de API estão nas variáveis de ambiente
      const mailFunctionUrl = Deno.env.get("MAIL_FUNCTION_URL");
      const mailApiKey = Deno.env.get("MAIL_API_KEY");

      if (mailFunctionUrl && mailApiKey) {
        const emailResponse = await fetch(mailFunctionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${mailApiKey}`
          },
          body: JSON.stringify(emailData)
        });

        if (!emailResponse.ok) {
          console.warn("Aviso: E-mail não pode ser enviado, mas o checkout foi criado");
        } else {
          console.log("E-mail de checkout enviado com sucesso");
        }
      } else {
        console.warn("Configuração de e-mail não encontrada, pulando envio de e-mail");
      }
    } catch (emailError) {
      console.warn("Erro ao enviar e-mail, mas o checkout foi criado:", emailError);
    }

    // Retornar a URL do checkout para redirecionamento no frontend
    return new Response(JSON.stringify({ 
      success: true, 
      status: "pending",
      id: session.id,
      url: session.url
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Erro ao processar sessão de checkout:", error);
    
    // Retornar erro
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || "Erro desconhecido"
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
