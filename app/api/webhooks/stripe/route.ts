/**
 * Stripe Webhooks Handler
 * Processes Stripe events for subscription management
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const supabase = createClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const { data: organization } = await supabase
      .from('organizations')
      .select('id')
      .eq('stripe_customer_id', subscription.customer)
      .single();

    if (!organization) {
      console.error('Organization not found for customer:', subscription.customer);
      return;
    }

    // Create or update subscription record
    await supabase
      .from('subscriptions')
      .upsert({
        organization_id: organization.id,
        stripe_subscription_id: subscription.id,
        plan_type: getPlanTypeFromPriceId(subscription.items.data[0].price.id),
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end
      });

    console.log('Subscription created for organization:', organization.id);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end
      })
      .eq('stripe_subscription_id', subscription.id);

    console.log('Subscription updated:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled'
      })
      .eq('stripe_subscription_id', subscription.id);

    console.log('Subscription cancelled:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    if (invoice.subscription) {
      await supabase
        .from('subscriptions')
        .update({
          status: 'active'
        })
        .eq('stripe_subscription_id', invoice.subscription);

      console.log('Payment succeeded for subscription:', invoice.subscription);
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    if (invoice.subscription) {
      await supabase
        .from('subscriptions')
        .update({
          status: 'past_due'
        })
        .eq('stripe_subscription_id', invoice.subscription);

      console.log('Payment failed for subscription:', invoice.subscription);
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

function getPlanTypeFromPriceId(priceId: string): string {
  // Map Stripe price IDs to plan types
  const priceMap: Record<string, string> = {
    [process.env.STRIPE_STARTER_PRICE_ID!]: 'starter',
    [process.env.STRIPE_PROFESSIONAL_PRICE_ID!]: 'professional',
    [process.env.STRIPE_ENTERPRISE_PRICE_ID!]: 'enterprise'
  };

  return priceMap[priceId] || 'starter';
}
