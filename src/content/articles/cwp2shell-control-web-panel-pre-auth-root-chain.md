---
title: "CWP2Shell: Ten New Control Web Panel Bugs Turn a Login Page Into Root"
subtitle: "VulnCheck's November 3 disclosure shows how a missing exit() after a 302 in Control Web Panel's user panel opens an unauthenticated path to root. Upgrade to 1.29 or later."
pubDate: 2026-11-04
category: "security"
tags: ["Control Web Panel", "CWP", "CWP2Shell", "CVE-2026-73695", "CVE-2026-73696", "Pre-Auth RCE", "Hosting Panels", "VulnCheck"]
readingTime: "6 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
cveIds: ["CVE-2026-73695", "CVE-2026-73696", "CVE-2026-73697", "CVE-2026-77876", "CVE-2026-77877", "CVE-2026-77878", "CVE-2026-77879", "CVE-2026-77880", "CVE-2026-77881", "CVE-2026-104080"]
severity: "CRITICAL"
cvss: 9.8
affectedVersions: "Control Web Panel (CWP) before 1.29 (pre-auth entry closed in 1.12; user-panel sinks closed in 1.16; root-owned user API closed in 1.27/1.29)"
patchedVersions: "CWP 1.29 or later (1.30 is the current release as of November 3, 2026)"
coverImage: "/images/covers/cwp2shell-control-web-panel-pre-auth-root-chain.webp"
coverAlt: "Risograph-style illustration of a tall cream panel door with a soft terracotta 302 stamp and a small ink side path leading past it"
coverCaption: "Illustration by TechPulse Editorial · The login page said no. The server kept going."
tldr:
  - "On November 3, 2026, VulnCheck disclosed ten CVEs in Control Web Panel (formerly CentOS Web Panel), tracked as CWP2Shell. The chain starts on the user panel (port 2083) and ends at root via a loopback API on port 2302."
  - "The front door is a redirect without exit(): an unauthenticated request gets a 302 to /login, then the dispatcher still includes a module file named by the attacker (CVE-2026-73695 + CVE-2026-73696)."
  - "Stage scores: pre-auth RCE as the hosting user is 9.8; the loopback root sinks are 8.8 each; chained unauthenticated-to-root is 10.0. VulnCheck counts roughly 19,834 hosts with the user panel exposed."
  - "All ten are fixed in CWP 1.29 (October 31). Anything before 1.12 is unauthenticated-to-root; anything before 1.29 still lets a hosting account become root. Keep 2083 and the admin ports off the public internet."
sources:
  - label: "VulnCheck — CWP2Shell: The Login Page That Never Says No"
    url: "https://www.vulncheck.com/blog/control-web-panel-pre-auth-module-dispatch-rce"
  - label: "NVD — CVE-2026-73695"
    url: "https://nvd.nist.gov/vuln/detail/CVE-2026-73695"
  - label: "VulnCheck — Control Web Panel path traversal LFI advisory (CVE-2026-73695)"
    url: "https://www.vulncheck.com/advisories/control-web-panel-cwp-path-traversal-lfi-via-module-parameter"
---

A hosting control panel's job is to keep low-privilege users away from privileged actions. On **Control Web Panel (CWP)**, formerly CentOS Web Panel, that boundary was one keyword thick. On **November 3, 2026**, VulnCheck's Initial Access Intelligence team published **CWP2Shell**: ten coordinated CVEs that turn the user-panel login page into an unauthenticated path to **root**.

## What the chain looks like

CWP fronts everything with a custom nginx. The user panel listens on **port 2083**. A small **user API** on `127.0.0.1:2302` runs as root and talks to MySQL as `root@localhost`. That loopback service is supposed to be unreachable from the internet. The chain never needs it to be: it gets a foothold as a hosting user first, then talks to 2302 from inside the box.

