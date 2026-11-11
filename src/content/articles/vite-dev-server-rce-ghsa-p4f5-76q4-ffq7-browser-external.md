---
title: "Vite Dev Server RCE (GHSA-p4f5-76q4-ffq7): One HTTP Request to an Exposed `vite --host` Runs Code on Your Machine"
subtitle: "An unescaped module ID in the __vite-browser-external and __vite-optional-peer-dep virtual modules lets a network attacker read files outside the allow list and get eval'd code on the dev server. Vite 4.0 through 8.3.6 are affected; upgrade to 8.3.7, 8.2.5, 8.1.7, 7.3.8 or 6.4.6."
pubDate: 2026-11-11
category: "security"
tags: ["Vite", "npm", "JavaScript", "Dev Server", "RCE", "Rolldown", "Supply Chain", "GHSA"]
readingTime: "4 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
cveIds: ["GHSA-p4f5-76q4-ffq7"]
severity: "CRITICAL"
cvss: 9.1
affectedVersions: "vite >=4.0.0 <=6.4.5, >=7.0.0 <=7.3.7, >=8.0.0 <=8.1.6, >=8.2.0 <=8.2.4, >=8.3.0 <=8.3.6; vite-plus <=1.5.0 — only when the dev server is exposed to the network (--host or server.host)"
patchedVersions: "vite 8.3.7, 8.2.5, 8.1.7, 7.3.8, 6.4.6; vite-plus 1.5.1 (Vite 8.3.7/8.2.5 rely on Rolldown 1.2.17, 8.1.7 on Rolldown 1.1.7)"
coverImage: "/images/covers/vite-dev-server-rce-ghsa-p4f5-76q4-ffq7-browser-external.webp"
coverAlt: "Risograph-style illustration of a small ochre workshop with its wide front window propped open toward a sage field, and a thin ink thread running from the field through the window to a desk inside"
coverCaption: "Illustration by TechPulse Editorial · The workshop was never meant to face the street."
tldr:
  - "GHSA-p4f5-76q4-ffq7 (Critical; its CVSS v4 vector AV:N/AC:L/AT:P/PR:N/UI:N/VC:H/VI:H scores 9.1) lets anyone who can reach a Vite dev server run arbitrary code on it with crafted HTTP requests. Published November 10, 2026."
  - "Only dev servers exposed to the network are affected: started with --host or with server.host set. The default localhost-only server is not reachable by this attack."
  - "Root cause: the __vite-browser-external: and __vite-optional-peer-dep: virtual modules embedded the URL-derived module ID without escaping. Injected imports bypass the server.fs allow list, and Vite's eval for new Worker / import.meta.glob runs injected code (globalThis.process.getBuiltinModule gets around the blocked globals)."
  - "Upgrade to vite 8.3.7, 8.2.5, 8.1.7, 7.3.8 or 6.4.6 (vite-plus 1.5.1), and stop exposing dev servers on shared networks, cloud IDEs and CI preview boxes."
sources:
  - label: "GitHub Security Advisory — vitejs/vite GHSA-p4f5-76q4-ffq7"
    url: "https://github.com/vitejs/vite/security/advisories/GHSA-p4f5-76q4-ffq7"
---

The Vite team published a **Critical** advisory on **November 10, 2026**: **GHSA-p4f5-76q4-ffq7**, "Remote code execution using `__vite-browser-external` virtual module." No CVE ID was listed when we checked. It covers every major line from **Vite 4.0 to 8.3.6**, plus `vite-plus` up to 1.5.0.

The condition that matters: the attack only works if your **dev server is reachable over the network**. That is what `vite --host`, `server.host: true` or `server.host: '0.0.0.0'` do, and it's common in Docker setups, cloud IDEs, devcontainers, "test on my phone" workflows and CI preview environments.

## How the bug works

Vite's resolver plugin creates two virtual modules, `__vite-browser-external:<id>` and `__vite-optional-peer-dep:<id>`. The `<id>` part comes from the request URL and was **embedded into generated module code without escaping**. So a crafted URL can inject JavaScript into a module that Vite trusts. That leads to two problems:

1. **File read past `server.fs`.** Files that a module imports are treated as allowed. Inject `import '/@fs/path/to/secret'` and a file that normally returns **403 Restricted** becomes fetchable. The advisory's PoC reads a file in `/tmp` this way.
2. **Code execution on the server.** Vite uses `eval` to pull values out of module code for `new Worker` and `import.meta.glob`. Injected code inside that path runs in the Node process. Vite hides a few globals like `require` and `exports`, but the advisory notes this "is not a security boundary," and `globalThis.process.getBuiltinModule` gets around it.

A dev server process usually holds your source, `.env` files, cloud credentials in the environment and SSH agent access, so code execution there is a serious compromise.

In Vite 8 the vulnerable code sits in the **Rolldown** binary. Vite 8.3.7 and 8.2.5 depend on the fix in Rolldown 1.2.17, and 8.1.7 on Rolldown 1.1.7. The report was marked as submitted with AI assistance.

## Fixed versions

| Line | Vulnerable | Fixed |
| --- | --- | --- |
| 8.3 | 8.3.0 – 8.3.6 | **8.3.7** |
| 8.2 | 8.2.0 – 8.2.4 | **8.2.5** |
| 8.0 / 8.1 | 8.0.0 – 8.1.6 | **8.1.7** |
| 7.x | 7.0.0 – 7.3.7 | **7.3.8** |
| 4.x – 6.x | 4.0.0 – 6.4.5 | **6.4.6** |
| vite-plus | ≤ 1.5.0 | **1.5.1** |

## What to do

```sh
# See which Vite version(s) you actually resolve (frameworks pin their own)
npm ls vite            # or: pnpm why vite / yarn why vite

# Upgrade within your major line
npm i -D vite@^8.3.7   # or 7.3.8 / 6.4.6 for older lines

# Find dev servers that are exposed on purpose
rg -n "server:\s*\{[^}]*host|--host" vite.config.* package.json
```

- **Check framework lockfiles.** Astro, SvelteKit, Nuxt, Remix/React Router, Vitest and Storybook all pull in Vite transitively. Make sure the lockfile resolves to a fixed version, not just your direct dependency.
- **Don't publish dev servers.** If you need LAN or container access, bind to a specific interface, put the server behind an authenticated tunnel, or use `vite preview` on a built bundle for demos. A dev server is not a production server.
- **Cloud IDEs and preview boxes:** treat any internet-reachable Vite dev URL that ran a vulnerable version as possibly compromised. Rotate the secrets that process could see.
