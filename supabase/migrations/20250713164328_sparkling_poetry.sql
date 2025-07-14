/*
  # Subscription System Schema

  1. New Tables
    - `subscription_plans` - Available subscription plans
    - `subscriptions` - User subscription records
    - `payment_history` - Payment transaction history

  2. Security
    - Enable RLS on all tables
    - Users can only access their own subscription data
*/

CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price_monthly decimal(10,2),
  price_annual decimal(10,2),
  features text[],
  is_popular boolean DEFAULT false,
  is_active boolean DEFAULT true,
  trial_days integer DEFAULT 14,
  max_family_members integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES subscription_plans(id),
  status text DEFAULT 'active' CHECK (status IN ('trial', 'active', 'cancelled', 'expired', 'past_due')),
  billing_cycle text DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual', 'lifetime')),
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  cancelled_at timestamptz,
  stripe_subscription_id text,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id),
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  payment_method text,
  stripe_payment_intent_id text,
  invoice_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Subscription plans policies (public read)
CREATE POLICY "Anyone can read active subscription plans"
  ON subscription_plans
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Subscriptions policies
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Payment history policies
CREATE POLICY "Users can read own payment history"
  ON payment_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);