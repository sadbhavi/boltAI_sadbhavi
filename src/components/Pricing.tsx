import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import SubscriptionModal from './subscription/SubscriptionModal';

const Pricing = () => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const { user, isPremium } = useAuth();

  const handlePlanSelect = (planId: string) => {
    if (!user) {
      alert('Please login first to subscribe');
      return;
    }
    setSelectedPlan(planId);
    setShowSubscriptionModal(true);
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'Perfect for beginners to explore mindfulness',
      features: [
        'Limited meditation sessions',
        'Basic breathing exercises',
        'One sleep story',
        'Mood tracking',
        'Community access',
        'Basic dating features'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      id: 'monthly',
      name: 'Monthly',
      price: '₹499',
      period: 'per month',
      description: 'Full access to all premium content',
      features: [
        'Unlimited meditations',
        '500+ sleep stories',
        'All breathing exercises',
        'Masterclasses',
        'Advanced progress tracking',
        'Offline downloads',
        'Premium support',
        'Premium dating features'
      ],
      cta: 'Start 14-Day Trial',
      popular: true
    },
    {
      id: 'annual',
      name: 'Annual',
      price: '₹2999',
      period: 'per year',
      originalPrice: '₹5988',
      description: 'Best value - save 50% with annual billing',
      features: [
        'Everything in Monthly',
        'Priority customer support',
        'Early access to new features',
        'Family sharing (up to 6 members)',
        'Exclusive content',
        'Annual progress reports',
        'Premium dating with priority matching'
      ],
      cta: 'Start 14-Day Trial',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            Choose your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 to-sage-500">
              wellness journey
            </span>
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Start your path to better mental health with flexible plans designed to fit your lifestyle and budget.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-stone-50 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                plan.popular ? 'ring-2 ring-forest-600 bg-gradient-to-br from-forest-50 to-sage-50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-forest-600 to-sage-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-stone-800 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-stone-800">{plan.price}</span>
                  <span className="text-stone-600 ml-2">{plan.period}</span>
                  {plan.originalPrice && (
                    <div className="text-sm text-stone-500 line-through mt-1">
                      {plan.originalPrice}/year
                    </div>
                  )}
                </div>
                <p className="text-stone-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-forest-600 flex-shrink-0" />
                    <span className="text-stone-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 rounded-full font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-forest-600 text-white hover:bg-forest-700 transform hover:scale-105'
                    : 'border-2 border-forest-600 text-forest-600 hover:bg-forest-600 hover:text-white'
                }`}
                onClick={() => handlePlanSelect(plan.id)}
                disabled={isPremium && plan.id !== 'free'}
              >
                {isPremium && plan.id !== 'free' ? 'Current Plan' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-stone-600">All plans include a 14-day free trial • Cancel anytime</p>
          <div className="flex justify-center items-center space-x-6 text-sm text-stone-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No commitment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Money-back guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Cancel in one click</span>
            </div>
          </div>
        </div>
      </div>

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        selectedPlan={selectedPlan}
      />
    </section>
  );
};

export default Pricing;