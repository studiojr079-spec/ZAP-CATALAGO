const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

if (!code.includes('Manrope')) {
  code = code.replace("@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap');", "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');");
  code = code.replace('--font-sans: "Inter",', '--font-sans: "Manrope",');
  fs.writeFileSync('src/index.css', code);
}
