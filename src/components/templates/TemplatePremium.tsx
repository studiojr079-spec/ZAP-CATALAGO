import React, { useState } from 'react';
import { Search, ChevronRight, ShoppingCart, Info, Home, LayoutGrid, MessageCircle } from 'lucide-react';
import { CatalogTemplateProps } from './types';

export default function TemplatePremium({
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
    <div style={{ backgroundColor: '#111111', color: '#FFFFFF' }} className="min-h-screen pb-32 font-sans selection:bg-[#FF2D7A] selection:text-white">
      <div className="w-full max-w-md mx-auto min-h-screen relative">
        
        {/* Header/Banner Section */}
        <div className="relative h-[400px] overflow-hidden">
          <img 
            src={activeBanner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
          
          <div className="absolute inset-0 z-10 px-6 pt-10 flex flex-col justify-end pb-16">
            {store.description && (
                <p className="text-lg text-gray-200 font-light tracking-wide max-w-xs">
                   {store.description}
                </p>
            )}
            <button 
                onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-8 w-fit px-10 py-3 bg-white text-[#111111] font-bold rounded-full uppercase tracking-widest text-sm hover:bg-gray-200 transition active:scale-95"
            >
                Ver Coleção
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 -mt-8 relative z-20">
            
            {/* Search */}
            <div className="mb-8">
              <div className="bg-[#1C1917] rounded-full flex items-center px-5 py-3 border border-white/10">
                <Search className="w-5 h-5 text-gray-500 mr-3" />
                <input
                  type="text"
                  placeholder="Buscar modelo..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 text-sm outline-none text-white placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Categories */}
            {categories && categories.length > 0 && (
              <div className="mb-8">
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  <button 
                      onClick={() => setSelectedCategory('')}
                      className={`flex flex-col items-center gap-2 flex-shrink-0 ${selectedCategory === '' ? '' : 'opacity-60'}`}
                  >
                      <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center border-2 border-[#FF2D7A]">
                          <span className="text-xs font-bold">Todos</span>
                      </div>
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`flex flex-col items-center gap-2 flex-shrink-0 ${selectedCategory === cat.name ? '' : 'opacity-60'}`}
                    >
                        <div className="w-16 h-16 rounded-full bg-stone-800 overflow-hidden border-2 border-[#FF2D7A]">
                            <img src={cat.image || "https://images.unsplash.com/photo-1595959183075-c1d0a174821d?w=100&h=100&fit=crop"} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-bold">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp CTA */}
            <button
              onClick={() => window.open(`https://wa.me/${store.whatsapp}`, '_blank')}
              className="mb-8 w-full bg-[#25D366] hover:bg-[#128C7E] text-white p-5 rounded-2xl flex items-center justify-center gap-3 transition shadow-lg shadow-[#25D366]/20"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="font-bold text-sm">Fale comigo no WhatsApp!</span>
            </button>

            {/* Section Header */}
            <div id="products-section" className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-serif font-bold uppercase tracking-wider text-white">
                Mais Vendidos
              </h2>
            </div>

            {/* Products */}
            <div className="grid grid-cols-2 gap-4 pb-20">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-[#1C1917] rounded-3xl overflow-hidden shadow-sm">
                  <div className="aspect-square bg-stone-800">
                    {product.images && product.images[0] && (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white text-sm truncate">{product.name}</h3>
                    {product.showPrice !== false && (
                        <p className="text-lg font-bold text-[#FF2D7A] mt-1">R$ {product.price.toFixed(2)}</p>
                    )}
                    <button 
                      onClick={() => handleEuQuero(product)}
                      className="mt-3 w-full py-2 bg-[#FF2D7A] text-white text-xs font-bold rounded-full uppercase tracking-widest active:scale-95 transition"
                    >
                      Eu Quero
                    </button>
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* Bottom Nav - simplified */}
        <div className="fixed bottom-0 inset-x-0 bg-[#0c0a0f] border-t border-white/10 px-6 py-4 z-50 flex justify-between items-center text-gray-400">
             <Home className="w-6 h-6" />
             <LayoutGrid className="w-6 h-6" />
             <button onClick={() => setShowCartModal?.(true)} className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#FF2D7A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
             </button>
             <Info className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
