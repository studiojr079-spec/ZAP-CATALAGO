const fs = require('fs');

let code = fs.readFileSync('src/components/CatalogView.tsx', 'utf8');

// We will replace the entire render body.

const newImports = `
import TemplateClean from './templates/TemplateClean';
import TemplatePremium from './templates/TemplatePremium';
import TemplateDark from './templates/TemplateDark';
`;

code = code.replace(/import { saveOrder, saveAnalytics, getAnalytics, saveNotification, saveProduct, getOrderById } from '\.\.\/lib\/db';/, "import { saveOrder, saveAnalytics, getAnalytics, saveNotification, saveProduct, getOrderById } from '../lib/db';\n" + newImports);


const newRender = `
  const templateProps = {
    store,
    products,
    categories,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    handleEuQuero,
    favorites,
    toggleFavorite,
    setShowAboutModal,
    setShowTrackModal,
    customBanners
  };

  const renderTemplate = () => {
    switch (store.catalogTemplate) {
      case 'premium':
        return <TemplatePremium {...templateProps} />;
      case 'dark':
        return <TemplateDark {...templateProps} />;
      case 'clean':
      default:
        return <TemplateClean {...templateProps} />;
    }
  };

  return (
    <>
      {/* Top Floating Preview Bar */}
      {isPreview && (
        <div className="bg-pink-600 text-white text-[11px] py-2 px-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
          <span className="font-semibold flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Você está visualizando a prévia do seu catálogo
          </span>
          <button
            onClick={onBackToDashboard}
            className="bg-white text-pink-600 px-3 py-1 rounded-full font-bold text-[10px] hover:bg-pink-50 transition active:scale-95"
          >
            Voltar
          </button>
        </div>
      )}

      {renderTemplate()}

      {/* Modals are kept at the CatalogView level so they work across templates */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-[#0c0a0f] text-white w-full max-w-md h-[85vh] rounded-t-3xl shadow-2xl relative flex flex-col animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>
            
            <button
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">
              <div className="flex flex-col items-center text-center mt-4 mb-8">
                {store.logo && (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 mb-4 bg-white/5 p-2 shadow-2xl">
                    <img src={store.logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                  </div>
                )}
                <h2 className="text-2xl font-black tracking-tight" style={{ color: store.primaryColor }}>
                  {store.name}
                </h2>
                {store.description && (
                  <p className="mt-3 text-sm text-[#8E8E93] leading-relaxed">
                    {store.description}
                  </p>
                )}
              </div>

              {store.about && (
                <div className="space-y-6">
                  {/* Additional about content can go here based on store.about fields */}
                  {store.about.history && (
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-[#8E8E93] mb-2">Nossa História</h3>
                      <p className="text-sm font-medium leading-relaxed">{store.about.history}</p>
                    </div>
                  )}
                  {store.about.address && (
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <h3 className="text-xs font-black uppercase tracking-widest text-[#8E8E93] mb-2">Endereço</h3>
                      <p className="text-sm font-medium leading-relaxed">{store.about.address}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
`;

const startIndex = code.indexOf('return (');
if (startIndex !== -1) {
  code = code.substring(0, startIndex) + newRender + '\n}\n';
}

fs.writeFileSync('src/components/CatalogView.tsx', code);
