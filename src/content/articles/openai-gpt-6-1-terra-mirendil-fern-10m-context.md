---
title: "OpenAI Ships GPT-6.1 Terra at Half the Price, While Newcomer Mirendil Debuts Fern with a 10M-Token Context"
subtitle: "A cheaper, faster computer-use model lands in ChatGPT Work, Codex, the API and Amazon Bedrock on the same day a new lab bets on extreme context length for agent workloads."
pubDate: 2026-10-27
category: "ai"
tags: ["OpenAI", "GPT-6.1 Terra", "Mirendil", "Fern", "Computer Use", "Amazon Bedrock", "Long Context"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "AI Research Editor"
featured: false
tldr:
  - "OpenAI released GPT-6.1 Terra (API id gpt-6.1-terra) on October 26, 2026, a fast, efficient model focused on visual reasoning, computer use, writing, and coding."
  - "Standard API prices are 50% lower than GPT-5.6 Terra and GPT-6.1 Sol; on Agents' Last Exam it scores 15 points above GPT-5.6 Terra at medium effort and matches GPT-6 Astra at about one-tenth the per-token price."
  - "Terminal-Bench 4.0 at max effort jumps to 50.3% (from 21.5% for GPT-5.6 Terra), and OpenAI's internal error-inducing prompt benchmark shows hallucination rates at low effort falling from 53.6% to 16.7%."
  - "AWS made GPT-6.1 Terra generally available on Amazon Bedrock the same day, with a context window of up to 1 million input tokens."
  - "Mirendil introduced Fern, its first from-scratch pretrained model, whose architecture and serving stack support up to 10M tokens of context for long-running agent work."
sources:
  - label: "OpenAI — Introducing GPT-6.1 Terra"
    url: "https://openai.com/index/introducing-gpt-6-1-terra"
  - label: "AWS — OpenAI GPT-6.1 Terra is now generally available on Amazon Bedrock"
    url: "https://aws.amazon.com/about-aws/whats-new/2026/10/openai-gpt-6-1-terra-on-amazon-bedrock/"
  - label: "Mirendil — Introducing Fern"
    url: "https://mirendil.com/news/introducing-fern/"
coverImage: "/images/covers/openai-gpt-6-1-terra-mirendil-fern-10m-context.webp"
coverAlt: "Editorial illustration of a botanical fern frond beside a relief terracotta sphere and unrolled paper scroll"
coverCaption: "Illustration by TechPulse Editorial · Frontier inference economics meet ultra-long-horizon context architectures."
---

October 26, 2026 brought two very different model launches. OpenAI pushed the price-performance curve with **GPT-6.1 Terra**, a workhorse model built for the computer-based tasks that fill a normal workday. Meanwhile a new lab, **Mirendil**, came out of stealth with **Fern**, a model whose defining trait is a context window of up to 10 million tokens.

## GPT-6.1 Terra: computer use at scale, for less

OpenAI positions GPT-6.1 Terra as "a significant step up" from GPT-5.6 Terra. It combines detailed visual reasoning and precise computer use with clearer writing, and it's aimed at work like drafting proposals, interpreting technical drawings, filling out forms, and editing video.

The headline is cost. Standard API prices are **50% lower than GPT-5.6 Terra and GPT-6.1 Sol**, and in ChatGPT Work and Codex the same usage allowance covers more tasks than the previous Terra model. OpenAI explicitly pitches it for high-volume automation, such as reading incoming invoices and entering them into accounting software.

### What the benchmarks say

All figures below are OpenAI's own published results:

- **Agents' Last Exam** (professional computer-use tasks): at medium reasoning effort, 15 percentage points above GPT-5.6 Terra at roughly one-third the cost, and on par with GPT-6 Astra at about one-tenth its per-token price. OpenAI also says it completes tasks more than three times faster than GPT-6 Astra and GPT-6.1 Sol.
- **MMMU-Pro** (visual reasoning): beats GPT-5.6 Terra at every reasoning setting and nearly matches GPT-6 Astra and GPT-6.1 Sol.
- **OSWorld 2.1** (multistep desktop tasks): at medium effort it surpasses GPT-5.6 Terra's best score.
- **Terminal-Bench 4.0** (command-line coding agents): 50.3% at max effort, more than double GPT-5.6 Terra's 21.5%. OpenAI still recommends GPT-6.1 Sol or GPT-6 Astra for the hardest coding work.
- **Factuality**: on OpenAI's internal set of error-inducing prompts, the error rate at low effort dropped from 53.6% to 16.7%, and to 4.3% at max effort.

On safety, OpenAI says GPT-6.1 Terra meets the **Critical** cybersecurity threshold under its Preparedness Framework and keeps the safeguards built for GPT-6 Astra. That's worth noting for anyone deploying it in security-sensitive agent pipelines.

### Availability

The model is live in ChatGPT Work, Codex, and the API as `gpt-6.1-terra`. AWS announced general availability on **Amazon Bedrock** the same day, with support for up to 1 million input tokens and both text and image input. Teams can call it through Bedrock APIs directly or point ChatGPT Work and Codex at Bedrock.

## Mirendil Fern: betting on 10 million tokens

Mirendil's debut takes a different angle. **Fern** is pretrained from scratch, and the company says its architecture, training, and serving can hold up to **10M tokens** at once. Mirendil frames that as about 23 MB of code, roughly half a million lines, which is enough for an entire large codebase, dozens to hundreds of complete agent traces, or days of an agent's work in one context.

The first public version, **Fern 0.1**, was finished with only a short round of post-training, and Mirendil says new versions will ship frequently. Its launch page lists two base models, Mirendil-Base-Large (0.5–2T parameters) and Mirendil-Base-XL (2–10T parameters), though many details such as access and pricing weren't filled in at publication.

## Why it matters for developers

These launches pull in two directions. Terra makes "good enough" computer-use agents much cheaper to run at volume, which changes the math for back-office automation. Fern tests whether extreme context length can replace some of the retrieval and summarization plumbing that long-running agents depend on today. Both are early: Terra's numbers are vendor-reported, and Fern is a 0.1 release. Benchmark them on your own workloads before switching anything in production.
