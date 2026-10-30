---
title: "Mistral Opens the Weights of Large 4 'Le Chonk': A 1T-Parameter MoE That Leads Open Models on Coding and Cyber Defense"
subtitle: "Three weeks after its preview, Mistral's European-trained flagship ships on Hugging Face with a 1M-token context, three reasoning modes, and API pricing of $0.70 / $2.10 per million tokens."
pubDate: 2026-10-30
category: "ai"
tags: ["Mistral", "Mistral Large 4", "Open Weights", "LLM", "MoE", "Cybersecurity", "Sovereign AI"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: true
coverImage: "/images/covers/mistral-large-4-open-weight-le-chonk-1t-moe-coding-cyber.webp"
coverAlt: "Gouache illustration of a lone stone gateway in a quiet field, with a long wall of wooden drawers stretching to the horizon, some drawers open and glowing, and a small figure holding a key at the threshold"
coverCaption: "Illustration by TechPulse Editorial · Open weights hand the key to whoever stands at the gate."
tldr:
  - "On October 29, 2026, Mistral released the open weights of Mistral Large 4 ('Le Chonk'), an improved version of the 1-trillion-parameter model it previewed earlier this month."
  - "It is a granular Mixture-of-Experts model with about 1.05T total and 52B active parameters (49B excluding embeddings), a 1M-token context, and text plus image input."
  - "Mistral says it now leads open-weight models on FrontierCode 2.0 (19.7%) and Terminal-Bench 4.0 (41%), and scores 51% on the Artificial Analysis Cyber Index while refusing 96.6% of malicious cyber prompts."
  - "API pricing is $0.70 input, $0.07 cached input, and $2.10 output per million tokens. The license is a modified MIT that requires a separate deal for Model-as-a-Service businesses."
sources:
  - label: "Mistral — Mistral Large 4 (Le Chonk) is now open weight"
    url: "https://mistral.ai/news/mistral-large-4-oss/"
  - label: "Hugging Face — mistralai/Mistral-Large-4-1T-A52B model card"
    url: "https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B"
  - label: "Hugging Face Blog — Welcome Le Chonk: Mistral Large 4 on Hugging Face"
    url: "https://huggingface.co/blog/mistral-large4"
  - label: "Mistral Docs — Mistral Large 4"
    url: "https://docs.mistral.ai/models/mistral-large-4"
---

Mistral previewed **Mistral Large 4** earlier in October. On **October 29, 2026**, it published the weights of an improved version on Hugging Face, after what the company describes as three more weeks of reinforcement learning focused on coding and defensive security. The model is nicknamed **"Le Chonk"**, and at roughly a trillion parameters it is Mistral's largest model to date.

## What's in the box

According to the model card, Mistral Large 4 is a natively multimodal **Mixture-of-Experts** model:

- **~1.05T total parameters, ~52B active per token** (49B excluding embeddings and output layers), with 128 routed experts (4 active per token) plus one shared expert.
- **1M-token context window**, using Multi-head Latent Attention with a DeepSeek-style sparse attention indexer that picks up to 2,048 key positions per query.
- **Text and image input, text output**, through a Pixtral-style vision encoder of about 1.6B parameters.
- **Three reasoning efforts** per request: `low`, `medium`, and `high` (the default). `low` replaces the old "none" mode.
- An embedded speculative decoding draft head, plus an official **NVFP4** checkpoint aimed at Blackwell GPUs.

Mistral says the model was trained from scratch on 3,800 NVIDIA Grace Blackwell GPUs in its own European data centers, which is central to its "sovereign AI" pitch.

## Coding numbers

Mistral reports these results for the open-weight release:

- **FrontierCode 2.0** (Cognition's private benchmark of whether a maintainer would merge the change): **19.7%**, which Mistral says leads the field it tested.
- **Terminal-Bench 4.0**: **41%**, up 13 points from the preview while using 30% fewer output tokens.
- **Artificial Analysis Coding Agent Index**: **48%**, effectively tied with GLM-5.3 while using 47% fewer tokens per task.
- In Surge Code's blind human-preference tests, graders preferred it over GLM-5.3, Kimi K3, and DeepSeek V4.1 Flash, ranking it behind only Claude Opus 5.5.

These are vendor-reported figures, so expect independent runs over the coming days.

## Built for defenders, with a caveat

Mistral leans hard on security. It reports **51% on the Artificial Analysis Cyber Index**, which tests finding, reproducing, and patching vulnerabilities, and an average **96.6% refusal rate** on malicious cyber prompts from JailbreakBench, StrongREJECT, and AgentHarm. On the B3 Agent Security Benchmark, it resisted 97.1% of attacks, up from 93.3% in preview.

Mistral is also candid that it saw "a potential for uplift to conduct real attacks" in live traffic during the preview and is tightening guardrails. A more permissive variant for penetration testing and red-teaming goes only to vetted design partners such as Orange Cyberdefense. Booz Allen, Cisco, Cloudflare, Rubrik, and Zscaler all offered supporting quotes.

## Pricing, license, and where to run it

On the Mistral API (`mistral-large-4`), pricing is **$0.70 per million input tokens, $0.07 cached, and $2.10 output**. It's also on OpenRouter, Microsoft Foundry, NVIDIA NIM, and Hugging Face Inference Providers, with day-zero support in transformers, vLLM, SGLang, and llama.cpp (community GGUFs are available).

The **Mistral Ecosystem Open-Weight License** is a modified MIT license. You can use, fine-tune, and commercialize the model freely, but a company running a **Model-as-a-Service** business needs a separate commercial license.

## Can you run it yourself?

Not on a desktop GPU. Even with only 52B active parameters per token, all ~1T parameters have to sit in memory, so the FP8 checkpoint needs roughly a full 8× H200 or B200 node. The NVFP4 checkpoint and aggressive GGUF quants lower that, but this is still data-center hardware. For pricing and VRAM comparisons against other models, see our [model calculator](/models).

## Why it matters

Open-weight frontier models used to trail closed ones by a wide margin. Mistral is now claiming the open lead on coding while pricing its API well below most closed frontier models, and it's betting that European banks, governments, and security teams will pay for a model they can inspect and host themselves.
