
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

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2022-11-15",
    });

    console.log(`Processing payment with method: ${paymentMethod} for user: ${userId}`);

    let result = {
      success: false,
      status: "pending"
    };

    // Simulate payment processing based on payment method
    if (paymentMethod === "credit-card") {
      // In real implementation, you would use Stripe to charge the card
      // For this simulation, we'll assume the payment is successful
      console.log("Processing credit card payment");
      
      // Simulating success (in real case, use Stripe Checkout or PaymentIntent)
      result = { 
        success: true, 
        status: "completed",
        id: `sim_${Date.now()}`
      };
    } 
    else if (paymentMethod === "pix") {
      console.log("Generating PIX QR code");
      
      // Simulate PIX payment (in real case, use Stripe or local payment provider)
      // Using a placeholder QR code image
      result = { 
        success: true, 
        status: "pending",
        id: `pix_${Date.now()}`,
        pixQrCode: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
      };
    }
    else if (paymentMethod === "bank-slip") {
      console.log("Generating bank slip");
      
      // Simulate bank slip generation (in real case, use local payment provider)
      result = { 
        success: true, 
        status: "pending",
        id: `boleto_${Date.now()}`,
        boletoUrl: "https://example.com/boleto/123"
      };
    }

    // Create Supabase client to update user payment status
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );
    
    // Update user payment status in Supabase
    if (result.success) {
      const paymentData = {
        payment_status: result.status,
        payment_method: paymentMethod,
        stripe_payment_id: result.id,
        payment_date: result.status === "completed" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };
      
      const { error: updateError } = await supabaseAdmin
        .from("user_payments")
        .update(paymentData)
        .eq("user_id", userId);
      
      if (updateError) {
        console.error("Error updating payment status:", updateError);
      } else {
        console.log("Payment status updated for user:", userId);
      }
      
      // If payment is completed, update the user to active
      if (result.status === "completed") {
        const { error: userUpdateError } = await supabaseAdmin
          .from("users")
          .update({ role: "student" })
          .eq("id", userId);
        
        if (userUpdateError) {
          console.error("Error updating user role:", userUpdateError);
        } else {
          console.log("User activated:", userId);
        }
      }
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
