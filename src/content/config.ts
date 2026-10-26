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

export const collections = {
  articles: articlesCollection,
};
