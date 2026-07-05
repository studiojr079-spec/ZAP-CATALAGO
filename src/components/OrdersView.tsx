/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, Calendar, Clock, ArrowRight, MessageSquare, Check, X, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: 'Pendente' | 'Atendido' | 'Cancelado', notes?: string) => void;
}

export default function OrdersView({ orders, onUpdateStatus }: OrdersViewProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [statusSelect, setStatusSelect] = useState<'Pendente' | 'Atendido' | 'Cancelado'>('Pendente');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    onUpdateStatus(selectedOrder.id, statusSelect, notesInput);
    setSelectedOrder(null);
  };

  const startEditOrder = (ord: Order) => {
    setSelectedOrder(ord);
    setStatusSelect(ord.status);
    setNotesInput(ord.notes || '');
  };

  return (
    <div id="orders-view" className="min-h-screen text-white bg-[#0c0a0f] pb-24 text-left p-4">
      
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight">Registro de Cliques</h1>
        <p className="text-xs text-[#8E8E93] mt-1 font-semibold">Consulte todos os clientes que clicaram no botão de WhatsApp dos seus produtos.</p>
      </div>

      {/* Editor Modal for Updating status */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#090909] border border-pink-950/20 rounded-3xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-1 bg-[#181818] rounded-full text-[#8E8E93] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-white mb-2">Atualizar Registro</h3>
            <p className="text-xs text-[#8E8E93] font-semibold mb-4">Atualize o status de atendimento deste clique.</p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Status</label>
                <select
                  value={statusSelect}
                  onChange={(e) => setStatusSelect(e.target.value as any)}
                  className="w-full bg-[#181818] border border-pink-950/30 rounded-xl py-2 px-3 text-xs font-semibold outline-none focus:border-pink-500 text-white cursor-pointer transition"
                >
                  <option value="Pendente">🔴 Pendente (Não respondido)</option>
                  <option value="Atendido">🟢 Atendido (Respondido/Vendido)</option>
                  <option value="Cancelado">⚫ Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Observações / Anotações</label>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  rows={3}
                  className="w-full bg-[#181818] border border-pink-950/30 rounded-xl p-3 text-xs font-semibold outline-none focus:border-pink-500 text-white transition"
                  placeholder="Ex: Cliente fechou o pedido de Beyonce 80cm!"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-1/2 py-2.5 bg-[#181818] hover:bg-gray-900 border border-pink-950/20 text-[#8E8E93] rounded-xl text-xs font-bold uppercase transition"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold uppercase transition"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-b from-[#18121e] to-[#120c15] border border-pink-950/20 rounded-3xl p-6">
          <ShoppingCart className="w-12 h-12 text-pink-500/20 mx-auto mb-3" />
          <p className="text-[#8E8E93] font-medium">Nenhum clique registrado ainda.</p>
          <p className="text-xs text-[#8E8E93] mt-2">Os cliques aparecerão aqui quando visitantes clicarem em "EU QUERO" no seu catálogo público.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((ord) => {
            const isPending = ord.status === 'Pendente';
            const isCompleted = ord.status === 'Atendido';

            return (
              <div
                key={ord.id}
                onClick={() => startEditOrder(ord)}
                className="bg-gradient-to-b from-[#18121e] to-[#120c15] border border-pink-950/20 rounded-2xl p-4 flex flex-col gap-3 shadow-md hover:border-pink-500/15 transition cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{ord.productName}</h4>
                    <span className="text-xs font-black text-pink-400 mt-1 block">
                      R$ {ord.productPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isCompleted
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : ord.status === 'Cancelado'
                        ? 'bg-[#0c0a0f]0/10 text-[#8E8E93] border border-gray-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>

                <div className="border-t border-pink-950/10 pt-3 flex items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-[10px] text-[#8E8E93] font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-pink-500" />
                      <span>{ord.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#8E8E93] font-semibold">
                      <Clock className="w-3.5 h-3.5 text-pink-500" />
                      <span>{ord.time}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-[#8E8E93] bg-[#181818] px-2 py-0.5 rounded-md">
                    Origem: {ord.source}
                  </span>
                </div>

                {ord.notes && (
                  <div className="bg-[#181818]/50 rounded-xl p-2 text-[11px] text-gray-300 font-medium italic border-l-2 border-pink-500 text-left">
                    "{ord.notes}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
