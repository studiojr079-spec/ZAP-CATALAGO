const fs = require('fs');
let code = fs.readFileSync('src/components/ProductsManagement.tsx', 'utf8');

const regexEstoque = /<div>\s*<label className="block text-xs font-bold text-\[#8E8E93\] uppercase tracking-widest mb-1\.5">Estoque<\/label>[\s\S]*?<\/div>/;
code = code.replace(regexEstoque, '');

const regexGrid2 = /<div className="grid grid-cols-2 gap-4">([\s\S]*?)<\/div>\s*<\/div>/;
// I need to change how the grid is structured, let's just use string replace.
