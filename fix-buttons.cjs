const fs = require('fs');

const files = [
  'src/components/ProductsManagement.tsx',
  'src/components/CategoriesManagement.tsx',
  'src/components/PersonalizeStore.tsx',
  'src/components/OrdersView.tsx',
  'src/components/SubscriptionsView.tsx',
  'src/components/MoreMenu.tsx',
  'src/components/OwnerPortal.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Quick and dirty fix for pink background elements
    code = code.replace(/bg-\[#FF2D7A\] text-gray-900/g, 'bg-[#FF2D7A] text-white');
    code = code.replace(/bg-pink-500 text-gray-900/g, 'bg-pink-500 text-white');
    code = code.replace(/bg-pink-600 text-gray-900/g, 'bg-pink-600 text-white');
    code = code.replace(/bg-red-500 text-gray-900/g, 'bg-red-500 text-white');
    code = code.replace(/bg-amber-500 text-gray-900/g, 'bg-amber-500 text-white');
    code = code.replace(/bg-blue-500 text-gray-900/g, 'bg-blue-500 text-white');
    code = code.replace(/bg-gray-900 text-gray-900/g, 'bg-gray-900 text-white');
    
    fs.writeFileSync(file, code);
  }
});
console.log("Buttons fixed");
