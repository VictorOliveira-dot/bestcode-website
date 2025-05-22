
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
        console.log("✅ Webhook signature verified successfully");
      } catch (error) {
        console.error(`❌ Webhook signature verification failed: ${error.message}`);
        return new Response(`Webhook signature verification failed`, { status: 400 });
      }
    } else {
      // For development without signature verification
      event = JSON.parse(body);
      console.log("⚠️ Using webhook without signature verification (development mode)");
    }
    
    console.log(`Received event: ${event.type}`);

    // Helper function to activate a student account
    async function activateStudentAccount(userId) {
      if (!userId) {
        console.error("❌ Cannot activate account: No user ID provided");
        return false;
      }

      console.log(`🔄 Attempting to activate student account for user ${userId}`);

      try {
        // First check if user is a student
        const { data: userData, error: userError } = await supabaseAdmin
          .from("users")
          .select("role, is_active")
          .eq("id", userId)
          .single();
          
        if (userError) {
          console.error("❌ Error checking user role:", userError);
          return false;
        }
        
        if (userData.role !== 'student') {
          console.error(`⚠️ User ${userId} is not a student. Role: ${userData.role}`);
          return false;
        }

        if (userData.is_active) {
          console.log(`✅ User ${userId} is already active`);
          return true;
        }
          
        // Use the RPC call to directly update the database for more reliable updates
        const { data: activationData, error: activationError } = await supabaseAdmin
          .rpc('activate_student_account', { user_id: userId });
          
        if (activationError) {
          console.error("❌ Error updating user status with RPC call:", activationError);
          console.error("Trying direct update as fallback...");
          
          // Direct update as fallback
          const { error: directUpdateError } = await supabaseAdmin
            .from("users")
            .update({ 
              is_active: true,
              updated_at: new Date().toISOString()
            })
            .eq("id", userId)
            .eq("role", "student");
            
          if (directUpdateError) {
            console.error("❌ Error with fallback direct update:", directUpdateError);
            return false;
          } else {
            console.log(`✅ Student ${userId} activated successfully with direct update`);
          }
        } else {
          console.log(`✅ Student ${userId} activated successfully with RPC call: ${activationData}`);
        }
          
        // Verify the account was actually activated
        const { data: verifyData, error: verifyError } = await supabaseAdmin
          .from("users")
          .select("id, email, role, is_active")
          .eq("id", userId)
          .single();
          
        if (verifyError) {
          console.error("❌ Could not verify user activation:", verifyError);
          return false;
        }
          
        console.log(`✅ Verified activation: User ${verifyData.email} (${verifyData.id}) role=${verifyData.role} is_active=${verifyData.is_active}`);
        return verifyData.is_active;

      } catch (error) {
        console.error(`❌ Unexpected error activating account: ${error.message}`);
        return false;
      }
    }

    // Helper function to create a notification for the user
    async function createNotification(userId, title, message) {
      try {
        const { error: notificationError } = await supabaseAdmin
          .from("notifications")
          .insert({
            user_id: userId,
            title: title,
            message: message,
            read: false
          });
          
        if (notificationError) {
          console.error("❌ Error creating notification:", notificationError);
          return false;
        } else {
          console.log(`✉️ Notification sent to user ${userId}`);
          return true;
        }
      } catch (error) {
        console.error(`❌ Error creating notification: ${error.message}`);
        return false;
      }
    }
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const isTestMode = session.livemode === false;
        
        // Extract customer info and metadata
        const customerEmail = session.customer_email;
        const userId = session.metadata?.userId;
        const applicationId = session.metadata?.applicationId;
        const paymentMethod = session.metadata?.paymentMethod;
        
        console.log(`💰 Payment ${isTestMode ? '[TEST MODE] ' : ''}successful for session ${session.id}. User ID: ${userId}, Payment Method: ${paymentMethod}`);
        
        if (userId) {
          // Activate the student account
          const activated = await activateStudentAccount(userId);
          
          if (activated) {
            // Send confirmation notification
            await createNotification(
              userId, 
              "Pagamento Confirmado", 
              `Seu pagamento foi confirmado! Sua conta está ativa e você já tem acesso completo ao curso ${session.metadata?.courseTitle || 'Formação Completa em QA'}.`
            );
            
            // Update payment status to completed
            const { error: paymentUpdateError } = await supabaseAdmin
              .from("user_payments")
              .update({ 
                payment_status: "completed",
                payment_date: new Date().toISOString()
              })
              .eq("stripe_payment_id", session.id);
              
            if (paymentUpdateError) {
              console.error("❌ Error updating payment status:", paymentUpdateError);
            } else {
              console.log(`✅ Payment status updated for session ${session.id}`);
            }
            
            // If application ID is provided, update application status
            if (applicationId) {
              const { error: applicationError } = await supabaseAdmin
                .from("student_applications")
                .update({ status: "approved" })
                .eq("id", applicationId);
                
              if (applicationError) {
                console.error("❌ Error updating application status:", applicationError);
              } else {
                console.log(`✅ Application ${applicationId} marked as approved`);
              }
            }
          }
        } else if (customerEmail) {
          // If no userId in metadata, try to find user by email
          const { data: userData, error: userFetchError } = await supabaseAdmin
            .from("users")
            .select("id, role")
            .eq("email", customerEmail)
            .single();
            
          if (userFetchError || !userData) {
            console.error("❌ Error finding user by email:", userFetchError);
          } else {
            const userId = userData.id;
            // Activate the student account
            const activated = await activateStudentAccount(userId);
            
            if (activated) {
              // Send confirmation notification
              await createNotification(
                userId, 
                "Pagamento Confirmado", 
                "Seu pagamento foi confirmado! Sua conta está ativa e você já tem acesso completo ao curso."
              );
              
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
                console.error("❌ Error recording payment:", paymentError);
              } else {
                console.log(`✅ Payment record created for user with email ${customerEmail}`);
              }
            }
          }
        } else {
          console.error("❌ No user identifier found in session");
        }
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const isTestMode = paymentIntent.livemode === false;
        console.log(`PaymentIntent ${isTestMode ? '[TEST MODE] ' : ''}for ${paymentIntent.amount} succeeded.`);
        
        // If the payment intent has metadata with user ID, update user status
        const userId = paymentIntent.metadata?.userId;
        
        if (userId) {
          // Activate the student account
          const activated = await activateStudentAccount(userId);
          
          if (activated) {
            // Update payment status
            const { error: paymentUpdateError } = await supabaseAdmin
              .from("user_payments")
              .update({ 
                payment_status: "completed",
                payment_date: new Date().toISOString()
              })
              .eq("user_id", userId)
              .eq("payment_status", "pending");
              
            if (paymentUpdateError) {
              console.error("Error updating payment status from payment intent:", paymentUpdateError);
            } else {
              console.log(`✅ Payment status updated for user ${userId}`);
            }
          }
        }
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log(`Payment failed: ${paymentIntent.last_payment_error?.message}`);
        
        // If the payment intent has metadata with user ID, update payment status
        const userId = paymentIntent.metadata?.userId;
        
        if (userId) {
          const { error: paymentUpdateError } = await supabaseAdmin
            .from("user_payments")
            .update({ 
              payment_status: "failed",
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId)
            .eq("payment_status", "pending");
            
          if (paymentUpdateError) {
            console.error("Error updating payment status to failed:", paymentUpdateError);
          }
        }
        break;
      }
      
      // Handle PIX-specific events
      case 'payment_intent.processing': {
        const paymentIntent = event.data.object;
        console.log(`Payment processing: ${paymentIntent.id}`);
        
        // Check if this is a PIX payment
        const paymentMethod = paymentIntent.payment_method_types?.includes('pix') ? 'pix' : '';
        
        if (paymentMethod === 'pix') {
          const userId = paymentIntent.metadata?.userId;
          
          if (userId) {
            const { error: paymentUpdateError } = await supabaseAdmin
              .from("user_payments")
              .update({ 
                payment_status: "processing",
                updated_at: new Date().toISOString()
              })
              .eq("user_id", userId)
              .eq("payment_status", "pending");
              
            if (paymentUpdateError) {
              console.error("Error updating PIX payment status to processing:", paymentUpdateError);
            }
          }
        }
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
    console.error(`❌ Error processing webhook: ${error.message}`);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
});
