import { cpSync, mkdirSync } from 'fs';

mkdirSync('dist/src/js', { recursive: true });
cpSync('src/js', 'dist/src/js', { recursive: true });
console.log('✓ src/js copiado para dist/src/js');
