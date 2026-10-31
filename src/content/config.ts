import { defineCollection, z } from 'astro:content';

const articlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(['ai', 'security', 'tech-update', 'tech-news']),
    tags: z.array(z.string()),
    readingTime: z.string(),
    author: z.object({
      name: z.string(),
      role: z.string(),
      avatar: z.string().optional(),
    }),
    featured: z.boolean().default(false),
    coverImage: z.string().optional(),
    coverAlt: z.string().optional(),
    coverCaption: z.string().optional(),
    tldr: z.array(z.string()),
    cveIds: z.array(z.string()).optional(),
    severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM']).optional(),
    cvss: z.number().optional(),
    affectedVersions: z.string().optional(),
    patchedVersions: z.string().optional(),
    sources: z.array(
      z.object({
        label: z.string(),
        url: z.string().url(),
      })
    ),
  }),
});

const tipsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).min(1),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    author: z.object({
      name: z.string().default('Mazzden'),
    }).default({ name: 'Mazzden' }),
    sources: z
      .array(
        z.object({
          handle: z.string(),
          platform: z.enum(['x', 'threads', 'web']),
          url: z.string().url(),
          note: z.string().optional(),
        })
      )
      .min(1),
    coverImage: z.string().optional(),
  }),
});

export const collections = {
  articles: articlesCollection,
  tips: tipsCollection,
};
