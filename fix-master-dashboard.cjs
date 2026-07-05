const fs = require('fs');

let code = fs.readFileSync('src/components/MasterPortal.tsx', 'utf8');

const dashboardRegex = /<div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 pt-6 animate-in fade-in duration-300">[\s\S]*?{activeTab === 'users' && \(/;

const newDashboard = `<div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-4 pt-4 animate-in fade-in duration-300">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Visão Geral */}
            <div>
              <h2 className="text-xl font-bold mb-4">Visão Geral</h2>
              <div className="flex gap-2 mb-6">
                <button className="px-4 py-1.5 rounded-full bg-[#181818] border border-white/5 text-xs font-medium">Hoje</button>
                <button className="px-4 py-1.5 rounded-full bg-[#181818] border border-white/5 text-xs font-medium">7 dias</button>
                <button className="px-4 py-1.5 rounded-full bg-[#FF2D7A]/20 border border-[#FF2D7A] text-[#FF2D7A] text-xs font-bold">30 dias</button>
                <button className="px-4 py-1.5 rounded-full bg-[#181818] border border-white/5 text-xs font-medium">90 dias</button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Cards */}
                <div className="bg-[#181818] border border-white/5 rounded-[24px] p-5 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <Users className="w-5 h-5 text-[#FF2D7A]" />
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Lojistas Ativos</div>
                  <div className="text-2xl font-black mt-1 mb-2">{merchants.length}</div>
                  <div className="text-[10px] text-[#FF2D7A] font-bold">↑ 18% este mês</div>
                </div>
                
                <div className="bg-[#181818] border border-white/5 rounded-[24px] p-5 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <StoreIcon className="w-5 h-5 text-[#FF2D7A]" />
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Lojas Ativas</div>
                  <div className="text-2xl font-black mt-1 mb-2">{stores.length}</div>
                  <div className="text-[10px] text-[#FF2D7A] font-bold">↑ 16% este mês</div>
                </div>

                <div className="bg-[#181818] border border-white/5 rounded-[24px] p-5 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <Package className="w-5 h-5 text-[#FF2D7A]" />
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Assinaturas Ativas</div>
                  <div className="text-2xl font-black mt-1 mb-2">{merchants.length}</div>
                  <div className="text-[10px] text-[#FF2D7A] font-bold">↑ 21% este mês</div>
                </div>

                <div className="bg-[#181818] border border-white/5 rounded-[24px] p-5 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-[#FF2D7A]/10 flex items-center justify-center mb-4">
                    <DollarSign className="w-5 h-5 text-[#FF2D7A]" />
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Receita (Mês)</div>
                  <div className="text-[18px] font-black mt-1 mb-2">R$ {revenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                  <div className="text-[10px] text-[#FF2D7A] font-bold">↑ 24% este mês</div>
                </div>
              </div>
            </div>

            {/* Receita dos últimos 30 dias */}
            <div className="bg-[#181818] border border-white/5 rounded-3xl p-5 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white">Receita dos últimos 30 dias</h3>
                <div className="bg-[#0D0D0D] text-gray-400 text-[10px] px-3 py-1 rounded-full flex items-center gap-1 border border-white/5">
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
                <div className="flex justify-between text-[9px] text-gray-500 mt-2 absolute bottom-[-15px] w-full">
                  <span>10/05</span>
                  <span>17/05</span>
                  <span>24/05</span>
                  <span>31/05</span>
                  <span>07/06</span>
                </div>
                <div className="flex flex-col justify-between h-full text-[9px] text-gray-500 absolute left-[-25px] top-0 pb-4">
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
                    <div className="text-sm font-bold">Nova loja cadastrada</div>
                    <div className="text-[11px] text-gray-400">Beleza Store</div>
                  </div>
                  <div className="text-[10px] text-gray-500">há 10 min</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-green-500/30 flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">Assinatura aprovada</div>
                    <div className="text-[11px] text-gray-400">Jessica Hair</div>
                  </div>
                  <div className="text-[10px] text-gray-500">há 30 min</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">Pagamento recebido</div>
                    <div className="text-[11px] text-gray-400">Plano Profissional - R$ 47,00</div>
                  </div>
                  <div className="text-[10px] text-gray-500">há 1 hora</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">Novo lojista</div>
                    <div className="text-[11px] text-gray-400">Maria Silva</div>
                  </div>
                  <div className="text-[10px] text-gray-500">há 2 horas</div>
                </div>
              </div>
            </div>

            {/* Atalhos Rápidos */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-white">Atalhos Rápidos</h3>
                <button className="text-[11px] text-[#FF2D7A] font-bold">Personalizar</button>
              </div>
              <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">
                <button className="flex-none w-24 bg-[#181818] border border-white/5 rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 hover:border-[#FF2D7A]/50 transition">
                  <StoreIcon className="w-6 h-6 text-[#FF2D7A] stroke-[1.5]" />
                  <span className="text-[10px] font-bold whitespace-nowrap">Nova Loja</span>
                </button>
                <button className="flex-none w-24 bg-[#181818] border border-white/5 rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 hover:border-[#FF2D7A]/50 transition">
                  <Users className="w-6 h-6 text-[#FF2D7A] stroke-[1.5]" />
                  <span className="text-[10px] font-bold whitespace-nowrap">Novo Lojista</span>
                </button>
                <button className="flex-none w-24 bg-[#181818] border border-white/5 rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 hover:border-[#FF2D7A]/50 transition">
                  <CreditCard className="w-6 h-6 text-[#FF2D7A] stroke-[1.5]" />
                  <span className="text-[10px] font-bold whitespace-nowrap">Novo Plano</span>
                </button>
                <button className="flex-none w-24 bg-[#181818] border border-white/5 rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 hover:border-[#FF2D7A]/50 transition">
                  <Ticket className="w-6 h-6 text-[#FF2D7A] stroke-[1.5]" />
                  <span className="text-[10px] font-bold whitespace-nowrap">Novo Cupom</span>
                </button>
                <button className="flex-none w-24 bg-[#181818] border border-white/5 rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 hover:border-[#FF2D7A]/50 transition">
                  <TrendingUp className="w-6 h-6 text-[#FF2D7A] stroke-[1.5]" />
                  <span className="text-[10px] font-bold whitespace-nowrap">Relatórios</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'users' && (`;

