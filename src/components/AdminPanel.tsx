/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Users, Store as StoreIcon, CreditCard, Ticket, FileText, Settings, Plus, Trash2, Check, X, AlertTriangle } from 'lucide-react';
import { Store } from '../types';

interface AdminPanelProps {
  onBackToDashboard: () => void;
}

interface Coupon {
  code: string;
  discountPercent: number;
  active: boolean;
}

export default function AdminPanel({ onBackToDashboard }: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'stores' | 'plans' | 'coupons' | 'logs' | 'settings'>('stores');

  // Admin Mock Database
  const [adminStores, setAdminStores] = useState<any[]>([
    { id: 'store_1', name: 'Jessica Hair', slug: 'jessicahair', owner: 'Jessica', plan: 'Pro', mrr: 89.90, products: 128 },
    { id: 'store_2', name: 'Sarah Makeup', slug: 'sarahmakeup', owner: 'Sarah Silva', plan: 'Elite', mrr: 149.90, products: 312 },
    { id: 'store_3', name: 'Bella Biquínis', slug: 'bellabiquinis', owner: 'Isabella Lima', plan: 'Free', mrr: 0, products: 4 }
  ]);

  const [coupons, setCoupons] = useState<Coupon[]>([
    { code: 'CATALOGO10', discountPercent: 10, active: true },
    { code: 'START2026', discountPercent: 20, active: true },
    { code: 'BLACKFRIDAY50', discountPercent: 50, active: false }
  ]);

  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);

  const [logs] = useState([
    { id: 1, action: 'Confirmação de pagamento via Stripe webhook', store: 'Sarah Makeup', time: 'Há 5 min' },
    { id: 2, action: 'Novo cadastro de lojista efetuado', store: 'Bella Biquínis', time: 'Há 1 hora' },
    { id: 3, action: 'Exclusão de produto', store: 'Jessica Hair', time: 'Há 3 horas' },
    { id: 4, action: 'Upgrade de plano para PRO', store: 'Jessica Hair', time: 'Há 1 dia' }
  ]);

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const newC: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      discountPercent: Number(newCouponDiscount),
      active: true
    };
    setCoupons([...coupons, newC]);
    setNewCouponCode('');
  };

  const toggleCoupon = (code: string) => {
    setCoupons(coupons.map(c => c.code === code ? { ...c, active: !c.active } : c));
  };

  const deleteStore = (id: string) => {
    if (confirm('Tem certeza de que deseja suspender/deletar esta loja do SaaS?')) {
      setAdminStores(adminStores.filter(s => s.id !== id));
    }
  };

  return (
    <div id="admin-panel" className="min-h-screen text-gray-100 bg-[#0c0a0f] pb-24 text-left p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-600 rounded-2xl shadow-md">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Painel Administrador</h1>
            <p className="text-xs text-pink-400 font-semibold uppercase tracking-wider">Configuração Global de todo o SaaS</p>
          </div>
        </div>
        <button
          onClick={onBackToDashboard}
          className="bg-[#18121e] border border-pink-950/20 text-gray-300 px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#211827] transition"
        >
          Ir para Loja
        </button>
      </div>

      {/* Admin stats widgets row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-b from-[#18121e] to-[#120c15] border border-pink-950/15 p-4 rounded-2xl text-left">
          <span className="text-[9px] font-bold text-pink-400 uppercase tracking-widest block">Lojas Ativas</span>
          <span className="text-xl font-black text-white block mt-1">{adminStores.length}</span>
        </div>
        <div className="bg-gradient-to-b from-[#18121e] to-[#120c15] border border-pink-950/15 p-4 rounded-2xl text-left">
          <span className="text-[9px] font-bold text-pink-400 uppercase tracking-widest block">MRR Total</span>
          <span className="text-xl font-black text-white block mt-1">R$ 239,80</span>
        </div>
        <div className="bg-gradient-to-b from-[#18121e] to-[#120c15] border border-pink-950/15 p-4 rounded-2xl text-left">
          <span className="text-[9px] font-bold text-pink-400 uppercase tracking-widest block">Conversão</span>
          <span className="text-xl font-black text-white block mt-1">14.8%</span>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex gap-2 bg-gray-950 p-1 rounded-xl mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('stores')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'stores' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <StoreIcon className="w-4 h-4" />
          Lojas & Usuários
        </button>

        <button
          onClick={() => setActiveSubTab('coupons')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'coupons' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Ticket className="w-4 h-4" />
          Cupons
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'logs' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Logs & Auditoria
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shrink-0 ${
            activeSubTab === 'settings' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          Configurações
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        {activeSubTab === 'stores' && (
          <div className="bg-[#18121e] border border-pink-950/20 rounded-[32px] p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-black text-white">Gerenciamento de Lojas</h3>
            <div className="space-y-3">
              {adminStores.map(s => (
                <div key={s.id} className="bg-gray-950 border border-pink-950/10 p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="bg-pink-950/40 text-pink-400 border border-pink-500/10 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wide">
                      Plano {s.plan}
                    </span>
                    <h4 className="text-sm font-extrabold text-white mt-1">{s.name}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Dono: {s.owner} • {s.products} produtos</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-pink-400">R$ {s.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</span>
                    <button
                      onClick={() => deleteStore(s.id)}
                      className="p-2 bg-red-950/20 text-red-400 hover:bg-red-950/40 rounded-xl transition"
                      title="Deletar loja"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'coupons' && (
          <div className="space-y-4">
            {/* Create Coupon Sub-form */}
            <div className="bg-[#18121e] border border-pink-950/20 rounded-[32px] p-5 shadow-lg space-y-4">
              <h3 className="text-sm font-black text-white">Criar Novo Cupom</h3>
              <form onSubmit={handleAddCoupon} className="grid grid-cols-3 gap-3 items-end">
                <div className="col-span-2 space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Código do Cupom</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="Ex: CUPOM50"
                    className="w-full bg-gray-950 border border-pink-950/30 rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-pink-500 text-white transition"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Desconto %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full bg-gray-950 border border-pink-950/30 rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-pink-500 text-white transition"
                  />
                </div>
                <button
                  type="submit"
                  className="col-span-3 py-3 bg-pink-600 hover:bg-pink-700 text-white text-xs font-extrabold uppercase rounded-xl transition active:scale-95 shadow-lg shadow-pink-600/10 mt-2"
                >
                  Adicionar Cupom
                </button>
              </form>
            </div>

            {/* Coupons List */}
            <div className="bg-[#18121e] border border-pink-950/20 rounded-[32px] p-5 shadow-lg">
              <h3 className="text-sm font-black text-white mb-4">Cupons Cadastrados</h3>
              <div className="space-y-2">
                {coupons.map((c) => (
                  <div key={c.code} className="bg-gray-950 rounded-xl p-3 flex items-center justify-between border border-pink-950/10">
                    <div className="text-left">
                      <span className="text-sm font-black text-white tracking-wider">{c.code}</span>
                      <span className="text-[10px] text-pink-400 font-extrabold ml-3">{c.discountPercent}% OFF</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCoupon(c.code)}
                        className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase transition ${
                          c.active
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}
                      >
                        {c.active ? 'Ativo' : 'Inativo'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'logs' && (
          <div className="bg-[#18121e] border border-pink-950/20 rounded-[32px] p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-black text-white">Logs do Sistema</h3>
            <div className="space-y-2">
              {logs.map((l) => (
                <div key={l.id} className="bg-gray-950 border border-pink-950/10 p-3 rounded-xl flex items-center justify-between gap-4 text-left">
                  <div>
                    <p className="text-xs font-bold text-white">{l.action}</p>
                    <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Loja: {l.store}</p>
                  </div>
                  <span className="text-[9px] font-semibold text-pink-400 shrink-0">{l.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'settings' && (
          <div className="bg-[#18121e] border border-pink-950/20 rounded-[32px] p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-black text-white border-b border-pink-950/10 pb-3">Parâmetros do SaaS</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Taxa de Transação Kiwify (%)</label>
                <input
                  type="number"
                  defaultValue={2.99}
                  className="w-full bg-gray-950 border border-pink-950/30 rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-pink-500 text-white transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Período de Testes Grátis (Dias)</label>
                <input
                  type="number"
                  defaultValue={7}
                  className="w-full bg-gray-950 border border-pink-950/30 rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-pink-500 text-white transition"
                />
              </div>

              <button
                type="button"
                onClick={() => alert('Configurações administrativas salvas!')}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white text-xs font-extrabold uppercase rounded-xl transition"
              >
                Salvar Parâmetros Globais
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
