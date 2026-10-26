---
title: "October 2026 DevSecOps Patching Guide: Unified Checklist for Node.js, Bun, PHP, and Java"
subtitle: "An operational playbook and priority matrix for engineering teams remediating Brotli RCE, PHP2Shell, HTTP/3 QPACK DoS, and JSSE TLS vulnerabilities in a single sprint."
pubDate: 2026-10-26
category: "tech-update"
tags: ["DevSecOps", "Node.js", "Bun", "PHP", "Java", "Patch Management"]
readingTime: "6 min read"
author:
  name: "Dendy Swarandanu & Infrastructure Team"
  role: "Cloud & DevSecOps Practice"
featured: false
tldr:
  - "The fourth week of October 2026 brought simultaneous High and Critical security releases across four foundational server runtimes: Node.js, Bun, PHP, and Oracle Java SE."
  - "Priority #1 (24-Hour Emergency): Patch PHP to 8.5.12 / 8.4.27 to block active exploitation of PHP2Shell (CVE-2026-109618) and upgrade Node.js to 22.23.4 / 24.22.1 to remediate Brotli RCE (CVE-2026-111497)."
  - "Priority #2 (48-Hour Window): Upgrade Bun to 1.4.4 (including recompiling standalone binaries) and apply the October 2026 JSSE TLS patch across Java SE and GraalVM services."
  - "Includes a one-line read-only Linux audit script to inspect runtime versions across your fleet."
sources:
  - label: "Node.js October 2026 Security Releases Advisory"
    url: "https://nodejs.org/en/blog/vulnerability/october-2026-security-releases"
  - label: "Bun v1.4.4 Security Release Notes"
    url: "https://bun.com/blog/bun-v1.4.4"
---

It is rare for four foundational server runtimes—**Node.js, Bun, PHP, and Java**—to ship High and Critical security advisories within the exact same week. Yet that is precisely what unfolded during the fourth week of **October 2026**.

For VPs of Engineering, Tech Leads, and DevSecOps practitioners managing polyglot microservices, sifting through separate vendor bulletins slows down incident response. This guide consolidates all four runtime advisories into a **single operational execution matrix**.

## October 2026 Infrastructure Patching Priority Matrix

Use the quick-reference matrix below to validate compliance across your production environments today:

| Runtime | Primary CVE / Advisory | CVSS Score | Primary Risk Vector | Minimum Safe Target Version |
| :--- | :--- | :--- | :--- | :--- |
| **Node.js** | `CVE-2026-111497` (`+ 3 CVEs`) | **9.8 (Critical)** | Out-of-bounds write in Brotli decoder (`node:zlib` / `fetch`) & DNS NUL byte truncation. | **22.23.4**, **24.22.1**, or **26.12.1** *(Migrate off EOL Node 20!)* |
| **PHP** | `CVE-2026-109618`, `CVE-2026-109619` | **9.2 (Critical)** | Pre-Auth RCE ("PHP2Shell"); **active exploitation detected by AWS sensors**. | **8.5.12**, **8.4.27**, **8.3.36**, or **8.2.35** |
| **Bun** | `GHSA-cf8x-9m69-3gg3`, `CVE-2026-111497` | **9.2 (High)** | HTTP/3 QPACK memory amplification ("Header Accordions"), Brotli 1.2.1, & eMudhra CA removal. | **Bun 1.4.4** *(Must rebuild `bun build --compile` binaries)* |
| **Java SE / GraalVM** | `CVE-2026-91403` | **9.1 (Critical)** | Pre-Auth network vulnerability in **JSSE (TLS)**. | **October 2026 Out-of-Band Patch** for JDK 8, 11, 17, 21, 25, 27 |

## One-Line Read-Only Linux Fleet Audit Script

Run the following read-only bash snippet on any Linux host or container image to print an instant compliance summary of installed runtimes:

```bash
#!/usr/bin/env bash
echo "=== OCTOBER 2026 RUNTIME SECURITY AUDIT ==="
command -v node >/dev/null && echo "[Node.js] Installed: $(node -v) (Target: >= v22.23.4 / v24.22.1 / v26.12.1)"
command -v bun  >/dev/null && echo "[Bun]     Installed: $(bun -v) (Target: >= 1.4.4)"
command -v php  >/dev/null && echo "[PHP]     Installed: $(php -r 'echo PHP_VERSION;') (Target: >= 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35)"
command -v java >/dev/null && echo "[Java]    Installed: $(java -version 2>&1 | head -n 1)"
```

## Three Common Blind Spots During Runtime Patching

Based on real-world incident response across enterprise fleets, make sure your team avoids these three pitfalls:

1. **Stale Multi-Stage Docker Build Caches**: When running `docker build` in CI/CD with floating tags like `FROM node:22-alpine`, runners frequently reuse cached base layers pulled weeks ago. Pin explicit patch versions (`FROM node:22.23.4-alpine`) or pass `docker build --pull`.
2. **Self-Contained Compiled Binaries (`bun build --compile`)**: Upgrading the `bun` package on a host does not update standalone executables compiled with earlier versions. Identify all deployed single-file binaries and recompile them in your release pipeline.
3. **Forgotten Node.js 20 Workloads**: Legacy serverless functions and background queue workers still targeting `nodejs20.x` will **not** receive a fix for `CVE-2026-111497` because Node.js 20 is **End-of-Life (EOL)**. Upgrade those workloads to **Node.js 22 LTS (`22.23.4`)** or **Node.js 24 LTS (`24.22.1`)**.
