const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

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

// Os scripts de src/js não passam pelo Vite (não são módulos), então saem sem hash
// no nome e o navegador serve a versão em cache mesmo depois de um deploy novo.
// Aqui cada <script src="src/js/x.js"> ganha ?v=<hash do conteúdo>.
const indexPath = 'dist/index.html';
let html = fs.readFileSync(indexPath, 'utf8');
let versionados = 0;

html = html.replace(/(<script\s+src=")(src\/js\/[^"?]+\.js)("[^>]*>)/g, (m, ini, arquivo, fim) => {
  const conteudo = fs.readFileSync(path.join('dist', arquivo));
  const hash = crypto.createHash('md5').update(conteudo).digest('hex').slice(0, 8);
  versionados++;
  return `${ini}${arquivo}?v=${hash}${fim}`;
});

fs.writeFileSync(indexPath, html);
console.log(`✓ ${versionados} scripts de src/js versionados com hash de conteúdo`);
