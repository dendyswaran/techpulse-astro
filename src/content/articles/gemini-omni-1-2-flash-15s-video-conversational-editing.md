---
title: "Gemini Omni 1.2 Flash Goes GA: 15-Second Clips, Conversational Edits, 30% Cheaper"
subtitle: "Google DeepMind's production video model stretches native generation to 15 seconds, lets you refine the same clip turn by turn, and drops 720p pricing to $0.07 per second."
pubDate: 2026-11-06
category: "ai"
tags: ["Google", "Gemini", "Gemini Omni", "Video Generation", "DeepMind", "Gemini API", "Google Cloud"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/gemini-omni-1-2-flash-15s-video-conversational-editing.webp"
coverAlt: "Soft editorial illustration of three muted video frames linked by a wavy ink ribbon toward a terracotta orb on warm paper"
coverCaption: "Illustration by TechPulse Editorial · One clip, many turns, fewer regenerations."
tldr:
  - "Google launched Gemini Omni 1.2 Flash as generally available on November 5, 2026 across the Gemini API, Gemini for business, and Google Cloud."
  - "Native video length rises from 10 seconds (Omni 1.1) to 15 seconds, with duration selectable in one-second steps from 3 to 15."
  - "720p generation is priced at $0.07 per second—about 30% below Omni 1.1 Flash—with draft-at-360p/720p then upscale-to-1080p/4K workflows."
  - "Multi-turn conversational editing lets you swap products, lighting, weather, or aspect ratio on the same clip instead of regenerating from scratch; outputs carry an imperceptible SynthID watermark."
sources:
  - label: "Google — Gemini Omni 1.2 Flash: Fast and cost-effective with longer clips"
    url: "https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/"
  - label: "Google Cloud — Gemini Omni 1.2 Flash now GA"
    url: "https://cloud.google.com/blog/products/ai-machine-learning/gemini-omni-1-2-flash-generally-available"
  - label: "Google DeepMind — Gemini Omni 1.2 Flash model card"
    url: "https://deepmind.google/models/model-cards/gemini-omni-1-2-flash/"
---

Google DeepMind put **Gemini Omni 1.2 Flash** into general availability on **November 5, 2026**, and the pitch is blunt: longer clips, edits that do not throw away the take, and a lower price for the volume work businesses actually ship.

## What changed from Omni 1.1

**Length.** You can generate and edit videos natively up to **15 seconds**, up from **10 seconds** on Omni 1.1. Duration can be set in **one-second increments from 3 to 15**, which is enough for a product explainer or a full social ad spot in one generation.

**Editing.** Multi-turn conversational editing keeps the same clip in play. Google's examples swap backgrounds, products, lighting, weather, or aspect ratio without re-briefing the whole shot. That matters for ad variants: one hero generation, many placements.

**References.** The model accepts character, product, or style images, short motion clips (up to three seconds), and audio cues, and Google says it holds faces, garments, packaging typography, and brand colors more tightly across camera angles. Audio references remain allowlist-gated.

**Speech and camera.** Launch posts call out more natural multi-speaker dialogue with clearer lip-sync, plus steadier continuous moves (FPV flythroughs, orbits, crash zoom-outs) with fewer unwanted cuts.

**Cost.** 720p generation is **$0.07 per second**, described as about **30% cheaper** than Omni 1.1 Flash, with similar savings at other resolutions. The recommended workflow is draft at **360p or 720p**, iterate with conversational edits, then upscale keepers to **1080p or 4K**.

## Where you can call it

Omni 1.2 Flash is live for developers on the **Gemini API** (model id `gemini-omni-1.2-flash` in Google's cookbook), for businesses in **Gemini for business** and the **Google Cloud** console with Provisioned Throughput, and inside Google apps including **Flow**, **Google Vids**, the Gemini app (rolling out to AI Ultra), and **Google Ads**. Outputs carry an imperceptible **SynthID** watermark.

Google is frank about remaining weak spots: fast sports action, rapid script changes, and complex physics are still improving. For catalog spins, virtual try-on, explainers, and branded short-form, the GA release is the production path.

## Why developers should care

Video models usually punish iteration: every tweak burns another full generation. Conversational editing plus a draft-then-upscale ladder changes the unit economics for agentic creative pipelines that generate dozens of variants per SKU. If you already orchestrate image and copy agents, Omni 1.2 Flash is the piece that can stay on the same thread instead of restarting the brief each time.
