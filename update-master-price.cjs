const fs = require('fs');
let code = fs.readFileSync('src/components/MasterPortal.tsx', 'utf8');

code = code.replace(/merchants\.length \* 49/g, "merchants.length * 47");
code = code.replace(/\+R\$ 490/g, "+R$ 470");
code = code.replace(/R\$ 49/g, "R$ 47");

fs.writeFileSync('src/components/MasterPortal.tsx', code);
