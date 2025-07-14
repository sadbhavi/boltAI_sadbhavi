import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    // In a real implementation, you would verify the Stripe webhook signature here
    // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    // For demo purposes, we'll parse the JSON directly
    const event = JSON.parse(body);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        // Update subscription in database
        const { error } = await supabaseClient
          .from('subscriptions')
          .upsert({
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer,
            status: subscription.status === 'active' ? 'active' : 
                   subscription.status === 'trialing' ? 'trial' : 
                   subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Mark subscription as cancelled
        const { error } = await supabaseClient
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) throw error;
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        
        // Record successful payment
        const { error } = await supabaseClient
          .from('payment_history')
          .insert({
            stripe_payment_intent_id: invoice.payment_intent,
            amount: invoice.amount_paid / 100, // Convert from cents
            currency: invoice.currency.toUpperCase(),
            status: 'succeeded',
            invoice_url: invoice.hosted_invoice_url,
          });

        if (error) throw error;
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        
        // Record failed payment
        const { error } = await supabaseClient
          .from('payment_history')
          .insert({
            stripe_payment_intent_id: invoice.payment_intent,
            amount: invoice.amount_due / 100,
            currency: invoice.currency.toUpperCase(),
            status: 'failed',
          });

        if (error) throw error;

        // Update subscription status
        const { error: subError } = await supabaseClient
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', invoice.customer);

        if (subError) throw subError;
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});