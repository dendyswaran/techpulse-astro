---
title: "MAI Code 2 and Code 2 Flash: Microsoft's In-House Coding Models Land in GitHub Copilot at $0.50 / $2.50 and $0.05 / $0.25"
subtitle: "At Ignite 2026, Microsoft AI released seven models built for price-performance rather than the frontier. The two that matter most to developers are already in Copilot's model picker. Microsoft says it gets near GPT-6.1 Sol on everyday coding at 40% of the price, and the Flash model is free-tier eligible."
pubDate: 2026-11-18
category: "ai"
tags: ["Microsoft", "MAI Code 2", "GitHub Copilot", "Ignite 2026", "Coding Models", "LLM Pricing", "Model Routing", "Agents"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/microsoft-mai-code-2-flash-github-copilot-ignite-2026.webp"
coverAlt: "Risograph-style illustration of a long wooden workbench holding a row of small blocks in terracotta, slate, ochre and sage, with a large pale many-windowed building fading into the background behind it"
coverCaption: "Illustration by TechPulse Editorial · Small blocks doing the everyday work while the monument stands in the background."
tldr:
  - "Microsoft AI released MAI Code 2 and MAI Code 2 Flash on November 17, 2026 at Ignite. Both are GA in GitHub Copilot (VS Code, Visual Studio, JetBrains, Xcode, Eclipse, Copilot CLI, cloud agent, github.com). Flash is also on Copilot Free and Student."
  - "Copilot launch pricing per 1M tokens: Code 2 is $0.50 input / $0.025 cached / $2.50 output, and Flash is $0.05 / $0.005 / $0.25. These are 50% promo rates until May 17, 2027, then $1 / $0.05 / $5 and $0.10 / $0.01 / $0.50."
  - "Microsoft's claims: averaged over DeepSWE 1.1, Terminal Bench 2.1, SWE-Atlas and FrontierCode 1.1, Code 2 reaches 98% of GPT-6.1 Sol at about 40% of the cost and 96% of Claude Opus 5.5 at 5%. Flash roughly matches GPT-6 Luna and Claude Haiku 5.5 at 65% and 20% of their prices. Microsoft says neither is tuned for science or very long-horizon agent work."
  - "The rest of the Ignite lineup: MAI Cyber 2 Flash for 24/7 defensive scanning, the Decision 1.1 routing model, MAI Image 2.7, MAI Realtime 1 (from $0.01 per audio minute), MAI Transcribe 2, and 'MAI Licensed Weights' that enterprises can customize and run in their own Azure tenant. Maia 200 chips are now in production."
sources:
  - label: "Microsoft AI — MAI Code 2 and Code 2 Flash: Everyday coding at scalable prices"
    url: "https://microsoft.ai/news/introducing-mai-code-2-and-mai-code-2-flash/"
  - label: "Microsoft AI — Seven new world class models at scalable price-performance (Ignite 2026)"
    url: "https://microsoft.ai/news/microsoft-ignite-2026/"
  - label: "GitHub Changelog — MAI Code 2 and MAI Code 2 Flash in GitHub Copilot"
    url: "https://github.blog/changelog/2026-11-17-mai-code-2-and-mai-code-2-flash-in-github-copilot/"
  - label: "GitHub Docs — Models and pricing for GitHub Copilot"
    url: "https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing"
  - label: "AI Ping — GitHub Copilot adds two Microsoft coding models, with Flash on free plans"
    url: "https://aipingnews.com/en/news/2503-github-copilot-mai-code-2-flash-pricing-access"
---

Microsoft's in-house AI group used **Ignite 2026** on **November 17** to release a family of seven models. The goal isn't to top the frontier leaderboards. Microsoft's pitch is "a price point that lets you run agents 24-7 doing real engineering work". The two coding models went straight into **GitHub Copilot** the same day, so most developers can try them without signing up for anything new.

## The two coding models

**MAI Code 2** is the general-purpose model. Microsoft aims it at deep debugging, multi-file implementation, refactoring, repo-wide reasoning and UI work. **MAI Code 2 Flash** is the lightweight one, for code explanations, targeted edits, routine fixes and fast iteration. Both take text and images. AI Ping, citing Microsoft, reports a **1.05M-token** context window for each.

Microsoft is direct about what they're *not* for. They're "explicitly not yet tuned for harder problems, like fundamental science research and very long horizon agentic work". Read the benchmarks with that in mind.

### Pricing in Copilot (per 1M tokens)

| Model | Input | Cached input | Output | From May 17, 2027 |
| --- | --- | --- | --- | --- |
| **MAI Code 2** | $0.50 | $0.025 | $2.50 | $1.00 / $0.05 / $5.00 |
| **MAI Code 2 Flash** | $0.05 | $0.005 | $0.25 | $0.10 / $0.01 / $0.50 |
| *GPT-6.2 Sol (for comparison)* | $2.00 | $0.10 | $10.00 | — |
| *Claude Haiku 5.5 (≤100K)* | $0.10 | $0.01 | $0.50 | — |

Copilot bills these in AI credits (1 credit = $0.01). Even at the post-promo rate, Code 2 is half the price of GPT-6.2 Sol. At its promo rate, Flash costs half of Haiku 5.5.

### Availability

- **MAI Code 2:** Copilot Pro, Pro+, Max, Business and Enterprise.
- **MAI Code 2 Flash:** all of the above plus **Free and Student**.
- Clients: VS Code, Visual Studio, JetBrains, Xcode, Eclipse, Copilot CLI, Copilot cloud agent, the Copilot app, github.com and mobile. Business/Enterprise admins control access through the model policy. New models are on by default unless an admin has turned that off.
- Outside Copilot, Flash is in limited preview in **Microsoft Foundry**. Microsoft says OpenRouter, Vercel, OpenCode and Kilo are "soon".

## What the benchmarks say

All results are Microsoft's, run at max reasoning effort through the **Copilot CLI with subagents disabled**:

- **Code 2:** averaged over DeepSWE 1.1, Terminal Bench 2.1, SWE-Atlas and FrontierCode v1.1, it gets **98% of GPT-6.1 Sol's score at ~40% of the cost** and **96% of Claude Opus 5.5's at ~5%**. Note that the cost comparison uses Code 2's 50% promo price. In a blind frontend evaluation with 258 annotators, reviewers picked Code 2 over GPT-6 Sol **64%** of the time.
- **Code 2 Flash:** on DeepSWE 1.1, Terminal Bench 2.1 and SWE-Atlas, it's comparable to **GPT-6 Luna at 65%** of the price and **Claude Haiku 5.5 at 20%**.

None of this is independently verified yet. "98% of the score" is also an average, so it can hide a much bigger gap on your hardest tasks.

## The rest of the Ignite lineup

- **MAI Cyber 2 Flash.** Microsoft says it matches GPT-6 Astra on CyberGymE2E at under 2% of the cost per task, with output tokens 86% cheaper than Cyber 1.1 Flash. It's built for continuous defensive scanning.
- **Decision 1.1.** A routing model that sends requests to bigger models only when they're needed. Microsoft claims it's 50x faster and 79x cheaper than GPT-6.1 Sol and has 4,000 customers.
- **MAI Image 2.7** (#1 on Artificial Analysis image editing), **MAI Realtime 1** speech-to-speech from $0.01 per audio minute, and **MAI Transcribe 2** in Dragon Copilot.
- **MAI Licensed Weights.** Enterprises can take a MAI model, fine-tune it on their own data and run it in their own Azure environment.
- **Maia 200**, Microsoft's second-generation accelerator, is now serving its largest models at 1.7x more tokens per watt.

## Should you switch?

For high-volume, low-risk work, it's worth a test this week: explanations, small fixes, test scaffolding, subagent grunt work. **Flash at $0.05 / $0.25** is about as cheap as a capable coding model in Copilot gets. Code 2 is a sensible default for everyday multi-file changes. Microsoft itself says to escalate long-horizon or research-heavy tasks to a frontier model. Before you change the default for a whole team, run a few of your own real tickets through both models.
