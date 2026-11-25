---
title: "Your Prompts Went Further Than You Thought: Dragos Canaries Expose Breached Inference Providers, and OpenRouter Cuts Three Loose"
subtitle: "Dragos seeded about two million prompts with unique URLs and live-looking AWS keys and watched where they surfaced. The answer: at least three compromised hosting providers, marketplace resellers reading customer prompts, and privacy flags that didn't hold. Over the past few days OpenRouter, GMI Cloud, Phala, Together AI and Novita have published what happened on their side."
pubDate: 2026-11-25
category: "security"
tags: ["AI Security", "OpenRouter", "LLM Inference", "Supply Chain", "Data Leak", "Dragos", "Zero Data Retention", "Secrets"]
readingTime: "6 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/ai-inference-provider-prompt-leaks-dragos-canaries-openrouter-gmi-phala.webp"
coverAlt: "Muted editorial illustration of a long pneumatic-tube system running through several small buildings, with one tube cracked open and a few paper slips drifting out"
coverCaption: "Illustration by TechPulse Editorial · Every hop can read the message."
tldr:
  - "From July to November 2026, Dragos sent about two million prompts carrying unique canary URLs and real AWS keys tied to empty, fully logged accounts to widely used AI services, then watched who used them."
  - "Dragos found attackers stealing requests from at least three hosting providers. In the largest case a couple hundred seeded AWS keys were stolen and used for tens of thousands of AWS API calls, including attempts to enable Bedrock and add IAM users. Some stolen requests were marked Zero Data Retention."
  - "OpenRouter says it was not breached itself, but it off-boarded three providers, removed 125 endpoints from ZDR eligibility and notified affected customers (post dated November 22)."
  - "Provider write-ups so far: GMI Cloud (logging system accessed; requests from Oct 18 to Nov 18 may be exposed), Phala (DeepSeek V4 Flash 0731 requests readable from Oct 21 to Nov 1), Together AI (stored prompt samples stolen after an AI coding agent committed a credential), Novita (MiniMax requests forwarded to MiniMax's API from May 28 to Nov 11)."
  - "If you sent secrets in prompts through these routes in those windows, rotate them. Longer term: pin providers, keep credentials out of agent context, and seed your own canary."
sources:
  - label: "Dragos (HD Moore) — Three breaches, endless leaks: Your AI supply chain needs canaries"
    url: "https://www.dragos.com/blog/ai-supply-chain-security-canary-tokens"
  - label: "OpenRouter — Data Processing Incidents on Inference Providers"
    url: "https://openrouter.ai/blog/announcements/data-processing-incidents-on-inference-providers/"
  - label: "GMI Cloud — Security incident affecting GMI Cloud endpoints on OpenRouter"
    url: "https://www.gmicloud.ai/en/blog/security-incident-affecting-gmi-cloud-endpoints-on-openrouter"
  - label: "Phala — November Detailed Incident Report"
    url: "https://phala.com/posts/phala-november-detailed-incident-report"
  - label: "Together AI — Security event: Prompt leakage for requests in June and July of 2026"
    url: "https://www.together.ai/blog/security-event-prompt-leakage-for-requests-in-june-and-july-of-2026"
  - label: "Novita — Privacy Notice Regarding MiniMax Requests on Novita"
    url: "https://novita.ai/blog/minimax-requests-privacy-notice/"
---

Most developers think of an LLM call as one request to one company. In practice it can pass through a router, then a reseller, then a hosting provider, and maybe another router. As Dragos puts it, "every hop can see the entire prompt and response." A new study shows how often one of those hops leaks.

## What Dragos did

Dragos Chief Research Officer **HD Moore** published the research on **November 19, 2026**. From **July through November**, the team sent about **two million prompts** to widely used AI services. Each prompt carried unique secrets that existed nowhere else: a DNS name, a URL and an **AWS key tied to an empty account with full logging**. Any use of one of those secrets meant someone outside the intended path had read the prompt.

