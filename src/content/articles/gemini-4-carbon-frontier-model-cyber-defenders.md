---
title: "Google's Gemini 4 Carbon Goes to Cyber Defenders First, Tops the Artificial Analysis Index at 59"
subtitle: "Two weeks after Argon, Google DeepMind's new frontier model posts 88.2% on SEC-bench Pro and 0% prompt-injection success, but developers have to wait."
pubDate: 2026-10-29
category: "ai"
tags: ["Google", "Gemini", "Gemini 4 Carbon", "LLM", "Cybersecurity", "AI Safety"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: true
coverImage: "/images/covers/gemini-4-carbon-frontier-model-cyber-defenders.webp"
coverAlt: "Gouache illustration of a simple stone watchtower on a quiet shore at dusk, its soft beam sweeping across a field of paving stones"
coverCaption: "Illustration by TechPulse Editorial · A brighter light, pointed first at the cracks."
tldr:
  - "Google DeepMind announced Gemini 4 Carbon on October 28, 2026, calling it its strongest model with state-of-the-art cybersecurity and long-horizon capabilities."
  - "Carbon ranks #1 on the Artificial Analysis Intelligence Index v5.0 with a score of 59 and leads SEC-bench Pro (88.2%), ExploitGym (54.8%), and CWE-bench (71.0%)."
  - "Access starts with a subset of cyber defenders, then trusted partners through the Fairwind Program; developers, businesses, and consumers come later."
  - "Introductory pricing matches Gemini 4 Argon at $2 / $10 per million input / output tokens, rising to $4 / $20 after the introductory period."
sources:
  - label: "Google — Gemini 4 Carbon: our next frontier model"
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/"
  - label: "Artificial Analysis — Gemini 4 Carbon is the new #1 on the Intelligence Index v5"
    url: "https://artificialanalysis.ai/articles/gemini-4-carbon-new-number-1"
  - label: "Vals AI — Gemini 4 Carbon benchmarks, cost and capabilities"
    url: "https://www.vals.ai/models/google_gemini-4-carbon"
  - label: "Google AI for Developers — Gemini 4 Argon model page"
    url: "https://ai.google.dev/gemini-api/docs/models/gemini-4-argon"
---

Only two weeks after shipping **Gemini 4 Argon**, Google DeepMind announced **Gemini 4 Carbon** on **October 28, 2026**. Google calls it "our strongest model with state-of-the-art cybersecurity and long horizon capabilities," and it is taking an unusual route to market: the first users are not developers, but cyber defenders.

## The headline numbers

According to Google's launch post, Carbon:

- ranks **#1 on the Artificial Analysis Intelligence Index v5.0** with a score of **59**,
- scores **88.2% on SEC-bench Pro** (finding real vulnerabilities),
- sets a new high of **54.8% on ExploitGym** (validating exploitability),
- reaches **71.0% on Collinear's CWE-bench** (patching at the root cause), and
- climbs **+89 Elo to #4 (1768) on WebDev Arena**.

Google says Carbon delivers more than **2x uplift in generating secure code** over Argon on internal benchmarks, and that the Chrome team saw it perform more than **10x better** than another lab's large frontier model at producing high-quality patches. Internally, Google says Carbon has run "for days" on multi-step engineering work such as root-causing subtle bugs across large codebases.

## A safety-first rollout

Carbon is not on the public API yet. Google says it is taking part in the U.S. government's voluntary pre-release testing process, and access is being staged:

1. A subset of **cyber defenders** gets the model first, starting this week.
2. Additional **trusted partners** are phased in through Google's **Fairwind Program**.
3. Developers, businesses, and consumers get access "as soon as possible" once guardrails are tuned.

Third-party trackers note that Google has not yet published a public model ID or a developer model page for Carbon, so teams building on the Gemini API today should keep targeting `gemini-4-argon`.

## Alignment claims worth watching

Google pairs the capability jump with a list of behavioral improvements:

- **Shortcut resistance:** successful cheating on Terminal-Bench 4.0 fell to **0.0%**, with cheating attempts at **0.4%**, and high-severity misalignment alerts in live internal coding environments dropped by almost **80%**.
- **Honesty:** roughly **2x fewer unsupported claims** than Argon in internal testing.
- **Scope discipline:** **26% less overreach** and **29% less under-service** on multi-step plans.
- **Prompt injection:** a **0.0%** attack success rate on Gray Swan's Indirect Prompt Injection benchmark, down from Argon's 0.7%.

These are vendor-reported figures, and independent red-team results will matter more once the model is broadly available.

## Pricing and context

Carbon launches at the same **introductory price as Argon**: **$2 per million input tokens** and **$10 per million output tokens**, with cached input **95% off**. After the introductory period, Google lists **$4 / $20** per million tokens. Artificial Analysis and Vals AI report a **1M-token context window** with text, image, and video input.

Artificial Analysis estimates Carbon at **$7.76 per Intelligence Index task** at standard pricing, about 23% less than Claude Opus 5.5 (max) and in line with Argon, while scoring 9 points higher.

## Why it matters

The AI race in late 2026 is increasingly a security race. Anthropic's OSS program is now credited on major advisories (including this week's Jenkins release), Causal Security's agent found four EPICS Base bugs in hours, and Google is now positioning its top model first as a defender's tool. For security teams, the practical takeaway is simple: AI-assisted vulnerability discovery is accelerating, so patch cadence has to keep up.

You can compare Carbon's pricing against other frontier models on our [AI model pricing calculator](/models).
