import React from 'react';
import { CheckCircle2, AlertCircle, Clock, ExternalLink } from 'lucide-react';

export default function FinanceView() {
  const installments = [
    { id: '1', dueDate: '15/05/2026', amount: 47.00, status: 'paid' },
    { id: '2', dueDate: '15/06/2026', amount: 47.00, status: 'paid' },
    { id: '3', dueDate: '15/07/2026', amount: 47.00, status: 'pending' },
    { id: '4', dueDate: '15/08/2026', amount: 47.00, status: 'upcoming' },
    { id: '5', dueDate: '15/09/2026', amount: 47.00, status: 'upcoming' }
  ];

  return (
    <div className="p-5 max-w-md mx-auto space-y-6 text-left pb-24 font-sans animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Financeiro</h1>
        <p className="text-xs text-[#8E8E93] mt-1 font-semibold">Acompanhe suas mensalidades e status.</p>
      </div>

      <div className="space-y-3">
        {installments.map((item) => (
          <div key={item.id} className="bg-[#090909] border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                item.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 
                item.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                'bg-gray-800 text-gray-400'
              }`}>
                {item.status === 'paid' && <CheckCircle2 className="w-5 h-5" />}
                {item.status === 'pending' && <AlertCircle className="w-5 h-5" />}
                {item.status === 'upcoming' && <Clock className="w-5 h-5" />}
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-white">Mensalidade</h4>
                <p className="text-[11px] text-[#8E8E93] font-medium">Vencimento: {item.dueDate}</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-sm font-black text-white block">R$ {item.amount.toFixed(2)}</span>
              <span className={`text-[10px] font-bold uppercase ${
                item.status === 'paid' ? 'text-emerald-500' :
                item.status === 'pending' ? 'text-amber-500' :
                'text-gray-500'
              }`}>
                {item.status === 'paid' ? 'PAGO' : item.status === 'pending' ? 'A VENCER' : 'FUTURO'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-[#18121e] border border-white/5 p-4 rounded-2xl text-center">
        <p className="text-xs text-[#8E8E93] mb-3">Dúvidas sobre pagamentos?</p>
        <button className="bg-[#FF2D7A]/10 text-[#FF2D7A] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 mx-auto transition active:scale-95">
          Falar com Suporte <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
