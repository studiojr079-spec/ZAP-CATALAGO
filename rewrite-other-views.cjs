const fs = require('fs');

const files = [
  'src/components/ProductsManagement.tsx',
  'src/components/CategoriesManagement.tsx',
  'src/components/PersonalizeStore.tsx',
  'src/components/OrdersView.tsx',
  'src/components/MoreMenu.tsx',
  'src/components/SubscriptionsView.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Backgrounds
    code = code.replace(/bg-\[#0c0a0f\]/g, 'bg-gray-50');
    code = code.replace(/bg-\[#090909\]/g, 'bg-white');
    code = code.replace(/bg-gray-950/g, 'bg-gray-100');
    code = code.replace(/bg-\[#120c15\]/g, 'bg-white');
    code = code.replace(/bg-\[#18121e\]/g, 'bg-white');
    code = code.replace(/bg-\[#1e1325\]/g, 'bg-gray-200');
    code = code.replace(/bg-\[#1a1a1a\]/g, 'bg-gray-100');
    code = code.replace(/bg-pink-900\/30/g, 'bg-pink-50');
    code = code.replace(/bg-black\/80/g, 'bg-black/50');
    code = code.replace(/bg-black\/60/g, 'bg-black/40');
    code = code.replace(/bg-\[#202020\]/g, 'bg-gray-100');
    code = code.replace(/bg-\[#121212\]/g, 'bg-white');
    code = code.replace(/bg-\[#1A1A1A\]/g, 'bg-gray-50');
    
    // Texts
    code = code.replace(/text-white/g, 'text-gray-900');
    code = code.replace(/text-gray-100/g, 'text-gray-900');
    code = code.replace(/text-gray-200/g, 'text-gray-800');
    code = code.replace(/text-gray-300/g, 'text-gray-700');
    code = code.replace(/text-gray-400/g, 'text-gray-500');
    
    // Borders
    code = code.replace(/border-white\/10/g, 'border-gray-200');
    code = code.replace(/border-white\/5/g, 'border-gray-100');
    code = code.replace(/border-pink-950\/20/g, 'border-pink-200');
    code = code.replace(/border-pink-950\/10/g, 'border-pink-100');
    code = code.replace(/border-\[#2A2A2A\]/g, 'border-gray-200');
    code = code.replace(/border-gray-800/g, 'border-gray-300');
    
    fs.writeFileSync(file, code);
  }
});
console.log("Other views updated to light mode");
