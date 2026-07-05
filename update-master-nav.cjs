const fs = require('fs');
let code = fs.readFileSync('src/components/MasterPortal.tsx', 'utf8');

const navbar = `
      {/* Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090909] border-t border-white/5 pt-3 pb-2.5 px-3 flex flex-col justify-between items-center">
        <div className="w-full flex justify-around items-center">
          <button onClick={() => selectTab('dashboard')} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <Activity className={\`w-5.5 h-5.5 transition-colors \${activeTab === 'dashboard' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`} />
            <span className={\`text-[11px] font-bold tracking-tight font-sans transition-colors \${activeTab === 'dashboard' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`}>Dashboard</span>
          </button>
          <button onClick={() => selectTab('users')} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <Users className={\`w-5.5 h-5.5 transition-colors \${activeTab === 'users' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`} />
            <span className={\`text-[11px] font-bold tracking-tight font-sans transition-colors \${activeTab === 'users' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`}>Lojistas</span>
          </button>
          <button onClick={() => selectTab('stores')} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <StoreIcon className={\`w-5.5 h-5.5 transition-colors \${activeTab === 'stores' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`} />
            <span className={\`text-[11px] font-bold tracking-tight font-sans transition-colors \${activeTab === 'stores' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`}>Lojas</span>
          </button>
          <button onClick={() => selectTab('subscriptions')} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <CreditCard className={\`w-5.5 h-5.5 transition-colors \${activeTab === 'subscriptions' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`} />
            <span className={\`text-[11px] font-bold tracking-tight font-sans transition-colors \${activeTab === 'subscriptions' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`}>Assinaturas</span>
          </button>
          <button onClick={toggleMenu} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <div className="flex gap-[3px] items-center justify-center h-[22px]">
              <div className="w-[5px] h-[5px] rounded-full bg-[#8E8E93]"></div>
              <div className="w-[5px] h-[5px] rounded-full bg-[#8E8E93]"></div>
              <div className="w-[5px] h-[5px] rounded-full bg-[#8E8E93]"></div>
            </div>
            <span className="text-[11px] font-bold tracking-tight font-sans text-[#8E8E93]">Mais</span>
          </button>
        </div>
        {/* iOS Home Indicator */}
        <div className="w-36 h-1 bg-gray-500 rounded-full mt-3.5 mb-0.5" />
      </nav>
    </div>
  );
`;

const endRegex = /<\/main>\s*<\/div>\s*\);\s*}\s*$/;
if (code.match(endRegex)) {
  code = code.replace(endRegex, '</main>\n' + navbar + '\n}\n');
  fs.writeFileSync('src/components/MasterPortal.tsx', code);
  console.log("MasterPortal nav added");
} else {
  console.log("Not matched");
}
