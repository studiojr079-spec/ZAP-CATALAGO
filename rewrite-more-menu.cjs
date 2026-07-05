const fs = require('fs');

let code = fs.readFileSync('src/components/MoreMenu.tsx', 'utf8');

code = code.replace(/bg-pink-950\/30/g, 'bg-pink-100');
code = code.replace(/bg-green-950\/30/g, 'bg-green-100');
code = code.replace(/bg-gray-800/g, 'bg-gray-200');
code = code.replace(/bg-blue-950\/30/g, 'bg-blue-100');
code = code.replace(/bg-purple-950\/30/g, 'bg-purple-100');
code = code.replace(/bg-amber-950\/30/g, 'bg-amber-100');
code = code.replace(/bg-cyan-950\/30/g, 'bg-cyan-100');
code = code.replace(/bg-red-950\/30/g, 'bg-red-100');
code = code.replace(/bg-gray-900\/40/g, 'bg-gray-50');
code = code.replace(/bg-pink-950\/20/g, 'bg-pink-50');

fs.writeFileSync('src/components/MoreMenu.tsx', code);
console.log("MoreMenu colors updated");
