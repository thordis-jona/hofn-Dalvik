import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://hofn-dalvik.example',
  output: 'server',
  adapter: cloudflare(),
});
