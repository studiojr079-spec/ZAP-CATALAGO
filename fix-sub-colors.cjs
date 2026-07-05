const fs = require('fs');

let code = fs.readFileSync('src/components/SubscriptionsView.tsx', 'utf8');

code = code.replace(/bg-gradient-to-r from-pink-900\/30 to-\[#120c15\]/g, 'bg-white');
code = code.replace(/bg-gradient-to-b from-\[#18121e\] to-\[#120c15\]/g, 'bg-white');
code = code.replace(/text-gray-900/g, 'text-gray-900'); // make sure
code = code.replace(/text-gray-300/g, 'text-gray-600');
code = code.replace(/text-green-300/g, 'text-green-600');
code = code.replace(/text-pink-400/g, 'text-pink-600');
code = code.replace(/text-green-400/g, 'text-green-600');
code = code.replace(/bg-gray-950/g, 'bg-gray-100');
code = code.replace(/bg-\[#1e1325\]/g, 'bg-gray-200');

fs.writeFileSync('src/components/SubscriptionsView.tsx', code);
console.log("SubscriptionsView fixed");
