import React from 'react';
import { 
  Bell, Plus, ExternalLink, ShoppingBag, Eye, ShoppingCart, 
  Folder, Palette, ChevronRight, Share2, Package, Link2, Copy, DollarSign, TrendingUp, Menu, MessageCircle, Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Store, Product, Category, Order, AnalyticsRecord, Notification, AppUser } from '../types';

interface DashboardViewProps {
  user: AppUser;
  store: Store;
  products: Product[];
  categories: Category[];
  orders: Order[];
  analytics: AnalyticsRecord;
  notifications: Notification[];
  onNavigate: (tab: 'dashboard' | 'products' | 'categories' | 'personalize' | 'more' | 'orders' | 'subscriptions' | 'admin') => void;
  onOpenPublicCatalog: () => void;
  onAddProduct: () => void;
  onChangeSlug: () => void;
}

export default function DashboardView({
  user,
  store,
  products,
  orders,
  analytics,
  onNavigate,
  onOpenPublicCatalog,
  onAddProduct,
  onChangeSlug
}: DashboardViewProps) {
  
  const [copied, setCopied] = React.useState(false);
  const displayProductsCount = products.length;

  const getZeroDailyMetrics = () => {
    const metrics = [];
    const today = new Date();
    for (let i = 4; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      metrics.push({ date: dateStr, views: 0, clicks: 0, orders: 0 });
    }
    return metrics;
  };

  const copyStoreLink = () => {
    const fullUrl = `${window.location.origin}/#/${store.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen text-white bg-[#0c0a0f] pb-28 text-left font-sans select-none">
      
      {/* Toast Notificação */}
      {copied && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#FF2D7A] text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-[#FF2D7A]/40 flex items-center gap-2 transition-all duration-300">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>Link copiado com sucesso!</span>
        </div>
      )}
      
      {/* Header Area */}
      <header className="px-5 py-6 flex items-center justify-between z-30 relative bg-[#131016]/50 backdrop-blur-md border-b border-white/5">
        <div className="text-left leading-tight">
          <p className="text-[11px] text-[#8E8E93] font-bold uppercase tracking-widest mb-1 opacity-70">
            {(() => {
              const options: Intl.DateTimeFormatOptions = { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute:'2-digit' };
              const time = new Date().toLocaleTimeString('pt-BR', options);
              return time;
            })()} • São Paulo, BR
          </p>
          <h2 className="text-[18px] font-black text-white tracking-tight flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF2D7A] animate-pulse"></div>
            PAINEL DA LOJA
          </h2>
        </div>
        <button 
          onClick={onOpenPublicCatalog}
          className="flex items-center gap-2 bg-[#FF2D7A] text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#FF2D7A]/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Eye className="w-4 h-4" />
          Ver Catálogo
        </button>
      </header>

      {/* Main Content */}
      <div className="space-y-6 pt-6 px-5">
        
        {/* Link Publico */}
        <div className="bg-gradient-to-br from-[#18121e] to-[#0c0a0f] border border-white/5 rounded-[32px] p-6 shadow-2xl space-y-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Link2 className="w-24 h-24 rotate-12" />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-[11px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-1">Link da sua vitrine</h3>
              <p className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">Pronto para compartilhar</p>
            </div>
            <button 
              onClick={onChangeSlug}
              className="text-[10px] font-black text-white bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition uppercase tracking-wider"
            >
              Editar Link
            </button>
          </div>
          
          <div className="bg-[#0c0a0f]/80 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#FF2D7A]/10 flex items-center justify-center shrink-0 border border-[#FF2D7A]/20">
                <Sparkles className="w-6 h-6 text-[#FF2D7A]" />
              </div>
              <div className="truncate">
                <div className="text-[15px] font-black text-white mb-0.5 tracking-tight">zapcat.app/{store.slug || 'loja'}</div>
                <div className="text-[10px] text-[#8E8E93] truncate font-medium">Link oficial do seu catálogo</div>
              </div>
            </div>
            <button 
              onClick={copyStoreLink}
              className="bg-[#FF2D7A] text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-xl shrink-0 shadow-xl shadow-[#FF2D7A]/30 active:scale-90 transition-all"
            >
              Copiar
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => onNavigate('products')} className="bg-[#18121e] border border-white/5 rounded-[28px] p-6 flex flex-col items-start shadow-xl active:scale-95 transition-transform cursor-pointer relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShoppingBag className="w-16 h-16" />
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest mb-1">Produtos</p>
            <span className="text-3xl font-black text-white leading-none tracking-tight">{displayProductsCount}</span>
          </div>

          <div className="bg-[#18121e] border border-white/5 rounded-[28px] p-6 flex flex-col items-start shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
              <Eye className="w-16 h-16" />
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
              <Eye className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest mb-1">Visitas</p>
            <span className="text-3xl font-black text-white leading-none tracking-tight">{analytics?.views || 0}</span>
          </div>
          
          <div onClick={() => onNavigate('orders')} className="bg-[#18121e] border border-white/5 rounded-[28px] p-6 flex flex-col items-start shadow-xl cursor-pointer hover:bg-white/5 active:scale-95 transition-all relative overflow-hidden group col-span-2">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <MessageCircle className="w-20 h-20" />
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
              <MessageCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-widest mb-1">Cliques no WhatsApp</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-white leading-none tracking-tight">{analytics?.clicks || 0}</span>
              {(analytics?.clicks || 0) > 0 && (
                <span className="text-[10px] text-emerald-500 font-black mb-1 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> +12% HOJE
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-[#18121e] border border-white/5 rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-1">Engajamento</h3>
              <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider">Últimos 30 dias</p>
            </div>
            <div className="bg-[#0c0a0f] text-[#FF2D7A] text-[9px] px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-[#FF2D7A]/20 font-black uppercase tracking-widest shadow-inner">
              <span className="w-1 h-1 rounded-full bg-[#FF2D7A] animate-pulse"></span>
              Visualizações
            </div>
          </div>
          
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.dailyMetrics?.length > 0 ? analytics.dailyMetrics : (store.id === 'store_jessica' ? [
                { date: '10/05', views: 400, clicks: 20, orders: 5 },
                { date: '17/05', views: 800, clicks: 45, orders: 12 },
                { date: '24/05', views: 600, clicks: 30, orders: 8 },
                { date: '31/05', views: 1200, clicks: 80, orders: 25 },
                { date: '07/06', views: 900, clicks: 50, orders: 18 }
              ] : getZeroDailyMetrics())}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF2D7A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF2D7A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#8E8E93', fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131016', border: '1px solid rgba(255,45,122,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#FF2D7A', fontWeight: 'black', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#FF2D7A" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-[#8E8E93] uppercase tracking-[0.2em] px-1">Atalhos Rápidos</h3>
          
          <div className="grid grid-cols-2 gap-4 pb-4">
            <button 
              onClick={() => onNavigate('personalize')}
              className="bg-[#18121e] border border-white/5 rounded-[24px] p-5 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Palette className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">Visual da<br/>Vitrine</span>
            </button>
            
            <button 
              onClick={() => onNavigate('orders')}
              className="bg-[#18121e] border border-white/5 rounded-[24px] p-5 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">Relatório de<br/>Cliques</span>
            </button>

            <button 
              onClick={() => onNavigate('more')}
              className="bg-[#18121e] border border-white/5 rounded-2xl p-4 flex items-center gap-3 active:scale-95 transition text-left col-span-2"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-tight">Mais Opções</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
