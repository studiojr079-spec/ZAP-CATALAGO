import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Video, Image as ImageIcon, Link as LinkIcon, Save, Upload, Info, FileText } from 'lucide-react';
import { Tutorial, SystemConfig } from '../types';
import { getTutorials, addTutorial, deleteTutorial } from '../lib/tutorials';
import { getSystemConfig, updateSystemConfig } from '../lib/system';
import ImageUpload from './ImageUpload';

export default function MasterTutorials() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [config, setConfig] = useState<SystemConfig>({});
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [newTutorial, setNewTutorial] = useState({ 
    title: '', 
    description: '', 
    type: 'video' as 'video'|'image'|'link', 
    url: '',
    location: 'general' as 'general' | 'video_cover' | 'thumbnail' | 'pdf_manual',
    thumbnailUrl: ''
  });

  const autoDetectYoutubeThumbnail = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      const videoId = match[2];
      const ytThumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      setNewTutorial(prev => ({
        ...prev,
        url,
        thumbnailUrl: ytThumb
      }));
    } else {
      setNewTutorial(prev => ({ ...prev, url }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [tData, cData] = await Promise.all([
        getTutorials(),
        getSystemConfig()
      ]);
      setTutorials(tData);
      setConfig(cData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      await updateSystemConfig(config);
      alert('Configurações de template salvas!');
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar.');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleAdd = async () => {
    if (!newTutorial.title || !newTutorial.url) return;
    try {
      await addTutorial(newTutorial);
      setIsAdding(false);
      setNewTutorial({ 
        title: '', 
        description: '', 
        type: 'video', 
        url: '', 
        location: 'general', 
        thumbnailUrl: '' 
      });
      loadData();
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar tutorial.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este item?')) return;
    try {
      await deleteTutorial(id);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-10 w-48 shimmer rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="aspect-[3/4] shimmer rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Central de Mídias & Tutoriais</h2>
          <p className="text-[#8E8E93] text-sm mt-1">Gerencie os tutoriais e mídias que aparecem para os lojistas.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-[#FF2D7A] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#E51C5C] transition-colors">
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 flex gap-4 items-start">
        <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500 shrink-0">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Otimização de Performance</h4>
          <p className="text-[13px] text-gray-400 leading-relaxed">
            Para garantir um carregamento instantâneo para os lojistas, as imagens agora são <strong>comprimidas automaticamente</strong> ao subir. 
            Para vídeos longos, prefira usar links externos para não sobrecarregar o banco de dados.
          </p>
        </div>
      </div>

      <div className="bg-blue-950/30 border border-blue-500/20 rounded-2xl p-5 flex gap-4 items-start animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 shrink-0">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Como subir mídias locais?</h4>
          <p className="text-[13px] text-gray-400 leading-relaxed">
            Para usar imagens ou vídeos baixados, arraste os arquivos para a pasta <span className="text-blue-400 font-mono bg-blue-400/10 px-1.5 py-0.5 rounded">public</span> no editor (menu esquerdo). 
            Ao adicionar um item abaixo, use o nome do arquivo começando com barra. Ex: <span className="text-blue-400 font-mono bg-blue-400/10 px-1.5 py-0.5 rounded">/logo.png</span>
          </p>
        </div>
      </div>

      {/* Template Previews Config */}
      <div className="bg-[#181818] rounded-2xl p-6 border border-white/5 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#FF2D7A]" />
            Miniaturas dos Modelos (Templates)
          </h3>
          <button 
            onClick={handleSaveConfig}
            disabled={isSavingConfig}
            className="flex items-center gap-2 text-xs font-bold bg-[#FF2D7A]/10 text-[#FF2D7A] px-4 py-2 rounded-xl hover:bg-[#FF2D7A]/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSavingConfig ? 'Salvando...' : 'Salvar Miniaturas'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['clean', 'dark'] as const).map((id) => (
            <div key={id} className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Template {id.toUpperCase()}</label>
              <div className="relative group">
                <div className="aspect-[3/4] rounded-xl bg-[#0D0D0D] border border-white/10 overflow-hidden mb-2">
                  <img 
                    src={config.templatePreviews?.[id] || `/${id}.png`} 
                    alt={id}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/300x400/181818/FF2D7A?text=Sem+Imagem')}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={config.templatePreviews?.[id] || ''} 
                    onChange={(e) => setConfig({
                      ...config,
                      templatePreviews: {
                        ...(config.templatePreviews || {}),
                        [id]: e.target.value
                      }
                    })}
                    placeholder={`Ex: /${id}.png ou link`}
                    className="flex-1 bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#FF2D7A] outline-none"
                  />
                  <ImageUpload 
                    onUpload={(base64) => setConfig({
                      ...config,
                      templatePreviews: {
                        ...(config.templatePreviews || {}),
                        [id]: base64
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isAdding && (
        <div className="bg-[#181818] rounded-2xl p-6 border border-white/5 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="font-bold text-white text-lg">Nova Mídia / Tutorial</h3>
            <span className="text-xs text-gray-400">Preencha os campos para adicionar na vitrine do lojista</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Título</label>
              <input 
                type="text" 
                value={newTutorial.title} 
                onChange={e => setNewTutorial({...newTutorial, title: e.target.value})} 
                className="w-full bg-[#090909] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#FF2D7A] focus:outline-none" 
                placeholder="Ex: Como configurar sua loja" 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400">Tipo de Conteúdo</label>
              <select 
                value={newTutorial.type} 
                onChange={e => setNewTutorial({...newTutorial, type: e.target.value as any})} 
                className="w-full bg-[#090909] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#FF2D7A] focus:outline-none"
              >
                <option value="video">Vídeo (YouTube/Vimeo)</option>
                <option value="image">Imagem (Link direto)</option>
                <option value="link">Link de Acesso / Manual</option>
              </select>
            </div>

            {/* ONDE EXIBIR / LOCATION SELECTION */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Onde deseja que esta mídia apareça?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'video_cover', label: 'Capa de Vídeo', desc: 'Vídeo destaque principal com player', color: 'border-blue-500/30 hover:border-blue-500' },
                  { id: 'thumbnail', label: 'Miniatura / Banner', desc: 'Imagem/Criativo na galeria de miniaturas', color: 'border-emerald-500/30 hover:border-emerald-500' },
                  { id: 'pdf_manual', label: 'Manual PDF / Guia', desc: 'Guia prático para baixar ou ler', color: 'border-amber-500/30 hover:border-amber-500' },
                  { id: 'general', label: 'Geral (Lista Apoio)', desc: 'Lista padrão de mídias extras', color: 'border-gray-500/30 hover:border-white/50' }
                ].map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setNewTutorial(prev => ({ ...prev, location: loc.id as any }))}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                      newTutorial.location === loc.id 
                        ? 'bg-[#FF2D7A]/15 border-[#FF2D7A] text-white' 
                        : 'bg-[#090909] text-gray-300 ' + loc.color
                    }`}
                  >
                    <span className="text-xs font-bold block">{loc.label}</span>
                    <span className="text-[10px] text-gray-400 leading-tight block">{loc.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-400">Descrição curta</label>
              <textarea 
                value={newTutorial.description} 
                onChange={e => setNewTutorial({...newTutorial, description: e.target.value})} 
                className="w-full bg-[#090909] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#FF2D7A] focus:outline-none h-20 resize-none" 
                placeholder="Breve descrição do tutorial ou instrução para baixar" 
              />
            </div>
            
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-gray-400">URL / Link do Arquivo</label>
                {newTutorial.type === 'video' && (
                  <button 
                    type="button"
                    onClick={() => autoDetectYoutubeThumbnail(newTutorial.url)}
                    className="text-[10px] font-black text-[#FF2D7A] hover:underline uppercase tracking-wide"
                  >
                    ⚡ Capturar Capa do YouTube
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="url" 
                  value={newTutorial.url} 
                  onChange={e => autoDetectYoutubeThumbnail(e.target.value)} 
                  className="flex-1 bg-[#090909] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#FF2D7A] focus:outline-none" 
                  placeholder="https://www.youtube.com/watch?v=..." 
                />
                {(newTutorial.type === 'image' || newTutorial.type === 'video') && (
                  <ImageUpload 
                    onUpload={(base64) => setNewTutorial({...newTutorial, url: base64})}
                    accept={newTutorial.type === 'video' ? 'video/*' : 'image/*'}
                  />
                )}
              </div>
            </div>

            {/* THUMBNAIL / CAPA OPCIONAL */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-400">Imagem de Capa / Miniatura (Opcional - link ou upload)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={newTutorial.thumbnailUrl} 
                  onChange={e => setNewTutorial({...newTutorial, thumbnailUrl: e.target.value})} 
                  className="flex-1 bg-[#090909] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#FF2D7A] focus:outline-none" 
                  placeholder="Link da imagem da miniatura (ou use o botão ao lado para fazer upload)" 
                />
                <ImageUpload 
                  onUpload={(base64) => setNewTutorial({...newTutorial, thumbnailUrl: base64})}
                  accept="image/*"
                />
              </div>
              {newTutorial.thumbnailUrl && (
                <div className="mt-2 w-32 aspect-video bg-black rounded-lg overflow-hidden border border-white/10">
                  <img src={newTutorial.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2.5 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-white">Cancelar</button>
            <button onClick={handleAdd} className="px-6 py-2.5 bg-[#FF2D7A] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#E51C5C] shadow-lg shadow-[#FF2D7A]/20 transition-all">Salvar Mídia</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutorials.map(tut => {
          const locNames = {
            video_cover: { name: 'Capa de Vídeo', bg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
            thumbnail: { name: 'Miniatura', bg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
            pdf_manual: { name: 'Manual PDF', bg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
            general: { name: 'Geral', bg: 'bg-gray-500/10 text-gray-400 border border-white/5' }
          };
          const locInfo = locNames[tut.location || 'general'] || locNames.general;
          const displayImg = tut.thumbnailUrl || (tut.type === 'image' ? tut.url : null);

          return (
            <div key={tut.id} className="bg-[#181818] rounded-2xl border border-white/5 overflow-hidden relative group hover:border-[#FF2D7A]/30 transition-all flex flex-col justify-between">
              <div>
                {/* Image Preview inside Card if available */}
                {displayImg ? (
                  <div className="aspect-video w-full bg-[#0D0D0D] relative overflow-hidden border-b border-white/5">
                    <img src={displayImg} alt={tut.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${locInfo.bg}`}>
                        {locInfo.name}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex justify-between items-start">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${locInfo.bg}`}>
                      {locInfo.name}
                    </span>
                  </div>
                )}

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm line-clamp-1">{tut.title}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => handleDelete(tut.id)} className="text-gray-500 hover:text-red-500 p-1 rounded-lg hover:bg-white/5 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{tut.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a 
                  href={tut.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#090909] hover:bg-black border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-wider text-[#FF2D7A] hover:text-white transition-all"
                >
                  {tut.type === 'video' ? <Video className="w-4 h-4" /> : tut.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                  Ver / Acessar Mídia
                </a>
              </div>
            </div>
          );
        })}
        {tutorials.length === 0 && !isAdding && (
          <div className="col-span-full py-16 text-center text-gray-500 border border-dashed border-white/10 rounded-[32px]">
            Nenhuma mídia ou tutorial adicionado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
