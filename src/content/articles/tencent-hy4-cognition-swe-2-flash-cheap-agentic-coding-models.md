---
title: "Tencent Hy4 and Cognition's SWE-2 Flash: Two Cheaper Agent Models Land on the Same Day"
subtitle: "Tencent's Hy4 adds vision and computer use at $0.90 / $2.70 per million tokens with a 1M context, while Cognition's 276B-A12B SWE-2 Flash runs in Devin at one-fifth the price of SWE-2."
pubDate: 2026-11-05
category: "ai"
tags: ["Tencent", "Hy4", "Cognition", "SWE-2 Flash", "Devin", "Coding Models", "Agentic AI", "Open Weights", "Model Pricing"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/tencent-hy4-cognition-swe-2-flash-cheap-agentic-coding-models.webp"
coverAlt: "Ink-and-wash illustration of a tall layered sage-and-slate tower with a small grid window beside a slim ochre tower, joined by a thin line on textured paper"
coverCaption: "Illustration by TechPulse Editorial · Big model, small model, one task line between them."
tldr:
  - "On November 4, 2026, Tencent released Hy4, its first Hy model with visual understanding and computer use (CLI and GUI). Weights and system cards are promised 'in the coming days.'"
  - "Hy4 keeps Hy4 Preview's list price: about $0.90 per million input tokens, $2.70 output and $0.045 cached input. OpenRouter lists a 1,048,576-token context and 65,536 max output, at 50% off during launch."
  - "The same day, Cognition launched SWE-2 Flash, a 276B-total / 12B-active coding model mid-trained and RL-tuned from Thinking Machines' Inkling-Small. Terminal-Bench 4.0 went from 0.9% to 20.0%."
  - "SWE-2 Flash is in Devin Desktop and CLI at one-fifth the price and about 3× the speed of SWE-2. Weights are not public; Cognition is building a gated program for partners and researchers."
sources:
  - label: "Tencent — Tencent Launches Hy4"
    url: "https://www.tencent.com/tencent-launches-hy4-joining-the-ranks-of-the-worlds-leading-open-source-ai-models/"
  - label: "OpenRouter — Tencent models (Hy4 listing)"
    url: "https://openrouter.ai/tencent"
  - label: "Cognition — Introducing SWE-2 Flash"
    url: "https://cognition.com/blog/swe-2-flash"
---

Two launches on **November 4, 2026** point the same way: the cheap tier of agent models keeps getting more capable, and vendors are pricing for the bulk of everyday agent work rather than the hardest tasks.

## Tencent Hy4: vision and computer use, same price

Hy4 is the full release after **Hy4 Preview** (August). Tencent says it is the first Hy model with **visual understanding**, and the first with **computer use** across command-line and graphical interfaces. It was trained on professional software such as Blender and CAD for long-horizon tasks.

Numbers Tencent published:

- **Price:** about **$0.90 / $2.70** per million input/output tokens and **$0.045** per million cached input tokens, unchanged from the Preview. TokenHub has it at 50% off through December 31, 2026.
- **Context:** OpenRouter lists **1,048,576 tokens** of context and **65,536** max output tokens, with tool calling, structured outputs and reasoning.
- **Hallucination:** in Tencent's internal tests the hallucination rate fell from **12.95% to 7.2%**, and errors from unsupported assumptions fell from **23.1% to 5.6%**.
- **Game dev:** +19.1% on GameDev and +9.8% on GameLogic versus the Preview, with Unreal, Unity and Godot integration.

Tencent's earlier Preview listing describes a 770B-total / 49B-active MoE. Tencent has not restated the parameter count for the final Hy4, and the **weights are not out yet**; the company says weights and system cards will follow "in the coming days." Most of the benchmark numbers are internal, so treat them as Tencent's claims until independent evals land.

On safety, Tencent says offensive exploitation material was excluded from training, and Xuanwu Lab and Keen Lab found "no significant concerns" about offensive cyber capability in the areas they tested.

## Cognition SWE-2 Flash: a small model for routine agent work

Cognition's pitch is direct: smaller models now handle a large share of what coding agents do, such as automations, code review, feature work and docs. SWE-2 Flash is built for that share.

- **Base:** Thinking Machines' **Inkling-Small**, **276B total / 12B active**.
- **Recipe:** for the first time, Cognition added a **mid-training stage** of a few trillion tokens (scientific articles, blogs, code) before large-scale RL.
- **Gains over the base model:** Terminal-Bench 4.0 **0.9% → 20.0%**, FrontierCode 2.0 **3.2% → 24.0%**, DeepSWE 1.1 **17.4% → 60.1%**, SWE-Bench Pro v2 Hard **56.5% → 89.9%**.
- **Versus its big sibling:** on FrontierCode 2.0 it scores **24.0** against SWE-2's **23.8**, but SWE-2 still leads on Terminal-Bench 4.0 (27.3) and DeepSWE (73.0).
- **Speed and price:** about **200 tok/s** versus SWE-2's 60, at **one-fifth the price**.

Cognition also pushed its ExploitBench score from 11.3% to 34.8% to help defenders. Because the same skills help attackers, the **weights are not public**. Cognition says a vetted sharing program for partners and labs is coming "in a few weeks."

## What it means for your routing

Both models fit the planner/executor split many teams already use: a frontier model plans and reviews, and a cheaper, faster model does the high-volume edits, searches and test runs. Hy4 is the one you can call today through OpenRouter at a known price. SWE-2 Flash is only reachable inside Devin for now. If you route executor work by cost, Hy4's $0.045 cached input price is the number to test against your current executor.
