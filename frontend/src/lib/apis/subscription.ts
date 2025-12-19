import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import type { SubscriptionPlan } from '../supabase';

export const subscriptionAPI = {
  async getSubscriptionPlans(): Promise<{ data: SubscriptionPlan[] | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true, nullsFirst: true });
    return { data, error };
  },

  async getUserSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    return { data, error } as { data: unknown; error: PostgrestError | null };
  },

  async createSubscription(userId: string, planId: string, billingCycle: 'monthly' | 'annual') {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        billing_cycle: billingCycle,
        status: 'trial',
        trial_start: new Date().toISOString(),
        trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();
    return { data, error } as { data: unknown; error: PostgrestError | null };
  },
};
