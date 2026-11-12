---
title: "AWS Emulator Runs AWS on Your Laptop, and No Human Wrote or Reviewed Its Code"
subtitle: "AWS released a free local emulator that answers real AWS SDK and CLI calls in milliseconds, so developers and coding agents can test without an account. Three teams of autonomous agents wrote all of it, gated by tens of thousands of fidelity tests checked against real AWS."
pubDate: 2026-11-12
category: "tech-update"
tags: ["AWS", "AWS Emulator", "Local Development", "Testing", "CI", "AI Agents", "Autonomous Coding", "Kiro"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/aws-emulator-local-aws-built-by-autonomous-agents.webp"
coverAlt: "Risograph-style illustration of a small terracotta architectural model of a building sitting on a wooden table, in front of a large faint cream silhouette of the same building, with an ochre sun in the corner and a sage floor"
coverCaption: "Illustration by TechPulse Editorial · A tabletop copy of the cloud, built to be checked against the real thing."
tldr:
  - "AWS Emulator, released November 11, 2026, runs on your machine or in CI and accepts the same AWS SDK and CLI calls you send to AWS, signed with credentials it provides. No AWS account or deployment needed."
  - "For supported operations it returns the same results and errors as AWS; unsupported ones return 501 Not Implemented. State lives in memory, and each copy gets its own port, keys and state, so parallel agents and test jobs don't collide."
  - "Services are generated from AWS's published API models. There's no service fee, it doesn't depend on a Region, and the source is public domain under CC0."
  - "According to AWS, autonomous agents wrote 100% of the code without human review. Three agent teams write fidelity tests against real AWS, find divergences, and fix them through a merge gate that includes review agents."
sources:
  - label: "AWS What's New — AWS Emulator is now available (Nov 11, 2026)"
    url: "https://aws.amazon.com/about-aws/whats-new/2026/11/aws-emulator-now-available/"
  - label: "About Amazon — How we built the agents that built AWS Emulator (Matthew Goldberg)"
    url: "https://www.aboutamazon.com/news/aws/how-autonomous-ai-agents-built-aws-emulator"
---

AWS has released **AWS Emulator**, a local emulator of AWS services that you run on your own computer or in a CI job. It went out on **November 11, 2026** with no service fee and its source code under the **CC0 1.0** public-domain dedication. The unusual part is how it was built: AWS says **autonomous agents wrote every line, and its team hasn't written or reviewed any of the code**.

## What it does

You point your existing **AWS SDK and CLI** calls at the emulator, signed with credentials it hands out, and get answers back in milliseconds. AWS's description of how it behaves:

- **Same results, same errors.** For operations it supports, it returns what AWS returns for valid calls and the same errors for invalid ones. Unsupported operations return **501 Not Implemented**, so a gap is visible rather than silently wrong.
- **In-memory and isolated.** Resource state lives in memory until you stop it. **Each copy gets its own port, keys and state**, so agents, test suites and CI jobs never see each other's resources.
- **Generated from the API models.** Services come from the same published API models behind the SDKs. New services and APIs show up as AWS adds them, with behavior filled in and verified release by release. A public **fidelity report** shows how its responses compare to AWS.
- **No Region, no account.** You pay only when you deploy to real AWS.

The launch post is explicit about who it's for: "you and your coding agents." Its example is an agent that creates a DynamoDB table, tests against it offline and fixes its code before deploying.

## How the agents built it

Senior Principal Engineer **Matthew Goldberg** describes the process. It started as a weekend experiment, inspired by Anthropic's demonstration of agents building a C compiler. The idea: AWS's API models are the spec and the real cloud is the reference implementation. He asked **Kiro** to write CLI-based tests, iterate until they passed against real AWS, then build an in-memory implementation that passed the same tests. A rough SQS came back in 15 minutes, and his team was using a rough "rest of AWS" by Monday.

Turning that into a product took guardrails. The system now runs **three teams of agents**:

1. **Test writers** build fidelity tests from the published API models and **verify each one against real AWS** before submitting. There are tens of thousands across AWS, and the suite keeps growing.
2. **Issue finders** replay those tests against the emulator and file issues for failures, grouping ones that seem to share a root cause. The repo started as an empty web server answering requests for **438 API models**.
3. **Fixers** each take one issue, root-cause it and change code. Every change goes through a **merge gate**: it must compile, pass review agents for coding standards and security, and not regress fidelity. Anything that fails goes back for rework.

AWS says thousands of issues are fixed per day by hundreds of concurrent agents. Code flows through AWS CodeCommit and a release pipeline, and is published to GitHub only at the end. The repo includes every issue the agents filed, split into `issues/things-that-now-work` and `issues/things-that-do-not-work`. One anecdote: an earlier version of the agents decided to write their own Python interpreter to support Lambda. They have since been told to reuse existing libraries.

## Why it matters for developers

- **Agent-friendly test loops.** Coding agents are only as good as the feedback they get. A local AWS that gives real error shapes in milliseconds, with isolated state per copy, is a much tighter loop than deploying to a sandbox account.
- **A reference design for agent teams.** The pattern is the interesting part: an executable spec, a reference implementation to verify tests against, narrow per-issue tasks, and a strict automated merge gate. That's what let AWS skip human code review, and it only works because "correct" is defined by tests checked against the real system.
- **Know the limits.** Check the fidelity report before relying on a service. Treat 501s as a list of what to keep testing in the cloud, and don't use emulator results as a substitute for IAM, quota and networking tests against real AWS.
