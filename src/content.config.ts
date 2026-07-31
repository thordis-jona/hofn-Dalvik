import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const copy = defineCollection({
  loader: glob({ base: './src/content/copy', pattern: '**/*.md' }),
  schema: z.object({
    kicker: z.string().optional(),
    title: z.string(),
    imageAlt: z.string().optional(),
    note: z.string().optional(),
  }),
});

const guidebook = defineCollection({
  loader: glob({ base: './src/content/guidebook', pattern: '**/*.md' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    category: z.string(),
    link: z.string().url().optional(),
  }),
});

export const collections = { copy, guidebook };
