import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://hofn.manifesto.is',
  output: 'server',
  adapter: cloudflare(),
  integrations: [react()],
});
