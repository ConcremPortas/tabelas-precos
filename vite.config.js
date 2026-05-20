import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const envScript = `<script>
window.__SUPABASE_URL__      = ${JSON.stringify(env.VITE_SUPABASE_URL      || '')};
window.__SUPABASE_ANON_KEY__ = ${JSON.stringify(env.VITE_SUPABASE_ANON_KEY || '')};
</script>`;

  return {
    plugins: [
      {
        name: 'inject-env-globals',
        transformIndexHtml(html) {
          // Injeta o bloco de env logo antes do primeiro script do app
          return html.replace(
            '<script src="src/js/data.js">',
            envScript + '\n<script src="src/js/data.js">'
          );
        },
      },
    ],
  };
});
