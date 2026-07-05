const fs = require('fs');
let code = fs.readFileSync('src/components/DashboardView.tsx', 'utf8');

const regex = /<header className="px-5 py-5 flex items-center justify-between z-30 relative">[\s\S]*?<\/header>[\s\S]*?{\/\* Main Content \*\/}[\s\S]*?<div className="px-5 pt-2 space-y-5">[\s\S]*?{\/\* Link Publico \*\/}/;
const newHeaderAndStart = `
      <header className="px-5 py-5 flex items-center justify-between z-30 relative">
        <div className="text-left leading-tight">
          <p className="text-[14px] text-[#8E8E93] font-medium tracking-tight mb-1">
            Olá, 
            {(() => {
              const options = { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute:'2-digit' };
              const time = new Date().toLocaleTimeString('pt-BR', options);
              return " " + time;
            })()}
          </p>
          <h2 className="text-[20px] font-extrabold text-white tracking-wide">
            {store.name ? store.name : 'JESSICA HAIR'}
          </h2>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-5 space-y-5">
        
        {/* Link Publico */}`;

code = code.replace(regex, newHeaderAndStart);

const statsRegex = /{\/\* Stats Grid \*\/}[\s\S]*?{\/\* Chart \*\//;
const newStats = `{/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div onClick={() => onNavigate('products')} className="bg-[#18121e] border border-white/5 rounded-[24px] p-5 flex flex-col items-start shadow-lg">
            <div className="mb-4">
              <ShoppingBag className="w-6 h-6 text-[#FF2D7A] stroke-[1.5]" />
            </div>
            <p className="text-xs text-[#8E8E93] font-medium mb-1">Produtos</p>
            <span className="text-2xl font-black text-white leading-none mb-2">{displayProductsCount}</span>
          </div>

          <div className="bg-[#18121e] border border-white/5 rounded-[24px] p-5 flex flex-col items-start shadow-lg">
            <div className="mb-4">
              <Eye className="w-6 h-6 text-[#FF2D7A] stroke-[1.5]" />
            </div>
            <p className="text-xs text-[#8E8E93] font-medium mb-1">Visualizações</p>
            <span className="text-2xl font-black text-white leading-none mb-2">{analytics?.views || 0}</span>
          </div>
          
          <div className="bg-[#18121e] border border-white/5 rounded-[24px] p-5 flex flex-col items-start shadow-lg cursor-pointer transition active:scale-95">
            <div className="mb-4">
              <Share2 className="w-6 h-6 text-[#FF2D7A] stroke-[1.5]" />
            </div>
            <p className="text-xs text-[#8E8E93] font-medium mb-1">Cliques WhatsApp</p>
            <span className="text-2xl font-black text-white leading-none mb-2">{analytics?.clicks || 0}</span>
          </div>
        </div>

        {/* Chart */`;
code = code.replace(statsRegex, newStats);

const quickActionsRegex = /{\/\* Atalhos Rápidos \*\/}[\s\S]*?{\/\* Produtos mais visualizados \*\/}/;
code = code.replace(quickActionsRegex, '{/* Produtos mais visualizados */}');

const popProductsRegex = /{\/\* Produtos mais visualizados \*\/}[\s\S]*?<\/div>\s*<\/div>\s*\);\s*}\s*$/;
code = code.replace(popProductsRegex, '</div>\n    </div>\n  );\n}');

fs.writeFileSync('src/components/DashboardView.tsx', code);
