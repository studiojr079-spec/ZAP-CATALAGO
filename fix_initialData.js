import fs from 'fs';
let content = fs.readFileSync('src/lib/initialData.ts', 'utf8');
content = content.replace(/hidden: false,\n    images: \[/g, 'hidden: false,\n    showPrice: true,\n    images: [');
fs.writeFileSync('src/lib/initialData.ts', content);
console.log('File updated');
