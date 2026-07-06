/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Home, LayoutGrid, ShoppingCart, Share2, MessageCircle, Heart, Check, Info, X } from 'lucide-react';
import { Store, Product, Category, Order, Notification } from '../types';
import { saveOrder, saveAnalytics, getAnalytics, saveNotification, saveProduct, getOrderById } from '../lib/db';

import TemplateClean from './templates/TemplateClean';
import TemplateDark from './templates/TemplateDark';
import TemplatePremium from './templates/TemplatePremium';


interface CatalogViewProps {
  store: Store;
  products: Product[];
  categories: Category[];
  onBackToDashboard?: () => void;
  isPreview?: boolean;
}

export default function CatalogView({ store, products, categories, onBackToDashboard, isPreview = false }: CatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('cat_todos');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('favorited_products');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [cartItems, setCartItems] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem(`cart_${store.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [showCartModal, setShowCartModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    localStorage.setItem(`cart_${store.id}`, JSON.stringify(cartItems));
  }, [cartItems, store.id]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: 'cart_' + Math.random().toString(36).substr(2, 9),
        productId: product.id,
        name: product.name,
        price: product.promoPrice || product.price,
        image: product.images[0],
        quantity: 1
      }];
    });
    setToastMsg(`"${product.name}" adicionado ao carrinho!`);
    setTimeout(() => {
      setToastMsg('');
    }, 2500);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const toggleFavorite = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem('favorited_products', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (product.hidden) return false;
      
      let matchesCategory = false;
      if (selectedCategory === 'favorites') {
        matchesCategory = favorites.includes(product.id);
      } else {
        matchesCategory = selectedCategory === 'cat_todos' || product.categoryId === selectedCategory;
      }

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.description || '').toLowerCase().includes(query) ||
        product.color?.toLowerCase().includes(query) ||
        product.length?.toLowerCase().includes(query) ||
        categories.find(c => c.id === product.categoryId)?.name.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery, categories, favorites]);

  // Handle "EU QUERO" Click (WhatsApp redirect & log analytics / orders)
  const handleEuQuero = async (product: Product) => {
    if (isPreview) {
      alert(`[Modo de Visualização]\nIsso direcionaria o cliente para o WhatsApp com uma mensagem sobre o produto "${product.name}".`);
      return;
    }

    try {
      // 1. Log click in orders database
      const now = new Date();
      const newOrder: Order = {
        id: 'ord_' + Math.random().toString(36).substr(2, 9),
        storeId: store.id,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        source: 'WhatsApp Link',
        status: 'Pendente',
        notes: `Clique originado do botão "EU QUERO" no catálogo público.`
      };
      await saveOrder(newOrder);

      // 2. Increment click analytics
      const analytics = await getAnalytics(store.id);
      if (analytics) {
        analytics.clicks = (analytics.clicks || 0) + 1;
        await saveAnalytics(analytics);
      } else {
        await saveAnalytics({
          storeId: store.id,
          views: 0,
          clicks: 1,
          uniqueVisitors: 0,
          devices: { mobile: 0, tablet: 0, desktop: 0 },
          origins: { direct: 0, whatsapp: 0, instagram: 0, tiktok: 0, google: 0 },
          locations: [],
          dailyMetrics: []
        });
      }

      // Increment clicks on this specific product
      product.clicks = (product.clicks || 0) + 1;
      await saveProduct(product);

      // 3. Trigger a real notification
      const newNotification: Notification = {
        id: 'not_' + Math.random().toString(36).substr(2, 9),
        storeId: store.id,
        type: 'click',
        title: 'Novo clique no WhatsApp!',
        description: `Alguém se interessou pelo produto "${product.name}"!`,
        date: now.toISOString(),
        read: false
      };
      await saveNotification(newNotification);
    } catch (e) {
      console.error('Error logging analytics/orders:', e);
    }

    // 4. Construct WhatsApp Message URL
    const formattedPrice = ((product.promoPrice || product.price) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    let message = store.messageTemplate
      ? store.messageTemplate
      : 'Olá!\n\nTenho interesse no produto:\n*{productName}*\n\nValor:\n*R$ {productPrice}*\n\nPode me atender?';

    message = message
      .replace('{productName}', product.name)
      .replace('{productPrice}', formattedPrice);

    const whatsappUrl = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyStoreLink = () => {
    const fullUrl = window.location.origin + '/#/' + store.slug;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Check if store has any active custom uploaded banners
  const customBanners = useMemo(() => {
    return (store.banners || []).filter(b => b.active).sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [store.banners]);

  const templateProps = {
    store,
    products,
    categories,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    handleEuQuero: addToCart, // In templates, "EU QUERO" now adds to cart
    favorites,
    toggleFavorite,
    setShowAboutModal,
    setShowShareModal,
    setShowCartModal,
    cartCount,
    customBanners,
    addToCart,
    setSelectedProduct
  };

  const finalizeOrder = async () => {
    if (cartItems.length === 0) return;

    if (isPreview) {
      alert(`[Modo de Visualização]\nIsso enviaria seu carrinho para o WhatsApp da loja.`);
      return;
    }

    const total = cartItems.reduce((acc, item) => acc + ((item.price || 0) * item.quantity), 0);
    const formattedTotal = total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    const orderId = 'ORD_' + Math.random().toString(36).substr(2, 6).toUpperCase();

    try {
      // 1. Log analytics for the whole order
      const now = new Date();
      
      for (const item of cartItems) {
        const newOrder: Order = {
          id: orderId + '_' + item.productId,
          storeId: store.id,
          productId: item.productId,
          productName: item.name,
          productPrice: item.price,
          date: now.toISOString().split('T')[0],
          time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          source: 'WhatsApp Cart',
          status: 'Pendente',
          notes: `Pedido de ${item.quantity}x ${item.name} via carrinho.`
        };
        await saveOrder(newOrder);
      }
    } catch (e) {
      console.error('Error saving orders:', e);
    }

    //Construct Message
    let message = `Olá! Gostaria de fazer um pedido:\n\n`;
    cartItems.forEach(item => {
      message += `• *${item.quantity}x ${item.name}* - R$ ${((item.price || 0) * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
    });
    message += `\n*TOTAL: R$ ${formattedTotal}*\n\nCódigo do Pedido: *${orderId}*`;

    const whatsappUrl = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
    
    // Clear cart after finalizing
    setCartItems([]);
    setShowCartModal(false);
    
    window.open(whatsappUrl, '_blank');
  };

  const renderTemplate = () => {
    switch (store.catalogTemplate) {
      case 'dark':
        return <TemplateDark {...templateProps} />;
      case 'premium':
        return <TemplatePremium {...templateProps} />;
      case 'clean':
      default:
        return <TemplateClean {...templateProps} />;
    }
  };

  return (
    <>
      {toastMsg && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#22C55E] text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Floating Preview Bar */}
      {isPreview && (
        <div className="bg-pink-600 text-white text-[11px] py-2 px-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
          <span className="font-semibold flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Você está visualizando a prévia do seu catálogo
          </span>
          <button
            onClick={onBackToDashboard}
            className="bg-white text-pink-600 px-3 py-1 rounded-full font-bold text-[10px] hover:bg-pink-50 transition active:scale-95"
          >
            Voltar
          </button>
        </div>
      )}

      {renderTemplate()}

      {/* Modals are kept at the CatalogView level so they work across templates */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-[#0c0a0f] text-white w-full max-w-md h-[85vh] rounded-t-3xl shadow-2xl relative flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>
            
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">
              <div className="flex flex-col items-center text-center mt-8 mb-10">
                <h2 className="text-3xl font-black tracking-tight uppercase" style={{ color: store.primaryColor }}>
                  {store.name}
                </h2>
                {store.description && (
                  <p className="mt-4 text-sm text-[#8E8E93] leading-relaxed font-medium">
                    {store.description}
                  </p>
                )}
              </div>

              {store.about && (
                <div className="space-y-6">
                  {/* Additional about content can go here based on store.about fields */}
                  {store.about.history && (
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-[#8E8E93] mb-2">Nossa História</h3>
                      <p className="text-sm font-medium leading-relaxed">{store.about.history}</p>
                    </div>
                  )}
                  {store.about.address && (
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-[#8E8E93] mb-2">Endereço</h3>
                      <p className="text-sm font-medium leading-relaxed">{store.about.address}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[#181818] border border-white/10 w-full max-w-sm rounded-[32px] p-8 text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-[#FF2D7A]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#FF2D7A]">
              <Share2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Compartilhar Catálogo</h3>
            <p className="text-sm text-[#8E8E93] mb-8">Espalhe a beleza! Copie o link abaixo para enviar para suas amigas.</p>
            
            <div className="bg-[#0D0D0D] border border-white/5 p-4 rounded-2xl mb-6 flex items-center justify-between gap-3">
              <span className="text-[13px] text-[#8E8E93] truncate">{window.location.origin}/#/{store.slug}</span>
              <button 
                onClick={copyStoreLink}
                className="bg-[#FF2D7A] text-white text-[11px] font-bold px-4 py-2 rounded-xl shrink-0"
              >
                {copiedLink ? 'Copiado!' : 'Copiar'}
              </button>
            </div>

            <button 
              onClick={() => setShowShareModal(false)}
              className="w-full py-4 text-[#8E8E93] font-bold text-sm hover:text-white transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 sm:items-center p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center z-10 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-square bg-gray-100 relative shrink-0">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">Sem imagem</div>
              )}
            </div>
            <div className="p-6 overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{selectedProduct.name}</h2>
              {selectedProduct.showPrice !== false && (
                <div className="text-2xl font-black text-[#FF2D7A] mb-4">
                  R$ {(selectedProduct.promoPrice || selectedProduct.price).toFixed(2).replace('.', ',')}
                </div>
              )}
              {selectedProduct.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Descrição</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{selectedProduct.description}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    handleEuQuero(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-4 bg-[#25D366] text-white font-black rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chamar no WhatsApp
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-14 h-14 bg-[#FF2D7A] text-white rounded-2xl flex items-center justify-center active:scale-95 transition"
                >
                  <ShoppingCart className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-[#0c0a0f] text-white w-full max-w-md h-[85vh] rounded-t-3xl shadow-2xl relative flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>
            
            <button
              onClick={() => setShowCartModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="text-xl font-black flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#FF2D7A]" />
                Meu Carrinho
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 text-[#8E8E93]">
                    <ShoppingCart className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold">Carrinho Vazio</h3>
                  <p className="text-sm text-[#8E8E93] mt-2">Você ainda não adicionou produtos.</p>
                  <button 
                    onClick={() => setShowCartModal(false)}
                    className="mt-6 px-8 py-3 bg-[#FF2D7A] rounded-full text-sm font-bold active:scale-95 transition"
                  >
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-white/5 rounded-2xl p-4 flex gap-4 border border-white/5">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/10 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                          <p className="text-[#FF2D7A] font-black text-xs mt-1">R$ {(item.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-[#0D0D0D] rounded-lg p-1 gap-3">
                            <button 
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-[10px] font-bold text-red-400 uppercase tracking-wider"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 bg-[#181818] border-t border-white/5 rounded-t-[32px] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#8E8E93] font-bold text-sm">Subtotal</span>
                  <span className="text-xl font-black text-white">
                    R$ {cartItems.reduce((acc, item) => acc + ((item.price || 0) * item.quantity), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button 
                  onClick={finalizeOrder}
                  className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-2xl shadow-lg shadow-green-500/20 active:scale-95 transition flex items-center justify-center gap-2 uppercase tracking-tight"
                >
                  <MessageCircle className="w-5 h-5" />
                  Finalizar no WhatsApp
                </button>
                <div className="text-[10px] text-[#8E8E93] text-center font-bold uppercase tracking-widest">
                  Envio rápido & atendimento humano
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

}
