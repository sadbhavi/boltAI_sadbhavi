import React, { useState } from 'react';
import { X, Check, Star, CreditCard, Smartphone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, selectedPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('upi');
  const [loading, setLoading] = useState(false);
  const { user, isPremium } = useAuth();

  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Perfect for beginners to explore mindfulness',
      features: [
        'Limited meditation sessions',
        'Basic breathing exercises',
        'One sleep story',
        'Mood tracking',
        'Community access'
      ],
      popular: false
    },
    {
      id: 'monthly',
      name: 'Premium Monthly',
      monthlyPrice: 499,
      annualPrice: 0,
      description: 'Full access to all premium content',
      features: [
        'Unlimited meditations',
        '500+ sleep stories',
        'All breathing exercises',
        'Masterclasses',
        'Advanced progress tracking',
        'Offline downloads',
        'Premium support',
        'Dating app access'
      ],
      popular: true
    },
    {
      id: 'annual',
      name: 'Premium Annual',
      monthlyPrice: 299,
      annualPrice: 3588,
      originalPrice: 5988,
      description: 'Best value - save 40% with annual billing',
      features: [
        'Everything in Monthly',
        'Priority customer support',
        'Early access to new features',
        'Family sharing (up to 6 members)',
        'Exclusive content',
        'Annual progress reports',
        'Dating app premium features'
      ],
      popular: false
    }
  ];

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[1];
  const price = billingCycle === 'monthly' ? currentPlan.monthlyPrice : currentPlan.annualPrice;

  const handleSubscribe = async () => {
    if (!user) {
      alert('Please login first');
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would integrate with payment gateway here
      console.log('Processing payment:', {
        plan: currentPlan.id,
        billingCycle,
        paymentMethod,
        amount: price
      });
      
      alert('Subscription successful! Welcome to Premium!');
      onClose();
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Upgrade to Premium</h2>
          <p className="text-stone-600">Unlock all features and enhance your wellness journey</p>
        </div>

        {/* Plan Selection */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedPlan === plan.id || (selectedPlan === 'monthly' && plan.id === 'monthly')
                  ? 'border-forest-600 bg-forest-50'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-forest-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Most Popular</span>
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="font-semibold text-stone-800 mb-2">{plan.name}</h3>
                <div className="mb-3">
                  <span className="text-2xl font-bold text-stone-800">₹{plan.monthlyPrice}</span>
                  {plan.monthlyPrice > 0 && <span className="text-stone-600">/month</span>}
                </div>
                {plan.originalPrice && (
                  <div className="text-sm text-stone-500 line-through mb-2">
                    ₹{plan.originalPrice}/year
                  </div>
                )}
                <p className="text-sm text-stone-600 mb-4">{plan.description}</p>
                
                <ul className="text-left space-y-2">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4 text-forest-600 flex-shrink-0" />
                      <span className="text-stone-700">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="text-sm text-stone-500">+{plan.features.length - 4} more features</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {currentPlan.monthlyPrice > 0 && (
          <>
            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-stone-100 rounded-lg p-1">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingCycle === 'monthly' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingCycle === 'annual' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  Annual (Save 40%)
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="font-semibold text-stone-800 mb-4">Payment Method</h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex flex-col items-center p-4 border-2 rounded-xl transition-colors ${
                    paymentMethod === 'upi' ? 'border-forest-600 bg-forest-50' : 'border-stone-200'
                  }`}
                >
                  <Smartphone className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">UPI</span>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center p-4 border-2 rounded-xl transition-colors ${
                    paymentMethod === 'card' ? 'border-forest-600 bg-forest-50' : 'border-stone-200'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Card</span>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`flex flex-col items-center p-4 border-2 rounded-xl transition-colors ${
                    paymentMethod === 'netbanking' ? 'border-forest-600 bg-forest-50' : 'border-stone-200'
                  }`}
                >
                  <div className="w-6 h-6 mb-2 bg-blue-600 rounded"></div>
                  <span className="text-sm font-medium">Net Banking</span>
                </button>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-stone-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-stone-700">Plan</span>
                <span className="font-medium">{currentPlan.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-stone-700">Billing</span>
                <span className="font-medium">{billingCycle === 'monthly' ? 'Monthly' : 'Annual'}</span>
              </div>
              <div className="border-t border-stone-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-stone-800">Total</span>
                  <span className="font-bold text-xl text-forest-600">₹{price}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={loading || isPremium}
              className="w-full bg-forest-600 text-white py-4 rounded-xl font-semibold hover:bg-forest-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : isPremium ? 'Already Premium' : `Subscribe for ₹${price}`}
            </button>

            <div className="text-center mt-4 text-sm text-stone-500">
              <p>Secure payment • Cancel anytime • 14-day money-back guarantee</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModal;