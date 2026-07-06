/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Check, ChevronRight, Zap, Shield, CreditCard, Flame, HelpCircle } from 'lucide-react';
import { Plan, UserSubscription } from '../types';
import { PLANS } from '../lib/initialData';

interface SubscriptionsViewProps {
  subscription: UserSubscription;
  onUpdateSubscription: (sub: UserSubscription) => void;
}

export default function SubscriptionsView({ subscription, onUpdateSubscription }: SubscriptionsViewProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(subscription.planId);
  const [billingCycle, setBillingCycle] = useState<'mensal' | 'anual'>('mensal');
  const [selectedGateway, setSelectedGateway] = useState<'stripe' | 'mercadopago' | 'kiwify'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const activePlan = PLANS.find(p => p.id === subscription.planId) || PLANS[0];

  const handleCheckout = () => {
    if (selectedPlanId === subscription.planId) {
      alert('Você já possui este plano ativo!');
      return;
    }

    setIsProcessing(true);
    setSuccess(false);

    // Simulate Payment Gateway redirect and immediate automatic webhook notification response
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      
      const expires = new Date();
      expires.setDate(expires.getDate() + (billingCycle === 'anual' ? 365 : 30));

      const updatedSubscription: UserSubscription = {
        userId: subscription.userId,
        planId: selectedPlanId,
        status: 'active',
        expiresAt: expires.toISOString(),
        paymentGateway: selectedGateway
      };

      onUpdateSubscription(updatedSubscription);

      // Dismiss success state after 4 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    }, 1800);
  };

  return (
    <div id="subscriptions-view" className="min-h-screen text-white bg-[#0c0a0f] pb-24 text-left p-4">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Assinatura SaaS</h1>
        <p className="text-xs text-[#8E8E93] mt-1 font-semibold">Consulte seu plano ativo, limites de recursos e escolha seu plano.</p>
      </div>

      {/* Success notification banner */}
      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-3xl flex items-center gap-3 animate-bounce">
          <Zap className="w-6 h-6 text-green-400 shrink-0" />
          <div className="text-left">
            <h4 className="text-sm font-extrabold text-white">Plano Ativado com Sucesso!</h4>
            <p className="text-[10px] text-green-400 font-semibold mt-0.5">O webhook de confirmação foi recebido. Seu painel foi liberado!</p>
          </div>
        </div>
      )}

      {/* Active plan status card */}
      <div className="bg-[#090909] border border-pink-500/20 rounded-[32px] p-5 shadow-lg mb-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="p-3 bg-pink-500/20 text-pink-400 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">Seu plano ativo</span>
              <h3 className="text-xl font-black text-white mt-0.5">Plano {activePlan.name}</h3>
              <p className="text-[10px] text-[#8E8E93] font-semibold mt-0.5">Vencimento: {new Date(subscription.expiresAt).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            Ativo
          </span>
        </div>

        {/* Resource limits meter bar */}
        <div className="border-t border-pink-950/20 pt-4 mt-4 space-y-3.5">
          <div>
            <div className="flex justify-between text-[10px] font-bold text-[#8E8E93] mb-1">
              <span>Produtos Ativos</span>
              <span>Até {activePlan.limits.products === 9999 ? 'Ilimitados' : activePlan.limits.products}</span>
            </div>
            <div className="w-full bg-[#1e1325] h-2 rounded-full overflow-hidden">
              <div className="bg-pink-500 h-full rounded-full" style={{ width: activePlan.limits.products === 9999 ? '100%' : '20%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] font-bold text-[#8E8E93] mb-1">
              <span>Espaço de Armazenamento</span>
              <span>Até {activePlan.limits.storageMb} MB</span>
            </div>
            <div className="w-full bg-[#1e1325] h-2 rounded-full overflow-hidden">
              <div className="bg-pink-500 h-full rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing table billing switcher */}
      <div className="bg-[#181818] border border-pink-950/20 p-1.5 rounded-2xl flex items-center mb-6 max-w-xs mx-auto">
        <button
          onClick={() => setBillingCycle('mensal')}
          className={`w-1/2 py-2 text-xs font-bold rounded-xl transition ${
            billingCycle === 'mensal' ? 'bg-pink-600 text-white' : 'text-[#8E8E93]'
          }`}
        >
          Mensal
        </button>
        <button
          onClick={() => setBillingCycle('anual')}
          className={`w-1/2 py-2 text-xs font-bold rounded-xl transition ${
            billingCycle === 'anual' ? 'bg-pink-600 text-white' : 'text-[#8E8E93]'
          }`}
        >
          Anual (Economize 20%)
        </button>
      </div>

      {/* Pricing plans cards list */}
      <div className="space-y-4 mb-8">
        {PLANS.map((plan) => {
          const isCurrent = subscription.planId === plan.id;
          const isSelected = selectedPlanId === plan.id;
          
          let displayPrice = plan.price;
          if (billingCycle === 'anual') {
            displayPrice = Number((plan.price * 12 * 0.8).toFixed(2));
          }

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`bg-[#090909] rounded-[32px] p-5 border cursor-pointer transition text-left flex flex-col justify-between ${
                isSelected
                  ? 'border-pink-500 shadow-lg shadow-pink-500/5'
                  : 'border-pink-950/20 hover:border-pink-950/40'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-black text-white">{plan.name}</h4>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-black text-white">R$ {(displayPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span className="text-[10px] text-[#8E8E93] font-bold">/{billingCycle === 'anual' ? 'ano' : 'mês'}</span>
                  </div>
                </div>

                {isCurrent && (
                  <span className="bg-pink-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Plano Atual
                  </span>
                )}
              </div>

              {/* Resource specifications list */}
              <ul className="mt-5 space-y-2 border-t border-pink-950/10 pt-4">
                {plan.features.map((feat, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                    <Check className="w-4 h-4 text-pink-500 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Payment Gateway Selection & Webhook checkout simulator */}
      {selectedPlanId !== subscription.planId && (
        <div className="bg-[#090909] border border-pink-950/20 rounded-[32px] p-5 shadow-lg space-y-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-pink-950/10 pb-3">
            <CreditCard className="w-5 h-5 text-pink-500" />
            Checkout Seguro Integrado
          </h3>

          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest">Escolha a Forma de Pagamento</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedGateway('stripe')}
                className={`py-2 px-3 rounded-xl border text-[10px] font-extrabold transition ${
                  selectedGateway === 'stripe'
                    ? 'border-pink-500 bg-pink-500/10 text-white'
                    : 'border-pink-950/20 bg-[#181818] text-[#8E8E93] hover:text-white'
                }`}
              >
                Stripe
              </button>
              <button
                type="button"
                onClick={() => setSelectedGateway('mercadopago')}
                className={`py-2 px-3 rounded-xl border text-[10px] font-extrabold transition ${
                  selectedGateway === 'mercadopago'
                    ? 'border-pink-500 bg-pink-500/10 text-white'
                    : 'border-pink-950/20 bg-[#181818] text-[#8E8E93] hover:text-white'
                }`}
              >
                Mercado Pago
              </button>
              <button
                type="button"
                onClick={() => setSelectedGateway('kiwify')}
                className={`py-2 px-3 rounded-xl border text-[10px] font-extrabold transition ${
                  selectedGateway === 'kiwify'
                    ? 'border-pink-500 bg-pink-500/10 text-white'
                    : 'border-pink-950/20 bg-[#181818] text-[#8E8E93] hover:text-white'
                }`}
              >
                Kiwify
              </button>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-pink-600/15 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Processando Webhook...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-white fill-white" />
                <span>Simular Assinatura Instantânea</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