They also built "something like traceroute for AI inference." Each request included an image URL pointing back to Dragos, so every system that fetched it revealed an IP, an HTTP client and a timestamp. Of about **2,000 traced routes**, several hundred included a system Dragos couldn't identify. A handful sent the image to a company that wasn't on the advertised path at all.

## What they found

**1. Three compromised providers.** Attackers were copying requests at three hosting providers. None of them knew until Dragos told them. The earliest case dates to mid-July. In the largest, **a couple hundred AWS keys** were stolen within a few windows in late October. Some came from requests the provider rejected before any model ran, which means the copying happened "at the provider's front door." The attackers then followed a familiar cloud playbook. They checked whether each key was live, sometimes within hours, listed S3 buckets, searched Secrets Manager and Parameter Store, tried to **enable Bedrock models and create Bedrock API keys**, and added IAM users to keep access. The bait keys were used for **tens of thousands of AWS API calls**. In two of the breaches, some stolen requests were flagged **Zero Data Retention**. "A privacy flag doesn't help when the attacker is already inside."

**2. Marketplace resellers reading prompts.** On one inference marketplace, sellers could view and keep customer prompts through ordinary logging, with no exploit needed. Dragos explains the incentive: list a popular model at the lowest price, take the traffic, and collect the data from the logs. One seller quietly added about a thousand hidden tokens to every request.

**3. Policies not honored.** Prompts sent to U.S. providers reached Chinese AI organizations. URLs were fetched months after a single request. One seeded link turned up in an internal company chat in China.

Dragos doesn't name the providers. The disclosures below come from the companies themselves.

## What the providers have said

- **OpenRouter** (November 22) says Dragos found no breach of OpenRouter itself. It **off-boarded three providers**, **removed 125 endpoints from ZDR eligibility**, and notified potentially affected customers. It says it will run similar canary checks on an ongoing basis and verify network paths for hidden forwarding.
- **GMI Cloud** (November 24) says an unauthorized party got into a logging and monitoring system behind its OpenRouter endpoints on **October 21 and 22** and again from **October 27**, using two compromised credentials that were revoked on **November 18**. Because the system kept about three days of request content, requests from **October 18 to November 18** may be exposed. GMI has stopped logging prompt and response content.
- **Phala** (final report, November 23) says that from **October 21 to November 1** an attacker could read requests sent to its **`DeepSeek V4 Flash 0731`** backend on OpenRouter. Phala says an experimental server had served OpenRouter traffic without production controls. On November 5 the same attacker also obtained the root key of Phala Cloud's legacy KMS.
- **Together AI** says an **AI coding agent committed a credential** to its public `xorl` repository. That credential gave access to a private Hugging Face repo of prompt samples from June and July (MiniMax M3, GLM-5.2, Kimi K2.6). An unauthorized party downloaded the samples and tested credentials found in them, five of which were Dragos canaries. Together has made ZDR the default for new accounts.
- **Novita** (November 22) says a routing misconfiguration sent some **MiniMax** requests to **MiniMax's official API** instead of Novita-hosted infrastructure from **May 28 to November 11**, including traffic that came through OpenRouter.

## What to do

1. **Rotate anything secret** you sent through the affected routes during these windows: API keys, tokens, passwords and `.env` contents. Phala and GMI both say to do this even if you've seen no misuse. Phala suggests asking OpenRouter support, with the request ID and time, if you aren't sure which provider served a request.
2. **Pick your upstream providers.** Don't accept a router's default pool. Pin the providers you trust and check that your privacy settings actually change routing. Dragos notes that "a privacy flag only binds the first hop."
3. **Keep credentials out of agent context.** Dragos warns that agents "will happily send whatever they can read." Use scoped, short-lived credentials and secret filtering where available.
4. **Seed your own canary.** Put a fake credential (a free Thinkst Canarytoken works) into the context your agents already send, and treat any use of it as an incident.
5. **For the most sensitive work, self-host.** It's the only setup where nobody else reads your prompts.
