
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This is your Stripe webhook secret for testing your endpoint locally
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

// Enhanced logging function for tracking webhook flow
const logEvent = (message: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] [STRIPE-WEBHOOK] ${message}${detailsStr}`);
};

serve(async (req) => {
  logEvent("Webhook received");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  const signature = req.headers.get("stripe-signature");
  
  try {
    // Get the raw body
    const body = await req.text();
    logEvent("Request body received", { bodyLength: body.length });
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2022-11-15",
    });

    // Create Supabase admin client with service role key for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );
    
    let event;
    
    // Verify webhook signature
    if (endpointSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
        logEvent("✅ Webhook signature verified successfully");
      } catch (error) {
        logEvent(`❌ Webhook signature verification failed: ${error.message}`);
        return new Response(`Webhook signature verification failed`, { status: 400 });
      }
    } else {
      // For development without signature verification
      event = JSON.parse(body);
      logEvent("⚠️ Using webhook without signature verification (development mode)");
    }
    
    logEvent(`Received event: ${event.type}`, { eventId: event.id });
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Extract customer email and metadata
        const customerEmail = session.customer_email;
        const userId = session.metadata?.userId;
        const applicationId = session.metadata?.applicationId;
        const paymentMethod = session.metadata?.paymentMethod;
        const testMode = session.livemode === false; // Determine if it's test mode
        const courseTitle = session.metadata?.courseTitle || 'Formação Completa em QA';
        
        logEvent(`💰 Payment successful for session ${session.id}`, { 
          userId, 
          customerEmail, 
          paymentMethod, 
          testMode: testMode ? 'Yes' : 'No',
          courseTitle,
          livemode: session.livemode
        });

        // Debug: Check if we have valid user identifiers
        if (!userId && !customerEmail) {
          logEvent("❌ No user identifier found in session");
          throw new Error("No user identifier found in checkout session");
        }
        
        if (userId) {
          logEvent(`Processing activation for user ID: ${userId}`);
          
          // Verificar se o usuário é um estudante
          const { data: userData, error: userError } = await supabaseAdmin
            .from("users")
            .select("role, email, name, is_active")
            .eq("id", userId)
            .single();
            
          if (userError) {
            logEvent("❌ Error fetching user role:", userError);
            throw new Error(`Failed to fetch user information: ${userError.message}`);
          } else if (userData.role !== 'student') {
            logEvent(`⚠️ User ${userId} is not a student. Role: ${userData.role}`);
            return new Response(JSON.stringify({ 
              received: true, 
              message: "User is not a student, not activating account" 
            }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            });
          }
          
          // Check if user is already active
          if (userData.is_active) {
            logEvent(`ℹ️ User ${userId} is already active`);
          } else {
            logEvent(`🔄 Activating user ${userId} (Test mode: ${testMode ? 'Yes' : 'No'})`);
          }
          
          // CRITICAL: Always activate user regardless of test mode
          logEvent("🔓 Activating student account (works in both test and live mode)");
          
          // Use direct update to ensure activation
          const { error: activationError } = await supabaseAdmin
            .from("users")
            .update({ 
              is_active: true,
              updated_at: new Date().toISOString()
            })
            .eq("id", userId)
            .eq("role", "student");
            
          if (activationError) {
            logEvent("❌ Error activating user account:", activationError);
            throw new Error(`Failed to activate student account: ${activationError.message}`);
          } else {
            logEvent(`✅ Student ${userId} activated successfully`);
          }
          
          // Verify the activation by checking the user's status again
          const { data: updatedUser, error: checkError } = await supabaseAdmin
            .from("users")
            .select("id, email, name, role, is_active")
            .eq("id", userId)
            .single();
            
          if (!checkError && updatedUser) {
            logEvent(`✅ Verification: User ${updatedUser.email} (${updatedUser.id})`, {
              role: updatedUser.role,
              is_active: updatedUser.is_active,
              name: updatedUser.name
            });

            if (!updatedUser.is_active) {
              logEvent("⚠️ WARNING: User is still not active after update attempts!");
            }
          } else {
            logEvent("❌ Could not verify user activation:", checkError);
          }
          
          // Get payment amount from session or use a default value
          const paymentAmount = session.amount_total 
            ? session.amount_total / 100 
            : (paymentMethod === "credit-installments" ? 4499.00 : 4000.00);

          // Record payment information
          logEvent("Recording payment in user_payments table");
          const { error: paymentError } = await supabaseAdmin
            .from("user_payments")
            .insert({
              user_id: userId,
              stripe_payment_id: session.id,
              payment_method: paymentMethod || "stripe",
              payment_status: "completed",
              payment_amount: paymentAmount,
              payment_date: new Date().toISOString(),
              application_id: applicationId
            });
            
          if (paymentError) {
            logEvent("❌ Error recording payment:", paymentError);
          } else {
            logEvent(`✅ Payment record created for user ${userId}`);
          }
          
          // Send notification to student
          logEvent("Sending notification to student");
          const { error: notificationError } = await supabaseAdmin
            .from("notifications")
            .insert({
              user_id: userId,
              title: "Pagamento Confirmado",
              message: `Seu pagamento foi confirmado! Sua conta está ativa e você já tem acesso completo ao curso ${courseTitle}. ${testMode ? '(Pagamento processado em modo teste)' : ''}`,
              read: false
            });
              
          if (notificationError) {
            logEvent("❌ Error creating notification:", notificationError);
          } else {
            logEvent(`✉️ Notification sent to user ${userId} about payment confirmation`);
          }
          
          // If application ID is provided, update application status
          if (applicationId) {
            logEvent(`Updating application ${applicationId} status to approved`);
            const { error: applicationError } = await supabaseAdmin
              .from("student_applications")
              .update({ status: "approved" })
              .eq("id", applicationId);
              
            if (applicationError) {
              logEvent("❌ Error updating application status:", applicationError);
            } else {
              logEvent(`✅ Application ${applicationId} marked as approved`);
            }
          }
        } else if (customerEmail) {
          // If no userId in metadata, try to find user by email
          logEvent(`No userId provided, looking up user by email: ${customerEmail}`);
          
          const { data: userData, error: userFetchError } = await supabaseAdmin
            .from("users")
            .select("id, role, email, name, is_active")
            .eq("email", customerEmail)
            .single();
            
          if (userFetchError || !userData) {
            logEvent("❌ Error finding user by email:", userFetchError);
            throw new Error(`User not found with email ${customerEmail}`);
          } else if (userData.role !== 'student') {
            logEvent(`⚠️ User with email ${customerEmail} is not a student. Not activating.`);
            return new Response(JSON.stringify({ 
              received: true, 
              message: "User is not a student, not activating account" 
            }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            });
          } else {
            // Check if user is already active
            if (userData.is_active) {
              logEvent(`ℹ️ User ${userData.id} is already active`);
            } else {
              logEvent(`🔄 Activating user ${userData.id} (${userData.email}) - Test mode: ${testMode ? 'Yes' : 'No'}`);
            }
            
            // Update user to active status
            const userId = userData.id;
            
            // Always activate regardless of test mode
            logEvent("🔓 Activating student account (works in both test and live mode)");
            const { error: activationError } = await supabaseAdmin
              .from("users")
              .update({ 
                is_active: true,
                updated_at: new Date().toISOString()
              })
              .eq("id", userId)
              .eq("role", "student");
              
            if (activationError) {
              logEvent("❌ Error updating user status:", activationError);
              throw new Error(`Failed to activate student account: ${activationError.message}`);
            } else {
              logEvent(`✅ User with email ${customerEmail} activated successfully`);
            }
              
            // Verify the activation worked
            const { data: updatedUser, error: checkError } = await supabaseAdmin
              .from("users")
              .select("id, email, name, role, is_active")
              .eq("id", userId)
              .single();
              
            if (!checkError && updatedUser) {
              logEvent(`✅ Verification: User ${updatedUser.email} (${updatedUser.id})`, {
                role: updatedUser.role,
                is_active: updatedUser.is_active,
                name: updatedUser.name
              });
              
              if (!updatedUser.is_active) {
                logEvent("⚠️ WARNING: User is still not active after update attempts!");
              }
            } else {
              logEvent("❌ Could not verify user activation:", checkError);
            }
            
            // Get payment amount from session or use a default value
            const paymentAmount = session.amount_total 
              ? session.amount_total / 100 
              : (paymentMethod === "credit-installments" ? 4499.00 : 4000.00);
            
            // Record payment
            logEvent("Recording payment in user_payments table");
            const { error: paymentError } = await supabaseAdmin
              .from("user_payments")
              .insert({
                user_id: userId,
                payment_status: "completed",
                payment_method: paymentMethod || "stripe", 
                stripe_payment_id: session.id,
                payment_amount: paymentAmount,
                payment_date: new Date().toISOString(),
              });
              
            if (paymentError) {
              logEvent("❌ Error recording payment:", paymentError);
            } else {
              logEvent(`✅ Payment record created for user with email ${customerEmail}`);
            }
            
            // Add notification
            logEvent("Sending notification to student");
            const { error: notificationError } = await supabaseAdmin
              .from("notifications")
              .insert({
                user_id: userId,
                title: "Pagamento Confirmado",
                message: `Seu pagamento foi confirmado! Sua conta está ativa e você já tem acesso completo ao curso ${courseTitle}. ${testMode ? '(Pagamento processado em modo teste)' : ''}`,
                read: false
              });
              
            if (notificationError) {
              logEvent("❌ Error creating notification:", notificationError);
            } else {
              logEvent(`✉️ Notification sent to user ${userId} about payment confirmation`);
            }
          }
        } else {
          logEvent("❌ No user identifier found in session");
          throw new Error("No user identifier found in checkout session");
        }
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const testMode = paymentIntent.livemode === false;
        
        logEvent(`PaymentIntent for ${paymentIntent.amount / 100} succeeded`, {
          id: paymentIntent.id,
          testMode: testMode ? 'Yes' : 'No'
        });
        
        // If the payment intent has metadata with user ID, update user status
        const userId = paymentIntent.metadata?.userId;
        
        if (userId) {
          logEvent(`Processing payment_intent.succeeded for userId: ${userId} (Test mode: ${testMode ? 'Yes' : 'No'})`);
          
          // Check if the user is already active
          const { data: userData, error: checkError } = await supabaseAdmin
            .from("users")
            .select("is_active, role, email, name")
            .eq("id", userId)
            .single();
            
          if (checkError) {
            logEvent("❌ Error checking user status:", checkError);
          } else if (userData.is_active) {
            logEvent(`ℹ️ User ${userId} is already active`);
          } else if (userData.role !== 'student') {
            logEvent(`⚠️ User ${userId} is not a student. Role: ${userData.role}`);
          } else {
            logEvent(`🔄 Activating user ${userId} from payment intent (Test mode: ${testMode ? 'Yes' : 'No'})`);
            
            // Always activate regardless of test mode
            logEvent("🔓 Activating student account from payment intent (works in both test and live mode)");
            const { error: activationError } = await supabaseAdmin
              .from("users")
              .update({ 
                is_active: true,
                updated_at: new Date().toISOString() 
              })
              .eq("id", userId)
              .eq("role", "student");
              
            if (activationError) {
              logEvent("❌ Error updating user status from payment intent:", activationError);
            } else {
              logEvent(`✅ User ${userId} activated successfully from payment intent`);
            }
            
            // Verify activation worked
            const { data: updatedUser, error: verifyError } = await supabaseAdmin
              .from("users")
              .select("id, email, name, role, is_active")
              .eq("id", userId)
              .single();
              
            if (!verifyError && updatedUser) {
              logEvent(`✅ Verification after payment_intent: User ${updatedUser.id}`, {
                is_active: updatedUser.is_active
              });
              
              if (!updatedUser.is_active) {
                logEvent("⚠️ WARNING: User is still not active after payment_intent update!");
              }
            }
            
            // Add notification about payment
            const { error: notificationError } = await supabaseAdmin
              .from("notifications")
              .insert({
                user_id: userId,
                title: "Pagamento Confirmado",
                message: `Seu pagamento foi confirmado! Sua conta está ativa e você já tem acesso completo ao curso. ${testMode ? '(Pagamento processado em modo teste)' : ''}`,
                read: false
              });
              
            if (notificationError) {
              logEvent("❌ Error creating payment notification:", notificationError);
            } else {
              logEvent(`✉️ Notification sent about payment confirmation`);
            }
          }
            
          // Update payment status to completed
          logEvent("Updating payment status to completed");
          const { error: paymentUpdateError } = await supabaseAdmin
            .from("user_payments")
            .update({ 
              payment_status: "completed",
              payment_date: new Date().toISOString()
            })
            .eq("user_id", userId)
            .eq("payment_status", "pending");
            
          if (paymentUpdateError) {
            logEvent("❌ Error updating payment status from payment intent:", paymentUpdateError);
          } else {
            logEvent(`✅ Payment status updated to completed for user ${userId}`);
          }
        } else {
          logEvent("⚠️ No userId found in payment intent metadata");
        }
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        logEvent(`Payment failed: ${paymentIntent.last_payment_error?.message}`, {
          id: paymentIntent.id
        });
        
        // If the payment intent has metadata with user ID, update payment status
        const userId = paymentIntent.metadata?.userId;
        
        if (userId) {
          logEvent(`Updating payment status to failed for userId: ${userId}`);
          const { error: paymentUpdateError } = await supabaseAdmin
            .from("user_payments")
            .update({ 
              payment_status: "failed",
              updated_at: new Date().toISOString()
            })
            .eq("user_id", userId)
            .eq("payment_status", "pending");
            
          if (paymentUpdateError) {
            logEvent("❌ Error updating payment status to failed:", paymentUpdateError);
          } else {
            logEvent(`✅ Payment status updated to failed for user ${userId}`);
          }
          
          // Notify user about failed payment
          logEvent("Sending notification about failed payment");
          const { error: notificationError } = await supabaseAdmin
            .from("notifications")
            .insert({
              user_id: userId,
              title: "Falha no Pagamento",
              message: "Houve um problema com seu pagamento. Por favor, verifique seu método de pagamento ou entre em contato conosco.",
              read: false
            });
            
          if (notificationError) {
            logEvent("❌ Error creating failed payment notification:", notificationError);
          } else {
            logEvent(`✉️ Notification sent about failed payment`);
          }
        } else {
          logEvent("⚠️ No userId found in payment intent metadata for failed payment");
        }
        break;
      }
      
      default:
        logEvent(`Unhandled event type ${event.type}`);
    }
    
    logEvent("Webhook processing complete, returning success response");
    return new Response(JSON.stringify({ 
      received: true,
      success: true,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // Log and return error
    const errorMessage = error instanceof Error ? error.message : String(error);
    logEvent(`❌ Error processing webhook: ${errorMessage}`);
    
    // Return structured error response
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false,
      timestamp: new Date().toISOString()
    }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400 
    });
  }
});
