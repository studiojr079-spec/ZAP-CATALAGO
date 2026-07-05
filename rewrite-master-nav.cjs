const fs = require('fs');
let code = fs.readFileSync('src/components/MasterPortal.tsx', 'utf8');

const navRegex = /<nav className="fixed bottom-0[\s\S]*?<\/nav>/;
const newNav = `<nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090909] border-t border-white/5 pt-3 pb-2.5 px-3 flex flex-col justify-between items-center">
        <div className="w-full flex justify-around items-center">
          <button onClick={() => selectTab('dashboard')} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <Activity className={\`w-5.5 h-5.5 transition-colors \${activeTab === 'dashboard' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`} />
            <span className={\`text-[11px] font-bold tracking-tight font-sans transition-colors \${activeTab === 'dashboard' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`}>Dashboard</span>
          </button>
          <button onClick={() => selectTab('stores')} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <StoreIcon className={\`w-5.5 h-5.5 transition-colors \${activeTab === 'stores' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`} />
            <span className={\`text-[11px] font-bold tracking-tight font-sans transition-colors \${activeTab === 'stores' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`}>Lojas</span>
          </button>
          <button onClick={() => selectTab('subscriptions')} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <Package className={\`w-5.5 h-5.5 transition-colors \${activeTab === 'subscriptions' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`} />
            <span className={\`text-[11px] font-bold tracking-tight font-sans transition-colors \${activeTab === 'subscriptions' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`}>Assinaturas</span>
          </button>
          <button onClick={() => selectTab('finance')} className="flex flex-col items-center gap-1.5 focus:outline-none flex-1 py-1 relative group">
            <DollarSign className={\`w-5.5 h-5.5 transition-colors \${activeTab === 'finance' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`} />
            <span className={\`text-[11px] font-bold tracking-tight font-sans transition-colors \${activeTab === 'finance' ? 'text-[#FF2D7A]' : 'text-[#8E8E93]'}\`}>Financeiro</span>
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
        <div className="w-36 h-1 bg-gray-500 rounded-full mt-3.5 mb-0.5" />
      </nav>`;
code = code.replace(navRegex, newNav);

const dashRegex = /{activeTab === 'dashboard' && \([\s\S]*?{activeTab === 'users' && \(/;
const newDash = `{activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-[17px] font-bold mb-4 text-white">Visão Geral</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <StoreIcon className="w-6 h-6 text-[#FF2D7A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8E8E93] font-bold mb-1">Lojas Ativas</div>
                    <div className="text-2xl font-black text-white mb-2">{stores.length || 138}</div>
                  </div>
                </div>

                <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <Package className="w-6 h-6 text-[#FF2D7A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8E8E93] font-bold mb-1">Assinaturas Ativas</div>
                    <div className="text-2xl font-black text-white mb-2">142</div>
                  </div>
                </div>

                <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-[#FF2D7A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8E8E93] font-bold mb-1">Receita (Mês)</div>
                    <div className="text-[18px] font-black text-white mb-2">R$ {(revenue || 12450).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                  </div>
                </div>
                
                <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-[#FF2D7A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8E8E93] font-bold mb-1">Novos Clientes</div>
                    <div className="text-2xl font-black text-white mb-2">24</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 mt-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white">Receita</h3>
                <div className="bg-[#0D0D0D] text-[#8E8E93] text-[10px] px-3 py-1 rounded-full flex items-center gap-1 border border-white/5 font-bold">
                  Mensal <ChevronRight className="w-3 h-3 rotate-90" />
                </div>
              </div>
              
              <div className="h-32 w-full relative">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  <path d="M0,40 L0,25 C10,15 20,10 30,15 C40,20 50,22 60,18 C70,12 80,5 90,15 C95,20 100,25 100,25 L100,40 Z" fill="url(#gradient-master)" opacity="0.3"/>
                  <path d="M0,25 C10,15 20,10 30,15 C40,20 50,22 60,18 C70,12 80,5 90,15 C95,20 100,25 100,25" fill="none" stroke="#FF2D7A" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
                  <defs>
                    <linearGradient id="gradient-master" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF2D7A" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#FF2D7A" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-white">Atividades Recentes</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF2D7A]/10 flex items-center justify-center shrink-0">
                    <StoreIcon className="w-4 h-4 text-[#FF2D7A]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-white">Nova loja cadastrada</div>
                    <div className="text-[11px] text-[#8E8E93]">Beleza Store</div>
                  </div>
                  <div className="text-[10px] text-[#8E8E93]">há 10 min</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-green-500/30 flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-[#181818]"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-white">Assinatura aprovada</div>
                    <div className="text-[11px] text-[#8E8E93]">Jessica Hair</div>
                  </div>
                  <div className="text-[10px] text-[#8E8E93]">há 30 min</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FF2D7A]/10 flex items-center justify-center shrink-0 text-[#FF2D7A]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-white">Pagamento recebido</div>
                    <div className="text-[11px] text-[#8E8E93]">Plano Profissional - R$ 99,90</div>
                  </div>
                  <div className="text-[10px] text-[#8E8E93]">há 1 hora</div>
                </div>
              </div>
            </div>
            
          </div>
        )}

        {activeTab === 'users' && (`;

code = code.replace(dashRegex, newDash);
fs.writeFileSync('src/components/MasterPortal.tsx', code);