if (code.match(dashboardRegex)) {
  code = code.replace(dashboardRegex, newDashboard);
  
  // also fix the header: "PAINEL MASTER / Administração da Plataforma"
  const headerRegex = /<ShieldAlert className="w-6 h-6 text-\[#FF2D7A\]" \/>[\s\S]*?<div className="flex items-center gap-2">/;
  const newHeader = `<div className="w-10 h-10 bg-[#FF2D7A]/10 border border-[#FF2D7A]/30 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-[#FF2D7A]" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest text-white">PAINEL <span className="text-[#FF2D7A]">MASTER</span></h1>
              <div className="text-[9px] text-gray-400 tracking-wide font-medium">Administração da Plataforma</div>
            </div>
          </div>
          <div className="flex items-center gap-2">`;
  code = code.replace(headerRegex, newHeader);

  // and notifications bell in header
  const bellRegex = /<button className="w-10 h-10 flex items-center justify-center bg-\[#181818\] rounded-full text-white relative">[\s\S]*?<\/button>/;
  const newBell = `<button className="w-10 h-10 flex items-center justify-center bg-[#181818] border border-white/5 rounded-full text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-[#FF2D7A] text-[8px] font-bold flex items-center justify-center rounded-full">9+</span>
            </button>`;
  code = code.replace(bellRegex, newBell);

  fs.writeFileSync('src/components/MasterPortal.tsx', code);
  console.log("MasterPortal dashboard updated");
} else {
  console.log("Regex not matched");
}
