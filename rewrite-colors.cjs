const fs = require('fs');

const files = [
  'src/components/ProductsManagement.tsx',
  'src/components/CategoriesManagement.tsx',
  'src/components/PersonalizeStore.tsx',
  'src/components/OrdersView.tsx',
  'src/components/MoreMenu.tsx',
  'src/components/SubscriptionsView.tsx',
  'src/components/DashboardView.tsx',
  'src/components/OwnerPortal.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Remaining dark colors
    code = code.replace(/bg-\[#181818\]/g, 'bg-white');
    code = code.replace(/bg-\[#241725\]/g, 'bg-gray-100');
    code = code.replace(/bg-\[#150F16\]/g, 'bg-white');
    code = code.replace(/bg-\[#1B111A\]/g, 'bg-gray-50');
    code = code.replace(/bg-black\/20/g, 'bg-gray-50');
    code = code.replace(/bg-white\/5/g, 'bg-gray-50');
    code = code.replace(/bg-white\/10/g, 'bg-gray-100');
    
    fs.writeFileSync(file, code);
  }
});
console.log("Colors updated");
