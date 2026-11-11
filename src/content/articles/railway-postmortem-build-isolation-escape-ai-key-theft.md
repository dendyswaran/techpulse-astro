---
title: "Railway's Postmortem: A Build Escape, a Too-Trusted Credential and a Bad OIDC Binding Exposed AI Keys for Up to 100,000 Workspaces"
subtitle: "Railway's November 10 incident report traces the October 20–21 attack from a partial filesystem escape on shared build VMs to decrypted customer variables. The attacker went after AI provider keys, and stolen-key spend reached about $740,000."
pubDate: 2026-11-11
category: "tech-news"
tags: ["Railway", "PaaS", "Incident Report", "Build Isolation", "OIDC", "Secrets", "AI API Keys", "LLMjacking", "Platform Security"]
readingTime: "6 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/railway-postmortem-build-isolation-escape-ai-key-theft.webp"
coverAlt: "Ink-and-wash illustration of a long low building divided into identical terracotta rooms, one shared wall with a thin ink crack, and a row of small brass keys hanging from a rail above the roof, on sage and cream paper"
coverCaption: "Illustration by TechPulse Editorial · Shared walls, separate rooms, and a key rack someone could see through the crack."
tldr:
  - "Railway published its full incident report on November 10, 2026. On October 20 an attacker partially escaped filesystem isolation on Railway's multi-tenant build VMs and read a build credential from the host."
  - "That credential was meant only for registry pushes, but Railway's internal Temporal cluster accepted it as a trusted client. The attacker read 353 build histories, including variables, and pulled a copy of Railway's internal monorepo from build cache snapshots."
  - "With the source code, the attacker found a misconfigured OIDC binding in CI, got short-lived cloud credentials, then an SSH key and a long-lived decryption credential on an orchestration machine. Up to 1.85% of workspaces (~100,000) may have had variables decrypted, and 1,852 users had BYOK/GitHub tokens exposed."
  - "Queries targeted AI provider keys by name. Unauthorized spend on stolen keys is estimated at ~$740,000, which Railway is working to refund. Builds now run on single-tenant VMs on top of the old isolation layer."
sources:
  - label: "Railway — Incident Report: October 21st Security Attack (Nov 10, 2026)"
    url: "https://blog.railway.com/p/incident-report-october-security-incident"
  - label: "Postmortem.io — Railway preliminary report, Oct 21 security incident"
    url: "https://postmortem.io/incidents/railway--2026-10-20--preliminary-report-security-incident/"
  - label: "Cybersixt — Railway traces AI key theft to a build isolation escape"
    url: "https://cybersixt.com/originals/railway-traces-ai-key-theft-to-a-build-isolation-escape"
  - label: "BleepingComputer — Railway breach leads to $740,000 in fraudulent AI charges"
    url: "https://www.bleepingcomputer.com/news/apple/railway-breach-leads-to-740-000-in-fraudulent-ai-charges/"
---

Railway, the app-hosting platform, published its full report on the **October 20–21** breach on **November 10, 2026**. It's one of the most detailed public postmortems of the current wave of **AI-key theft** attacks on developer platforms. Railway itself lists OpenCode, Warp and Fireworks AI as reporting similar thefts between October 6 and 23. Each step in the chain is a pattern other platforms can check for in their own systems.

## The chain, step by step

**1. Partial build escape (Oct 20, 07:28 UTC).** Railway's builds ran **multi-tenant**: several customers' builds shared one VM, each isolated from the others. The attacker used a previously unknown bug to partly escape **filesystem isolation** and read files on the host. One of those files held the **build credential**, used to push images after a build.

**2. A credential trusted too widely.** The credential was meant only for build work. But the self-hosted **Temporal** cluster that drives builds accepted it as a **trusted client**. Temporal task histories held each build's environment variables, secrets and a repo-scoped GitHub token. The attacker read the histories of **353 builds**. Because the credential could also fetch **repository snapshots** used for build caching, the attacker downloaded Railway's **internal monorepo** from the build of an internal service.

**3. Source code as a map.** Railway revoked the credential that evening and re-enabled builds. But the attacker now had the code, and started probing endpoints that hadn't been used in months or years. Railway says the source gave the attacker a privileged view that let them "run agent fanouts, find any exploit, and move laterally with significant speed."

**4. A misconfigured OIDC binding (Oct 21, 03:26 UTC).** In the code they found an **erroneously defined OIDC binding** for Railway's CI/CD. That gave them **short-lived cloud credentials**, which they used to fetch an **SSH key** and a **long-lived credential** from the cloud environment. On an orchestration machine they found a file with a credential that could **decrypt customer variables**. The machine also had network access to the database of envelope-encrypted variables.

**5. Targeted decryption (04:07–07:15 UTC).** Database logs show the attacker **selecting rows whose variable names matched regexes for AI provider keys**, and favoring environments with many variables. Railway disabled all cloud credentials at 07:14, shut down builds again at 07:22, and confirmed eviction at 09:24.

## Impact in numbers

| What | Figure |
| --- | --- |
| Workspaces whose variables could have been decrypted | ≤ 1.85% (~100,000), upper bound |
| Build histories read (incl. sealed variables) | 353 |
| Users with BYOK agent keys / GitHub OAuth tokens exposed | 1,852 (all reset) |
| Estimated unauthorized AI spend | ~$740,000 |
| Builds fully restored | Oct 22, 22:49 UTC |

Railway asked GitHub, GitLab, Anthropic, OpenAI, OpenRouter, Google, Stripe and others to revoke keys. It sent them **hashes of every key it held** because it couldn't yet tell which ones had leaked. It also reports seeing stolen keys used for coding agents and for producing training data, consistent with resale through proxy or "transfer station" services used for **distillation**.

## What Railway changed

- **Single-tenant VM builds**, rolled out to all users at once. The new builder was planned for a gradual rollout the week of October 26. Within an hour of the first fix, Railway's own hardening team found a **variant of the original escape**, so it moved everyone immediately.
- New PKI and root CA, all relevant secrets rotated, and internal tooling rebuilt from validated source with CI disabled.
- New incident-response runbooks that set a fixed impact-assessment window, after which customers are notified broadly whether or not the analysis is finished.

## What to take from it

- **Scope machine credentials to one audience.** A "push images" token should not be accepted by your workflow engine. Check what each internal service actually accepts.
- **Audit OIDC trust policies** for CI (subject, audience, branch and repo conditions). One loose binding turned stolen source code into cloud access.
- **Assume your source code will leak.** Dead endpoints, decryption material on disk, and broad VPC reachability all become usable once an attacker can read the code.
- **If you stored AI keys on Railway:** rotate them, set per-key spend limits and alerts with your providers, and report charges you didn't make through Railway's form.
