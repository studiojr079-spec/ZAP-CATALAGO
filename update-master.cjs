const fs = require('fs');
let code = fs.readFileSync('src/components/MasterPortal.tsx', 'utf8');

// Replace Header
const headerRegex = /<header className="sticky top-0 z-40 bg-\[#0D0D0D\]\/90 backdrop-blur-md border-b border-white\/10 px-4 py-4 flex items-center justify-between">[\s\S]*?<\/header>/;
const newHeader = `<header className="sticky top-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-md px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-transparent border-2 border-[#FF2D7A] rounded-2xl flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-[#FF2D7A]" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest text-white flex items-center gap-1">PAINEL <span className="text-[#FF2D7A]">MASTER</span></h1>
            <div className="text-[9px] text-gray-400 tracking-wide font-medium">Administração da Plataforma</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center bg-[#181818] rounded-full text-white relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 bg-[#FF2D7A] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0D0D0D]">9+</span>
          </button>
          <button onClick={toggleMenu} className="w-10 h-10 flex items-center justify-center bg-[#FF2D7A] rounded-full text-white shadow-lg shadow-[#FF2D7A]/20">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>`;
code = code.replace(headerRegex, newHeader);

// Replace Dashboard block
const dashStart = code.indexOf(`{activeTab === 'dashboard' && (`);
const dashEnd = code.indexOf(`{/* USERS / LOJISTAS TAB */}`);
if (dashStart > -1 && dashEnd > -1) {
  const dashBlock = code.substring(dashStart, dashEnd);
  const newDashBlock = `{activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Visão Geral */}
            <div>
              <h2 className="text-[17px] font-bold mb-4 text-white">Visão Geral</h2>
              <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                <button className="px-4 py-2 rounded-xl bg-[#181818] text-[#8E8E93] text-xs font-bold whitespace-nowrap">Hoje</button>
                <button className="px-4 py-2 rounded-xl bg-[#181818] text-[#8E8E93] text-xs font-bold whitespace-nowrap">7 dias</button>
                <button className="px-4 py-2 rounded-xl bg-[#FF2D7A]/10 border border-[#FF2D7A]/50 text-[#FF2D7A] text-xs font-bold whitespace-nowrap">30 dias</button>
                <button className="px-4 py-2 rounded-xl bg-[#181818] text-[#8E8E93] text-xs font-bold whitespace-nowrap">90 dias</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Cards */}
                <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-[#FF2D7A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8E8E93] font-bold mb-1">Lojistas Ativos</div>
                    <div className="text-2xl font-black text-white mb-2">{merchants.length || 124}</div>
                    <div className="text-[10px] text-[#FF2D7A] font-bold">↑ 18% este mês</div>
                  </div>
                </div>
                
                <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <StoreIcon className="w-6 h-6 text-[#FF2D7A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8E8E93] font-bold mb-1">Lojas Ativas</div>
                    <div className="text-2xl font-black text-white mb-2">{stores.length || 138}</div>
                    <div className="text-[10px] text-[#FF2D7A] font-bold">↑ 16% este mês</div>
                  </div>
                </div>

                <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <Package className="w-6 h-6 text-[#FF2D7A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8E8E93] font-bold mb-1">Assinaturas Ativas</div>
                    <div className="text-2xl font-black text-white mb-2">142</div>
                    <div className="text-[10px] text-[#FF2D7A] font-bold">↑ 21% este mês</div>
                  </div>
                </div>

                <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-[#FF2D7A]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#8E8E93] font-bold mb-1">Receita (Mês)</div>
                    <div className="text-[18px] font-black text-white mb-2">R$ {(revenue || 12450).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                    <div className="text-[10px] text-[#FF2D7A] font-bold">↑ 24% este mês</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-[#181818] rounded-3xl p-5 shadow-lg border border-white/5 mt-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white">Receita dos últimos 30 dias</h3>
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
                <div className="flex justify-between text-[9px] text-[#8E8E93] mt-2 absolute bottom-[-15px] w-full font-bold">
                  <span>10/05</span>
                  <span>17/05</span>
                  <span>24/05</span>
                  <span>31/05</span>
                  <span>07/06</span>
                </div>
                <div className="flex flex-col justify-between h-full text-[9px] text-[#8E8E93] absolute left-[-25px] top-0 pb-4 font-bold">
                  <span>15K</span>
                  <span>10K</span>
                  <span>5K</span>
                  <span>0</span>
                </div>
              </div>
            </div>

            {/* Atividades Recentes */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-white">Atividades Recentes</h3>
                <button className="text-[11px] text-[#FF2D7A] font-bold">Ver todas</button>
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
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-white">Novo lojista</div>
                    <div className="text-[11px] text-[#8E8E93]">Maria Silva</div>
                  </div>
                  <div className="text-[10px] text-[#8E8E93]">há 2 horas</div>
                </div>
              </div>
            </div>

            {/* Atalhos Rápidos */}
            <div className="pt-4 pb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-white">Atalhos Rápidos</h3>
                <button className="text-[11px] text-[#FF2D7A] font-bold">Personalizar</button>
              </div>
              <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">
                <button className="flex-none w-28 bg-[#181818] border border-white/5 rounded-[20px] p-5 flex flex-col items-center justify-center gap-3 hover:border-[#FF2D7A]/50 transition">
                  <StoreIcon className="w-6 h-6 text-[#FF2D7A] stroke-[1.5]" />
                  <span className="text-[10px] font-bold text-[#8E8E93]">Nova Loja</span>
                </button>
                <button className="flex-none w-28 bg-[#181818] border border-white/5 rounded-[20px] p-5 flex flex-col items-center justify-center gap-3 hover:border-[#FF2D7A]/50 transition">
                  <Users className="w-6 h-6 text-[#FF2D7A] stroke-[1.5]" />
                  <span className="text-[10px] font-bold text-[#8E8E93]">Novo Lojista</span>
                </button>
                <button className="flex-none w-28 bg-[#181818] border border-white/5 rounded-[20px] p-5 flex flex-col items-center justify-center gap-3 hover:border-[#FF2D7A]/50 transition">
                  <CreditCard className="w-6 h-6 text-[#FF2D7A] stroke-[1.5]" />
                  <span className="text-[10px] font-bold text-[#8E8E93]">Novo Plano</span>
                </button>
                <button className="flex-none w-28 bg-[#181818] border border-white/5 rounded-[20px] p-5 flex flex-col items-center justify-center gap-3 hover:border-[#FF2D7A]/50 transition">
                  <Ticket className="w-6 h-6 text-[#FF2D7A] stroke-[1.5]" />
                  <span className="text-[10px] font-bold text-[#8E8E93]">Novo Cupom</span>
                </button>
                <button className="flex-none w-28 bg-[#181818] border border-white/5 rounded-[20px] p-5 flex flex-col items-center justify-center gap-3 hover:border-[#FF2D7A]/50 transition">
                  <TrendingUp className="w-6 h-6 text-[#FF2D7A] stroke-[1.5]" />
                  <span className="text-[10px] font-bold text-[#8E8E93]">Relatórios</span>
                </button>
              </div>
            </div>
            
            <div className="w-full flex justify-center py-6 border-t border-white/5">
              <button onClick={handleLogout} className="flex items-center gap-2 text-[#FF2D7A] border border-[#FF2D7A]/30 bg-[#FF2D7A]/5 px-6 py-3 rounded-xl font-bold active:scale-95 transition">
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </div>
          </div>
        )}

        `;
  code = code.replace(dashBlock, newDashBlock);
}

fs.writeFileSync('src/components/MasterPortal.tsx', code);
console.log("MasterPortal header and dashboard updated");
