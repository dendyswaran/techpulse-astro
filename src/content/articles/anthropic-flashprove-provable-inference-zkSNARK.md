---
title: "Anthropic's FlashProve: Cryptographic Proofs That a Response Came From a Specific Model"
subtitle: "The Frontier Red Team's open-source zkSNARK prototype proves Llama 4 Maverick inference at about 110 tokens per second on one H100 — roughly 70–95× the cost of running the model itself."
pubDate: 2026-11-04
category: "ai"
tags: ["Anthropic", "FlashProve", "zkSNARK", "Provable Inference", "zkML", "Llama 4 Maverick", "AI Safety", "Frontier Red Team"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: true
coverImage: "/images/covers/anthropic-flashprove-provable-inference-zkSNARK.webp"
coverAlt: "Soft gouache illustration of a cream ledger block stamped with a muted teal seal, beside a small terracotta model silhouette on textured paper"
coverCaption: "Illustration by TechPulse Editorial · A fingerprint for the weights, without showing the weights."
tldr:
  - "On November 2, 2026, Anthropic's Frontier Red Team released FlashProve, an open-source zkSNARK system for provable inference: a short proof that a response came from a committed set of model weights, without revealing those weights."
  - "On Llama 4 Maverick (400B MoE, 4-bit), one H100 generates proofs at ~110 tokens/s with ~19 MB proofs per 1,024-token request — about 70–95× the GPU time of vLLM on the same model."
  - "The release includes a technical report, protocol spec, C++ and Lean verifiers, and Lean proofs of completeness, soundness and zero-knowledge. Code is Apache 2.0."
  - "It is a research prototype, not a production deployment. Limits include greedy integer decoding, MoE-only architecture, 1,024-token contexts, and no formal guarantee that the fast C++ code matches the Lean protocol."
sources:
  - label: "Anthropic — Progress on provable inference for large language models"
    url: "https://www.anthropic.com/research/provable-inference"
  - label: "GitHub — anthropics/FlashProve"
    url: "https://github.com/anthropics/FlashProve"
  - label: "TechCrunch — Anthropic is working on a system to prove AI models' identity"
    url: "https://techcrunch.com/2026/11/03/anthropic-is-working-on-a-system-to-prove-ai-models-identity/"
---

When you talk to a friend in person, you have many ways to know it is really them. When you talk to an AI model, you have almost none. On **November 2, 2026**, Anthropic's **Frontier Red Team** published **FlashProve**: an open-source system that attaches a cryptographic proof to a model response, so a user (or a regulator) can check that the tokens came from a specific committed set of weights — without ever seeing those weights.

## What "provable inference" means here

FlashProve is a **zkSNARK** (zero-knowledge succinct argument of knowledge) for LLM inference. In two phases:

1. **Offline.** The provider publishes a short **commitment** (fingerprint) to the model weights. The weights stay hidden.
2. **Online.** For each request, the provider returns the reply plus a proof that *the committed model*, run on that prompt, produces exactly those tokens.

Anyone who holds the commitment, the prompt and the reply can verify the proof. Completeness says an honest proof always verifies. Soundness says forging a proof of a false claim is computationally infeasible. Zero-knowledge says the proof leaks nothing about the weights (the architecture is not hidden). Succinctness says the proof is small and cheap to check relative to running the model.

## The numbers

Anthropic measured FlashProve on **Llama 4 Maverick** (400B-parameter mixture of experts, ~17B active per token), using a public 4-bit conversion:

| Metric | Result |
| --- | --- |
| Prover hardware | 1× H100 + 24 CPU cores |
| Offline commitment | ~39 minutes (good for ~16M requests) |
| Online throughput | ~110 tokens/s (batch of 24 × 1,024-token windows) |
| Proof size | ~18.8 MB per 1,024-token request |
| Verifier | ~17 s on 24 threads, no GPU |
| Overhead vs vLLM | ~70–95× GPU time |

Prior open-source zkML systems were orders of magnitude slower on models this large. VerInf, the only earlier public proof of the same Maverick model Anthropic cites, reported roughly 0.02 tok/s with a 93.6 GB proof. FlashProve's prover work scales with the experts that actually ran, batches requests post-hoc, and streams layer segments so a single 80 GB GPU is enough.

## Why Anthropic cares

The post maps the tool onto four trust problems:

- **Pacing / compute accounting.** A regulator can ask for certificates covering a period's inference traffic and check that the claimed model was actually served, without learning the weights.
- **Tamper detection.** A compromised server, or a stronger model substituting itself for a weaker one, cannot produce valid proofs for the expected commitment.
- **Text provenance.** A developer who claims "a frontier model scanned this library for bugs" can attach a proof instead of a forgeable chat log.
- **Model approval.** A regulator can require proofs that only approved models are being served.

Anthropic notes that a separate, related project already met its September 30, 2026 Frontier Safety Roadmap goal for "inference verification" by signing traffic and recomputing it on a trusted server. FlashProve pursues the same objective with cryptography alone. Trusted hardware and zkSNARKs are complementary, not substitutes.

## What's in the release

Five artifacts, Apache 2.0:

- The research post and a technical report
- A Claude-written protocol specification
- Executable code: a prover, a fast C++ verifier, and a Lean verifier
- Lean proofs of the top-level completeness, soundness and zero-knowledge statements, plus an interactive visualizer for auditing those statements

Collaborators include researchers from **EPFL**, **StarkWare**, **MIT** and Anthropic's fellows programs. The team is explicit that Claude contributed substantially to the zkSNARK engineering, and that Lean is there in part because agent-written crypto code is hard to evaluate by inspection.

## Limitations (read them)

This is a research prototype, not a product Anthropic plans to deploy tomorrow:

- Proofs cover an **exact integer** model under **greedy** decoding. Floating-point or sampled decoding can diverge.
- The system assumes a **Mixture-of-Experts** architecture and uses that structure for efficiency. Architecture hiding is future work.
- Contexts are capped at **1,024 tokens**.
- The fast C++ code has **no formal guarantee** that it matches the Lean protocol; the Lean verifier does.
- Side channels such as proof latency are out of scope.

## Bottom line

FlashProve does not make frontier models open. It makes a specific claim checkable: *these tokens came from these committed weights*. At roughly two orders of magnitude over native inference, that claim is no longer science fiction for a 400B MoE on a single H100. Whether providers will actually publish commitments and attach proofs is a product and policy question the research deliberately leaves open.
