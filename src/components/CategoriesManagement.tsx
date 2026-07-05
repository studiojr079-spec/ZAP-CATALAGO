/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Folder, Plus, Trash2, Edit2, Check, X, ArrowUp, ArrowDown, Image, Sparkles } from 'lucide-react';
import { Category, Product } from '../types';
import ImageUpload from './ImageUpload';

interface CategoriesManagementProps {
  categories: Category[];
  products: Product[];
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onReorderCategories: (categories: Category[]) => void;
  storeId?: string;
}

export default function CategoriesManagement({
  categories,
  products,
  onSaveCategory,
  onDeleteCategory,
  onReorderCategories,
  storeId
}: CategoriesManagementProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsAdding(false);
    setName(cat.name);
    setImage(cat.image);
    setErrorMsg('');
  };

  const startAdd = () => {
    setEditingCategory(null);
    setIsAdding(true);
    setName('');
    setImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');
    setErrorMsg('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Check unique category name constraint
    const isDuplicate = categories.some(
      c => c.name.toLowerCase() === name.trim().toLowerCase() && 
      (!editingCategory || c.id !== editingCategory.id)
    );

    if (isDuplicate) {
      setErrorMsg('Já existe uma categoria cadastrada com este nome.');
      return;
    }

    const categoryData: Category = {
      id: editingCategory ? editingCategory.id : 'cat_' + Math.random().toString(36).substr(2, 9),
      storeId: editingCategory ? editingCategory.storeId : (storeId || 'store_default'),
      name: name.trim().toUpperCase(), // Uppercase category matching Image 1 circular labels
      image: image.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      order: editingCategory ? editingCategory.order : categories.length
    };

    onSaveCategory(categoryData);
    setIsAdding(false);
    setEditingCategory(null);
    setErrorMsg('');
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const updated = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    // Swap order property and positions
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // Fix index order field
    updated.forEach((cat, idx) => {
      cat.order = idx;
    });

    onReorderCategories(updated);
  };

  return (
    <div id="categories-management" className="min-h-screen text-white bg-[#0c0a0f] pb-24 text-left p-4">
      {/* Title block */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Categorias</h1>
          <p className="text-xs text-[#8E8E93] mt-1 font-semibold">Crie e ordene as seções circulares do seu catálogo.</p>
        </div>
        {!isAdding && !editingCategory && (
          <button
            id="btn-add-category"
            onClick={startAdd}
            className="flex items-center gap-1.5 py-2.5 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-xs font-bold tracking-tight transition active:scale-95 shadow-lg shadow-pink-600/20"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        )}
      </div>

      {/* Editor Block */}
      {(isAdding || editingCategory) && (
        <div className="bg-[#090909] border border-pink-950/20 rounded-3xl p-6 shadow-xl mb-6 animate-in fade-in duration-200">
          <h3 className="text-base font-black text-white flex items-center gap-2 mb-4">
            <Folder className="w-5 h-5 text-pink-500" />
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </h3>

          {errorMsg && (
            <div className="bg-red-950/30 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-semibold mb-4">
              {errorMsg}
            </div>
          )}

          <form id="category-form" onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Nome da Categoria *</label>
              <input
                id="form-category-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: CACHEADOS, LISOS"
                className="w-full bg-[#181818] border border-pink-950/30 rounded-2xl py-3 px-4 text-sm font-semibold outline-none focus:border-pink-500 text-white transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest">URL da Foto de Capa (Circular)</label>
                <div className="text-[10px] text-[#8E8E93] font-medium bg-[#181818] px-2 py-1 rounded-lg border border-white/5">
                  1:1 recomendado
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Image className="w-4 h-4 text-[#8E8E93]" />
                  </div>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-[#181818] border border-pink-950/30 rounded-2xl py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-pink-500 text-white transition"
                  />
                </div>
                <ImageUpload onUpload={(base64) => setImage(base64)} />
              </div>
              <p className="text-[10px] text-[#8E8E93] mt-1.5 font-medium">Recomendado: 400x400 px. Formato quadrado (1:1) ideal para ícones circulares.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingCategory(null);
                  setErrorMsg('');
                }}
                className="w-1/2 py-3.5 px-4 bg-[#181818] hover:bg-gray-900 border border-pink-950/20 text-[#8E8E93] rounded-2xl text-xs font-bold uppercase tracking-wider transition"
              >
                Cancelar
              </button>
              <button
                id="save-category-btn"
                type="submit"
                className="w-1/2 py-3.5 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition active:scale-95 shadow-lg shadow-pink-600/20"
              >
                Salvar Categoria
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid List */}
      {!isAdding && !editingCategory && (
        <div className="space-y-3">
          {categories.map((cat, index) => {
            // Automatically count products belonging to this category
            const categoryProductsCount = cat.id === 'cat_todos'
              ? products.length
              : products.filter((p) => p.categoryId === cat.id).length;

            return (
              <div
                key={cat.id}
                className="bg-gradient-to-b from-[#18121e] to-[#120c15] border border-pink-950/20 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#181818] shrink-0 border border-pink-500/20 p-0.5">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-extrabold text-white">{cat.name}</h4>
                    <p className="text-[10px] text-[#8E8E93] font-bold mt-1 uppercase tracking-wide flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-pink-500" />
                      <span>{categoryProductsCount} produtos ativos</span>
                    </p>
                  </div>
                </div>

                {/* Operations Layout */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Reordering indicators */}
                  <button
                    onClick={() => moveCategory(index, 'up')}
                    disabled={index === 0}
                    className="p-2 bg-[#181818]/40 text-[#8E8E93] hover:text-white disabled:opacity-20 rounded-xl border border-pink-950/10 transition"
                    title="Mover para cima"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveCategory(index, 'down')}
                    disabled={index === categories.length - 1}
                    className="p-2 bg-[#181818]/40 text-[#8E8E93] hover:text-white disabled:opacity-20 rounded-xl border border-pink-950/10 transition"
                    title="Mover para baixo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => startEdit(cat)}
                    className="p-2 bg-[#181818]/40 text-[#8E8E93] hover:text-white disabled:opacity-20 rounded-xl border border-pink-950/10 transition"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="p-2 bg-[#181818]/40 text-[#8E8E93] hover:text-red-500 disabled:opacity-20 rounded-xl border border-pink-950/10 transition"
                    title="Deletar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
