const fs = require('fs');

let code = fs.readFileSync('src/components/MainMenu.tsx', 'utf8');
code = code.replace(/border-\[#090909\]/g, 'border-white');
fs.writeFileSync('src/components/MainMenu.tsx', code);
