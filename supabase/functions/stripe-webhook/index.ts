
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This is your Stripe webhook secret for testing your endpoint locally
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  const signature = req.headers.get("stripe-signature");
  
  try {
    // Get the raw body
    const body = await req.text();
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2022-11-15",
    });

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );
    
    let event;
    
    // Verify webhook signature
    if (endpointSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      } catch (error) {
        console.error(`Webhook signature verification failed: ${error.message}`);
        return new Response(`Webhook signature verification failed`, { status: 400 });
      }
    } else {
      // For development without signature verification
      event = JSON.parse(body);
    }
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Extract customer email and metadata
        const customerEmail = session.customer_email;
        const userId = session.metadata?.userId;
        const applicationId = session.metadata?.applicationId;
        
        console.log(`Payment successful for session ${session.id}. User ID: ${userId}, Application ID: ${applicationId}`);
        
        if (userId) {
          // Verificar se o usuário é um estudante
          const { data: userData, error: userError } = await supabaseAdmin
            .from("users")
            .select("role")
            .eq("id", userId)
            .single();
            
          if (userError) {
            console.error("Error fetching user role:", userError);
          } else if (userData.role !== 'student') {
            console.error(`User ${userId} is not a student. Role: ${userData.role}`);
            return new Response(JSON.stringify({ 
              received: true, 
              message: "User is not a student, not activating account" 
            }), {
              headers: { "Content-Type": "application/json" },
              status: 200,
            });
          }
          
          // Update user to active status (only for students)
          const { error: userUpdateError } = await supabaseAdmin
            .from("users")
            .update({ is_active: true })
            .eq("id", userId);
            
          if (userUpdateError) {
            console.error("Error updating user status:", userUpdateError);
          } else {
            console.log(`Student ${userId} activated successfully`);
          }
          
          // Update payment status
          const paymentData = {
            user_id: userId,
            payment_status: "completed",
            payment_method: "stripe", 
            stripe_payment_id: session.id,
            payment_amount: session.amount_total / 100,
            payment_date: new Date().toISOString()
          };
          
          // Add application_id if available
          if (applicationId) {
            paymentData.application_id = applicationId;
            
            // Also update the application status
            const { error: applicationError } = await supabaseAdmin
              .from("student_applications")
              .update({ status: "approved" })
              .eq("id", applicationId);
              
            if (applicationError) {
              console.error("Error updating application status:", applicationError);
            } else {
              console.log(`Application ${applicationId} marked as approved`);
            }
          }
          
          // Record payment
          const { error: paymentUpdateError } = await supabaseAdmin
            .from("user_payments")
            .insert(paymentData);
            
          if (paymentUpdateError) {
            console.error("Error recording payment:", paymentUpdateError);
          } else {
            console.log(`Payment record created for user ${userId}`);
          }
        } else if (customerEmail) {
          // If no userId in metadata, try to find user by email
          const { data: userData, error: userFetchError } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("email", customerEmail)
            .single();
            
          if (userFetchError || !userData) {
            console.error("Error finding user by email:", userFetchError);
          } else {
            // Update user to active status
            const userId = userData.id;
            const { error: userUpdateError } = await supabaseAdmin
              .from("users")
              .update({ 
                is_active: true 
              })
              .eq("id", userId);
              
            if (userUpdateError) {
              console.error("Error updating user status:", userUpdateError);
            } else {
              console.log(`User with email ${customerEmail} activated successfully`);
            }
            
            // Record payment
            const { error: paymentError } = await supabaseAdmin
              .from("user_payments")
              .insert({
                user_id: userId,
                payment_status: "completed",
                payment_method: "stripe", 
                stripe_payment_id: session.id,
                payment_amount: session.amount_total / 100,
                payment_date: new Date().toISOString(),
              });
              
            if (paymentError) {
              console.error("Error recording payment:", paymentError);
            } else {
              console.log(`Payment record created for user with email ${customerEmail}`);
            }
          }
        } else {
          console.error("No user identifier found in session");
        }
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} succeeded.`);
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log(`Payment failed: ${paymentIntent.last_payment_error?.message}`);
        break;
      }
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
});
