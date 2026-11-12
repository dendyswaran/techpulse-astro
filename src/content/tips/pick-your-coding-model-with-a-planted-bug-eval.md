---
title: "Pick your default coding model with a planted-bug eval on your own repo"
description: "Leaderboard scores bunch together, but cost per task doesn't. Before you switch your agent's default model, plant known bugs in your own code, run each candidate through the same harness, and compare bugs fixed per dollar."
pubDate: 2026-11-12T10:00:00+07:00
tags: ["model-routing", "evals", "token-cost", "coding-agents", "benchmarking"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "PawelHuryn"
    platform: x
    url: "https://x.com/PawelHuryn/status/2120283296550547618"
    note: "Bug Hunt Bench results: Gemini 4 Carbon vs Fable 5.2 vs Sonnet 5.5 and others on 105 planted bugs in 2 repos"
  - handle: "productcompass"
    platform: web
    url: "https://bughunt.productcompass.pm/"
    note: "Bug Hunt Bench: same prompt, each model in its own CLI, diff graded blind against an answer key"
---

## The problem

Every new frontier release comes with a benchmark chart, and you're expected to switch defaults. But public leaderboards rarely show what you actually pay per finished task in your stack, and close scores can hide big cost gaps.

## The tip

Measure it on code you own. @PawelHuryn's Bug Hunt Bench shows why. Each model gets the same prompt in its own agentic CLI, the task is to find and fix **105 planted bugs** across two repos, and an independent judge grades the diff against an answer key the model never sees. In his November 10 run, Fable 5.2 at max effort fixed 58 for about **$140**, while Gemini 4 Carbon at high fixed 57.3 for about **$31**. Roughly the same score, about 4.5x apart on cost. Effort level mattered too: Fable 5.2 at xhigh fixed 49 for about $61.

You can build a small version yourself in an afternoon:

1. Take 10–20 real bug-fix commits from your history and revert just the fix. Those are your planted bugs.
2. Store the original fixes as a private answer key the agent can't read.
3. Run each candidate model and effort level through the same harness and prompt.
4. Grade the diffs blind (a script, tests, or a separate judge model) and log cost and wall time.

## Example

```text
You are working in this repository. Some recent changes introduced bugs.
Find and fix as many real defects as you can. Run the test suite before
you finish. Do not modify tests. When done, list each fix with the file
and a one-line reason.
```

```bash
# same prompt, same repo snapshot, one run per model/effort
for m in fable-5.2:max gemini-4-carbon:high sonnet-5.5:xhigh; do
  git checkout planted-bugs && ./run-agent.sh "$m" prompt.txt > "runs/$m.diff"
done
./grade.sh runs/*.diff answer-key/   # fixed count + cost per run
```

Then route on the numbers: the cheapest model that's close to the top becomes your default executor, and the expensive one gets the hard escalations.

## When NOT to use it

Skip it for one-off or tiny projects, where the eval costs more than any savings. And don't trust a single run: repeat each configuration at least a few times, since agent runs vary.
