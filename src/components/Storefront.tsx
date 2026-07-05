import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import CatalogView from './CatalogView';
import { getStoreBySlug, getProducts, getCategories } from '../lib/db';
import { Store, Product, Category } from '../types';
import { Loader2, Sparkles } from 'lucide-react';

export default function Storefront() {
  const { slug } = useParams();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    async function loadStore() {
      try {
        const normalizedSlug = (slug as string).toLowerCase();
        const s = await getStoreBySlug(normalizedSlug);
        if (s) {
          setStore(s);
          const [p, c] = await Promise.all([
            getProducts(s.id),
            getCategories(s.id)
          ]);
          setProducts(p);
          setCategories(c);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadStore();
  }, [slug]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0c0a0f] flex flex-col items-center justify-center z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-[#FF2D7A]/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative bg-[#181818] p-8 rounded-[40px] border border-white/5 flex flex-col items-center gap-6">
            <div className="p-4 bg-[#FF2D7A]/10 rounded-3xl text-[#FF2D7A]">
              <Sparkles className="w-10 h-10 animate-pulse" />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-black text-white tracking-tight">Carregando Vitrine</h2>
              <div className="flex items-center gap-2 justify-center text-[#8E8E93] text-sm font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-[#FF2D7A]" />
                <span>Prepare seu coração...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090909] text-white">
        <h1 className="text-2xl font-bold mb-2">Loja não encontrada</h1>
        <p className="text-gray-400">Verifique se o link está correto.</p>
      </div>
    );
  }

  return (
    <CatalogView
      store={store}
      products={products}
      categories={categories}
      onBackToDashboard={() => window.location.href = '/admin'}
      isPreview={false}
    />
  );
}
