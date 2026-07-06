import React, { useState, useEffect } from 'react';
import { 
  Users, Store as StoreIcon, Activity, Settings, Search, LogOut, LogIn,
  ShieldAlert, CreditCard, Ticket, Menu, Bell, Plus, X, ChevronRight,
  TrendingUp, TrendingDown, DollarSign, Package, HeadphonesIcon, Download,
  Tag, List, Database, PieChart as PieChartIcon, Trash2 } from 'lucide-react';
import { AppUser, Store } from '../types';
import { getAllUsers, getAllStores, saveUserProfile, deleteUserProfile, deleteStore } from '../lib/db';
// import { signOut } from 'firebase/auth';
// import { auth } from '../lib/firebase';
import MasterTutorials from './MasterTutorials';
import Greeting from './Greeting';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const CHART_DATA = [
  { name: 'Jan', revenue: 4200, users: 12 },
  { name: 'Fev', revenue: 5100, users: 15 },
  { name: 'Mar', revenue: 4800, users: 14 },
  { name: 'Abr', revenue: 6200, users: 21 },
  { name: 'Mai', revenue: 5900, users: 18 },
  { name: 'Jun', revenue: 7800, users: 24 },
];

const PLAN_DISTRIBUTION = [
  { name: 'Pro', value: 85, color: '#FF2D7A' },
  { name: 'Free', value: 15, color: '#8E8E93' },
];

