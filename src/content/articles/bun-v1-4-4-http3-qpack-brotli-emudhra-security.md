---
title: "Bun v1.4.4 Released: Fixing the 'Header Accordions' HTTP/3 QPACK DoS & eMudhra CA Revocation"
subtitle: "Why upgrading to Bun 1.4.4 is essential to prevent HTTP/3 memory amplification, patch Brotli CVE-2026-111497, and rebuild standalone compiled binaries."
pubDate: 2026-10-23
category: "security"
tags: ["Bun", "HTTP/3", "QPACK", "CVE-2026-111497", "GHSA-cf8x-9m69-3gg3", "TLS"]
readingTime: "6 min read"
author:
  name: "Mazzden"
  role: "Infrastructure & Security Lead"
featured: false
tldr:
  - "GHSA-cf8x-9m69-3gg3 (CVSS 9.2 High): An HTTP/3 QPACK decompression amplification attack dubbed 'Header Accordions' allows a 20 KB payload to stall the CPU and 6 MB to exhaust 2 GB of RAM when http3: true is enabled."
  - "Updates the bundled Brotli library to version 1.2.1 to remediate the critical CVE-2026-111497 out-of-bounds write flaw."
  - "GHSA-26q8-h657-pf84: Removes 8 compromised eMudhra (emSign) intermediate Certificate Authority keys from Bun's built-in root trust store."
  - "Developers distributing standalone executables via 'bun build --compile' must recompile their binaries using Bun v1.4.4."
cveIds: ["GHSA-cf8x-9m69-3gg3", "CVE-2026-111497", "GHSA-26q8-h657-pf84"]
severity: "HIGH"
cvss: 9.2
affectedVersions: "Bun < 1.4.4"
patchedVersions: "Bun 1.4.4"
sources:
  - label: "Bun Official Blog — Bun v1.4.4 Release Notes"
    url: "https://bun.com/blog/bun-v1.4.4"
  - label: "GitHub Security Advisory GHSA-cf8x-9m69-3gg3 (QPACK HTTP/3 DoS)"
    url: "https://github.com/oven-sh/bun/security/advisories/GHSA-cf8x-9m69-3gg3"
  - label: "GitHub Security Advisory GHSA-26q8-h657-pf84 (eMudhra CA Removal)"
    url: "https://github.com/oven-sh/bun/security/advisories/GHSA-26q8-h657-pf84"
coverImage: "/images/covers/bun-v1-4-4-http3-qpack-brotli-emudhra-security.webp"
coverAlt: "Editorial illustration of a folded paper accordion book beside a ceramic teacup on a wooden table"
coverCaption: "Illustration by TechPulse Editorial · Mitigating QPACK header amplification and root store trust shifts in Bun v1.4.4."
---

One day after the October 2026 Node.js security bulletin, the **Bun** team shipped **Bun v1.4.4**, patching three high-impact vulnerabilities affecting `Bun.serve()`, data decompression APIs, and outbound TLS certificate validation.

If your team runs Bun in production—especially with **HTTP/3 (`http3: true`)** enabled—or ships standalone CLI tools and microservices compiled via `bun build --compile`, upgrading to `1.4.4` should be scheduled immediately.

## 1. GHSA-cf8x-9m69-3gg3: The "Header Accordions" HTTP/3 QPACK Attack

The headline fix in Bun v1.4.4 addresses an asymmetric Denial of Service (DoS) technique dubbed **"Header Accordions"** (`GHSA-cf8x-9m69-3gg3`, rated **CVSS 9.2 High**). The vulnerability targets Bun's implementation of **QPACK**, the header compression format used by HTTP/3 over QUIC.

Unlike HTTP/2's HPACK over ordered TCP streams, QPACK utilizes a dynamic table that allows compact, repeated references to previously inserted header entries. In Bun versions prior to `1.4.4`, the decoder lacked strict bounds on the expansion ratio between compressed header blocks received from the network and the resulting heap allocations.

### How Severe Is the Amplification Ratio?

According to benchmark data published in the official security advisory:

- Sending just **20 KB** of specially crafted QUIC/HTTP/3 packets is sufficient to lock up the event loop and **stall the CPU**.
- Sending roughly **6 MB** of malicious traffic forces the Bun process to allocate over **2 GB of RAM**, rapidly triggering the Linux kernel's Out-Of-Memory (OOM) killer.

> Good news for default deployments: `Bun.serve()` does not enable HTTP/3 unless explicitly configured. `GHSA-cf8x-9m69-3gg3` only affects servers where `http3: true` is turned on.

## 2. Brotli 1.2.1 Upgrade for CVE-2026-111497

Just like Node.js, Bun bundles the native C `brotli` library to power `zlib.brotliDecompress*`, `DecompressionStream("brotli")`, and automatic response decompression in `fetch()`.

Bun v1.4.4 upgrades its internal Brotli dependency to **v1.2.1**, completely closing the **CVE-2026-111497** out-of-bounds write vulnerability.

## 3. GHSA-26q8-h657-pf84: Removal of 8 Compromised eMudhra (`emSign`) Intermediate CAs

The third security fix hardens Bun's cryptographic trust store. Under advisory **GHSA-26q8-h657-pf84**, Bun permanently removes **8 compromised intermediate Certificate Authority (CA) keys belonging to eMudhra (`emSign`)** from its bundled root store.

Without this update, outbound TLS connections relying on Bun's default certificate bundle could remain vulnerable to spoofing via certificates chained to those revoked intermediates.

## Critical Reminder: Recompile `bun build --compile` Binaries

One of Bun's most popular features is packaging TypeScript applications and the Bun runtime into a single self-contained executable via `bun build --compile`.

Because those standalone executables **embed the older Bun runtime binary inside the output file**, merely upgrading Bun on your host machine will not patch already-compiled artifacts. You must rebuild and redeploy all standalone binaries:

```bash
# 1. Upgrade Bun to v1.4.4
bun upgrade

# 2. Verify the active runtime version
bun --version
# Expected output: 1.4.4

# 3. Recompile all standalone production binaries
bun build ./src/index.ts --compile --outfile ./dist/app-server
```

For Docker deployments, update your base image tags to `oven/bun:1.4.4` or `oven/bun:1.4.4-slim` and trigger a clean image build without cached base layers.
