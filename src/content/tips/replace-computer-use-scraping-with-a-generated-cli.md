---
title: "Stop paying for computer-use loops: have the agent write a CLI for the site's HTTP calls"
description: "If your agent drives a browser over and over to read the same site, have it reverse-engineer the requests behind the page once and wrap them in a small CLI. Each run after that is a fast, deterministic call instead of an LLM re-reading the page."
pubDate: 2026-11-03T11:00:00+07:00
tags: ["computer-use", "token-cost", "tooling", "agents", "automation"]
difficulty: intermediate
author:
  name: Mazzden
sources:
  - handle: "vivekhaldar"
    platform: x
    url: "https://x.com/vivekhaldar/status/2117293019586334871"
    note: "Original tip: reverse-engineer the HTTP calls and write a CLI instead of using browser computer-use"
  - handle: "stretchcloud"
    platform: x
    url: "https://x.com/stretchcloud/status/2117333169137766628"
    note: "Explains why the token bill grows with how often you scrape: the LLM re-reads the page on every pass"
---

## The problem

Browser computer-use is the easiest way to get an agent to pull data from a site, and one of the most expensive ways to keep doing it. Every run, the model looks at screenshots or DOM dumps, decides where to click, waits, and reads the page again. As @stretchcloud puts it, the token bill grows with how *often* you scrape, not with how much useful data you get. It's also slow and flaky.

## The tip

@vivekhaldar's version: "ask your agent to reverse-engineer the HTTP calls behind it and write a CLI tool". Do the expensive exploration once. Have the agent watch the network requests the page makes (DevTools/HAR export or a Playwright trace), find the JSON endpoint that actually returns the data, and wrap it in a small script with a typed output. From then on, the agent runs a shell command. The LLM only comes back in when the CLI breaks because the site changed.

Keep credentials out of the code. Read the session cookie or token from an environment variable or a local, git-ignored file, never from the prompt or the repo.

## Example

```text
Here's a HAR export of me loading my orders page (orders.har).
1. Find the request(s) that return the order data as JSON.
2. Write scripts/orders.py: a CLI that calls that endpoint with the
   session cookie from $SHOP_SESSION, handles pagination, and prints
   JSON lines {id, date, total, status}.
3. Fail loudly with a non-zero exit code on 401/403 or a schema change.
4. Don't hard-code cookies or tokens. Add a --since flag.
Then run it once and show me the first 3 lines.
```

After that, the agent's tool call is `python scripts/orders.py --since 2026-10-01`. That costs a few hundred tokens instead of a browser session.

## When NOT to use it

Don't do this where the site's terms forbid automated access, on accounts you don't own, or when a proper API or MCP server already exists. Use that instead. For one-off tasks it isn't worth it, and computer-use is fine.
