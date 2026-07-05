const fs = require('fs');
let code = fs.readFileSync('src/components/CatalogView.tsx', 'utf8');

const navRegex = /<nav className="fixed bottom-0[\s\S]*?<\/nav>/;
const newNav = `<nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 pb-safe pt-2 px-6 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.03)] h-16">
        <button 
          onClick={() => { setSelectedCategory('cat_todos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
          className={\`flex flex-col items-center gap-1 transition-colors \${selectedCategory === 'cat_todos' ? 'text-[#FF2D7A]' : 'text-gray-400'}\`}
        >
          <Home className="w-[22px] h-[22px]" />
          <span className="font-sans text-[10px] font-bold tracking-wide">Início</span>
        </button>
        
        <button 
          onClick={() => { document.getElementById('search-input')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} 
          className="flex flex-col items-center gap-1 transition-colors text-gray-400 hover:text-[#FF2D7A]"
        >
          <LayoutGrid className="w-[22px] h-[22px]" />
          <span className="font-sans text-[10px] font-bold tracking-wide">Categorias</span>
        </button>

        <button 
          onClick={() => { document.getElementById('search-input')?.focus(); }} 
          className="flex flex-col items-center gap-1 transition-colors text-gray-400 hover:text-[#FF2D7A]"
        >
          <Search className="w-[22px] h-[22px]" />
          <span className="font-sans text-[10px] font-bold tracking-wide">Buscar</span>
        </button>
        
        <button 
          onClick={() => { document.getElementById('sobre-a-loja')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} 
          className="flex flex-col items-center gap-1 transition-colors text-gray-400 hover:text-[#FF2D7A]"
        >
          <Info className="w-[22px] h-[22px]" />
          <span className="font-sans text-[10px] font-bold tracking-wide">Sobre</span>
        </button>
      </nav>`;

code = code.replace(navRegex, newNav);

fs.writeFileSync('src/components/CatalogView.tsx', code);
