import { getCollection, type CollectionEntry } from 'astro:content';

export type TipEntry = CollectionEntry<'tips'>;
export type TipSource = TipEntry['data']['sources'][number];

export const DIFFICULTY_LABEL: Record<TipEntry['data']['difficulty'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

/** schema.org TechArticle.proficiencyLevel only knows Beginner / Expert. */
export const DIFFICULTY_PROFICIENCY: Record<TipEntry['data']['difficulty'], string> = {
  beginner: 'Beginner',
  intermediate: 'Beginner',
  advanced: 'Expert',
};

export const PLATFORM_LABEL: Record<TipSource['platform'], string> = {
  x: 'X',
  threads: 'Threads',
  web: 'Web',
};

/** "@handle" for social posts, plain name for web sources. */
export function sourceHandle(source: TipSource): string {
  if (source.platform === 'web') return source.handle;
  return `@${source.handle.replace(/^@/, '')}`;
}

/** Tips sorted newest first, each with a stable sequence number (oldest = 1). */
export async function getSortedTips(): Promise<Array<TipEntry & { number: number; label: string }>> {
  const tips = await getCollection('tips');
  const ascending = [...tips].sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf() || a.slug.localeCompare(b.slug)
  );
  const numbered = ascending.map((tip, idx) => ({
    ...tip,
    number: idx + 1,
    label: String(idx + 1).padStart(3, '0'),
  }));
  return numbered.reverse();
}

export function formatTipDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
}

export function isoDate(date: Date): string {
  return date.toISOString();
}
