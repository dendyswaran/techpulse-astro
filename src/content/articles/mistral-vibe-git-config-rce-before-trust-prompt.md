---
title: "Three Mistral Vibe CVEs: Opening a Crafted Repo Ran Code Before the Trust Prompt"
subtitle: "VulnCheck published CVE-2026-122133, CVE-2026-122134, and CVE-2026-122135 on November 4. Only Vibe 3.0.3 or later closes all three Git-config execution paths."
pubDate: 2026-11-06
category: "security"
tags: ["Mistral", "Mistral Vibe", "CVE-2026-122133", "CVE-2026-122134", "CVE-2026-122135", "Coding Agents", "Git", "RCE"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: true
coverImage: "/images/covers/mistral-vibe-git-config-rce-before-trust-prompt.webp"
coverAlt: "Soft editorial illustration of an open folder revealing code lines, linked by a thin wire to a terracotta hexagon on warm paper"
coverCaption: "Illustration by TechPulse Editorial · The trust prompt is not a time machine."
tldr:
  - "On November 4, 2026, VulnCheck published three High CVEs (CVSS 3.1 8.8 / CVSS 4.0 8.6) against Mistral Vibe; all fire when a user opens a crafted repository, before Vibe's trust prompt."
  - "CVE-2026-122133 (Windows): untrusted search path for git.exe in the repo root, fixed in 2.25.5. CVE-2026-122134: malicious Git clean/process filters via git status, fixed in 2.25.7. CVE-2026-122135: repository-configured gpg.program via git log, fixed only in 3.0.3."
  - "Releases 2.25.8 and 2.26.1 still carry the third flaw—upgrade to 3.0.3 or later (3.1.0 is current) rather than stopping at 2.25.7."
  - "Mistral's public advisory index still lists only MAI-2026-003 for earlier Vibe shell permission issues; these three are documented via VulnCheck, NVD, and the GitHub Advisory Database."
cveIds: ["CVE-2026-122133", "CVE-2026-122134", "CVE-2026-122135"]
severity: "HIGH"
cvss: 8.8
affectedVersions: "Mistral Vibe < 2.25.5 (CVE-2026-122133, Windows); < 2.25.7 (CVE-2026-122134); < 3.0.3 (CVE-2026-122135). 2.25.8 and 2.26.1 still vulnerable to the third."
patchedVersions: "Vibe 3.0.3 or later covers all three; intermediate floors are 2.25.5 and 2.25.7 for the first two only"
sources:
  - label: "VulnCheck — Mistral Vibe before 2.25.7 Code Execution via Git Filter Drivers"
    url: "https://www.vulncheck.com/advisories/mistral-vibe-before-2.25.7-code-execution-via-git-filter-drivers"
  - label: "GitHub Advisory GHSA-3fw5-5q64-5hwx (CVE-2026-122134)"
    url: "https://github.com/advisories/GHSA-3fw5-5q64-5hwx"
  - label: "GitHub Advisory GHSA-qx7j-gch3-gv7c (CVE-2026-122135)"
    url: "https://github.com/advisories/GHSA-qx7j-gch3-gv7c"
  - label: "VibeIncidents — Three Mistral Vibe CVEs before the trust prompt"
    url: "https://vibeincidents.com/incidents/mistral-vibe-repo-open-code-execution-cves-2026-11/"
  - label: "Mistral — Security advisories index"
    url: "https://docs.mistral.ai/resources/security-advisories"
---

Coding agents that inspect a repository on open are one bad `.git/config` away from running attacker code. On **November 4, 2026**, VulnCheck published three High-severity CVEs against **Mistral Vibe** that do exactly that—and they run **before** the trust prompt that is supposed to gate untrusted projects.

## The three paths

All three share a timing failure: Vibe reads Git state at session start, and whatever the repository's own Git configuration points at executes with the user's privileges first.

**CVE-2026-122133 (CWE-427, Windows only).** Before **2.25.5**, Vibe could pick up a `git.exe` planted in the repository root via an untrusted search path. Session startup code ran that binary before any trust UI. Fixed in **v2.25.5** (September 18, 2026).

**CVE-2026-122134 (CWE-829).** Before **2.25.7**, opening a crafted repo let malicious Git **clean** or **process** filter drivers fire when `ProjectContextProvider._fetch_git_status` ran `git status`. No Windows required. A repository extracted from an archive can carry its own `.git/config`; a plain `git clone` does not copy the sender's config. Fixed in **v2.25.7** (September 22, 2026). VulnCheck scores it **CVSS 4.0 8.6** / **CVSS 3.1 8.8**.

**CVE-2026-122135 (CWE-829).** Before **3.0.3**, a repo that sets `gpg.program` and `log.showSignature` on a signed commit made `git log` run the attacker's program during project-context collection. Fixed in **v3.0.3** (October 26, 2026).

Credit on all three goes to **Francisco Rosales of Manifold Security**. There are no public reports of in-the-wild exploitation as of the disclosure write-ups.

## The version trap

It is easy to read "fixed in 2.25.7" and stop. That is wrong for this batch. **v2.25.8** (last 2.25) and **v2.26.1** (last 2.26) still call `git log` without `--no-show-signature`, so CVE-2026-122135 survives on both lines through **3.0.2**. The safe floor for all three is **3.0.3 or later**; **3.1.0** is the current release called out in incident tracking.

Mistral's own advisory index still features **MAI-2026-003** (September 14, 2026) for earlier Vibe shell-permission issues and does not yet list a dedicated advisory for these three Git-config CVEs. The durable public records are VulnCheck, NVD (Received), and the GitHub Advisory Database entries published minutes after the CVEs.

## What to do

1. Run `vibe --version`. Anything below **3.0.3** leaves at least one of the three open—move to **3.0.3+**.
2. Before opening a repo you did not write, inspect `.git/config` for `gpg.program`, `log.showSignature`, `filter` / `clean` / `process` entries, and on Windows check the root for a planted `git.exe`.
3. Prefer a fresh **clone** over opening a downloaded archive in place, and keep approval prompts on while you survey unfamiliar projects.

## The pattern for every coding agent

Any tool that auto-runs `git status`, `git log`, or a project-local Git binary before a trust gate inherits this class of bug. If you build or configure coding agents, treat repository-local Git configuration as untrusted input until the user has explicitly approved the workspace—and pin your agent CLI past the fixed floor, not merely "a recent 2.x."
