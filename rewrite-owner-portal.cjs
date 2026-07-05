const fs = require('fs');

let portal = fs.readFileSync('src/components/OwnerPortal.tsx', 'utf8');
portal = portal.replace(/bg-\[#0c0a0f\]/g, 'bg-gray-50');
portal = portal.replace(/text-gray-100/g, 'text-gray-900');
portal = portal.replace(/border-pink-500/g, 'border-[#FF2D7A]');
portal = portal.replace(/text-white/g, 'text-gray-900');
portal = portal.replace(/bg-\[#090909\]/g, 'bg-white');
portal = portal.replace(/bg-\[#1a1a1a\]/g, 'bg-gray-100');
fs.writeFileSync('src/components/OwnerPortal.tsx', portal);

let mainMenu = fs.readFileSync('src/components/MainMenu.tsx', 'utf8');
mainMenu = mainMenu.replace(/bg-\[#090909\]/g, 'bg-white');
mainMenu = mainMenu.replace(/border-white\/5/g, 'border-gray-200');
mainMenu = mainMenu.replace(/text-gray-400/g, 'text-gray-400');
mainMenu = mainMenu.replace(/group-hover:text-gray-200/g, 'group-hover:text-gray-600');
mainMenu = mainMenu.replace(/group-hover:text-gray-300/g, 'group-hover:text-gray-700');
mainMenu = mainMenu.replace(/bg-white\/70/g, 'bg-gray-300');
mainMenu = mainMenu.replace(/text-\[#8E8E93\]/g, 'text-gray-500');
fs.writeFileSync('src/components/MainMenu.tsx', mainMenu);
console.log("Portal and MainMenu updated");
