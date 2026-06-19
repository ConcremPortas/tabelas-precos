const fs   = require('fs');
const path = require('path');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

copyDir('src/js', 'dist/src/js');
console.log('✓ src/js copiado para dist/src/js');

// Logo usada em runtime pelos PDFs (print) — não é processada pelo Vite,
// então precisa existir em dist/Logos para não dar 404 no deploy.
fs.mkdirSync('dist/Logos', { recursive: true });
fs.copyFileSync('Logos/logo-cores.png', 'dist/Logos/logo-cores.png');
console.log('✓ Logos/logo-cores.png copiado para dist/Logos');
