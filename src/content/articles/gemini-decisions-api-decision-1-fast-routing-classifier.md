---
title: "Google's Gemini Decisions API Scores Up to 1,000 Questions in One Pass, with No Output Tokens Billed"
subtitle: "The new gemini-decision-1 model doesn't generate text. It scores yes/no, multiple-choice and rubric questions against one multimodal input in about 150–250 ms, for $0.10 per million input tokens. Google pitches it for model routing, tool selection and policy checks."
pubDate: 2026-11-12
category: "ai"
tags: ["Google", "Gemini", "Gemini Decision 1", "Decisions API", "Model Routing", "Classification", "Agents", "LLM Cost"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/gemini-decisions-api-decision-1-fast-routing-classifier.webp"
coverAlt: "Ink-and-gouache illustration of a single dark line on cream paper that fans out into five thin branches, each ending in a dot of a different size, the largest one ochre in the middle, above a sage strip"
coverCaption: "Illustration by TechPulse Editorial · One input, several options, and a weight on each."
tldr:
  - "Google launched the Gemini Decisions API on November 11, 2026, powered by a new model, Gemini Decision 1 (gemini-decision-1), in Google AI Studio."
  - "Instead of generating text, it scores candidate options in a single forward pass. One request can carry one shared multimodal input (text, images, audio, video, PDFs, up to 256K tokens) and up to 1,000 independent questions."
  - "Three question types: noul (yes/no probability), choice (2 to 255 options with normalized probabilities) and score (ordered rubric). Every answer has a 0–1 confidence score."
  - "Price: $0.10 per 1M input tokens, $0 for output, with the shared input billed once per request. Google quotes 150–250 ms end to end and says it's nearly 5x cheaper on its benchmark suite than Gemini 3.5 Flash-Lite via the Interactions API."
sources:
  - label: "Google Blog — Gemini Decisions API: Fast, calibrated multimodal decisions (Nov 11, 2026)"
    url: "https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/"
  - label: "Google Blog — Gemini 4 Carbon is now available (Nov 10, 2026)"
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/"
---

A lot of what agent harnesses ask an LLM isn't open-ended. Which tool should run next? Does this request need the big model? Does this message break a policy? Teams usually answer these by calling a small generative model and parsing its text, or by training a classifier. On **November 11, 2026**, Google shipped a third option: the **Gemini Decisions API**, a separate endpoint for closed-set decisions, backed by a new model, **Gemini Decision 1** (`gemini-decision-1`).

## How it works

Gemini Decision 1 doesn't decode an answer token by token. It **scores the candidate options in a single forward pass** and returns probabilities. A request has two parts:

- **One shared `input`**: text, images, audio, video and PDFs, mixed freely, up to **256K tokens**. It uses the same `Content` block format as the Interactions API.
- **Up to 1,000 independent questions** against that input, each one of three types:
  - `noul`: probability that a yes/no condition holds, with optional criteria for true and false.
  - `choice`: picks from **2 to 255** options and returns normalized probabilities for every candidate.
  - `score`: grades against an ordered rubric starting at 0, returning a weighted score and per-level probabilities.

Every answer includes a **confidence score from 0 to 1**, so your code can send ambiguous cases to a fallback model or a human.

## Speed and price

Google quotes **median model compute of 50–100 ms** and **150–250 ms end to end** for inputs up to 16K tokens, staying nearly flat from 1 to 100 questions per request. Pricing:

- **$0.10 per 1M input tokens**, **$0 for output**, no thinking-token charges and no separate audio transcription or OCR fees.
- The shared input is **billed once per request**, however many questions you ask. Each question adds only its own instruction and criteria tokens.
- A **no-cost tier** in Google AI Studio for prototyping.

Google says it leads its benchmark suite (agent routing, reasoning, ranking, multimodal understanding) with the lowest calibration error. It also says it's **nearly 5x cheaper** across that suite than Gemini 3.5 Flash-Lite through the Interactions API. These are Google's own numbers.

## What Google uses it for

- **Model routing in Gemini Notebook**: classifying intent to send each query to the right model tier and thinking level, which Google says cut latency by up to 40% on everyday queries.
- **A safety layer for MCP tools in Search**, detecting adversarial behavior within the latency budget.
- Lighter uses in **Stitch** (applying voice and tap edits to wireframes) and **CC** (picking one of 200+ emoji reactions).

Integrations are rolling out for **OpenRouter, LangChain, Vercel, LiteLLM, Pydantic AI, Pipecat, LiveKit and OpenCode**, alongside the `google-genai` SDKs. Support in Gemini on Google Cloud is listed as coming soon.

## Why it matters for agent builders

The launch landed a day after Google opened **Gemini 4 Carbon** to all paying developers and previewed `/swarm` in Antigravity, where Carbon handles coordination and auditing while lighter models do the parallel work. Decisions is the cheap piece in that kind of setup: the router or gate that decides which model, tool or reviewer gets a task.

In practice:

- **Routing and gating become a scoring call, not a generation call.** You get calibrated probabilities instead of parsing "yes" out of a sentence, and you can set thresholds per question.
- **Batch your checks.** One screenshot or document, 20 policy and quality questions, one request, with the input billed once.
- **Keep generative models for open-ended work.** Decisions only chooses from options you define. It doesn't explain or write anything, so it complements your main model rather than replacing it.
- **Measure before trusting the calibration claims.** Run it on a labeled slice of your own routing or moderation traffic and compare against what you use today.

```python
from google import genai
client = genai.Client(http_options={"api_version": "v1beta"})

result = client.decisions.create(
    model="gemini-decision-1",
    input=[{"type": "text", "text": user_request}],
    questions={
        "tier": {
            "type": "choice",
            "instructions": "Which model tier should handle this coding request?",
            "criteria": {
                "fast": "Small edit, lookup or explanation.",
                "frontier": "Multi-file change, debugging or design decision.",
            },
        },
    },
)
```
