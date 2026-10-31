---
title: "Give your coding agent a way to check its own work"
description: "An agent that can run the tests, hit the endpoint, or open the page will catch its own mistakes before you do. Make verification part of the prompt, not an afterthought."
pubDate: 2026-10-31T09:00:00+07:00
tags: ["agents", "prompting", "verification"]
difficulty: beginner
author:
  name: Mazzden
sources:
  - handle: "bcherny"
    platform: x
    url: "https://x.com/bcherny/status/2007179861115511237"
    note: "Boris Cherny (creator of Claude Code), final tip in his Jan 2026 thread"
  - handle: "Claude Code docs"
    platform: web
    url: "https://code.claude.com/docs/en/chrome"
    note: "Browser-based testing for web UIs"
---

## The problem

Most agent sessions end with "Done! The feature is implemented." and no evidence. The model wrote code that looks right, but nothing ran it. You become the test suite, and every bug costs another round trip.

## The tip

Before the agent starts, tell it how to prove the change works, and make that proof the exit condition. The feedback loop matters more than the wording of the request: an agent that sees a failing test or a broken page will fix it on its own, while an agent that only reads code will confidently ship the bug.

What "verify" means depends on the work. For a library it is the unit tests. For a backend it is starting the service and calling the endpoint. For a UI it is opening the page in a real browser and clicking through the flow. Spend time making that command fast and reliable — it pays off on every task after.

Boris Cherny calls this "probably the most important thing" for good results with Claude Code. He also says it improves results by 2–3x. That is his own estimate from Anthropic's internal use, not a published benchmark, but the principle holds for any agent.

## Example

```text
Add rate limiting to POST /api/login (5 attempts per minute per IP).

Done means:
1. `npm test -- auth` passes, including a new test for the 6th attempt returning 429.
2. Start the dev server and run:
   for i in $(seq 1 6); do curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:3000/api/login; done
   The last line must be 429.
3. Paste the command output in your final message. Do not report success without it.
```

## When NOT to use it

Skip the full loop for throwaway spikes and one-line edits, where running the suite takes longer than reading the diff yourself.
