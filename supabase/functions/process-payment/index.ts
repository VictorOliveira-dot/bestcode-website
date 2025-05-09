
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

    // Get user data for the checkout
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("email, name")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      throw new Error("User not found");
    }

    let result;

    // Create a Stripe checkout session
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
        },
      });

      result = { 
        success: true, 
        status: "pending",
        id: session.id,
        url: session.url
      };
    } 
    else if (paymentMethod === "credit-card") {
      // In real implementation, you would use Stripe to charge the card
      // For this simulation, we'll assume the payment is successful
      console.log("Processing credit card payment");
      
      // Update user to active status
      const { error: updateUserError } = await supabaseAdmin
        .from("users")
        .update({ is_active: true })
        .eq("id", userId);
        
      if (updateUserError) {
        console.error("Error activating user:", updateUserError);
        throw new Error("Failed to activate user account");
      } else {
        console.log("User activated:", userId);
      }
      
      // Record payment in user_payments table
      const { error: paymentError } = await supabaseAdmin
        .from("user_payments")
        .insert({
          user_id: userId,
          payment_status: "completed",
          payment_method: paymentMethod,
          stripe_payment_id: `sim_${Date.now()}`,
          payment_amount: course.finalPrice,
          payment_date: new Date().toISOString(),
        });
        
      if (paymentError) {
        console.error("Error recording payment:", paymentError);
      }
      
      result = { 
        success: true, 
        status: "completed",
        id: `sim_${Date.now()}`
      };
    } 
    else if (paymentMethod === "pix") {
      console.log("Generating PIX QR code");
      
      // Record pending payment in database
      const { error: paymentError } = await supabaseAdmin
        .from("user_payments")
        .insert({
          user_id: userId,
          payment_status: "pending",
          payment_method: "pix",
          payment_amount: course.finalPrice,
        });
        
      if (paymentError) {
        console.error("Error recording pending PIX payment:", paymentError);
      }
      
      result = { 
        success: true, 
        status: "pending",
        id: `pix_${Date.now()}`,
        pixQrCode: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
      };
    }
    else if (paymentMethod === "bank-slip") {
      console.log("Generating bank slip");
      
      // Record pending payment in database
      const { error: paymentError } = await supabaseAdmin
        .from("user_payments")
        .insert({
          user_id: userId,
          payment_status: "pending",
          payment_method: "bank-slip",
          payment_amount: course.finalPrice,
        });
        
      if (paymentError) {
        console.error("Error recording pending bank slip payment:", paymentError);
      }
      
      result = { 
        success: true, 
        status: "pending",
        id: `boleto_${Date.now()}`,
        boletoUrl: "https://example.com/boleto/123"
      };
    }
    
    console.log("Payment processed successfully");
    
    // Return successful response
    return new Response(JSON.stringify(result), {
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