export default function MasterPortal({ user, onLogout, onImpersonateStore, onSwitchToStoreView }: { 
  user: AppUser; 
  onLogout: () => void; 
  onImpersonateStore: (store: Store, ownerUser: AppUser) => void;
  onSwitchToStoreView: () => void;
}) {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [u, s] = await Promise.all([
          getAllUsers(),
          getAllStores()
        ]);
        setUsers(u);
        setStores(s);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    // await signOut(auth);
    onLogout();
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredStores = stores.filter(s => s.name && s.name.trim() !== '' && s.name.length > 0 && s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const selectTab = (tab: string) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [moveStoreId, setMoveStoreId] = useState('');

  const revenue = users.length * 47;

  const handleManageUser = (u: AppUser) => {
    console.log("Gerenciar Lojista clicado para:", u.name);
    setSelectedUser(u);
    setMoveStoreId(u.storeId || '');
    setShowManageModal(true);
  };

  const handleToggleAutoRenew = async (userId: string, currentAutoRenew: boolean) => {
    try {
      const u = users.find(x => x.id === userId);
      if (!u) return;
      const updatedUser: AppUser = { ...u, autoRenew: !currentAutoRenew };
      await saveUserProfile(updatedUser);
      setUsers(prev => prev.map(x => x.id === userId ? updatedUser : x));
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(updatedUser);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar renovação automática.');
    }
  };

  const handleRenewSubscription = async (userId: string) => {
    try {
      const u = users.find(x => x.id === userId);
      if (!u) return;
      const currentExpiry = u.expiresAt ? new Date(u.expiresAt) : new Date();
      const newExpiry = new Date(currentExpiry);
      newExpiry.setDate(newExpiry.getDate() + 30);
      const updatedUser: AppUser = { 
        ...u, 
        status: 'active', 
        planId: u.planId || 'plan_pro', 
        expiresAt: newExpiry.toISOString() 
      };
      await saveUserProfile(updatedUser);
      setUsers(prev => prev.map(x => x.id === userId ? updatedUser : x));
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(updatedUser);
      }
      alert('Assinatura renovada com sucesso por mais 30 dias!');
    } catch (err) {
      console.error(err);
      alert('Erro ao renovar assinatura.');
    }
  };

  const handleRemoveSubscription = async (userId: string) => {
    try {
      const u = users.find(x => x.id === userId);
      if (!u) return;
      const updatedUser: AppUser = { 
        ...u, 
        status: 'canceled', 
        expiresAt: new Date().toISOString() 
      };
      await saveUserProfile(updatedUser);
      setUsers(prev => prev.map(x => x.id === userId ? updatedUser : x));
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(updatedUser);
      }
      alert('Assinatura removida/cancelada com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao tirar assinatura.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir permanentemente este lojista? Esta ação é irreversível.')) {
      return;
    }
    try {
      const u = users.find(x => x.id === userId);
      if (!u) return;
      
      const deleteAssociatedStore = confirm('Deseja excluir também a loja associada a este lojista?');
      
      await deleteUserProfile(userId);
      if (deleteAssociatedStore && u.storeId) {
        await deleteStore(u.storeId);
        setStores(prev => prev.filter(s => s.id !== u.storeId));
      }
      
      setUsers(prev => prev.filter(x => x.id !== userId));
      setShowManageModal(false);
      setSelectedUser(null);
      alert('Lojista excluído com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir lojista.');
    }
  };

  const handleMoveUserStore = async (userId: string, newStoreId: string) => {
    try {
      const u = users.find(x => x.id === userId);
      if (!u) return;
      const updatedUser: AppUser = { ...u, storeId: newStoreId };
      await saveUserProfile(updatedUser);
      setUsers(prev => prev.map(x => x.id === userId ? updatedUser : x));
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(updatedUser);
      }
      alert('Lojista movido para a loja selecionada com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao mover lojista.');
    }
  };

  const handleManageStore = (store: Store) => {
    alert(`Loja: ${store.name}\nSlug: ${store.slug}\nWhatsApp: ${store.whatsapp || 'Não configurado'}\nTemplate: ${store.catalogTemplate || 'Clean'}`);
  };

  const handleEditPlan = (planId: string) => {
    alert(`Editando plano: ${planId}`);
  };

  const handleNewPlan = () => {
    alert('Funcionalidade para criar novo plano.');
  };

  const copyStoreSlug = (slug: string) => {
    const url = `${window.location.origin}/#/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Link da loja copiado!');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans overflow-x-hidden selection:bg-[#FF2D7A] selection:text-white">
      
      {/* Header Mobile First */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-md px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-transparent border-2 border-[#FF2D7A] rounded-2xl flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-[#FF2D7A]" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest text-white flex items-center gap-1">PAINEL <span className="text-[#FF2D7A]">MASTER</span></h1>
            <div className="text-[9px] text-gray-400 tracking-wide font-medium">Administração da Plataforma</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center bg-[#181818] rounded-full text-white relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 bg-[#FF2D7A] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0D0D0D]">9+</span>
          </button>
          <button onClick={toggleMenu} className="w-10 h-10 flex items-center justify-center bg-[#FF2D7A] rounded-full text-white shadow-lg shadow-[#FF2D7A]/20">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Drawer Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={toggleMenu}
        />
      )}

      {/* Drawer Menu */}
      <div className={`fixed inset-y-0 left-0 w-[280px] bg-[#181818] z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2 text-[#FF2D7A]">
            <ShieldAlert className="w-6 h-6" />
            <span className="font-semibold text-lg">Painel Master</span>
          </div>
          <button onClick={toggleMenu} className="text-[#8E8E93] hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
          <div className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-2 px-2 mt-2">Menu Principal</div>
          
          <button onClick={() => selectTab('dashboard')} className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all font-medium text-[15px] ${activeTab === 'dashboard' ? 'bg-[#FF2D7A]/10 text-[#FF2D7A]' : 'text-[#8E8E93] hover:bg-[#181818] hover:text-white'}`}>
            <Activity className="w-5 h-5" /> Dashboard
          </button>
          <button onClick={() => selectTab('users')} className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all font-medium text-[15px] ${activeTab === 'users' ? 'bg-[#FF2D7A]/10 text-[#FF2D7A]' : 'text-[#8E8E93] hover:bg-[#181818] hover:text-white'}`}>
            <Users className="w-5 h-5" /> Lojistas
          </button>
          <button onClick={() => selectTab('stores')} className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all font-medium text-[15px] ${activeTab === 'stores' ? 'bg-[#FF2D7A]/10 text-[#FF2D7A]' : 'text-[#8E8E93] hover:bg-[#181818] hover:text-white'}`}>
            <StoreIcon className="w-5 h-5" /> Lojas
          </button>
          <button onClick={() => selectTab('plans')} className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all font-medium text-[15px] ${activeTab === 'plans' ? 'bg-[#FF2D7A]/10 text-[#FF2D7A]' : 'text-[#8E8E93] hover:bg-[#181818] hover:text-white'}`}>
            <CreditCard className="w-5 h-5" /> Planos
          </button>
          
          <div className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-2 px-2 mt-6">Gestão</div>
          <button onClick={() => selectTab('analytics')} className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all font-medium text-[15px] ${activeTab === 'analytics' ? 'bg-[#FF2D7A]/10 text-[#FF2D7A]' : 'text-[#8E8E93] hover:bg-[#181818] hover:text-white'}`}>
            <TrendingUp className="w-5 h-5" /> Analytics
          </button>

          <div className="text-xs font-semibold text-[#8E8E93] uppercase tracking-wider mb-2 px-2 mt-6">Sistema</div>
          
          {user.storeId && (
            <button onClick={onSwitchToStoreView} className="flex items-center gap-3 w-full p-3 rounded-2xl transition-all font-medium text-[15px] text-[#FF2D7A] bg-[#FF2D7A]/10 hover:bg-[#FF2D7A]/20">
              <StoreIcon className="w-5 h-5" /> Ir para Minha Loja
            </button>
          )}

          <button onClick={() => selectTab('settings')} className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all font-medium text-[15px] ${activeTab === 'settings' ? 'bg-[#FF2D7A]/10 text-[#FF2D7A]' : 'text-[#8E8E93] hover:bg-[#181818] hover:text-white'}`}>
            <Settings className="w-5 h-5" /> Configurações
          </button>
          <button onClick={() => selectTab('support')} className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all font-medium text-[15px] ${activeTab === 'support' ? 'bg-[#FF2D7A]/10 text-[#FF2D7A]' : 'text-[#8E8E93] hover:bg-[#181818] hover:text-white'}`}>
            <HeadphonesIcon className="w-5 h-5" /> Suporte
          </button>
        </div>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-2xl font-medium text-[15px] text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="p-4 w-full max-w-lg mx-auto pb-24">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-[#FF2D7A] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* SEARCH COMPONENT - Global for most tabs */}
            {(activeTab === 'users' || activeTab === 'stores' || activeTab === 'plans') && (
              <div className="relative w-full">
                <Search className="w-5 h-5 text-[#8E8E93] absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder={`Buscar em ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#181818] border-none rounded-2xl pl-12 pr-4 py-4 text-[15px] text-white focus:ring-2 focus:ring-[#FF2D7A] transition-all"
                />
              </div>
            )}

            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in">
                
                <Greeting name={user.name} />

                <div>
                  <h2 className="text-[17px] font-bold mb-4 text-white">Visão Geral</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <StoreIcon className="w-6 h-6 text-[#FF2D7A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8E8E93] font-bold mb-1">Lojas Ativas</div>
                    <div className="text-2xl font-black text-white mb-2">{stores.length}</div>
                  </div>
                </div>

                <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <Package className="w-6 h-6 text-[#FF2D7A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8E8E93] font-bold mb-1">Assinaturas Ativas</div>
                    <div className="text-2xl font-black text-white mb-2">{users.filter(u => u.status === 'active').length}</div>
                  </div>
                </div>

                <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-[#FF2D7A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8E8E93] font-bold mb-1">Receita (Estimada/Mês)</div>
                    <div className="text-[18px] font-black text-white mb-2">R$ {(users.filter(u => u.status === 'active').length * 47).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                  </div>
                </div>
                
                <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-[#FF2D7A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8E8E93] font-bold mb-1">Total de Lojistas</div>
                    <div className="text-2xl font-black text-white mb-2">{users.length}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 mt-4 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white">Receita & Crescimento</h3>
                <div className="bg-[#0D0D0D] text-[#8E8E93] text-[10px] px-3 py-1 rounded-full flex items-center gap-1 border border-white/5 font-bold">
                  Últimos 6 meses
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF2D7A" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF2D7A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#8E8E93', fontSize: 10, fontWeight: 'bold'}}
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                      itemStyle={{fontSize: '11px', fontWeight: 'bold'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#FF2D7A" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                   <div className="text-center">
                     <div className="text-[10px] text-[#8E8E93] font-bold uppercase mb-0.5">Ticket Médio</div>
                     <div className="text-sm font-black text-white">R$ 52,40</div>
                   </div>
                   <div className="w-[1px] h-8 bg-white/5" />
                   <div className="text-center">
                     <div className="text-[10px] text-[#8E8E93] font-bold uppercase mb-0.5">Churn Rate</div>
                     <div className="text-sm font-black text-emerald-500">2.1%</div>
                   </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black">
                    <TrendingUp className="w-3 h-3" /> +14.8%
                  </div>
                  <div className="text-[9px] text-[#8E8E93] font-medium mt-0.5">vs mês anterior</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5">
                <h3 className="text-sm font-bold text-white mb-4">Planos</h3>
                <div className="h-40 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PLAN_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {PLAN_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  {PLAN_DISTRIBUTION.map(p => (
                    <div key={p.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: p.color}} />
                        <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider">{p.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-white">{p.value}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5">
                <h3 className="text-sm font-bold text-white mb-4">Novas Lojas</h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Bar dataKey="users" fill="#FF2D7A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-2">
                   <p className="text-[10px] text-[#8E8E93] font-bold uppercase tracking-wider">Crescimento constante</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-white">Atividades Recentes</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF2D7A]/10 flex items-center justify-center shrink-0">
                    <StoreIcon className="w-4 h-4 text-[#FF2D7A]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-white">Nova loja cadastrada</div>
                    <div className="text-[11px] text-[#8E8E93]">Beleza Store</div>
                  </div>
                  <div className="text-[10px] text-[#8E8E93]">há 10 min</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-green-500/30 flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-[#181818]"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-white">Assinatura aprovada</div>
                    <div className="text-[11px] text-[#8E8E93]">Jessica Hair</div>
                  </div>
                  <div className="text-[10px] text-[#8E8E93]">há 30 min</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF2D7A]/10 flex items-center justify-center shrink-0 text-[#FF2D7A]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-white">Pagamento recebido</div>
                    <div className="text-[11px] text-[#8E8E93]">Plano Profissional - R$ 99,90</div>
                  </div>
                  <div className="text-[10px] text-[#8E8E93]">há 1 hora</div>
                </div>
              </div>
            </div>
            
          </div>
        )}

        {activeTab === 'users' && (
              <>
                <div className="flex flex-col gap-1 mb-4">
                  <h1 className="text-xl font-semibold">Lojistas</h1>
                  <p className="text-sm text-[#8E8E93]">Gerencie os proprietários de lojas</p>
                </div>

                <div className="space-y-4">
                  {filteredUsers.map(u => (
                    <div key={u.id} className="bg-[#181818] p-5 rounded-[18px] flex flex-col">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF2D7A] to-purple-600 flex items-center justify-center font-bold text-lg shadow-sm">
                          {u.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[16px]">{u.name}</h3>
                            {u.role === 'admin' && (
                              <span className="text-[9px] uppercase tracking-wider bg-[#FF2D7A]/20 text-[#FF2D7A] px-2 py-0.5 rounded-full font-bold">Admin</span>
                            )}
                          </div>
                          <p className="text-sm text-[#8E8E93]">{u.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-4 bg-[#0D0D0D] p-3 rounded-xl">
                        <div>
                          <div className="text-[10px] text-[#8E8E93] uppercase font-semibold">Plano</div>
                          <div className="text-sm font-medium text-white">{u.planId === 'plan_pro' ? 'Pro' : (u.planId || 'Pro')}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#8E8E93] uppercase font-semibold">Status</div>
                          <div className={`flex items-center gap-1.5 text-sm font-medium ${(u.status === 'expired' || u.status === 'canceled') ? 'text-red-400' : 'text-emerald-400'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${(u.status === 'expired' || u.status === 'canceled') ? 'bg-red-400' : 'bg-emerald-400'}`}></div> {u.status === 'expired' ? 'Expirado' : u.status === 'canceled' ? 'Cancelado' : 'Ativo'}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleManageUser(u)}
                        className="w-full py-3 bg-[#0D0D0D] hover:bg-[#FF2D7A]/5 active:bg-[#FF2D7A]/10 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-white/5"
                      >
                        Gerenciar Lojista
                      </button>
                    </div>
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-10 text-[#8E8E93]">
                      Nenhum lojista encontrado.
                    </div>
                  )}
                </div>
              </>
            )}

            {/* STORES / LOJAS TAB */}
            {activeTab === 'stores' && (
              <>
                <div className="flex flex-col gap-1 mb-4">
                  <h1 className="text-xl font-semibold">Lojas</h1>
                  <p className="text-sm text-[#8E8E93]">Catálogo de todas as lojas ativas</p>
                </div>

                <div className="space-y-4">
                  {filteredStores.map(store => {
                    const storeOwner = users.find(u => u.id === store.ownerId);
                    return (
                    <div key={store.id} className="bg-[#181818] p-5 rounded-[18px] flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#0D0D0D] flex items-center justify-center border border-white/10 overflow-hidden">
                            {store.logoUrl ? (
                              <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover" />
                            ) : (
                              <StoreIcon className="w-6 h-6 text-[#8E8E93]" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[16px] leading-tight">{store.name}</h3>
                            <a href={`#/${store.slug}`} target="_blank" rel="noreferrer" className="text-[#FF2D7A] text-[13px] hover:underline flex items-center gap-1 mt-0.5">
                              /{store.slug}
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1 mb-4">
                        <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                          <span className="text-[#8E8E93]">Dono</span>
                          <span className="text-gray-400 font-medium">{storeOwner?.name || 'Desconhecido'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-white/10 py-2">
                          <span className="text-[#8E8E93]">Cadastro</span>
                          <span className="text-gray-400 font-medium">Hoje</span>
                        </div>
                        <div className="flex justify-between items-center text-sm py-2">
                          <span className="text-[#8E8E93]">Status</span>
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Online
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          const owner = users.find(u => u.storeId === store.id);
                          if (owner) onImpersonateStore(store, owner);
                          else alert("Dono da loja não encontrado.");
                        }}
                        className="w-full py-3 bg-[#FF2D7A] hover:bg-[#FF2D7A]/90 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 mb-2"
                      >
                        <LogIn className="w-4 h-4" /> Acessar Loja
                      </button>
                      <button 
                        onClick={() => handleManageStore(store)}
                        className="w-full py-3 bg-[#0D0D0D] hover:bg-[#FF2D7A]/5 active:bg-[#FF2D7A]/10 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-white/5"
                      >
                        Gerenciar Informações
                      </button>
                    </div>
                  )})}
                  
                  {filteredStores.length === 0 && (
                    <div className="text-center py-10 text-[#8E8E93]">
                      Nenhuma loja encontrada.
                    </div>
                  )}
                </div>
              </>
            )}
            
            {/* PLANS TAB */}
            {activeTab === 'plans' && (
              <>
                <div className="flex flex-col gap-1 mb-4">
                  <h1 className="text-xl font-semibold">Planos</h1>
                  <p className="text-sm text-[#8E8E93]">Configure os limites de assinaturas</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#181818] p-5 rounded-[18px] border border-[#FF2D7A]/30 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#FF2D7A] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                      MAIS POPULAR
                    </div>
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">Plano Pro</h3>
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-[#FF2D7A]">R$ 47</span>
                        <span className="text-sm text-[#8E8E93] mb-1">/mês</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6 bg-[#0D0D0D] p-4 rounded-xl">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#8E8E93]">Produtos</span>
                        <span className="font-semibold">Ilimitados</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#8E8E93]">Banners</span>
                        <span className="font-semibold">Até 5</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-[#8E8E93]">Armazenamento</span>
                        <span className="font-semibold">2 GB</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleEditPlan('pro')}
                        className="flex-1 py-3 bg-[#0D0D0D] hover:bg-[#181818] rounded-xl text-sm font-semibold transition-colors border border-white/5"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => alert('Plano Pro é o padrão e não pode ser excluído no momento.')}
                        className="flex-1 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-semibold transition-colors border border-red-500/10"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleNewPlan}
                    className="w-full py-4 border border-dashed border-[#FF2D7A]/30 rounded-[18px] text-[#8E8E93] font-semibold flex items-center justify-center gap-2 hover:bg-[#FF2D7A]/5 hover:border-[#FF2D7A]/50 transition-all"
                  >
                    <Plus className="w-5 h-5 text-[#FF2D7A]" /> Novo Plano
                  </button>
                </div>
              </>
            )}

            {/* TUTORIALS TAB */}
            {activeTab === 'tutorials' && (
              <div className="animate-in fade-in">
                <MasterTutorials />
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl font-semibold">Configurações Gerais</h1>
                  <p className="text-sm text-[#8E8E93]">Parâmetros globais da plataforma</p>
                </div>
                
                <div className="bg-[#181818] border border-white/5 rounded-[32px] p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Taxa de Manutenção SaaS (%)</label>
                      <input
                        type="number"
                        defaultValue={5}
                        className="w-full bg-[#0D0D0D] border border-white/5 rounded-xl py-3 px-4 text-sm font-semibold outline-none focus:border-[#FF2D7A] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Período Free Trial (Dias)</label>
                      <input
                        type="number"
                        defaultValue={7}
                        className="w-full bg-[#0D0D0D] border border-white/5 rounded-xl py-3 px-4 text-sm font-semibold outline-none focus:border-[#FF2D7A] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">E-mail de Suporte</label>
                      <input
                        type="email"
                        defaultValue="suporte@catalogo.com"
                        className="w-full bg-[#0D0D0D] border border-white/5 rounded-xl py-3 px-4 text-sm font-semibold outline-none focus:border-[#FF2D7A] transition"
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => alert('Configurações salvas!')}
                    className="w-full py-4 bg-[#FF2D7A] text-white text-xs font-extrabold uppercase rounded-2xl shadow-lg shadow-[#FF2D7A]/20 active:scale-95 transition"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            )}

            {/* ANALYTICS / REPORTS TAB */}
            {activeTab === 'analytics' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl font-semibold">Relatórios & Analytics</h1>
                  <p className="text-sm text-[#8E8E93]">Exportação de dados e visão detalhada</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#181818] p-5 rounded-3xl border border-white/5">
                    <div className="text-[10px] text-[#8E8E93] font-bold uppercase mb-1">Visualizações Totais</div>
                    <div className="text-xl font-black text-white">48.291</div>
                    <div className="text-[10px] text-emerald-500 font-bold mt-1">+8% vs ontem</div>
                  </div>
                  <div className="bg-[#181818] p-5 rounded-3xl border border-white/5">
                    <div className="text-[10px] text-[#8E8E93] font-bold uppercase mb-1">Taxa de Clique</div>
                    <div className="text-xl font-black text-white">12.4%</div>
                    <div className="text-[10px] text-emerald-500 font-bold mt-1">+1.2% vs ontem</div>
                  </div>
                  <div className="bg-[#181818] p-5 rounded-3xl border border-white/5">
                    <div className="text-[10px] text-[#8E8E93] font-bold uppercase mb-1">Novos Leads</div>
                    <div className="text-xl font-black text-white">842</div>
                    <div className="text-[10px] text-emerald-500 font-bold mt-1">+42 hoje</div>
                  </div>
                </div>

                <div className="bg-[#181818] rounded-[32px] p-6 border border-white/5">
                  <h3 className="text-sm font-black text-white mb-6">Exportar Relatórios</h3>
                  <div className="space-y-4">
                    <button 
                      onClick={() => alert('Exportando CSV...')}
                      className="w-full flex items-center justify-between p-4 bg-[#0D0D0D] border border-white/5 rounded-2xl hover:bg-white/5 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                          <Download className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-white">Lojistas Ativos (CSV)</div>
                          <div className="text-[10px] text-[#8E8E93]">Lista completa com e-mails e planos</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition" />
                    </button>

                    <button 
                      onClick={() => alert('Exportando PDF...')}
                      className="w-full flex items-center justify-between p-4 bg-[#0D0D0D] border border-white/5 rounded-2xl hover:bg-white/5 transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                          <Download className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-white">Faturamento Mensal (PDF)</div>
                          <div className="text-[10px] text-[#8E8E93]">Relatório financeiro detalhado</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* OTHER TABS - Simplified Implementation */}
            {['support'].includes(activeTab) && (
              <div className="text-center py-24 flex flex-col items-center justify-center bg-[#181818] rounded-[18px]">
                <Package className="w-12 h-12 mb-4 text-gray-400" />
                <h2 className="text-lg font-semibold mb-1 text-white capitalize">{activeTab}</h2>
                <p className="text-sm text-[#8E8E93] max-w-[200px] mx-auto">Esta funcionalidade está em desenvolvimento e será liberada em breve.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090909] border-t border-white/5 pt-3 pb-2.5 px-3 flex flex-col justify-between items-center">
        <div className="w-full flex justify-around items-center">
          <button onClick={() => selectTab('dashboard')} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <Activity className={`w-5.5 h-5.5 transition-colors ${activeTab === 'dashboard' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}`} />
            <span className={`text-[11px] font-bold tracking-tight font-sans transition-colors ${activeTab === 'dashboard' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}`}>Dashboard</span>
          </button>
          <button onClick={() => selectTab('stores')} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <StoreIcon className={`w-5.5 h-5.5 transition-colors ${activeTab === 'stores' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}`} />
            <span className={`text-[11px] font-bold tracking-tight font-sans transition-colors ${activeTab === 'stores' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}`}>Lojas</span>
          </button>
          <button onClick={() => selectTab('subscriptions')} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <Package className={`w-5.5 h-5.5 transition-colors ${activeTab === 'subscriptions' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}`} />
            <span className={`text-[11px] font-bold tracking-tight font-sans transition-colors ${activeTab === 'subscriptions' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}`}>Assinaturas</span>
          </button>
          <button onClick={() => selectTab('finance')} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <DollarSign className={`w-5.5 h-5.5 transition-colors ${activeTab === 'finance' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}`} />
            <span className={`text-[11px] font-bold tracking-tight font-sans transition-colors ${activeTab === 'finance' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}`}>Financeiro</span>
          </button>
          <button onClick={toggleMenu} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <div className="flex gap-[3px] items-center justify-center h-[22px]">
              <div className="w-[5px] h-[5px] rounded-full bg-[#8E8E93]"></div>
              <div className="w-[5px] h-[5px] rounded-full bg-[#8E8E93]"></div>
              <div className="w-[5px] h-[5px] rounded-full bg-[#8E8E93]"></div>
            </div>
            <span className="text-[11px] font-bold tracking-tight font-sans text-[#8E8E93]">Mais</span>
          </button>
        </div>
        <div className="w-36 h-1 bg-gray-500 rounded-full mt-3.5 mb-0.5" />
      </nav>

      {/* GESTÃO DE LOJISTA MODAL */}
      {showManageModal && selectedUser && (
        <div className="fixed inset-0 bg-black/85 z-[100] backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#181818] border border-white/10 w-full max-w-lg rounded-[32px] p-6 shadow-2xl space-y-6 text-left my-8">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-black text-white">Gerenciar Lojista</h2>
                <p className="text-xs text-[#8E8E93] mt-0.5">{selectedUser.name} ({selectedUser.email})</p>
              </div>
              <button 
                onClick={() => setShowManageModal(false)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STATUS INFO CARD */}
            <div className="bg-[#0D0D0D] p-5 rounded-2xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-semibold">Status de Assinatura</span>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  (selectedUser.status === 'expired' || selectedUser.status === 'canceled') ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {selectedUser.status === 'expired' ? 'Expirada' : selectedUser.status === 'canceled' ? 'Cancelada' : 'Ativa'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-xs text-gray-400">Vencimento</span>
                <span className="font-mono text-white">
                  {selectedUser.expiresAt ? new Date(selectedUser.expiresAt).toLocaleDateString('pt-BR') : '04/08/2026'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-white/5 pt-3">
                <div>
                  <div className="text-xs text-white font-bold">Renovação Automática (30 em 30 dias)</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Ativa ou desativa a renovação periódica</div>
                </div>
                <button
                  onClick={() => handleToggleAutoRenew(selectedUser.id, selectedUser.autoRenew || false)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    selectedUser.autoRenew ? 'bg-[#FF2D7A]' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      selectedUser.autoRenew ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* MOVER LOJISTA (LOJA ASSOCIAÇÃO) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Acesso de Administrador</h4>
              <button
                onClick={() => {
                  const store = stores.find(s => s.id === selectedUser.storeId);
                  if (store) {
                    onImpersonateStore(store, selectedUser);
                    setShowManageModal(false);
                  } else {
                    alert('Esta loja não foi encontrada.');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FF2D7A] hover:bg-[#FF2D7A]/90 text-white rounded-xl text-sm font-extrabold transition-all"
              >
                <LogIn className="w-4 h-4" />
                Gerenciar Loja (Impersonar)
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mover Lojista (Mudar Loja Associada)</h4>
              <div className="flex gap-2">
                <select
                  value={moveStoreId}
                  onChange={(e) => setMoveStoreId(e.target.value)}
                  className="flex-1 bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF2D7A]"
                >
                  <option value="">Sem loja associada</option>
                  {stores.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.slug})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleMoveUserStore(selectedUser.id, moveStoreId)}
                  className="bg-[#FF2D7A] hover:bg-[#FF2D7A]/90 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all"
                >
                  Mover
                </button>
              </div>
            </div>

            {/* GERENCIAR ASSINATURA */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-left">Controle da Assinatura</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleRenewSubscription(selectedUser.id)}
                  className="flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-extrabold transition-all"
                >
                  <Package className="w-4 h-4" />
                  Renovar Assinatura
                </button>
                <button
                  onClick={() => handleRemoveSubscription(selectedUser.id)}
                  className="flex items-center justify-center gap-2 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-extrabold transition-all"
                >
                  <X className="w-4 h-4" />
                  Tirar Assinatura
                </button>
              </div>
            </div>

            {/* EXCLUIR CLIENTE LOJISTA */}
            <div className="border-t border-white/5 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest">Zona de Perigo</h4>
              <button
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600/10 hover:bg-red-600 border border-red-500/20 text-red-500 hover:text-white rounded-xl text-sm font-extrabold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Cliente Lojista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}
