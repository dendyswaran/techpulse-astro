# TechPulse — Technology Updates, AI & Cybersecurity Digest (Astro v5)

A minimalist, Medium-inspired editorial publication built with **Astro v5** and **Astro Content Collections** (`src/content/articles/*.md`). Designed for reading comfort with editorial serif typography (`Source Serif 4`), clean UI metadata (`Plus Jakarta Sans`), code blocks (`JetBrains Mono`), and three persistent reading themes (**Light**, **Sepia**, **Dark**).

## Key Features

1. **Astro Content Collections + Zod Schema Validation (`src/content/config.ts`)**:
   - All stories are authored in Markdown inside `src/content/articles/*.md`.
   - Validated frontmatter schema: `title`, `subtitle`, `pubDate`, `updatedDate`, `category` (`ai`, `security`, `tech-update`, `tech-news`), `tags`, `readingTime`, `author`, `featured`, `tldr` (key bullet points), CVE metadata (`cveIds`, `severity`, `cvss`, `affectedVersions`, `patchedVersions`), and verified official `sources`.
2. **Medium-Inspired Minimalist Reading Experience**:
   - Centered `680px` reading column (`20px` / `1.25rem`, `line-height: 1.78`) with an editorial drop-cap lead paragraph.
   - Font size controls (`A-`, `A`, `A+`) and Reading Themes (**Light** `#FFFFFF`, **Sepia** `#F6F0E4`, **Dark** `#121212`) persisted in `localStorage`.
   - Inline expandable **Quick Summary (TL;DR)** accordions on the home feed and highlighted TL;DR cards at the top of every article.
   - Automatic **Security Vulnerability Advisory Card** for CVE articles.
   - **Instant Search Modal (`/`)** to search across titles, topics, and CVE IDs.
   - Local **Reading List (Bookmarks)** persisted in `localStorage`.
3. **Interactive Security & CVE Matrix Page (`/security`)**:
   - Filterable vulnerability tracker by runtime ecosystem (`Node.js`, `Bun`, `PHP`, `Java SE / GraalVM`) with CVSS scores, affected versions, and patched targets.

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server (http://localhost:4321)
npm run dev

# 3. Build static production output into ./dist
npm run build

# 4. Preview production build
npm run preview
```
