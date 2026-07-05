import React from 'react';
import { Award, CreditCard, Settings, Globe, Link as LinkIcon, Ticket, User, LogOut, ChevronRight, Bell, Shield, RotateCcw, Box, PlaySquare, BarChart3, Tag } from 'lucide-react';
import { AppUser, Notification, Store } from '../types';

interface MoreMenuProps {
  user: AppUser;
  store: Store;
  notifications: Notification[];
  onNavigate: (tab: 'dashboard' | 'products' | 'categories' | 'personalize' | 'more' | 'orders' | 'subscriptions' | 'admin' | 'finance' | 'tutorials') => void;
  onLogout: () => void;
  onReset: () => void;
  onDismissNotification: (id: string) => void;
}

export default function MoreMenu({ user, store, notifications, onNavigate, onLogout, onReset, onDismissNotification }: MoreMenuProps) {
  const [toastMsg, setToastMsg] = React.useState('');
  
  const showDevToast = (feature: string) => {
    setToastMsg(`${feature} estará disponível em breve!`);
    setTimeout(() => setToastMsg(''), 2500);
  };

  return (
    <div id="more-settings-tab" className="p-4 max-w-md mx-auto space-y-6 text-left pb-24 font-sans relative">
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#FF2D7A] text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 transition-all">
          <span>{toastMsg}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Mais Opções</h1>
        <p className="text-xs text-[#8E8E93] mt-1 font-semibold">Gerencie sua loja, planos e configurações.</p>
      </div>

      {/* Opções Principais da Loja */}
      <div className="bg-[#090909] border border-pink-950/20 rounded-[28px] p-5 shadow-lg space-y-1">
        {[
          { id: 'tutorials', icon: <PlaySquare />, label: 'Mídias & Tutoriais', onClick: () => onNavigate('tutorials'), color: 'text-blue-500', bg: 'bg-blue-950/30' },
          { id: 'coupons', icon: <Tag />, label: 'Cupons de Desconto', onClick: () => showDevToast('Cupons de Desconto'), color: 'text-pink-500', bg: 'bg-pink-950/30' },
          { id: 'reports', icon: <BarChart3 />, label: 'Relatórios de Vendas', onClick: () => showDevToast('Relatórios de Vendas'), color: 'text-emerald-500', bg: 'bg-emerald-950/30' },
          { id: 'settings', icon: <Settings />, label: 'Configurações Gerais', onClick: () => showDevToast('Configurações Gerais'), color: 'text-gray-400', bg: 'bg-gray-800/30' },
          { id: 'finance', icon: <CreditCard />, label: 'Financeiro', onClick: () => onNavigate('finance'), color: 'text-green-500', bg: 'bg-green-950/30' },
          { id: 'logout', icon: <LogOut />, label: 'Sair', onClick: onLogout, color: 'text-red-500', bg: 'bg-red-950/30' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="w-full flex items-center justify-between py-3 hover:bg-[#0c0a0f] rounded-xl px-2 transition group"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${item.bg} ${item.color}`}>
                {React.cloneElement(item.icon as React.ReactElement, { className: 'w-5 h-5' })}
              </div>
              <span className="text-xs font-bold text-white">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8E8E93] group-hover:text-white transition" />
          </button>
        ))}
      </div>

      <div className="text-center py-4">
        <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest">CATÁLOGO INTELIGENTE SaaS v1.1.0</p>
      </div>
    </div>
  );
}
