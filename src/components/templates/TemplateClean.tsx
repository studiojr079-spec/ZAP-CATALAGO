import React from 'react';
import { Search, ShoppingCart, Menu, Info, Truck, MessageCircle } from 'lucide-react';
import { CatalogTemplateProps } from './types';

export default function TemplateClean({
  store,
  categories,
  filteredProducts,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  handleEuQuero,
  setShowAboutModal,
  setShowCartModal,
  cartCount,
  customBanners
}: CatalogTemplateProps) {
  const activeBanner = customBanners?.[0]?.image || store.banner || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&fit=crop";

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
      <div className="w-full max-w-md mx-auto min-h-screen px-4">
        
        {/* Banner */}
        {activeBanner && (
            <div className="w-full h-48 rounded-3xl overflow-hidden mb-6">
                <img src={activeBanner} alt="Banner" className="w-full h-full object-cover" />
            </div>
        )}
        
        {/* Header */}
        <div className="pt-6 pb-4 flex items-center justify-between">
          <Menu className="w-6 h-6 text-stone-900" />
          <h1 className="text-xl font-serif font-bold text-stone-950 tracking-tight">
            {store.name}
          </h1>
          <button onClick={() => setShowCartModal?.(true)} className="relative">
            <ShoppingCart className="w-6 h-6 text-stone-900" />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#FF2D7A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="bg-white rounded-full flex items-center px-5 py-3 border border-stone-200 shadow-sm">
            <Search className="w-5 h-5 text-stone-400 mr-3" />
            <input
              type="text"
              placeholder="Buscar modelo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 text-sm outline-none text-stone-900 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Info Links */}
        <div className="flex items-center justify-center gap-6 mb-8 text-xs text-stone-600 font-medium">
            <button onClick={() => setShowAboutModal?.(true)} className="flex items-center gap-2"><Info className="w-4 h-4"/> Sobre a loja</button>
            <button className="flex items-center gap-2"><Truck className="w-4 h-4"/> Rastrear pedido</button>
        </div>

        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="mb-8">
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
               <button 
                  onClick={() => setSelectedCategory('')}
                  className={`flex flex-col items-center gap-2 flex-shrink-0 ${selectedCategory === '' ? '' : 'opacity-70'}`}
               >
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-[#FF2D7A] flex items-center justify-center font-bold text-xs text-stone-900">Todos</div>
               </button>
               {categories.map(cat => (
                 <button 
                   key={cat.id}
                   onClick={() => setSelectedCategory(cat.name)}
                   className={`flex flex-col items-center gap-2 flex-shrink-0 ${selectedCategory === cat.name ? '' : 'opacity-70'}`}
                 >
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF2D7A]">
                        <img src={cat.image || "https://images.unsplash.com/photo-1595959183075-c1d0a174821d?w=100&h=100&fit=crop"} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-bold text-stone-900">{cat.name}</span>
                 </button>
               ))}
            </div>
          </div>
        )}

        {/* WhatsApp CTA */}
        <button
          onClick={() => window.open(`https://wa.me/${store.whatsapp}`, '_blank')}
          className="mb-8 w-full bg-[#25D366] hover:bg-[#128C7E] text-white p-5 rounded-2xl flex items-center justify-center gap-3 transition shadow-md shadow-[#25D366]/20"
        >
            <MessageCircle className="w-6 h-6" />
            <span className="font-bold text-sm">Fale comigo no WhatsApp!</span>
        </button>

        {/* Products */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif font-bold text-stone-950">29 Modelos disponíveis</h2>
          <span className="text-xs font-bold text-[#FF2D7A]">Ver todos</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100">
              <div className="aspect-square bg-stone-100">
                {product.images && product.images[0] && (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-stone-900 text-sm truncate">{product.name}</h3>
                {product.description && (
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{product.description}</p>
                )}
                {product.showPrice !== false && (
                    <p className="text-lg font-bold text-[#FF2D7A] mt-1">R$ {product.price.toFixed(2)}</p>
                )}
                <button 
                  onClick={() => handleEuQuero(product)}
                  className="mt-3 w-full py-2 bg-[#22C55E] text-white text-xs font-bold rounded-full uppercase tracking-widest transition active:scale-95"
                >
                  Eu Quero
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
