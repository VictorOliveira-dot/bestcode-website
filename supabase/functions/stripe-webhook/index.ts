
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
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Extract customer email and metadata
        const customerEmail = session.customer_email;
        const userId = session.metadata?.userId;
        const applicationId = session.metadata?.applicationId;
        const paymentMethod = session.metadata?.paymentMethod;
        const testMode = session.metadata?.testMode === "true";
        
        console.log(`💰 Payment successful for session ${session.id}. User ID: ${userId}, Payment Method: ${paymentMethod}, Test Mode: ${testMode ? 'Yes' : 'No'}`);
        
        if (userId) {
          // Verificar se o usuário é um estudante
          const { data: userData, error: userError } = await supabaseAdmin
            .from("users")
            .select("role")
            .eq("id", userId)
            .single();
            
          if (userError) {
            console.error("❌ Error fetching user role:", userError);
          } else if (userData.role !== 'student') {
            console.error(`⚠️ User ${userId} is not a student. Role: ${userData.role}`);
            return new Response(JSON.stringify({ 
              received: true, 
              message: "User is not a student, not activating account" 
            }), {
              headers: { "Content-Type": "application/json" },
              status: 200,
            });
          }
          
          // CRITICAL: Update user to active status (only for students)
          const { error: userUpdateError } = await supabaseAdmin
            .from("users")
            .update({ is_active: true })
            .eq("id", userId);
            
          if (userUpdateError) {
            console.error("❌ Error updating user status:", userUpdateError);
            console.error("Error details:", JSON.stringify(userUpdateError));
            throw new Error(`Failed to activate student account: ${userUpdateError.message}`);
          } else {
            console.log(`✅ Student ${userId} activated successfully`);
            
            // Add more detailed logging about the user being activated
            const { data: updatedUser, error: checkError } = await supabaseAdmin
              .from("users")
              .select("id, email, is_active")
              .eq("id", userId)
              .single();
              
            if (!checkError && updatedUser) {
              console.log(`✅ Verified activation: User ${updatedUser.email} (${updatedUser.id}) is_active=${updatedUser.is_active}`);
            } else {
              console.error("❌ Could not verify user activation:", checkError);
            }
            
            // Send confirmation email to student
            try {
              const { data: emailData, error: emailError } = await supabaseAdmin
                .from("users")
                .select("email, name")
                .eq("id", userId)
                .single();
                
              if (!emailError && emailData) {
                // Add notification to the student's notifications
                const { error: notificationError } = await supabaseAdmin
                  .from("notifications")
                  .insert({
                    user_id: userId,
                    title: "Pagamento Confirmado",
                    message: `Seu pagamento foi confirmado! Sua conta está ativa e você já tem acesso completo ao curso ${session.metadata?.courseTitle || 'Formação Completa em QA'}.`,
                    read: false
                  });
                  
                if (notificationError) {
                  console.error("❌ Error creating notification:", notificationError);
                } else {
                  console.log(`✉️ Notification sent to user ${userId} about payment confirmation`);
                }
              }
            } catch (emailErr) {
              console.error("❌ Error sending confirmation notification:", emailErr);
            }
          }
          
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
        } else if (customerEmail) {
          // If no userId in metadata, try to find user by email
          const { data: userData, error: userFetchError } = await supabaseAdmin
            .from("users")
            .select("id, role")
            .eq("email", customerEmail)
            .single();
            
          if (userFetchError || !userData) {
            console.error("❌ Error finding user by email:", userFetchError);
          } else if (userData.role !== 'student') {
            console.log(`⚠️ User with email ${customerEmail} is not a student. Not activating.`);
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
              console.error("❌ Error updating user status:", userUpdateError);
              console.error("Error details:", JSON.stringify(userUpdateError));
            } else {
              console.log(`✅ User with email ${customerEmail} activated successfully`);
              
              // Add more detailed logging about the user being activated
              const { data: updatedUser, error: checkError } = await supabaseAdmin
                .from("users")
                .select("id, email, is_active")
                .eq("id", userId)
                .single();
                
              if (!checkError && updatedUser) {
                console.log(`✅ Verified activation: User ${updatedUser.email} (${updatedUser.id}) is_active=${updatedUser.is_active}`);
              } else {
                console.error("❌ Could not verify user activation:", checkError);
              }
              
              // Add notification
              const { error: notificationError } = await supabaseAdmin
                .from("notifications")
                .insert({
                  user_id: userId,
                  title: "Pagamento Confirmado",
                  message: "Seu pagamento foi confirmado! Sua conta está ativa e você já tem acesso completo ao curso.",
                  read: false
                });
                
              if (notificationError) {
                console.error("❌ Error creating notification:", notificationError);
              } else {
                console.log(`✉️ Notification sent to user ${userId} about payment confirmation`);
              }
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
              console.error("❌ Error recording payment:", paymentError);
            } else {
              console.log(`✅ Payment record created for user with email ${customerEmail}`);
            }
          }
        } else {
          console.error("❌ No user identifier found in session");
        }
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} succeeded.`);
        
        // If the payment intent has metadata with user ID, update user status
        const userId = paymentIntent.metadata?.userId;
        
        if (userId) {
          // Check if this is a payment for our course
          // Update user to active status (only for students)
          const { error: userUpdateError } = await supabaseAdmin
            .from("users")
            .update({ is_active: true })
            .eq("id", userId);
            
          if (userUpdateError) {
            console.error("Error updating user status from payment intent:", userUpdateError);
          } else {
            console.log(`User ${userId} activated successfully from payment intent`);
            
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
