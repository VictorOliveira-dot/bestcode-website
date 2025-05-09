
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
    // Get request body
    const { paymentMethod, cardData, course, userId } = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2022-11-15",
    });

    console.log(`Processing payment with method: ${paymentMethod}`);

    // Create Supabase client with service role key to update user status
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Get user data and verify it's a student
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("email, name, role")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      throw new Error("User not found");
    }

    // Check if user is a student
    if (userData.role !== 'student') {
      console.error("User is not a student:", userData.role);
      throw new Error("Only students can make payments");
    }

    // Get application data
    const { data: applicationData } = await supabaseAdmin
      .from("student_applications")
      .select("id")
      .eq("user_id", userId)
      .single();

    const applicationId = applicationData?.id;

    // Create a Stripe checkout session - only support Stripe Checkout
    if (paymentMethod === "checkout") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: userData.email,
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: course.title || 'Formação Completa em QA',
                description: 'Curso completo de formação em Quality Assurance',
              },
              unit_amount: Math.round((course.finalPrice || 1797) * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.get("origin")}/checkout?success=true`,
        cancel_url: `${req.headers.get("origin")}/checkout?canceled=true`,
        metadata: {
          userId: userId,
          applicationId: applicationId || '',
        },
      });

      // Salvar dados do checkout na tabela user_payments
      const { error: paymentError } = await supabaseAdmin
        .from("user_payments")
        .insert({
          user_id: userId,
          application_id: applicationId,
          stripe_session_id: session.id,
          checkout_url: session.url,
          amount: course.finalPrice || 1797,
          status: "pending",
          created_at: new Date().toISOString(),
        });

      if (paymentError) {
        console.error("Erro ao salvar dados de pagamento:", paymentError);
        // Continue mesmo com erro no salvamento para não interromper o fluxo
      }

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
    } 
    else {
      // We no longer support other payment methods
      throw new Error("Only Stripe Checkout payment method is supported");
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    
    // Return error response
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || "Unknown error"
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
