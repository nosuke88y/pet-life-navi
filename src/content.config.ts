import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 記事コレクションの共通スキーマ
const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()),
});

const dog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dog' }),
  schema: articleSchema,
});

const cat = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cat' }),
  schema: articleSchema,
});

const dogCare = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dog-care' }),
  schema: articleSchema,
});

const catCare = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cat-care' }),
  schema: articleSchema,
});

export const collections = { dog, cat, 'dog-care': dogCare, 'cat-care': catCare };