**Stage 1 — the login page that never says no.** When an anonymous request hits `/<account>/`, the dispatcher emits `Location: /login/...` and then keeps running. There is no `exit()` after the redirect (**CVE-2026-73696**, CWE-698). Execution falls through to a file-scope `include_once` whose module name comes from `$_GET['module']`. The anti-XSS filter leaves `../` alone, so that include is a path-traversal LFI (**CVE-2026-73695**, CWE-98).

**Stage 1 sinks — modules that trusted the gate.** The panel's feature modules assume the dispatcher already authenticated the caller. They don't check again. Two of them are enough:

- `phpini_editor` (**CVE-2026-73697**): an arbitrary file write plus an unquoted `rm -f` shell-out.
- `protected_directory` (**CVE-2026-77876**): an unquoted `sed` shell-out.

Either sink gives code execution as the hosting account. The attacker needs one real account name; the panel itself is the oracle (`302` if the account exists, `404` if it doesn't).

**Stages 2 and 3 — root on loopback.** From that foothold, the root-owned user API has two independent paths up:

- Ungated routes (**CVE-2026-77877**) reach command injections such as `/v1/restoredatabase/` (**CVE-2026-77878**) and `/v1/valid_token/` (**CVE-2026-104080**).
- A SQL injection in the API's `access_token()` gate (**CVE-2026-77879**) forges past auth into `/v1/newpass/` (**CVE-2026-77880**), which runs `passwd` as root. A second blind SQL injection (**CVE-2026-77881**) reads the database as MySQL root.

VulnCheck scores the pre-auth stage **9.8**, each root sink **8.8**, and the full unauthenticated-to-root chain **10.0** once scope change is counted. Those are stage scores; each CVE is scored on its own.

## Why this keeps coming back

CWP already shipped a patch for **CVE-2025-48703**, the last KEV-listed user-panel RCE. VulnCheck tested a CWP7 build that returns `403` to that published exploit and still runs a command through the module next door. The 48703 fix hardened one module. It did not put `exit()` behind the redirect, and it did not harden every other module that resolves out of the `module` parameter.

The admin panel, in the same codebase, does the right thing: it calls `exit()` on failed auth and allow-lists the module name. The user panel is the same pattern with those two controls missing. As VulnCheck puts it, a login page has one job: to say no. CWP's user panel says no in the status line and then keeps working anyway.

## Exposure and the public exploit

As of November 3, VulnCheck Target Intelligence counts **118,151** CWP service observations, including **19,834** on the 2083 user-panel port. ZoomEye and Shodan give larger and smaller counts depending on the fingerprint; treat them as an order of magnitude, not a census. VulnCheck also published a go-exploit module that fingerprints the panel, plants an in-band webshell through `phpini_editor`, and relays to root through the user API. The only required input is one account name.

## What to do

| Build | Status |
| --- | --- |
| Before 1.12 | Unauthenticated to root |
| 1.12 – 1.28 | Pre-auth entry closed; any hosting account can still reach root via the user API |
| **1.29+** | All ten fixed (1.30 is current) |

1. **Upgrade to CWP 1.29 or later.** Confirm the build, don't trust a changelog that only said "Security improvements" for the early fixes.
2. **Take the panels off the internet.** Put 2083 (user) and 2031/2087 (admin) behind an allowlist or VPN. The user API on 2302 should already be loopback-only; verify that.
3. **Assume exposure if you were on an unpatched build with 2083 public.** Hunt for unexpected files under `/tmp`, unusual `phpini_editor` or `protected_directory` traffic, and outbound connections from hosting accounts to `127.0.0.1:2302`.
4. **Rotate credentials** for hosting accounts and MySQL if compromise is suspected.

CWP fixed this in stages (1.12, then 1.16, then 1.27/1.29), and VulnCheck verified every step against ionCube-decoded source rather than the changelog alone. The lesson for operators is the same as for every other edge panel this year: a cosmetic 302 is not a closed door.
