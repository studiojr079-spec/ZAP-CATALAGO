import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  INITIAL_USER, 
  INITIAL_STORE, 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_ORDERS, 
  INITIAL_ANALYTICS, 
  getEmptyAnalytics,
  INITIAL_NOTIFICATIONS, 
  INITIAL_SUBSCRIPTION 
} from '../lib/initialData';
import { Store, Product, Category, Order, AnalyticsRecord, Notification, UserSubscription, AppUser } from '../types';
import AuthView from './AuthView';
import MasterPortal from './MasterPortal';
import DashboardView from './DashboardView';
import ProductsManagement from './ProductsManagement';
import CategoriesManagement from './CategoriesManagement';
import PersonalizeStore from './PersonalizeStore';
import OrdersView from './OrdersView';
import SubscriptionsView from './SubscriptionsView';
import FinanceView from './FinanceView';
import AdminPanel from './AdminPanel';
import MoreMenu from './MoreMenu';
import MainMenu from './MainMenu';
import TutorialsView from './TutorialsView';
// import { auth } from '../lib/firebase';
import { 
  getStoreBySlug, getStoreById, getProducts, getCategories, saveStore, 
  getUserProfile, saveUserProfile, getUserProfileByEmail, saveProduct, saveCategory, deleteProduct as dbDeleteProduct, deleteCategory as dbDeleteCategory,
  getOrders, saveOrder, getAnalytics, saveAnalytics, getNotifications, saveNotification,
  generateSlug, isSlugAvailable
} from '../lib/db';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Loader2, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerPortal() {
  const navigate = useNavigate();
  const location = useLocation();

  // Application States
  const [user, setUser] = useState<AppUser | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRecord | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription>(INITIAL_SUBSCRIPTION);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Impersonation States (Admin managing a specific store)
  const [impersonatedStore, setImpersonatedStore] = useState<Store | null>(null);
  const [impersonatedUser, setImpersonatedUser] = useState<AppUser | null>(null);
  const [adminViewMode, setAdminViewMode] = useState<'master' | 'store'>('master');

  // Slug Management State
  const [showSlugModal, setShowSlugModal] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [slugError, setSlugError] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  useEffect(() => {
    if (store?.slug) {
      setNewSlug(store.slug);
    }
  }, [store?.slug]);

  const handleUpdateSlug = async () => {
    if (!newSlug || !store) return;
    
    const sanitizedSlug = generateSlug(newSlug);
    if (!sanitizedSlug) {
      setSlugError('Endereço inválido');
      return;
    }

    setIsCheckingSlug(true);
    setSlugError('');
    
    try {
      const available = await isSlugAvailable(sanitizedSlug, store.id);
      if (!available) {
        setSlugError('Este endereço já está em uso por outra loja.');
        setIsCheckingSlug(false);
        return;
      }

      const updatedStore = { ...store, slug: sanitizedSlug };
      await saveStore(updatedStore);
      setStore(updatedStore);
      setShowSlugModal(false);
    } catch (err) {
      console.error(err);
      setSlugError('Erro ao salvar endereço.');
    } finally {
      setIsCheckingSlug(false);
    }
  };

  const handleStartImpersonating = async (selectedStore: Store, ownerUser: AppUser) => {
    setLoadingAuth(true);
    try {
      setImpersonatedStore(selectedStore);
      setImpersonatedUser(ownerUser);
      
      // Fetch all data for the impersonated store
      const [prods, cats, ords, anls, notifs] = await Promise.all([
        getProducts(selectedStore.id),
        getCategories(selectedStore.id),
        getOrders(selectedStore.id),
        getAnalytics(selectedStore.id),
        getNotifications(selectedStore.id)
      ]);
      
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setAnalytics(anls || (selectedStore.id === 'store_jessica' ? INITIAL_ANALYTICS : getEmptyAnalytics(selectedStore.id)));
      setNotifications(notifs);
      
      // Set a temporary subscription matching the owner's plan/status
      setSubscription({
        userId: ownerUser.id,
        planId: ownerUser.planId || 'plan_pro',
        status: ownerUser.status || 'active',
        expiresAt: ownerUser.expiresAt || '2026-08-04T00:00:00',
        paymentGateway: 'stripe',
        autoRenew: ownerUser.autoRenew !== undefined ? ownerUser.autoRenew : true
      });

      // Redirect to the dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Failed to load impersonated store data:", err);
    } finally {
      setLoadingAuth(false);
    }
  };

  const handleStopImpersonating = async () => {
    setLoadingAuth(true);
    setImpersonatedStore(null);
    setImpersonatedUser(null);
    // Reload normal admin states
    if (user && user.storeId) {
      const storeData = await getStoreById(user.storeId);
      if (storeData) {
        setStore(storeData);
        const [prods, cats, ords, anls, notifs] = await Promise.all([
          getProducts(storeData.id),
          getCategories(storeData.id),
          getOrders(storeData.id),
          getAnalytics(storeData.id),
          getNotifications(storeData.id)
        ]);
        setProducts(prods);
        setCategories(cats);
        setOrders(ords);
        setAnalytics(anls || (storeData.id === 'store_jessica' ? INITIAL_ANALYTICS : getEmptyAnalytics(storeData.id)));
        setNotifications(notifs);
      }
    }
    setLoadingAuth(false);
    navigate('/admin/dashboard');
  };

  // Admin pre-registration/seeding on boot
  useEffect(() => {
    async function seedAdmin() {
      try {
        const adminEmail = 'jessicahair60@gmail.com';
        const existing = await getUserProfileByEmail(adminEmail);
        if (!existing) {
          const newAdminUser: AppUser = {
            id: 'admin_jessicahair',
            email: adminEmail,
            name: 'Jessica Hair',
            role: 'admin',
            password: '32371067',
            planId: 'plan_pro',
            status: 'active',
            expiresAt: '2026-12-31T23:59:59',
            autoRenew: true
          };
          await saveUserProfile(newAdminUser);
          console.log('Seeded master admin successfully!');
        }
      } catch (err) {
        console.warn('Silent seeding notice:', err);
      }
    }
    seedAdmin();
  }, []);

  useEffect(() => {
    async function checkAuth() {
      let activeProfile: AppUser | null = null;
      
      const savedUserStr = localStorage.getItem('portal_user');
      if (savedUserStr) {
        try {
          activeProfile = JSON.parse(savedUserStr) as AppUser;
        } catch (e) {
          console.error('Error loading fallback user:', e);
        }
      }

      if (activeProfile) {
        setUser(activeProfile);

        const userSub: UserSubscription = {
          userId: activeProfile.id,
          planId: activeProfile.planId || 'plan_pro',
          status: activeProfile.status || 'active',
          expiresAt: activeProfile.expiresAt || '2026-08-04T00:00:00',
          paymentGateway: 'stripe',
          autoRenew: activeProfile.autoRenew !== undefined ? activeProfile.autoRenew : true
        };
        setSubscription(userSub);

        if (activeProfile.storeId) {
          const storeData = await getStoreById(activeProfile.storeId);
          if (storeData) {
            console.log('OwnerPortal useEffect: Setting store:', storeData);
            setStore(storeData);
            
            const [prods, cats, ords, anls, notifs] = await Promise.all([
              getProducts(storeData.id),
              getCategories(storeData.id),
              getOrders(storeData.id),
              getAnalytics(storeData.id),
              getNotifications(storeData.id)
            ]);
            
            setProducts(prods);
            setCategories(cats);
            setOrders(ords);
            setAnalytics(anls || (storeData.id === 'store_jessica' ? INITIAL_ANALYTICS : getEmptyAnalytics(storeData.id)));
            setNotifications(notifs);
          } else {
            console.log('OwnerPortal useEffect: Store data not found for storeId:', activeProfile.storeId);
            setStore(INITIAL_STORE);
          }
        }
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    }
    checkAuth();
  }, []);

  // Determine active tab based on route
  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[pathParts.length - 1] || 'dashboard';

  const handleSaveStore = async (updatedStore: Store) => {
    setStore(updatedStore);
    await saveStore(updatedStore);
  };

  const handleSaveProduct = async (updatedProduct: Product) => {
    const activeStore = impersonatedStore || store;
    if (!activeStore) {
      console.error('handleSaveProduct: No active store found!');
      toast.error('Erro: Loja não carregada. Tente recarregar a página.');
      return;
    }

    // Ensure storeId is correct
    const productToSave = { ...updatedProduct, storeId: activeStore.id };
    console.log('handleSaveProduct: Saving productToSave', productToSave);

    let updated: Product[];
    const exists = products.some(p => p.id === productToSave.id);
    if (exists) {
      updated = products.map(p => p.id === productToSave.id ? productToSave : p);
    } else {
      updated = [productToSave, ...products];
    }
    setProducts(updated);
    
    try {
      await saveProduct(productToSave);
      toast.success(exists ? 'Produto atualizado com sucesso.' : 'Produto salvo com sucesso.');
    } catch (e) {
      console.error('handleSaveProduct: Error saving product', e);
      toast.error('Erro crítico ao salvar produto. Verifique sua conexão.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Deseja realmente deletar este produto?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      if (store) {
        try {
          await dbDeleteProduct(store.id, id);
          toast.success('Produto excluído com sucesso.');
        } catch (e) {
          toast.error('Erro ao excluir produto.');
          console.error(e);
        }
      }
    }
  };

  const handleSaveCategory = async (updatedCategory: Category) => {
    let updated: Category[];
    const exists = categories.some(c => c.id === updatedCategory.id);
    if (exists) {
      updated = categories.map(c => c.id === updatedCategory.id ? updatedCategory : c);
    } else {
      updated = [...categories, updatedCategory];
    }
    setCategories(updated);
    if (store) {
      try {
        await saveCategory(updatedCategory);
        toast.success(exists ? 'Categoria atualizada com sucesso.' : 'Categoria salva com sucesso.');
      } catch (e) {
        toast.error('Erro ao salvar categoria.');
        console.error(e);
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Deseja realmente deletar esta categoria? Todos os produtos nela serão movidos para a categoria padrão.')) {
      const updatedCats = categories.filter(c => c.id !== id);
      setCategories(updatedCats);

      const defaultId = updatedCats[0]?.id || 'cat_todos';
      const updatedProds = products.map((p) => {
        if (p.categoryId === id) return { ...p, categoryId: defaultId };
        return p;
      });
      setProducts(updatedProds);
      
      if (store) {
        try {
          await dbDeleteCategory(store.id, id);
          toast.success('Categoria excluída com sucesso.');
          // Also update products in firestore
          for (const prod of updatedProds) {
            if (prod.categoryId === defaultId) {
               await saveProduct({ ...prod, storeId: store.id });
            }
          }
        } catch (e) {
          toast.error('Erro ao excluir categoria.');
          console.error(e);
        }
      }
    }
  };

  const handleReorderCategories = async (updatedCats: Category[]) => {
    setCategories(updatedCats);
    if (store) {
      for (const cat of updatedCats) {
        await saveCategory(cat);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: 'Pendente' | 'Atendido' | 'Cancelado', notes?: string) => {
    const updated = orders.map((ord) => {
      if (ord.id === orderId) return { ...ord, status, notes };
      return ord;
    });
    setOrders(updated);
    
    if (store) {
      const updatedOrder = updated.find(o => o.id === orderId);
      if (updatedOrder) {
        await saveOrder(updatedOrder);
      }
    }
  };

  const handleUpdateSubscription = async (updatedSub: UserSubscription) => {
    setSubscription(updatedSub);
    if (user) {
      const updatedUser: AppUser = {
        ...user,
        planId: updatedSub.planId,
        status: updatedSub.status,
        expiresAt: updatedSub.expiresAt,
        autoRenew: updatedSub.autoRenew !== undefined ? updatedSub.autoRenew : true
      };
      setUser(updatedUser);
      await saveUserProfile(updatedUser);
    }
  };

  const handleLoginSuccess = async (loggedInUser: AppUser) => {
    setUser(loggedInUser);
    localStorage.setItem('portal_user', JSON.stringify(loggedInUser));
    if (loggedInUser.storeId) {
       const storeData = await getStoreById(loggedInUser.storeId);
       setStore(storeData);
    }
    navigate('/admin/dashboard');
  };

  const handleLogout = async () => {
    // await signOut(auth);
    localStorage.removeItem('portal_user');
    setUser(null);
    navigate('/admin');
  };

  const handleReset = () => {
    alert('Operação desativada no banco de dados real.');
  };

  const handleDismissNotification = async (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    if (store) {
      const updatedNotif = updated.find(n => n.id === id);
      if (updatedNotif) {
        await saveNotification(updatedNotif);
      }
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  if (loadingAuth) {
    return (
      <div className="fixed inset-0 bg-[#0c0a0f] flex flex-col items-center justify-center z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-[#FF2D7A]/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative bg-[#181818] p-8 rounded-[40px] border border-white/5 flex flex-col items-center gap-6">
            <div className="p-4 bg-[#FF2D7A]/10 rounded-3xl text-[#FF2D7A]">
              <Sparkles className="w-10 h-10 animate-pulse" />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-black text-white tracking-tight">ZapCatálogo</h2>
              <div className="flex items-center gap-2 justify-center text-[#8E8E93] text-sm font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-[#FF2D7A]" />
                <span>Carregando sua vitrine...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0c0a0f] text-white flex flex-col justify-between">
        <AuthView onLoginSuccess={handleLoginSuccess} currentUser={user} onLogout={handleLogout} />
      </div>
    );
  }
  
  if (user && user.role === 'admin' && !impersonatedStore && adminViewMode === 'master') {
    return (
      <MasterPortal 
        user={user} 
        onLogout={handleLogout} 
        onImpersonateStore={handleStartImpersonating}
        onSwitchToStoreView={() => setAdminViewMode('store')}
      />
    );
  }

  // Se o usuário está logado, mas por algum motivo store está nulo (ex: recarregou a página rápido)
  // vamos garantir que ele tenha um store default pra não quebrar
  const safeStore = impersonatedStore || store || INITIAL_STORE;
  const safeUser = impersonatedUser || user || INITIAL_USER;

  return (
    <div className="min-h-screen bg-[#0c0a0f] text-white flex flex-col justify-between">
      {impersonatedStore && (
        <div className="bg-[#FF2D7A] text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold z-50 sticky top-0 shadow-lg select-none">
          <div className="flex items-center gap-2">
            <span className="bg-white text-[#FF2D7A] px-1.5 py-0.5 rounded-full font-black uppercase text-[9px] tracking-wider animate-pulse">MODO ADMIN</span>
            <span>Você está gerenciando a loja <strong>{impersonatedStore.name}</strong></span>
          </div>
          <button 
            onClick={handleStopImpersonating}
            className="bg-black/30 hover:bg-black/50 active:bg-black/60 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
          >
            Voltar ao Painel Master
          </button>
        </div>
      )}
      <div className="flex-1 animate-in fade-in duration-300 pb-24">
        <Routes>
          <Route path="dashboard" element={
            <DashboardView 
              user={safeUser}
              store={safeStore}
              products={products}
              categories={categories}
              orders={orders}
              analytics={analytics || (safeStore.id === 'store_jessica' ? INITIAL_ANALYTICS : getEmptyAnalytics(safeStore.id))}
              notifications={notifications}
              onNavigate={(tab) => navigate(`/admin/${tab}`)}
              onOpenPublicCatalog={() => window.open(`${window.location.origin}/#/${safeStore.slug}`, '_blank')}
              onAddProduct={() => navigate('/admin/products')}
              onChangeSlug={() => setShowSlugModal(true)}
            />
          } />
          <Route path="products" element={
            <ProductsManagement
              products={products}
              categories={categories}
              onSaveProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
              onReorderProducts={async (newProducts) => {
                setProducts(newProducts);
                if (safeStore) {
                  for (const prod of newProducts) {
                    await saveProduct({ ...prod, storeId: safeStore.id });
                  }
                }
              }}
              storeId={safeStore.id}
            />
          } />
          <Route path="categories" element={
            <CategoriesManagement
              categories={categories}
              products={products}
              onSaveCategory={handleSaveCategory}
              onDeleteCategory={handleDeleteCategory}
              onReorderCategories={handleReorderCategories}
              storeId={safeStore.id}
            />
          } />
          <Route path="personalize" element={
            <PersonalizeStore
              store={safeStore}
              onSaveStore={handleSaveStore}
            />
          } />
          <Route path="orders" element={
            <OrdersView
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          } />
          <Route path="finance" element={<FinanceView />} />
          <Route path="subscriptions" element={
            <SubscriptionsView
              subscription={subscription}
              onUpdateSubscription={handleUpdateSubscription}
            />
          } />
          <Route path="platform-admin" element={
            <AdminPanel onBackToDashboard={() => navigate('/admin/dashboard')} />
          } />
          <Route path="more" element={
            <MoreMenu
              user={safeUser}
              store={safeStore}
              notifications={notifications}
              onNavigate={(tab) => navigate(`/admin/${tab}`)}
              onLogout={handleLogout}
              onReset={handleReset}
              onDismissNotification={handleDismissNotification}
            />
          } />
          <Route path="tutorials" element={<TutorialsView />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>

      {activeTab !== 'platform-admin' && activeTab !== 'more' && (
        <div className="fixed bottom-[88px] right-4 z-40">
          <button
            onClick={() => window.open(`#/${safeStore.slug}`, '_blank')}
            className="bg-[#090909] border border-[#FF2D7A]/30 text-white pl-4 pr-5 py-3 rounded-full shadow-lg shadow-[#FF2D7A]/20 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wide hover:bg-[#181818] transition active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF2D7A] animate-pulse"></span>
            Visualizar Catálogo
          </button>
        </div>
      )}

      <MainMenu
        activeTab={activeTab as any}
        onChangeTab={(tab) => navigate(`/admin/${tab}`)}
        unreadNotificationsCount={unreadNotifications}
      />

      {/* Slug Change Modal */}
      {showSlugModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#18121e] border border-white/5 w-full max-w-sm rounded-[32px] p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-white tracking-tight uppercase">Alterar Endereço</h3>
              <button onClick={() => setShowSlugModal(false)} className="text-[#8E8E93] hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Endereço do Catálogo</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">zapcat.app/</div>
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => {
                      setNewSlug(e.target.value);
                      setSlugError('');
                    }}
                    placeholder="meu-catalogo"
                    className="w-full bg-[#0c0a0f] border border-white/10 rounded-2xl py-3.5 pl-[92px] pr-4 text-sm font-bold text-white outline-none focus:border-[#FF2D7A] transition"
                  />
                </div>
                <p className="text-[9px] text-gray-500 mt-2 px-1">
                  Use apenas letras minúsculas, números e hífens. O endereço será sanitizado automaticamente.
                </p>
                {slugError && (
                  <p className="text-[10px] text-red-500 mt-2 font-bold px-1 bg-red-500/10 py-1.5 rounded-lg border border-red-500/20">
                    ⚠ {slugError}
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleUpdateSlug}
                  disabled={isCheckingSlug || !newSlug}
                  className="w-full py-4 bg-[#FF2D7A] text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-[#FF2D7A]/20 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCheckingSlug && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isCheckingSlug ? 'Verificando...' : 'Confirmar Alteração'}
                </button>
                <button
                  onClick={() => setShowSlugModal(false)}
                  className="w-full py-4 bg-white/5 text-gray-400 text-xs font-black uppercase tracking-widest rounded-2xl active:scale-95 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

