---
title: "Microsoft's November 2026 Patch Tuesday: One Exploited Outlook Bug, a Zero-Click Exchange Path Through Windows Search, and 30 Wormable CVEs"
subtitle: "About 1,090 new CVEs, 63 rated Critical. Patch Outlook first because CVE-2026-124194 is already being exploited, then Exchange servers (CVE-2026-116928), domain controllers (LDAP, CVE-2026-119958) and the developer stack: VS Code, Azure DevOps Server and SharePoint."
pubDate: 2026-11-11
category: "security"
tags: ["Microsoft", "Patch Tuesday", "Outlook", "Exchange Server", "Windows Search", "LDAP", "SharePoint", "VS Code", "Azure DevOps", "Zero-Day", "CVE"]
readingTime: "6 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
cveIds: ["CVE-2026-124194", "CVE-2026-116928", "CVE-2026-119958", "CVE-2026-118207", "CVE-2026-120002"]
severity: "CRITICAL"
cvss: 9.8
affectedVersions: "Microsoft 365 Apps / Office LTSC 2021 and 2024 (Outlook), Exchange Server Subscription Edition, Windows Server running LDAP and Windows Search, SharePoint Server Subscription Edition, VS Code, Azure DevOps Server; builds before the November 10, 2026 updates"
patchedVersions: "November 10, 2026 security updates; Office LTSC 2024 16.0.17932.21140, Office LTSC 2021 16.0.14334.21048; SharePoint Server Subscription Edition KB5002945"
coverImage: "/images/covers/microsoft-patch-tuesday-november-2026-outlook-zero-day-windows-search-ldap.webp"
coverAlt: "Gouache illustration of a dusty-rose office facade made of a dense grid of small slate-blue windows, with one terracotta window lit near the base and a cream envelope shape resting on its sill, on warm paper"
coverCaption: "Illustration by TechPulse Editorial · A thousand windows to close, and one of them is already open."
tldr:
  - "Microsoft's November 10 release fixes about 1,090 new CVEs (counts vary by tracker; BleepingComputer counts 1,235 including non-Microsoft CVEs), 63 rated Critical. It is the second month in a row above 1,000."
  - "Only one bug is exploited: CVE-2026-124194, an Outlook spoofing flaw (CVSS 6.5). A crafted message file makes Outlook connect to an attacker server without the external-content warning, leaking the user's NTLMv2 hash. Treat it as the top priority despite the low score."
  - "The worst server bug is CVE-2026-116928 (CVSS 9.8) in Windows Search, reachable through Exchange: an email attachment triggers code execution when the server indexes it. Nobody has to open anything. LDAP RCE CVE-2026-119958 (9.8) threatens domain controllers."
  - "ZDI counts 30 wormable CVEs (network, no auth, no user interaction) across Message Queuing, DNS, DHCP, Schannel, IIS and more. Developers should also patch VS Code (CVE-2026-120779, 9.6), Azure DevOps Server (CVE-2026-109467, 9.9) and SharePoint (CVE-2026-120002, 9.9)."
sources:
  - label: "Zero Day Initiative — The November 2026 Security Update Review"
    url: "https://www.zerodayinitiative.com/blog/2026/11/10/the-november-2026-security-update-review"
  - label: "Automox — November 2026 Patch Tuesday: Exchange, Outlook, SharePoint"
    url: "https://www.automox.com/blog/patch-fix-tuesday-november-2026"
  - label: "Dark Reading — November Patch Tuesday Offers an Overflowing Cornucopia of CVEs"
    url: "https://www.darkreading.com/vulnerabilities-threats/november-patch-tuesday-cornucopia-cves"
  - label: "CIS — Critical Patches Issued for Microsoft Products, November 10, 2026"
    url: "https://www.cisecurity.org/advisory/critical-patches-issued-for-microsoft-products-november-10-2026_2026-132"
  - label: "BleepingComputer — Microsoft November 2026 Patch Tuesday fixes 1,235 flaws, Outlook zero-day"
    url: "https://www.bleepingcomputer.com/news/microsoft/microsoft-november-2026-patch-tuesday-fixes-1-235-flaws-outlook-zero-day/"
---

Microsoft shipped its November 2026 updates on **November 10**. The Zero Day Initiative counts **about 1,090 new CVEs**, and Automox and Dark Reading count 1,093 with **63 rated Critical**. That makes two four-figure months in a row; October had roughly 1,400. There is **one bug under active attack** and none publicly disclosed in advance.

ZDI's Dustin Childs has a theory for why so few zero-days show up: AI "is better at reversing patches than it is at finding and exploiting bugs in closed-source software." Put differently, the risk window now opens after the patch ships. Don't let this month's updates sit in a ring for weeks.

