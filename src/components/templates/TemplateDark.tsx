import React, { useState } from 'react';
import { Search, Home, LayoutGrid, Info, ShoppingCart, MessageCircle } from 'lucide-react';
import { CatalogTemplateProps } from './types';

export default function TemplateDark({
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
    <div style={{ backgroundColor: '#0B0A0C', color: '#FFFFFF' }} className="min-h-screen pb-24 font-sans relative selection:bg-[#FF2D7A] selection:text-white">
      <div className="w-full max-w-md mx-auto relative min-h-screen">
        
        {/* HERO & HEADER AREA */}
        <div className="relative w-full h-[360px] overflow-hidden">
           {/* Background Image */}
           <div className="absolute right-0 top-0 w-2/3 h-full">
             <img 
                src={activeBanner}
                alt="Banner"
                className="w-full h-full object-cover object-center opacity-90 transition-opacity duration-700"
                style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A0C] via-transparent to-transparent"></div>
           </div>

           <div className="absolute inset-0 z-10 pt-8 px-6 flex flex-col">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 mt-2">
                  <div className="h-[1px] w-6 bg-[#FF2D7A]/50"></div>
                  <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-[#FF2D7A]">
                    CATÁLOGO
                  </span>
                  <div className="h-[1px] w-6 bg-[#FF2D7A]/50"></div>
                </div>
              </div>

              {/* Banner Text */}
              <div className="max-w-[200px] mt-6">
                 <h2 className="text-[22px] text-white leading-tight mb-6 font-medium">
                    {store.description ? store.description.split('. ')[0] : 'Beleza, qualidade e naturalidade em cada fio.'}
                 </h2>
                 <button 
                  onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-3.5 bg-white text-black text-[11px] font-black rounded-2xl uppercase tracking-widest active:scale-95 transition shadow-2xl"
                 >
                    Ver Coleção
                 </button>
              </div>
           </div>
        </div>

        {/* MAIN HOME VIEW */}
        <div className="px-5 relative z-20 -mt-2">
            {/* Dark Search Input */}
            <div className="mb-8">
              <div className="bg-[#1C1A20] rounded-2xl flex items-center px-5 py-3.5 border border-white/5">
                <Search className="w-5 h-5 text-gray-500 mr-3" />
                <input
                  type="text"
                  placeholder="Buscar modelo..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 text-sm outline-none placeholder:text-gray-500 text-white"
                />
                <Search className="w-5 h-5 text-[#FF2D7A] ml-3" />
              </div>
            </div>

            {/* Categories Scroll Row */}
            {categories && categories.length > 0 && (
              <div className="mb-8">
                <div className="flex overflow-x-auto hide-scrollbar gap-5 pb-2">
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className="flex flex-col items-center gap-3 flex-shrink-0"
                  >
                    <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center border border-[#FF2D7A] p-1 bg-black">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop" alt="Todos" className="w-full h-full rounded-full object-cover opacity-80" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">Todos</span>
                  </button>
                  
                  {categories.map((cat, idx) => {
                    const isSelected = selectedCategory === cat.name;
                    const catImages = [
                      "https://images.unsplash.com/photo-1595959183075-c1d0a174821d?w=100&h=100&fit=crop",
                      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=100&h=100&fit=crop",
                      "https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=100&h=100&fit=crop",
                      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=100&h=100&fit=crop"
                    ];
                    const catImg = cat.image || catImages[idx % catImages.length];
                    return (
                      <button 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className="flex flex-col items-center gap-3 flex-shrink-0"
                      >
                        <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center p-1 bg-black ${isSelected ? 'border border-[#FF2D7A]' : ''}`}>
                          <img src={catImg} alt={cat.name} className="w-full h-full rounded-full object-cover opacity-80" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WhatsApp Box */}
            <button
              onClick={() => window.open(`https://wa.me/${store.whatsapp}`, '_blank')}
              className="mb-8 w-full bg-[#25D366] hover:bg-[#128C7E] text-white p-5 rounded-2xl flex items-center justify-center gap-3 transition shadow-lg shadow-[#25D366]/20"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="font-bold text-sm">Fale comigo no WhatsApp!</span>
            </button>

            {/* Section Header */}
            <div id="products-section" className="flex items-center justify-between mb-5 scroll-mt-6">
              <h2 className="text-[14px] font-bold uppercase tracking-wider text-white">
                {selectedCategory ? (selectedCategory === '' ? 'Destaques' : selectedCategory) : 'Destaques'}
              </h2>
              <button className="text-[13px] font-medium text-[#FF2D7A]">
                Ver todos
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {filteredProducts.map((product) => {
                const lengthText = product.length || '70cm';
                return (
                  <div 
                    key={product.id} 
                    className="bg-[#1A1720] rounded-2xl overflow-hidden flex flex-col"
                  >
                    <div className="aspect-[4/5] bg-zinc-900 relative">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/20 text-xs font-bold">Sem foto</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <h3 className="font-black text-[13px] text-white leading-tight uppercase tracking-wide">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-2 font-bold uppercase tracking-widest">
                           {lengthText}
                        </p>
                      </div>
                      
                      {product.showPrice !== false && (
                        <div className="mb-5">
                          <span className="text-xl font-black text-white">
                            R$ {(product.promoPrice || product.price).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => handleEuQuero(product)}
                        className="w-full py-4 bg-[#22C55E] text-white text-[11px] font-black rounded-2xl active:scale-95 transition shadow-lg shadow-[#22C55E]/10 uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Eu Quero
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
        </div>

        {/* FIXED BOTTOM NAVIGATION */}
        <div className="fixed bottom-0 inset-x-0 w-full max-w-md mx-auto bg-[#0c0a0f]/95 backdrop-blur-xl px-8 py-3 z-40 flex justify-between items-center pb-8 border-t border-white/5 shadow-2xl">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center gap-1.5 text-white active:scale-90 transition-transform"
          >
            <Home className="w-6 h-6 fill-white" />
            <span className="text-[10px] font-black uppercase tracking-widest">Início</span>
          </button>
          
          <button 
            onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-1.5 text-gray-500 active:scale-90 transition-transform"
          >
            <LayoutGrid className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Modelos</span>
          </button>
          
          <button 
            onClick={() => setShowCartModal?.(true)}
            className="flex flex-col items-center gap-1.5 text-gray-500 active:scale-90 transition-transform"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF2D7A] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#0c0a0f]">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Carrinho</span>
          </button>
          
          <button 
            onClick={() => setShowAboutModal?.(true)}
            className="flex flex-col items-center gap-1.5 text-gray-500 active:scale-90 transition-transform"
          >
            <Info className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sobre</span>
          </button>
        </div>

      </div>
    </div>
  );
}
