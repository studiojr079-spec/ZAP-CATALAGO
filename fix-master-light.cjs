const fs = require('fs');

let code = fs.readFileSync('src/components/MasterPortal.tsx', 'utf8');

// Colors
code = code.replace(/bg-\[#0D0D0D\]/g, 'bg-gray-50');
code = code.replace(/text-white/g, 'text-gray-900');
code = code.replace(/bg-\[#181818\]/g, 'bg-white');
code = code.replace(/border-white\/5/g, 'border-gray-200');
code = code.replace(/text-gray-400/g, 'text-gray-500');
code = code.replace(/text-gray-500/g, 'text-gray-500');
code = code.replace(/text-gray-300/g, 'text-gray-700');
code = code.replace(/hover:bg-white\/5/g, 'hover:bg-gray-100');
code = code.replace(/hover:text-white/g, 'hover:text-gray-900');
code = code.replace(/bg-black\/60/g, 'bg-black/40');
code = code.replace(/bg-black\/20/g, 'bg-gray-50');
code = code.replace(/bg-white\/5/g, 'bg-gray-50');
code = code.replace(/bg-white\/10/g, 'bg-gray-100');
code = code.replace(/border-[#FF2D7A]\/30/g, 'border-[#FF2D7A]/20');
code = code.replace(/border-white\/10/g, 'border-gray-200');
code = code.replace(/border-white\/20/g, 'border-gray-300');
code = code.replace(/border-white\/40/g, 'border-gray-400');
code = code.replace(/text-[#FF2D7A] text-gray-900/g, 'text-[#FF2D7A]'); // Fix potential double classes
code = code.replace(/bg-\[#FF2D7A\] text-gray-900/g, 'bg-[#FF2D7A] text-white');
code = code.replace(/text-gray-900 font-medium/g, 'text-gray-600 font-medium');

fs.writeFileSync('src/components/MasterPortal.tsx', code);
console.log("MasterPortal to light mode");
