import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://hofn.manifesto.is',
  output: 'server',
  adapter: cloudflare(),
});
