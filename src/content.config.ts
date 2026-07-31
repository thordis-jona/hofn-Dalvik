import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const seoSchema = z.object({
  title: z.string().min(5).max(120).optional(),
  description: z.string().min(15).max(160).optional(),
  pageType: z.enum(['website', 'article']).default('website'),
});

const copy = defineCollection({
  loader: glob({ base: './src/content/copy', pattern: '**/*.md' }),
  schema: z.object({
    kicker: z.string().optional(),
    title: z.string(),
    imageAlt: z.string().optional(),
    note: z.string().optional(),
    seo: seoSchema.optional(),
  }),
});

const guidebook = defineCollection({
  loader: glob({ base: './src/content/guidebook', pattern: '**/*.md' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    category: z.string(),
    image: z.string().min(1).optional(),
    imageAlt: z.string().min(10).optional(),
    imageSource: z.string().url().optional(),
    link: z.string().url().optional(),
    seo: seoSchema.optional(),
  }),
});

export const collections = { copy, guidebook };
