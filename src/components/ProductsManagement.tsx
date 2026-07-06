/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Search, Plus, Trash2, Edit2, Check, X, Star, Eye, EyeOff, Image, Upload, Video, Layers, Copy, ArrowUp, ArrowDown } from 'lucide-react';
import { Product, Category } from '../types';
import { LocalDatabase } from '../lib/initialData';
import { toast } from 'sonner';

interface ProductsManagementProps {
  products: Product[];
  categories: Category[];
  onDeleteProduct: (id: string) => void; // Still needed for UI update
  onReorderProducts?: (products: Product[]) => void;
  storeId?: string;
  onRefresh: () => void;
}

export default function ProductsManagement({
  products,
  categories,
  onDeleteProduct,
  onReorderProducts,
  storeId,
  onRefresh
}: ProductsManagementProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form States
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>("");
  const [promoPrice, setPromoPrice] = useState<number | string | undefined>(undefined);
  const [length, setLength] = useState('');
  const [color, setColor] = useState('');
  const [stock, setStock] = useState(10);
  const [featured, setFeatured] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showPrice, setShowPrice] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [fileError, setFileError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const sortedProducts = [...products].sort((a, b) => (a.order || 0) - (b.order || 0));

  const filteredProducts = sortedProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAdding(false);
    setName(product.name);
    setCategoryId(product.categoryId);
    setDescription(product.description || '');
    setPrice(product.price);
    setPromoPrice(product.promoPrice);
    setLength(product.length || '');
    setColor(product.color || '');
    setStock(product.stock);
    setFeatured(product.featured);
    setHidden(product.hidden);
    setShowPrice(product.showPrice ?? true);
    setExistingImages(product.images);
    setImages([]);
    setVideo(product.video || null);
    setFileError('');
  };

  const startAdd = () => {
    setEditingProduct(null);
    setIsAdding(true);
    setName('');
    setCategoryId(categories[0]?.id || 'cat_todos');
    setDescription('');
    setPrice('');
    setPromoPrice(undefined);
    setLength('');
    setColor('');
    setStock(10);
    setFeatured(false);
    setHidden(false);
    setShowPrice(true);
    setImages([]);
    setExistingImages([]);
    setVideo(null);
    setFileError('');
  };

  const handleDuplicate = async (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: 'prod_' + Math.random().toString(36).substr(2, 9),
      name: `${product.name} (Cópia)`,
      order: products.length,
      views: 0,
      clicks: 0
    };
    const formData = new FormData();
    formData.append('productData', JSON.stringify(duplicated));
    formData.append('existingImages', JSON.stringify(product.images));
    await LocalDatabase.createProduct(duplicated, formData);
    onRefresh();
  };

  const moveUp = async (index: number) => {
    if (index === 0 || !onReorderProducts) return;
    const newProducts = [...sortedProducts];
    const temp = newProducts[index];
    newProducts[index] = newProducts[index - 1];
    newProducts[index - 1] = temp;
    
    newProducts.forEach((p, i) => { p.order = i; });
    onReorderProducts(newProducts);
  };

  const moveDown = async (index: number) => {
    if (index === sortedProducts.length - 1 || !onReorderProducts) return;
    const newProducts = [...sortedProducts];
    const temp = newProducts[index];
    newProducts[index] = newProducts[index + 1];
    newProducts[index + 1] = temp;
    
    newProducts.forEach((p, i) => { p.order = i; });
    onReorderProducts(newProducts);
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  // Drag and Drop & Local File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file: any) => {
      if (!file.type.startsWith('image/')) {
        setFileError('Apenas arquivos de imagem são suportados.');
        return;
      }
      setImages((prev) => [...prev, file]);
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || typeof name !== 'string' || !name.trim()) return;
    setIsSaving(true);

    try {
      const productData: Product = {
        id: editingProduct ? editingProduct.id : 'prod_' + Math.random().toString(36).substr(2, 9),
        storeId: editingProduct ? editingProduct.storeId : (storeId || 'store_default'),
        name: typeof name === 'string' ? name.trim() : '',
        categoryId: categoryId,
        description: typeof description === 'string' ? description.trim() : '',
        price: Number(price),
        promoPrice: promoPrice ? Number(promoPrice) : undefined,
        length: typeof length === 'string' ? (length.trim() || undefined) : undefined,
        color: typeof color === 'string' ? (color.trim() || undefined) : undefined,
        stock: Number(stock),
        featured: featured,
        hidden: hidden,
        showPrice: showPrice,
        images: [], 
        video: typeof video === 'string' ? (video.trim() || undefined) : undefined,
        views: editingProduct ? editingProduct.views : 0,
        clicks: editingProduct ? editingProduct.clicks : 0,
        order: editingProduct ? editingProduct.order : products.length
      };

      const formData = new FormData();
      formData.append('productData', JSON.stringify(productData));
      images.forEach(file => formData.append('images', file));
      formData.append('existingImages', JSON.stringify(existingImages));

      if (editingProduct) {
        await LocalDatabase.updateProduct(editingProduct.id, productData, formData);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await LocalDatabase.createProduct(productData, formData);
        toast.success('Produto criado com sucesso!');
      }

      setIsAdding(false);
      setEditingProduct(null);
      onRefresh();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar produto.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="products-management" className="min-h-screen text-white bg-[#0c0a0f] pb-24 text-left p-4">
      
      {/* Title & Add Button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Produtos</h1>
          <p className="text-xs text-[#8E8E93] mt-1 font-semibold">Adicione, edite ou gerencie os modelos do seu catálogo.</p>
        </div>
        {!isAdding && !editingProduct && (
          <button
            id="btn-add-product"
            onClick={startAdd}
            className="flex items-center gap-1.5 py-2.5 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-xs font-bold tracking-tight transition active:scale-95 shadow-lg shadow-pink-600/20"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        )}
      </div>

      {/* Editor Form (Adding or Editing) */}
      {(isAdding || editingProduct) && (
        <div className="bg-[#090909] border border-pink-950/20 rounded-3xl p-6 shadow-xl animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-pink-500" />
              {editingProduct ? 'Editar Produto' : 'Novo Produto'}
            </h3>
            <button
              id="cancel-editor-btn"
              onClick={() => {
                setIsAdding(false);
                setEditingProduct(null);
              }}
              className="p-1.5 bg-[#181818] rounded-full text-[#8E8E93] hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Nome do Produto *</label>
              <input
                id="form-product-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Beyonce 80cm"
                className="w-full bg-[#181818] border border-pink-950/30 rounded-2xl py-3 px-4 text-sm font-semibold outline-none focus:border-pink-500 text-white transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Preço (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="169.99"
                  className="w-full bg-[#181818] border border-pink-950/30 rounded-2xl py-3 px-4 text-sm font-semibold outline-none focus:border-pink-500 text-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Preço Promocional (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={promoPrice ?? ''}
                  onChange={(e) => setPromoPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="159.99"
                  className="w-full bg-[#181818] border border-pink-950/30 rounded-2xl py-3 px-4 text-sm font-semibold outline-none focus:border-pink-500 text-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Categoria</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#181818] border border-pink-950/30 rounded-2xl py-3 px-4 text-sm font-semibold outline-none focus:border-pink-500 text-white cursor-pointer transition"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>



            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Comprimento (cm/m)</label>
                <input
                  type="text"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="Ex: 80cm"
                  className="w-full bg-[#181818] border border-pink-950/30 rounded-2xl py-3 px-4 text-sm font-semibold outline-none focus:border-pink-500 text-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Cor / Variação</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Ex: Castanho Escuro"
                  className="w-full bg-[#181818] border border-pink-950/30 rounded-2xl py-3 px-4 text-sm font-semibold outline-none focus:border-pink-500 text-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o produto..."
                className="w-full bg-[#181818] border border-pink-950/30 rounded-2xl py-3 px-4 text-sm font-semibold outline-none focus:border-pink-500 text-white transition min-h-[100px]"
              />
            </div>

            {/* Product Images Upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest">Imagens do Produto *</label>
                <div className="text-[10px] text-[#8E8E93] font-medium bg-[#181818] px-2 py-1 rounded-lg border border-white/5">
                  Proporção 9:16 recomendada
                </div>
              </div>
              
              <div className="bg-[#181818] border border-pink-950/20 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] text-gray-300 font-bold">Resolução sugerida: 1080 x 1920 px</p>
                  <p className="text-[10px] text-[#8E8E93]">Formatos: JPG, PNG e WebP. Imagens em alta resolução terão melhor qualidade no catálogo.</p>
                </div>

                <label className="flex flex-col items-center justify-center border-2 border-dashed border-pink-950/40 hover:border-pink-500/40 rounded-2xl p-6 bg-[#0c0a0f] cursor-pointer transition">
                  <Upload className="w-8 h-8 text-pink-500 mb-2" />
                  <span className="text-xs font-bold text-white uppercase tracking-tight">Escolher do dispositivo</span>
                  <span className="text-[9px] text-[#8E8E93] mt-1">Arraste e solte ou clique para selecionar</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {fileError && <p className="text-xs text-red-500 font-semibold">{fileError}</p>}

              {/* Previews & Sorting layout */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-pink-500/30 shrink-0">
                      <img src={URL.createObjectURL(img)} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 text-white rounded-full hover:bg-black transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Vídeo (Opcional - Upload)</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-pink-950/40 hover:border-pink-500/40 rounded-2xl p-4 bg-[#181818] cursor-pointer transition">
                  <Upload className="w-6 h-6 text-pink-500" />
                  <span className="text-[10px] font-bold text-gray-300 mt-2">{video ? 'Vídeo Selecionado' : 'Escolher vídeo da galeria'}</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        // simulate upload directly to state for now, in real app upload to storage
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setVideo(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
              </label>
              {video && (
                <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden border border-pink-500/30">
                  <video src={video} className="w-full h-full object-cover" controls />
                  <button
                    type="button"
                    onClick={() => setVideo('')}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black transition z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between bg-[#181818] border border-white/5 rounded-2xl p-4 shadow-sm">
              <div>
                <p className="text-sm font-bold text-white mb-0.5">Produto Ativo</p>
                <p className="text-xs text-[#8E8E93]">Mostrar no catálogo para os clientes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!hidden}
                  onChange={(e) => setHidden(!e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between bg-[#181818] border border-white/5 rounded-2xl p-4 shadow-sm">
              <div>
                <p className="text-sm font-bold text-white mb-0.5">Mostrar preço no catálogo</p>
                <p className="text-xs text-[#8E8E93]">O preço será visível aos clientes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPrice}
                  onChange={(e) => setShowPrice(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
              </label>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => { setIsAdding(false); setEditingProduct(null); }}
                className="flex-1 py-3.5 rounded-2xl font-extrabold text-sm border border-white/10 text-white bg-[#181818] active:bg-[#222] transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3.5 rounded-2xl font-extrabold text-sm bg-[#FF2D7A] text-white active:bg-pink-600 transition shadow-[0_0_20px_rgba(255,45,122,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  'Salvar Produto'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product List Grid */}
      {!isAdding && !editingProduct && (
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[#8E8E93]" />
            </div>
            <input
              id="product-search-bar"
              type="text"
              placeholder="Pesquisar produtos..."
              className="w-full bg-gradient-to-b from-[#18121e] to-[#120c15] border border-pink-950/20 rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold outline-none focus:border-pink-500 text-white transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-b from-[#18121e] to-[#120c15] border border-pink-950/20 rounded-3xl p-6">
              <ShoppingBag className="w-12 h-12 text-pink-500/20 mx-auto mb-3" />
              <p className="text-[#8E8E93] font-medium">Nenhum produto cadastrado ainda.</p>
              <button
                onClick={startAdd}
                className="mt-4 text-xs font-bold text-pink-500 bg-pink-950/20 border border-pink-500/10 px-4 py-2 rounded-full"
              >
                Adicionar primeiro modelo
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((prod) => {
                const categoryName = categories.find(c => c.id === prod.categoryId)?.name || 'Geral';
                
                return (
                  <div
                    key={prod.id}
                    className="bg-[#16141d] border border-white/5 rounded-3xl p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-pink-950/20 shrink-0 bg-[#181818]">
                        <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 text-left">
                        <h4 className="text-sm font-extrabold text-white truncate">{prod.name}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#8E8E93] font-semibold mt-1">
                          <Layers className="w-3 h-3 text-pink-500" />
                          <span>{categoryName}</span>
                          {prod.length && <span>• {prod.length}</span>}
                          
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs font-black text-pink-400">
                            R$ {((prod.promoPrice || prod.price) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          {prod.promoPrice && (
                            <span className="text-[10px] text-[#8E8E93] line-through">
                              R$ {(prod.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons (Edit, Delete, Duplicate, Reorder) */}
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                      {onReorderProducts && (
                        <div className="flex flex-col gap-1 mr-1">
                          <button
                            onClick={() => moveUp(filteredProducts.indexOf(prod))}
                            className="p-1 bg-[#181818]/40 hover:bg-gray-800 text-[#8E8E93] hover:text-white rounded transition"
                            title="Mover para cima"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveDown(filteredProducts.indexOf(prod))}
                            className="p-1 bg-[#181818]/40 hover:bg-gray-800 text-[#8E8E93] hover:text-white rounded transition"
                            title="Mover para baixo"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleDuplicate(prod)}
                        className="p-2.5 bg-[#181818]/40 hover:bg-blue-950/10 text-[#8E8E93] hover:text-blue-500 border border-pink-950/20 rounded-xl transition"
                        title="Duplicar"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => startEdit(prod)}
                        className="p-2.5 bg-[#181818]/40 hover:bg-pink-950/10 text-[#8E8E93] hover:text-white border border-pink-950/20 rounded-xl transition"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(prod.id)}
                        className="p-2.5 bg-[#181818]/40 hover:bg-red-950/10 text-[#8E8E93] hover:text-red-500 border border-pink-950/20 rounded-xl transition"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
