
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Cabeçalhos CORS para permitir solicitações do frontend
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Função principal que processa todas as requisições
serve(async (req) => {
  // Lidar com solicitações OPTIONS (preflight CORS)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Inicializar cliente Stripe com chave secreta
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Parsear o corpo da requisição
    const { paymentMethod, cardData, course } = await req.json();
    
    // Inicializar cliente Supabase para autenticação
    const supabaseUrl = "https://jqnarznabyiyngcdqcff.supabase.co";
    const supabaseKey = req.headers.get("Authorization")?.split(" ")[1] || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verificar autenticação - opcional, depende se você requer usuários logados
    const { data: { user }, error: authError } = await supabase.auth.getUser(supabaseKey);
    
    // Processar pagamento de acordo com o método escolhido
    let paymentResult;
    
    if (paymentMethod === "credit-card") {
      // Para cartão de crédito, criar um PaymentMethod e em seguida um PaymentIntent
      console.log("Processando pagamento com cartão de crédito");
      
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: cardData.cardNumber.replace(/\s+/g, ''),
          exp_month: parseInt(cardData.cardExpiry.split('/')[0]),
          exp_year: parseInt("20" + cardData.cardExpiry.split('/')[1]),
          cvc: cardData.cardCvc,
        },
        billing_details: {
          name: cardData.cardName,
        },
      });
      
      // Criar PaymentIntent para efetuar a cobrança
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(course.finalPrice * 100), // Stripe trabalha com centavos
        currency: 'brl',
        payment_method: paymentMethod.id,
        confirm: true,
        description: `Compra do curso ${course.title}`,
        return_url: `${req.headers.get("origin")}/enrollment`,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'always',
        },
      });
      
      paymentResult = {
        success: paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing',
        status: paymentIntent.status,
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      };
      
    } else if (paymentMethod === "pix") {
      // Para PIX, criar um PaymentIntent com método de pagamento PIX
      console.log("Processando pagamento com PIX");
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(course.finalPrice * 100),
        currency: 'brl',
        payment_method_types: ['pix'],
        description: `Compra do curso ${course.title}`,
      });
      
      paymentResult = {
        success: true,
        status: 'awaiting_pix',
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        pixQrCode: paymentIntent.next_action?.pix_display_qr_code?.image_url_png,
      };
      
    } else if (paymentMethod === "bank-slip") {
      // Para boleto bancário, criar um PaymentIntent com método de pagamento boleto
      console.log("Processando pagamento com boleto bancário");
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(course.finalPrice * 100),
        currency: 'brl',
        payment_method_types: ['boleto'],
        description: `Compra do curso ${course.title}`,
      });
      
      paymentResult = {
        success: true,
        status: 'awaiting_payment',
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        boletoUrl: paymentIntent.next_action?.boleto_display_details?.hosted_voucher_url,
      };
    }
    
    // Se o usuário estiver autenticado, registrar a compra no Supabase
    if (user) {
      // Criar cliente Supabase com service role para ignorar RLS
      const supabaseAdmin = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
        { auth: { persistSession: false } }
      );
      
      // Registrar a compra na tabela de pagamentos
      await supabaseAdmin.from('payments').insert({
        user_id: user.id,
        amount: course.finalPrice,
        payment_method: paymentMethod,
        stripe_payment_id: paymentResult.id,
        status: paymentResult.status,
        course_title: course.title,
      });
      
      // Se o pagamento for bem-sucedido, também criar uma matrícula
      if (paymentResult.success && paymentMethod === "credit-card") {
        // Consultar o ID da classe que corresponde ao curso comprado
        const { data: classData } = await supabaseAdmin
          .from('classes')
          .select('id')
          .eq('name', 'Formação Completa em QA')
          .limit(1);
        
        if (classData && classData.length > 0) {
          await supabaseAdmin.from('enrollments').insert({
            student_id: user.id,
            user_id: user.id,
            class_id: classData[0].id,
            status: 'active',
          });
        }
      }
    }
    
    // Retornar resultado do pagamento para o frontend
    return new Response(JSON.stringify(paymentResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    console.error("Erro no processamento do pagamento:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Ocorreu um erro ao processar o pagamento" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
