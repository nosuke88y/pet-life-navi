import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 記事コレクションの共通スキーマ
const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()),
  affiliateLinks: z
    .array(
      z.object({
        label: z.string(),
        url: z.string(),
      })
    )
    .optional(),
});

const dog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dog' }),
  schema: articleSchema,
});

const cat = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cat' }),
  schema: articleSchema,
});

export const collections = { dog, cat };
