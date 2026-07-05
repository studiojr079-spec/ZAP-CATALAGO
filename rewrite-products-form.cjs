const fs = require('fs');
let code = fs.readFileSync('src/components/ProductsManagement.tsx', 'utf8');

// replace the entire form block
const formRegex = /<form[\s\S]*?<\/form>/;
const newForm = `<form onSubmit={handleSubmit} className="space-y-5">
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
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="169.99"
                  className="w-full bg-[#181818] border border-pink-950/30 rounded-2xl py-3 px-4 text-sm font-semibold outline-none focus:border-pink-500 text-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Preço Promocional (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={promoPrice || ''}
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

            <div>
              <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1.5">Descrição do Produto</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Escreva detalhes sobre o material, toque, cuidados, etc."
                rows={3}
                className="w-full bg-[#181818] border border-pink-950/30 rounded-2xl py-3 px-4 text-sm font-semibold outline-none focus:border-pink-500 text-white transition"
              />
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

            {/* Premium Upload Component with automatic compression and previews */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#8E8E93] uppercase tracking-widest mb-1">Múltiplas Imagens (Upload)</label>
              
              {fileError && <p className="text-xs text-red-500 font-semibold">{fileError}</p>}

              {/* Drag and drop panel wrapper */}
              <div className="grid grid-cols-1 gap-4">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-pink-950/40 hover:border-pink-500/40 rounded-2xl p-4 bg-[#181818] cursor-pointer transition">
                  <Upload className="w-6 h-6 text-pink-500" />
                  <span className="text-[10px] font-bold text-gray-300 mt-2">Escolher do dispositivo</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Previews & Sorting layout */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-pink-500/30 shrink-0">
                      <img src={img} alt={\`Preview \${idx}\`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImageUrl(idx)}
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

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3.5 rounded-2xl font-extrabold text-sm border border-white/10 text-white bg-[#181818] active:bg-[#222] transition active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-2xl font-extrabold text-sm bg-[#FF2D7A] text-white active:bg-pink-600 transition shadow-[0_0_20px_rgba(255,45,122,0.3)] active:scale-95"
              >
                Salvar Produto
              </button>
            </div>
          </form>`;

code = code.replace(formRegex, newForm);

// we also need to remove stock from product list
const stockBadgeRegex = /{prod\.stock <= 3 \? \([\s\S]*?\) : \([\s\S]*?Qtd: {prod\.stock}<\/span>\s*\)\s*}/;
code = code.replace(stockBadgeRegex, '');

fs.writeFileSync('src/components/ProductsManagement.tsx', code);
