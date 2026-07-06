import React, { useState, useEffect } from 'react';
import { Palette, Store as StoreIcon, MessageCircle, Save, CheckCircle2, ChevronRight, Upload, Edit2, X, Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Check, Layout, Eye, Sparkles, Copy } from 'lucide-react';
import { Store, StoreBanner, Product, Category, SystemConfig } from '../types';
import CatalogView from './CatalogView';
import { getSystemConfig } from '../lib/system';
import ImageUpload from './ImageUpload';

interface PersonalizeStoreProps {
  store: Store;
  products?: Product[];
  categories?: Category[];
  onSaveStore: (store: Store) => Promise<void> | void;
}

export default function PersonalizeStore({ store, products = [], categories = [], onSaveStore }: PersonalizeStoreProps) {
  const [formData, setFormData] = useState<Store>(JSON.parse(JSON.stringify(store)));
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({});

  useEffect(() => {
    async function loadSystemConfig() {
      try {
        const config = await getSystemConfig();
        setSystemConfig(config);
      } catch (err) {
        console.error('Error loading system config:', err);
      }
    }
    loadSystemConfig();
  }, []);

  // Auxiliary helper states
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  useEffect(() => {
    // Only init if it's empty or different store
    if (!formData.id || formData.id !== store.id) {
      setFormData(JSON.parse(JSON.stringify(store)));
    }
  }, [store.id]);

  const updateField = (field: keyof Store, value: any) => {
    const next = { ...formData, [field]: value };
    setFormData(next);
  };

  const updateNestedField = (parent: keyof Store, field: string, value: any) => {
    const next = {
      ...formData,
      [parent]: {
        ...(formData[parent] as any || {}),
        [field]: value
      }
    };
    setFormData(next);
  };

  
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveStore(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Banner Editor state
  const [editingBanner, setEditingBanner] = useState<StoreBanner | null>(null);
  const [bannerForm, setBannerForm] = useState({ id: '', image: '', link: '', active: true, title: '', subtitle: '', buttonText: '', displayLocation: 'home' });

  const startEditBanner = (b?: StoreBanner) => {
    if (b) {
      setEditingBanner(b);
      setBannerForm({ id: b.id, image: b.image, link: b.link || '', active: b.active, title: b.title || '', subtitle: b.subtitle || '', buttonText: b.buttonText || '', displayLocation: b.displayLocation || 'home' });
    } else {
      setEditingBanner({ id: 'new', image: '', link: '', active: true, order: 0, title: '', subtitle: '', buttonText: '', displayLocation: 'home' } as any);
      setBannerForm({ id: 'new', image: '', link: '', active: true, title: '', subtitle: '', buttonText: '', displayLocation: 'home' });
    }
  };

  const saveBanner = () => {
    if (!bannerForm.image) return;
    let newBanners = [...(formData.banners || [])];
    
    if (editingBanner?.id === 'new') {
      newBanners.push({
        id: 'ban_' + Math.random().toString(36).substr(2, 9),
        image: bannerForm.image,
        link: bannerForm.link,
        active: bannerForm.active,
        title: bannerForm.title,
        subtitle: bannerForm.subtitle,
        buttonText: bannerForm.buttonText,
        order: newBanners.length,
        displayLocation: bannerForm.displayLocation
      });
    } else {
      newBanners = newBanners.map(b => b.id === editingBanner?.id ? { ...b, ...bannerForm } : b);
    }
    
    updateField('banners', newBanners);
    setEditingBanner(null);
  };

  const deleteBanner = (id: string) => {
    updateField('banners', (formData.banners || []).filter(b => b.id !== id));
  };

  const moveBanner = (index: number, dir: 'up' | 'down') => {
    const arr = [...(formData.banners || [])];
    if (dir === 'up' && index > 0) {
      const temp = arr[index];
      arr[index] = arr[index - 1];
      arr[index - 1] = temp;
    } else if (dir === 'down' && index < arr.length - 1) {
      const temp = arr[index];
      arr[index] = arr[index + 1];
      arr[index + 1] = temp;
    }
    arr.forEach((b, i) => b.order = i);
    updateField('banners', arr);
  };

  const templates = [
    { 
      id: 'clean', 
      name: 'Clean (Lumi)', 
      desc: 'Inspirado na Lumi Beauty (Imagem 2). Design romântico com fundo creme e rosé pastel, cabeçalho delicado, botões verdes de WhatsApp e cards minimalistas.', 
      img: systemConfig.templatePreviews?.clean || '/clean.png',
      badge: 'Clean & Delicado',
      colors: ['#FFFBF7', '#D9657D', '#22C55E'],
      colorNames: ['Fundo Creme', 'Rosé Pastel', 'WhatsApp Verde']
    },
    { 
      id: 'dark', 
      name: 'Dark (Moderno)', 
      desc: 'Visual contemporâneo de aplicativo (Imagem 1). Fundo escuro absoluto (obsidiana) com luzes de neon pink, modelo marcante e navegação integrada no rodapé.', 
      img: systemConfig.templatePreviews?.dark || '/dark.png',
      badge: 'Obsidian & Neon Pink',
      colors: ['#0c0a0f', '#FF2D7A', '#FFFFFF'],
      colorNames: ['Obsidiana', 'Neon Pink', 'Branco']
    },
    { 
      id: 'premium', 
      name: 'Premium (Elegante)', 
      desc: 'Design sofisticado com tipografia serifada, foco em clareza e elegância. Ideal para marcas premium.', 
      img: systemConfig.templatePreviews?.premium || '/premium.png',
      badge: 'Sofisticado & Clean',
      colors: ['#111111', '#FF2D7A', '#FFFFFF'],
      colorNames: ['Fundo Escuro', 'Pink Premium', 'Branco']
    }
  ];

  const currentTemplate = formData.catalogTemplate || 'clean';

  if (previewTemplate) {
    const previewStore: Store = { ...formData, catalogTemplate: previewTemplate };
    return (
      <div className="fixed inset-0 z-[100] bg-black">
        <CatalogView
          store={previewStore}
          products={products}
          categories={categories}
          isPreview={true}
          onBackToDashboard={() => setPreviewTemplate(null)}
        />
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center pb-8 z-[200]">
          <button
            onClick={async () => {
              const updated = { ...formData, catalogTemplate: previewTemplate };
              setFormData(updated);
              await onSaveStore(updated);
              setPreviewTemplate(null);
            }}
            className="bg-[#FF2D7A] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest shadow-2xl active:scale-95 transition"
          >
            Aplicar este Modelo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="personalize-store" className="min-h-screen text-white bg-[#0c0a0f] pb-32 text-left p-4 font-sans relative">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Aparência do Catálogo</h1>
          <p className="text-xs text-[#8E8E93] mt-1 font-semibold">Simples, profissional e feito para vender.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#FF2D7A] text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wide flex items-center gap-2 shadow-lg shadow-[#FF2D7A]/20 active:scale-95 transition whitespace-nowrap"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? 'Salvo!' : 'Salvar'}
        </button>
      </div>

      <div className="space-y-8">
        
        {/* MODELO DO CATÁLOGO */}
        <section className="bg-[#18121e] border border-white/5 rounded-3xl p-6 shadow-lg">
          <div className="mb-5">
            <h2 className="text-base font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Layout className="w-5 h-5 text-[#FF2D7A]" /> Modelo do Catálogo
            </h2>
            <p className="text-[10px] text-[#8E8E93] font-bold mt-1 uppercase tracking-wider">Escolha o visual que melhor combina com seu negócio</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map(tpl => {
              const isActive = currentTemplate === tpl.id;
              return (
                <div 
                  key={tpl.id}
                  onClick={() => updateField('catalogTemplate', tpl.id)}
                  className={`group relative rounded-3xl overflow-hidden border-2 bg-[#131016] transition-all duration-300 cursor-pointer flex flex-col p-3 ${
                    isActive 
                      ? 'border-[#FF2D7A] ring-4 ring-[#FF2D7A]/25 shadow-[0_20px_50px_rgba(255,45,122,0.35)] scale-[1.03] -translate-y-1' 
                      : 'border-white/5 opacity-70 hover:opacity-100 hover:border-white/20 hover:scale-[1.01]'
                  }`}
                >
                  {/* Selection Checkmark Icon in the Top Right */}
                  {isActive && (
                    <div className="absolute top-5 right-5 bg-[#FF2D7A] text-white p-2 rounded-full shadow-[0_4px_15px_rgba(255,45,122,0.5)] z-20 border border-white/20 animate-bounce">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}

                  {/* PREMIUM DEVICES MOCKUP SCREENSHOT AREA */}
                  <div className="relative aspect-[3/4.2] w-full rounded-2xl overflow-hidden mb-4 border border-white/5 bg-[#18121e] select-none shadow-inner flex flex-col">
                    {/* Simulated mobile status bar overlay */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between text-[6px] font-bold text-white/40 bg-black/30 backdrop-blur-[2px] px-2 py-0.5 rounded-full z-15 pointer-events-none">
                      <span>12:00</span>
                      <div className="w-6 h-0.5 bg-white/20 rounded-full"></div>
                      <div className="flex items-center gap-0.5">
                        <span className="w-0.5 h-0.5 rounded-full bg-white/40" />
                        <span className="w-1.5 h-1 bg-white/40 rounded-xs" />
                      </div>
                    </div>

                    {/* RENDER DYNAMIC MINI MOCKUP OF EACH TEMPLATE MATCHING SCREENSHOTS EXACTLY */}
                    {tpl.id === 'clean' && (
                      <div className="w-full h-full bg-[#FFFBF7] p-2 pt-6 flex flex-col gap-1.5 text-slate-800 text-[6px] overflow-hidden select-none relative">
                        {/* Header */}
                        <div className="text-center font-serif font-black text-[7.5px] text-[#D9657D] tracking-wider leading-none">
                          Jessica Hair
                          <div className="text-[3.5px] uppercase tracking-[0.2em] text-slate-400 mt-0.5">Catálogo</div>
                        </div>
                        
                        {/* Search bar */}
                        <div className="h-3.5 bg-white border border-slate-200/60 rounded-full px-1.5 flex items-center justify-between text-slate-300 scale-95 origin-center">
                          <span>Buscar modelo...</span>
                          <div className="w-1.5 h-1.5 rounded-full border border-slate-300" />
                        </div>

                        {/* Categories */}
                        <div className="flex gap-1 justify-between px-1">
                          {['Todos', 'Cheados', 'Lisos', 'Rabos'].map((cat, i) => (
                            <div key={i} className="flex flex-col items-center gap-0.5 scale-95 origin-center">
                              <div className="w-4 h-4 rounded-full bg-slate-100 border border-[#D9657D]/30 overflow-hidden flex items-center justify-center">
                                <span className="text-[3.5px] text-[#D9657D] font-bold">♥</span>
                              </div>
                              <span className="text-[3.5px] font-medium text-slate-500">{cat}</span>
                            </div>
                          ))}
                        </div>

                        {/* WhatsApp Banner */}
                        <div className="bg-[#22C55E]/5 border border-[#22C55E]/20 rounded-md p-1 flex items-center gap-1 scale-95 origin-center -my-0.5">
                          <div className="w-2.5 h-2.5 bg-[#22C55E] rounded-full flex items-center justify-center text-white text-[5px]">☏</div>
                          <div className="flex-1 font-bold text-[#15803d] leading-none text-[4.5px]">
                            Clique em EU QUERO e fale no WhatsApp!
                          </div>
                        </div>

                        {/* Grid of items */}
                        <div className="grid grid-cols-2 gap-1 px-0.5 flex-1 mt-0.5">
                          {[
                            { name: 'LUDMILLA MEL', length: '60cm', img: 'https://images.unsplash.com/photo-1595959183075-c1d0a174821d?w=100&h=120&fit=crop&q=80' },
                            { name: 'SARAH CHOCO', length: '70cm', img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=100&h=120&fit=crop&q=80' }
                          ].map((prod, i) => (
                            <div key={i} className="bg-white rounded-md border border-slate-100 p-0.5 flex flex-col gap-0.5 justify-between">
                              <div className="relative aspect-square rounded-sm overflow-hidden bg-slate-50">
                                <img src={prod.img} alt="" className="w-full h-full object-cover" />
                                <span className="absolute top-0.5 left-0.5 bg-[#D9657D] text-white text-[3px] px-1 py-0.2 rounded-full font-black scale-75 origin-top-left">{prod.length}</span>
                              </div>
                              <div className="font-bold text-[4px] text-slate-700 truncate leading-none">{prod.name}</div>
                              <div className="w-full py-0.5 bg-[#22C55E] rounded-xs text-white text-center font-bold text-[3px] flex items-center justify-center gap-0.5">
                                <span>☏ EU QUERO</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}


                    {tpl.id === 'dark' && (
                      <div className="w-full h-full bg-[#0c0a0f] p-2 pt-6 flex flex-col gap-1.5 text-white text-[6px] overflow-hidden select-none relative">
                        {/* Background glow overlay */}
                        <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#FF2D7A]/10 to-transparent pointer-events-none" />

                        {/* Header Logo */}
                        <div className="text-center leading-none">
                          <h1 className="text-[8px] font-serif font-black tracking-wide text-white">Jessica Hair</h1>
                          <span className="text-[3px] tracking-widest uppercase text-white/40 block mt-0.5">Catálogo</span>
                        </div>

                        {/* Hero Banner Area */}
                        <div className="bg-[#18121e] border border-white/5 rounded-lg p-1.5 h-[45px] flex relative overflow-hidden shadow-lg -my-0.5">
                          <div className="flex-1 flex flex-col justify-between h-full py-0.2 z-10">
                            <div className="font-black text-[5px] leading-tight text-white max-w-[65px]">
                              Beleza, qualidade e <span className="text-[#FF2D7A]">naturalidade</span>.
                            </div>
                            <button className="px-1.5 py-0.2 bg-[#FF2D7A] text-white rounded-full w-fit text-[3px] uppercase font-bold scale-90 origin-left">Ver Coleção</button>
                          </div>
                          <img 
                            src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=100&h=120&fit=crop&q=80" 
                            alt="" 
                            className="absolute right-0 bottom-0 h-full w-[40%] object-cover opacity-90" 
                          />
                        </div>

                        {/* Search Bar */}
                        <div className="h-3 bg-white/5 border border-white/10 rounded-full px-1.5 flex items-center justify-between text-white/30 scale-95 origin-center">
                          <span>Buscar modelo...</span>
                          <div className="w-1 h-1 rounded-full border border-white/30" />
                        </div>

                        {/* Categories Circle */}
                        <div className="flex gap-1 justify-between px-1 scale-95 origin-center">
                          {['Todos', 'Cheados', 'Lisos', 'Rabos'].map((cat, i) => (
                            <div key={i} className="flex flex-col items-center gap-0.5">
                              <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-[#FF2D7A]/30 flex items-center justify-center">
                                <span className="text-[3px] text-[#FF2D7A]">★</span>
                              </div>
                              <span className="text-[3.5px] text-white/70 font-semibold">{cat}</span>
                            </div>
                          ))}
                        </div>

                        {/* MAIS VENDIDOS Grid */}
                        <div className="grid grid-cols-2 gap-1 px-0.5 flex-1 mt-0.5">
                          {[
                            { name: 'Aplique Cacheado 70cm', price: 'R$ 189,90', img: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=100&h=120&fit=crop&q=80' },
                            { name: 'Aplique Liso 60cm', price: 'R$ 179,90', img: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=100&h=120&fit=crop&q=80' }
                          ].map((prod, i) => (
                            <div key={i} className="bg-zinc-950 rounded-md border border-white/5 p-0.5 flex flex-col gap-0.5 justify-between shadow-lg">
                              <div className="relative aspect-square rounded-sm overflow-hidden bg-zinc-900">
                                <img src={prod.img} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="font-bold text-[3.8px] text-white/90 truncate leading-none">{prod.name}</div>
                              <div className="text-[3.5px] text-[#FF2D7A] font-bold leading-none">{prod.price}</div>
                              <div className="w-full py-0.5 bg-[#FF2D7A] rounded-sm text-white text-center font-bold text-[3px]">
                                EU QUERO
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Gradient Overlay for luxury aesthetics / Theme colors indicators */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3 pt-6 z-10 pointer-events-none">
                      {/* Interactive palette viewer */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1">
                          {tpl.colors.map((color, idx) => (
                            <div 
                              key={idx} 
                              style={{ backgroundColor: color }} 
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" 
                              title={tpl.colorNames[idx]}
                            />
                          ))}
                        </div>
                        <span className="text-[7.5px] font-bold text-white/70 tracking-wider uppercase">
                          Paleta do Catálogo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Template details inside the premium card */}
                  <div className="px-1 pb-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-white uppercase tracking-wide">
                          {tpl.name}
                        </h3>
                        {isActive && (
                          <span className="text-[8px] bg-[#FF2D7A]/15 text-[#FF2D7A] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-[#FF2D7A]/25">
                            Selecionado
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-wider">
                      <span className={isActive ? 'text-[#FF2D7A]' : 'text-white/40'}>
                        {isActive ? '✓ Tema Selecionado' : 'Tocar para Selecionar'}
                      </span>
                      <span className="text-white/20 group-hover:text-white/40 transition-colors">
                        Selecionar →
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* CORES */}
        <section className="bg-[#18121e] border border-white/5 rounded-3xl p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="text-base font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#FF2D7A]" /> Cores da Identidade
            </h2>
            <p className="text-[10px] text-[#8E8E93] font-bold mt-1 uppercase tracking-wider">Personalize as cores para combinar com sua marca</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#0c0a0f] rounded-2xl border border-white/5">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider">Cor Principal</label>
                <p className="text-[10px] text-[#8E8E93] mt-1">Utilizada em botões e destaques importantes.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#8E8E93]">{formData.primaryColor || '#FF2D7A'}</span>
                <input
                  type="color"
                  value={formData.primaryColor || '#FF2D7A'}
                  onChange={e => updateField('primaryColor', e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0 overflow-hidden shadow-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0c0a0f] rounded-2xl border border-white/5">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider">Fundo do Catálogo</label>
                <p className="text-[10px] text-[#8E8E93] mt-1">Cor base de todo o fundo da página.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#8E8E93]">{formData.backgroundColor || '#0c0a0f'}</span>
                <input
                  type="color"
                  value={formData.backgroundColor || '#0c0a0f'}
                  onChange={e => updateField('backgroundColor', e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0 overflow-hidden shadow-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0c0a0f] rounded-2xl border border-white/5">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider">Cor dos Textos</label>
                <p className="text-[10px] text-[#8E8E93] mt-1">Garanta um bom contraste com o fundo.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#8E8E93]">{formData.textColor || '#FFFFFF'}</span>
                <input
                  type="color"
                  value={formData.textColor || '#FFFFFF'}
                  onChange={e => updateField('textColor', e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0 p-0 overflow-hidden shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ESTILO DOS CANTOS */}
        <section className="bg-[#18121e] border border-white/5 rounded-3xl p-5 shadow-lg">
          <h2 className="text-sm font-black text-white mb-4 uppercase tracking-widest">Estilo dos Cantos</h2>
          <div className="flex bg-[#0c0a0f] p-1 rounded-xl border border-white/5">
            {[
              { id: 'square', label: 'Quadrado' },
              { id: 'rounded', label: 'Arredondado' },
              { id: 'pill', label: 'Muito Arredondado' }
            ].map(style => (
              <button
                key={style.id}
                onClick={() => updateField('cornerStyle', style.id)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${(formData.cornerStyle || 'rounded') === style.id ? 'bg-[#FF2D7A] text-white shadow' : 'text-[#8E8E93] hover:text-white'}`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </section>

        {/* BANNER */}
        <section className="bg-[#18121e] border border-white/5 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#FF2D7A]" /> Banner
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#8E8E93]">
                {formData.layout?.showBanner ? 'VISÍVEL' : 'OCULTO'}
              </span>
              <button
                onClick={() => updateNestedField('layout', 'showBanner', !formData.layout?.showBanner)}
                className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.layout?.showBanner ? 'bg-[#FF2D7A]' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.layout?.showBanner ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <button
            onClick={() => startEditBanner()}
            className="w-full border-2 border-dashed border-[#FF2D7A]/30 text-[#FF2D7A] rounded-2xl py-4 flex flex-col items-center justify-center gap-2 hover:bg-[#FF2D7A]/5 transition mb-4"
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest">Adicionar Banner</span>
          </button>

          <div className="space-y-3">
            {(formData.banners || []).map((b, i) => (
              <div key={b.id} className="bg-[#0c0a0f] border border-white/5 rounded-2xl p-3 flex items-center gap-4">
                <img src={b.image} alt="Banner" className="w-20 h-12 object-cover rounded-xl" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{b.title || 'Sem título'}</div>
                  <div className="text-[10px] text-[#8E8E93] truncate">{b.link || 'Sem link'}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex flex-col gap-1 mr-1">
                    <button onClick={() => moveBanner(i, 'up')} className="p-1 bg-[#18121e] rounded text-[#8E8E93] hover:text-white transition"><ArrowUp className="w-3 h-3" /></button>
                    <button onClick={() => moveBanner(i, 'down')} className="p-1 bg-[#18121e] rounded text-[#8E8E93] hover:text-white transition"><ArrowDown className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => startEditBanner(b)} className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500/20 transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => deleteBanner(b.id)} className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MENSAGEM DO WHATSAPP */}
        <section className="bg-[#18121e] border border-white/5 rounded-3xl p-5 shadow-lg">
          <h2 className="text-sm font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#FF2D7A]" /> Mensagem do WhatsApp
          </h2>
          <div>
            <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Texto no Catálogo</label>
            <input
              type="text"
              value={formData.whatsappMessage !== undefined ? formData.whatsappMessage : 'Para escolher, clique no botão ME ENVIE e me chame no WhatsApp.'}
              onChange={e => updateField('whatsappMessage', e.target.value)}
              className="w-full bg-[#0c0a0f] border border-white/10 rounded-2xl py-3 px-4 text-sm font-medium text-white outline-none focus:border-[#FF2D7A] transition"
              placeholder="Ex: Clique em ME ENVIE e fale comigo!"
            />
          </div>
        </section>

        {/* SOBRE A LOJA */}
        <section className="bg-[#18121e] border border-white/5 rounded-3xl p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="text-base font-black text-white uppercase tracking-widest flex items-center gap-2">
              <StoreIcon className="w-5 h-5 text-[#FF2D7A]" /> Informações da Loja
            </h2>
            <p className="text-[10px] text-[#8E8E93] font-bold mt-1 uppercase tracking-wider">Dados básicos que aparecem para seus clientes</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-2 ml-1">Logo / Avatar (URL)</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[#0c0a0f] border border-white/10 rounded-2xl flex items-center px-4 py-3 focus-within:border-[#FF2D7A] transition">
                   <input
                    type="text"
                    value={formData.logo || ''}
                    onChange={e => updateField('logo', e.target.value)}
                    className="flex-1 bg-transparent border-none text-sm text-white outline-none"
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>
                <ImageUpload onUpload={(base64) => updateField('logo', base64)} />
              </div>
              <p className="text-[10px] text-[#8E8E93] mt-2 font-medium ml-1">Nota: A logo aparecerá apenas no menu "Sobre" para manter o catálogo elegante.</p>
            </div>

            <div>
              <label className="block text-[11px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-2 ml-1">Nome da Loja</label>
              <div className="bg-[#0c0a0f] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#FF2D7A] transition">
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => updateField('name', e.target.value)}
                  className="w-full bg-transparent border-none text-sm text-white outline-none font-bold"
                  placeholder="Ex: Jessica Hair"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-2 ml-1">Descrição / Bio</label>
              <div className="bg-[#0c0a0f] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#FF2D7A] transition">
                <textarea
                  value={formData.description || ''}
                  onChange={e => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full bg-transparent border-none text-sm text-white outline-none resize-none leading-relaxed"
                  placeholder="Fale um pouco sobre sua loja e o que você vende..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-2 ml-1">Instagram (@)</label>
                <div className="bg-[#0c0a0f] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#FF2D7A] transition flex items-center gap-2">
                  <span className="text-[#8E8E93] font-bold">@</span>
                  <input
                    type="text"
                    value={formData.instagram || ''}
                    onChange={e => updateField('instagram', e.target.value)}
                    className="w-full bg-transparent border-none text-sm text-white outline-none"
                    placeholder="sualoja"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-[#8E8E93] uppercase tracking-[0.2em] mb-2 ml-1">WhatsApp (DDD + Número)</label>
                <div className="bg-[#0c0a0f] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#FF2D7A] transition flex items-center gap-2">
                  <span className="text-[#8E8E93] font-bold">+55</span>
                  <input
                    type="text"
                    value={formData.whatsapp || ''}
                    onChange={e => updateField('whatsapp', e.target.value)}
                    className="w-full bg-transparent border-none text-sm text-white outline-none"
                    placeholder="11999999999"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* BANNER EDITOR MODAL */}
      {editingBanner && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#18121e] border border-white/5 rounded-3xl p-5 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setEditingBanner(null)}
              className="absolute top-4 right-4 p-2 bg-[#0c0a0f] rounded-full text-[#8E8E93] hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-black text-white mb-6 pr-8 tracking-tight">
              {editingBanner.id === 'new' ? 'Novo Banner' : 'Editar Banner'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest">URL da Imagem *</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={bannerForm.image}
                    onChange={(e) => setBannerForm({...bannerForm, image: e.target.value})}
                    placeholder="https://..."
                    className="flex-1 bg-[#0c0a0f] border border-white/10 rounded-2xl py-3 px-4 text-sm font-medium text-white outline-none focus:border-[#FF2D7A] transition"
                  />
                  <ImageUpload onUpload={(base64) => setBannerForm({...bannerForm, image: base64})} />
                </div>
                <p className="text-[10px] text-[#8E8E93] mt-1.5 font-medium">Recomendado: 1200x450px (Formato horizontal)</p>
                {bannerForm.image && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-white/10 relative h-32 bg-[#0c0a0f]">
                    <img src={bannerForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Onde exibir o banner?</label>
                <select
                    value={bannerForm.displayLocation || 'home'}
                    onChange={(e) => setBannerForm({...bannerForm, displayLocation: e.target.value})}
                    className="w-full bg-[#0c0a0f] border border-white/10 rounded-2xl py-3 px-4 text-sm font-medium text-white outline-none focus:border-[#FF2D7A] transition"
                >
                    <option value="home">Página Inicial</option>
                    <option value="categories">Página de Categorias</option>
                    <option value="products">Página de Produtos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Link de Destino (Opcional)</label>
                <input
                  type="text"
                  value={bannerForm.link || ''}
                  onChange={(e) => setBannerForm({...bannerForm, link: e.target.value})}
                  placeholder="https://..."
                  className="w-full bg-[#0c0a0f] border border-white/10 rounded-2xl py-3 px-4 text-sm font-medium text-white outline-none focus:border-[#FF2D7A] transition"
                />
              </div>

                            <div>
                <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Título do Banner (Opcional)</label>
                <input type="text" value={bannerForm.title} onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})} className="w-full bg-[#0c0a0f] border border-white/10 rounded-2xl py-3 px-4 text-sm font-medium text-white outline-none focus:border-[#FF2D7A] transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Subtítulo (Opcional)</label>
                <input type="text" value={bannerForm.subtitle} onChange={(e) => setBannerForm({...bannerForm, subtitle: e.target.value})} className="w-full bg-[#0c0a0f] border border-white/10 rounded-2xl py-3 px-4 text-sm font-medium text-white outline-none focus:border-[#FF2D7A] transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Texto do Botão (Opcional)</label>
                <input type="text" value={bannerForm.buttonText} onChange={(e) => setBannerForm({...bannerForm, buttonText: e.target.value})} className="w-full bg-[#0c0a0f] border border-white/10 rounded-2xl py-3 px-4 text-sm font-medium text-white outline-none focus:border-[#FF2D7A] transition" />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="flex-1 bg-[#0c0a0f] text-white py-3 rounded-2xl font-bold text-sm hover:bg-white/5 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveBanner}
                  disabled={!bannerForm.image}
                  className="flex-1 bg-[#FF2D7A] text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-[#FF2D7A]/20 disabled:opacity-50 transition"
                >
                  Salvar Banner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
