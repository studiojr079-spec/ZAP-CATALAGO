import React, { useState, useEffect } from 'react';
import { Video, Image as ImageIcon, Link as LinkIcon, ChevronRight, Play, Download, FileText, ExternalLink, Sparkles } from 'lucide-react';
import { Tutorial } from '../types';
import { getTutorials } from '../lib/tutorials';

export default function TutorialsView() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getTutorials();
        setTutorials(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-lg mx-auto space-y-6 text-center text-[#8E8E93] text-sm py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#FF2D7A] border-t-transparent mx-auto mb-4" />
        Carregando central de mídias...
      </div>
    );
  }

  // Group tutorials by their location
  const videoCovers = tutorials.filter(t => t.location === 'video_cover');
  const thumbnails = tutorials.filter(t => t.location === 'thumbnail');
  const pdfManuals = tutorials.filter(t => t.location === 'pdf_manual');
  const generalList = tutorials.filter(t => t.location === 'general' || !t.location);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-8 text-left pb-28 font-sans animate-in fade-in duration-500">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF2D7A]/15 text-[#FF2D7A] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#FF2D7A]/20 mb-3">
          <Sparkles className="w-3 h-3" />
          Material Exclusivo
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight uppercase">MÍDIAS & TUTORIAIS</h1>
        <p className="text-xs text-[#8E8E93] mt-1 font-semibold leading-relaxed">
          Aprenda a utilizar a plataforma, assista aos guias em vídeo e baixe as mídias prontas para impulsionar suas vendas!
        </p>
      </div>

      {tutorials.length === 0 ? (
        <div className="text-center py-16 text-[#8E8E93] text-sm border border-dashed border-white/10 rounded-[32px] bg-[#181818]/20">
          Nenhum material disponível no momento.
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* SECTION 1: VIDEO COVERS / FEATURED VIDEO */}
          {videoCovers.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-black text-[#8E8E93] uppercase tracking-wider">🎥 Vídeos de Treinamento / Capas</h2>
              <div className="space-y-4">
                {videoCovers.map(tut => {
                  const hasPreview = !!tut.thumbnailUrl;
                  return (
                    <a 
                      key={tut.id} 
                      href={tut.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="block group bg-[#181818] border border-white/5 rounded-[24px] overflow-hidden hover:border-[#FF2D7A]/40 transition-all"
                    >
                      <div className="aspect-video w-full bg-[#0D0D0D] relative flex items-center justify-center overflow-hidden">
                        {hasPreview ? (
                          <img 
                            src={tut.thumbnailUrl} 
                            alt={tut.title} 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" 
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2D7A]/20 to-[#ff5d9e]/5" />
                        )}
                        <div className="absolute inset-0 bg-black/30" />
                        
                        {/* Play button overlay */}
                        <div className="w-14 h-14 bg-[#FF2D7A] text-white rounded-full flex items-center justify-center shadow-xl shadow-[#FF2D7A]/30 group-hover:scale-110 group-hover:bg-[#ff1e70] transition-all duration-300 z-10">
                          <Play className="w-6 h-6 fill-white ml-1" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-white text-sm group-hover:text-[#FF2D7A] transition-colors">{tut.title}</h3>
                        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{tut.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: THUMBNAILS & CREATIVES GALLEY */}
          {thumbnails.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-black text-[#8E8E93] uppercase tracking-wider">🖼️ Miniaturas & Imagens prontas para Baixar</h2>
              <div className="grid grid-cols-2 gap-3.5">
                {thumbnails.map(tut => {
                  const displayImg = tut.thumbnailUrl || tut.url;
                  return (
                    <div 
                      key={tut.id} 
                      className="bg-[#181818] border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#FF2D7A]/30 transition-all"
                    >
                      <div className="aspect-square bg-black relative overflow-hidden">
                        <img 
                          src={displayImg} 
                          alt={tut.title} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                          onError={(e) => (e.currentTarget.src = 'https://placehold.co/150x150/181818/FF2D7A?text=Miniatura')}
                        />
                      </div>
                      <div className="p-3 space-y-2">
                        <h4 className="font-bold text-white text-xs line-clamp-1">{tut.title}</h4>
                        <p className="text-[10px] text-gray-400 line-clamp-2 leading-snug">{tut.description}</p>
                        <a 
                          href={tut.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full py-2 bg-white/5 hover:bg-[#FF2D7A] hover:text-white text-[10px] font-bold text-gray-300 rounded-lg text-center flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Baixar Imagem
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 3: MANUAL PDF / QUICK GUIDES */}
          {pdfManuals.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-black text-[#8E8E93] uppercase tracking-wider">📄 Guias Rápidos & Manuais PDF</h2>
              <div className="space-y-2.5">
                {pdfManuals.map(tut => (
                  <a 
                    key={tut.id} 
                    href={tut.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-3.5 bg-[#181818] hover:bg-[#202020] border border-white/5 p-4 rounded-2xl transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors">{tut.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{tut.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-amber-500 transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: GENERAL & SUPPORT LINKS */}
          {generalList.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-black text-[#8E8E93] uppercase tracking-wider">🔗 Links de Apoio & Outras Mídias</h2>
              <div className="space-y-3">
                {generalList.map(tut => (
                  <a 
                    key={tut.id} 
                    href={tut.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block bg-[#090909] border border-white/10 rounded-2xl p-4 hover:border-[#FF2D7A]/50 transition-colors group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#181818] border border-white/5 flex items-center justify-center text-[#FF2D7A] shrink-0">
                        {tut.type === 'video' ? <Video className="w-5 h-5" /> : tut.type === 'image' ? <ImageIcon className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h3 className="font-semibold text-white text-sm truncate pr-4 group-hover:text-[#FF2D7A] transition-colors">{tut.title}</h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{tut.description}</p>
                      </div>
                      <div className="shrink-0 flex items-center self-center">
                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#FF2D7A] transition-colors" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
