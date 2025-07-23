
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Set test mode flag
const isTestMode = true;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { paymentMethod, cardData, course, userId, applicationId } = await req.json();

    // Initialize Stripe with the test key from environment variables
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    
    // Verify if we're using a test key
    if (!stripeKey.startsWith('sk_test_')) {
      console.error("ERROR: Using a live key in test mode! Please set a test key.");
      throw new Error("Configuration error: Test mode requires a Stripe test key.");
    }
    
    // console.log(`Using Stripe in TEST mode with key prefix: ${stripeKey.substring(0, 8)}...`);
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2022-11-15",
    });

    // console.log(`[TEST MODE] Processing payment with method: ${paymentMethod}`);

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

    // Set payment amount based on payment method
    let amount = 0;
    let paymentType = "payment";
    
    // Configure line items based on payment method
    let lineItems = [];
    
    if (paymentMethod === "pix" || paymentMethod === "credit-full") {
      // PIX or credit card one-time full payment
      amount = 400000; // R$4,000.00 in cents
      paymentType = "payment";
      
      lineItems.push({
        price_data: {
          currency: 'brl',
          product_data: {
            name: course.title || 'Formação Completa em QA',
            description: 'Curso completo de formação em Quality Assurance',
          },
          unit_amount: amount, // R$4,000.00 in cents
        },
        quantity: 1,
      });
    } 
    else if (paymentMethod === "credit-installments") {
      // Credit card installments (handled by Stripe)
      amount = 449900; // R$4,499.00 in cents (12x R$374.91)
      paymentType = "payment";
      
      lineItems.push({
        price_data: {
          currency: 'brl',
          product_data: {
            name: course.title || 'Formação Completa em QA',
            description: 'Curso completo de formação em Quality Assurance - Parcelado',
          },
          unit_amount: amount,
        },
        quantity: 1,
      });
    }
    else if (paymentMethod === "boleto") {
      // Boleto installments (handled by Stripe)
      amount = 449900; // R$4,499.00 in cents
      paymentType = "payment";
      
      lineItems.push({
        price_data: {
          currency: 'brl',
          product_data: {
            name: course.title || 'Formação Completa em QA',
            description: 'Curso completo de formação em Quality Assurance - Boleto Parcelado',
          },
          unit_amount: amount,
        },
        quantity: 1,
      });
    }

    // Create a Stripe checkout session - FORCE TEST MODE
    const session = await stripe.checkout.sessions.create({
      payment_method_types: getPaymentMethodTypes(paymentMethod),
      customer_email: userData.email,
      line_items: lineItems,
      mode: paymentType,
      payment_intent_data: {
        setup_future_usage: paymentMethod.includes('credit') ? 'on_session' : undefined,
        metadata: {
          userId: userId,
          applicationId: applicationId || '',
          paymentMethod: paymentMethod,
          testMode: "true" // Force test mode flag as string
        },
      },
      success_url: `${req.headers.get("origin")}/checkout?success=true`,
      cancel_url: `${req.headers.get("origin")}/checkout?canceled=true`,
      metadata: {
        userId: userId,
        applicationId: applicationId || '',
        paymentMethod: paymentMethod,
        testMode: "true", // Force test mode flag as string
      },
    });

    // Record the pending payment
    const paymentData = {
      user_id: userId,
      payment_status: "pending",
      payment_method: getPaymentMethodTypeForDB(paymentMethod),
      stripe_payment_id: session.id,
      payment_amount: amount / 100, // Convert from cents to real
      payment_date: new Date().toISOString(),
      application_id: applicationId || null,
    };
    
    // Insert payment record
    const { error: paymentUpdateError } = await supabaseAdmin
      .from("user_payments")
      .insert(paymentData);
    
    if (paymentUpdateError) {
      console.error("Error recording payment:", paymentUpdateError);
    } else {
      // console.log(`[TEST MODE] Payment record created for user ${userId}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      status: "pending",
      id: session.id,
      url: session.url,
      testMode: true // Force test mode flag as boolean
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
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

// Helper functions
function getPaymentMethodTypes(paymentMethod: string): string[] {
  switch (paymentMethod) {
    case "pix":
      return ['pix'];
    case "credit-full":
    case "credit-installments":
      return ['card'];
    case "boleto":
      return ['boleto'];
    default:
      return ['card'];
  }
}

function getPaymentMethodTypeForDB(paymentMethod: string): string {
  switch (paymentMethod) {
    case "pix":
      return "pix";
    case "credit-full":
    case "credit-installments":
      return "credit_card";
    case "boleto":
      return "boleto";
    default:
      return "other";
  }
}
