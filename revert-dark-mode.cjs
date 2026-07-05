const fs = require('fs');

const files = [
  'src/components/OwnerPortal.tsx',
  'src/components/DashboardView.tsx',
  'src/components/MainMenu.tsx',
  'src/components/MasterPortal.tsx',
  'src/components/ProductsManagement.tsx',
  'src/components/CategoriesManagement.tsx',
  'src/components/PersonalizeStore.tsx',
  'src/components/OrdersView.tsx',
  'src/components/SubscriptionsView.tsx',
  'src/components/MoreMenu.tsx',
  'src/components/Storefront.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');

    code = code.replace(/bg-gray-50/g, 'bg-[#0c0a0f]');
    code = code.replace(/text-gray-900/g, 'text-gray-100');
    code = code.replace(/bg-white/g, 'bg-[#090909]');
    code = code.replace(/bg-gray-100/g, 'bg-[#181818]');
    code = code.replace(/bg-gray-200/g, 'bg-[#1e1325]');
    code = code.replace(/border-gray-200/g, 'border-white/10');
    code = code.replace(/border-gray-100/g, 'border-white/5');
    code = code.replace(/text-gray-500/g, 'text-[#8E8E93]');
    code = code.replace(/text-gray-700/g, 'text-gray-300');
    code = code.replace(/text-gray-600/g, 'text-gray-400');
    code = code.replace(/text-gray-800/g, 'text-gray-200');
    code = code.replace(/border-pink-200/g, 'border-pink-950/20');
    code = code.replace(/border-pink-100/g, 'border-pink-950/10');
    code = code.replace(/bg-pink-100/g, 'bg-pink-950/30');
    code = code.replace(/bg-green-100/g, 'bg-green-950/30');
    code = code.replace(/bg-blue-100/g, 'bg-blue-950/30');
    code = code.replace(/bg-purple-100/g, 'bg-purple-950/30');
    code = code.replace(/bg-amber-100/g, 'bg-amber-950/30');
    code = code.replace(/bg-cyan-100/g, 'bg-cyan-950/30');
    code = code.replace(/bg-red-100/g, 'bg-red-950/30');
    code = code.replace(/bg-black\/40/g, 'bg-black/60');
    code = code.replace(/bg-black\/50/g, 'bg-black/80');

    // SubscriptionsView specifics
    code = code.replace(/text-green-600/g, 'text-green-400');
    code = code.replace(/text-pink-600/g, 'text-pink-400');
    
    code = code.replace(/text-gray-100/g, 'text-white');

    fs.writeFileSync(file, code);
  }
});

let masterCode = fs.readFileSync('src/components/MasterPortal.tsx', 'utf8');
masterCode = masterCode.replace(/bg-\[#0c0a0f\]/g, 'bg-[#0D0D0D]');
masterCode = masterCode.replace(/bg-\[#090909\]/g, 'bg-[#181818]');
fs.writeFileSync('src/components/MasterPortal.tsx', masterCode);

console.log("Reverted to dark mode");