## Patch first: the exploited Outlook bug

**CVE-2026-124194, Microsoft Outlook spoofing (CVSS 6.5, exploited).** An attacker sends a crafted message file. When the user opens it, Outlook connects to an attacker-controlled network location **without showing the usual external-content warning**, and that connection leaks the user's **NTLMv2 hash**. The attacker can then authenticate as that user, or crack the hash. The Preview Pane is not an attack vector, so someone has to open the file.

Ignore the moderate score. Microsoft has confirmed exploitation, so this goes first in your Office rollout. Fixed builds are **16.0.17932.21140** (Office LTSC 2024) and **16.0.14334.21048** (Office LTSC 2021), plus the current Microsoft 365 Apps channel builds.

## Servers: Exchange, domain controllers, SharePoint

| CVE | Component | CVSS | Why it matters |
| --- | --- | --- | --- |
| CVE-2026-116928 | Windows Search (via Exchange) | 9.8 | Zero-click: the server indexes a crafted attachment and runs attacker code. Nobody opens anything |
| CVE-2026-119958 | Windows LDAP | 9.8 | Unauthenticated out-of-bounds write via crafted LDAP calls. Runs in the LDAP service context, which is worst case on domain controllers |
| CVE-2026-118207 | Exchange Server SE | 8.8 | Any low-privilege login plus a crafted request equals code on the server, and Exchange usually holds broad AD rights. "Exploitation More Likely" |
| CVE-2026-119952 | Schannel | 8.1 | Unauthenticated network RCE, high complexity, but "Exploitation More Likely" |
| CVE-2026-120002 | SharePoint Server SE | 9.9 | Labeled only Important, but low-priv EoP with changed scope. KB5002945 |
| CVE-2026-110043 | Outlook Preview Pane | 8.8 | Third Preview Pane RCE in three months; one click to select the email |

Note that the Windows Search fix ships in the **Windows cumulative update on the Exchange server**. Applying the nine Exchange patches alone does not close CVE-2026-116928.

## The developer stack gets a big batch too

Several fixes this month land on tools developers run every day:

- **Visual Studio Code**: more than a dozen RCE and security-feature-bypass fixes, topped by **CVE-2026-120779 (9.6)**. Update VS Code and restart it. Extensions updating alone isn't enough.
- **Azure DevOps Server**: **CVE-2026-109467 (RCE, 9.9)** and an 8.8 privilege escalation (CVE-2026-85923). On-prem servers need the update; the cloud service is Microsoft's job.
- **Azure CLI** RCE (CVE-2026-109457, 8.0), **Azure Pipelines** RCE (CVE-2026-119989, 8.2), **ASP.NET Core** EoP (CVE-2026-114146, 9.0) plus seven DoS fixes, and **MSAL for Node.js / JavaScript** fixes (CVE-2026-108470, CVE-2026-108469).
- **SQL Server**: a long list, including **CVE-2026-116945 (RCE, 9.8)**.

## Wormable count: 30

ZDI counts **30 CVEs** that let an unauthenticated attacker run code over the network with no user interaction. The groups: Message Queuing (5), DNS (4), DHCP Server, Color Management, DirectMusic and Xbox (2 each), plus single entries in Exchange/Search, LDAP, Schannel, CredSSP, Deployment Services, IIS, NAT, RPC Runtime, Media Foundation, iSCSI, Virtual Filtering Platform, eSCL Scanner and Modern Device Management. Network-facing DNS, DHCP, LDAP and Exchange servers should go in the first wave.

## A practical order

```text
Day 0   Outlook / Microsoft 365 Apps (CVE-2026-124194, exploited)
        Exchange servers: Windows CU + Exchange SU (CVE-2026-116928, -118207)
Day 1-2 Domain controllers (LDAP CVE-2026-119958), DNS/DHCP servers
        SharePoint SE (KB5002945), Azure DevOps Server, SQL Server
Day 2-3 Developer workstations: VS Code, Visual Studio, Azure CLI, .NET SDK/runtime
Week 1  Everything else in the Windows/Office cumulative updates
```

While the Outlook patch rolls out, the usual NTLM-leak hardening still helps: block outbound **SMB (TCP 445)** at the perimeter so fewer forced connections reach the internet, and put privileged accounts in the **Protected Users** group so their NTLM credentials aren't usable.

**Adobe** shipped the same day: 110 CVEs in nine bulletins, with **Adobe Connect** (24 CVEs, top CVSS 10.0) and **Experience Manager** (four 9.9 Criticals) as the priorities. Neither is known to be exploited.
