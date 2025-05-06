
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
    const { paymentMethod, cardData, course, userId, registrationData } = await req.json();

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
    let userEmail, userName;
    if (userId) {
      const { data: userData, error: userError } = await supabaseAdmin
        .from("users")
        .select("email, name")
        .eq("id", userId)
        .single();

      if (!userError && userData) {
        userEmail = userData.email;
        userName = userData.name;
      } else {
        console.error("Error fetching user data:", userError);
      }
    } else if (registrationData) {
      userEmail = registrationData.email;
      userName = registrationData.name;
    }

    if (!userEmail) {
      throw new Error("User email is required for payment processing");
    }

    let result;

    // Create a Stripe checkout session
    if (paymentMethod === "checkout") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: userEmail,
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
        success_url: `${req.headers.get("origin")}/enrollment?success=true`,
        cancel_url: `${req.headers.get("origin")}/checkout?canceled=true`,
        metadata: {
          userId: userId || '',
          registrationData: registrationData ? JSON.stringify(registrationData) : '',
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
      
      // Handle user creation if registration data is provided
      if (registrationData && !userId) {
        // Create the user in auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: registrationData.email,
          password: registrationData.password,
          email_confirm: true,
          user_metadata: {
            name: registrationData.name,
            role: registrationData.role || 'student'
          }
        });
        
        if (authError) {
          console.error("Error creating auth user:", authError);
          throw new Error(`Failed to create user: ${authError.message}`);
        }
        
        userId = authData.user.id;
        
        // Create user in public.users table
        const { error: insertError } = await supabaseAdmin
          .from("users")
          .insert({
            id: userId,
            email: registrationData.email,
            name: registrationData.name,
            role: registrationData.role || 'student',
            is_active: true
          });
          
        if (insertError) {
          console.error("Error creating user record:", insertError);
        }
      } else if (userId) {
        // Update user to active status
        const { error: updateUserError } = await supabaseAdmin
          .from("users")
          .update({ is_active: true })
          .eq("id", userId);
          
        if (updateUserError) {
          console.error("Error activating user:", updateUserError);
        } else {
          console.log("User activated:", userId);
        }
      }
      
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
    
    // Update user payment status in Supabase if there's a userId
    if (result.success && userId) {
      const paymentData = {
        user_id: userId,
        payment_status: result.status,
        payment_method: paymentMethod,
        stripe_payment_id: result.id,
        payment_date: result.status === "completed" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };
      
      const { error: paymentError } = await supabaseAdmin
        .from("user_payments")
        .upsert(paymentData);
      
      if (paymentError) {
        console.error("Error updating payment status:", paymentError);
      } else {
        console.log("Payment status updated for user:", userId);
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
