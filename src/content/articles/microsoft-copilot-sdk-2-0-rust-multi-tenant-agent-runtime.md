---
title: "Microsoft Copilot SDK 2.0: A Rust Runtime Hosts Many Agent Sessions in One Process, With Per-User Identity and No Shell by Default"
subtitle: "The SDK formerly called GitHub Copilot SDK no longer assumes one container per agent. Sessions are cheap, isolated and durable. They run as the requesting user, start with no ambient tools, and only move into a sandbox when the work needs a shell. Microsoft says a warm first turn dropped from 5.25 s to 55 ms."
pubDate: 2026-11-18
category: "tech-update"
tags: ["Microsoft", "GitHub", "Copilot SDK", "Agents", "Rust", "Multi-Tenancy", "Sandboxing", "Ignite 2026", "Agent Orchestration"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/microsoft-copilot-sdk-2-0-rust-multi-tenant-agent-runtime.webp"
coverAlt: "Risograph-style illustration of one long cream building with a row of identical small rooms, each window holding a different muted colour, while a single small slate-roofed shed stands apart on the right"
coverCaption: "Illustration by TechPulse Editorial · Many rooms under one roof, and a separate shed only for the messy work."
tldr:
  - "At Ignite on November 17, 2026, Microsoft renamed the GitHub Copilot SDK to the Microsoft Copilot SDK and shipped 2.0. It gives programmatic access to the same agent harness Microsoft uses across its products, with SDKs for TypeScript, Python, Go, .NET, Java and Rust."
  - "The runtime was rebuilt in Rust and now hosts many isolated sessions in one process. Each session has its own state, credentials, tools, files and history. Microsoft's warm benchmark: client + session + one turn went from 5.25 s (TypeScript CLI) to 55.3 ms in-process, memory for 10 clients from 1,383 MB to 126 MB, and throughput from 7.55 to 120 sessions/s."
  - "mode: \"empty\" starts a session with no host shell, no host files and no default tools. You register host-owned tools plus an explicit per-session allow-list. Each session can run under the requesting user's GitHub token (or a rotating token provider), so model and tool calls are attributed to that user, not your server."
  - "Sessions are durable. An append-only session journal plus a pluggable sessionFs lets any instance resume a session by ID. Besides classic container-per-session, Microsoft outlines shared, promote-to-sandbox, shared-loop-with-sandbox, coordinator/worker and mixed architectures on one runtime. It still recommends a container boundary for compiling code or running untrusted scripts."
sources:
  - label: "Microsoft Command Line — Building modern agentic applications with Microsoft Copilot SDK 2.0"
    url: "https://commandline.microsoft.com/microsoft-copilot-sdk-2-0-github/"
  - label: "Visual Studio Magazine — Microsoft Releases Copilot SDK 2.0 for Enterprise AI Agents"
    url: "https://visualstudiomagazine.com/articles/2026/11/17/microsoft-releases-copilot-sdk-2-0-for-enterprise-ai-agents.aspx"
  - label: "GitHub public roadmap — Copilot SDK 2.0 [GA]"
    url: "https://github.com/github/roadmap/issues/1398"
  - label: "Microsoft — Ignite 2026: Building the frontier ecosystem"
    url: "https://blogs.microsoft.com/blog/2026/11/17/ignite-2026-building-the-frontier-ecosystem/"
---

If you've built a product on an agent harness, you've probably used the **one-container-per-session** pattern. It's safe, but every chat waits for infrastructure, cost grows with the session count, and the agent acts as whatever identity started the process. **Microsoft Copilot SDK 2.0**, announced at Ignite on **November 17, 2026**, is GitHub's attempt to make that the exception rather than the default.

The SDK (renamed from *GitHub Copilot SDK*) exposes the same harness Microsoft runs behind Copilot products. Microsoft says it can drive "any inference" and run anywhere. It ships for **TypeScript, Python, Go, .NET, Java and Rust**, plus a C ABI for everything else.

## One runtime, many sessions

The core change is a **multi-tenant runtime rebuilt in Rust**. One process now holds many sessions, each with its **own state, credentials, tools, files and history**, and no session can see another. Creating a session doesn't start a container, process or VM.

Microsoft's numbers for a warmed workload (create client, create session, complete one turn):

| | TypeScript CLI (1.x) | Rust core, in-process (2.0) |
| --- | --- | --- |
| Time | 5.25 s | **55.3 ms** |
| Memory, 10 clients | 1,383 MB | **126 MB** |
| Throughput | 7.55 sessions/s | **120 sessions/s** |

These are Microsoft's own workload-specific numbers, not a promise about your app's speed. The runtime now runs **in-process by default**. It can also run as a child process or as a shared service, and the agent code stays the same.

## Nothing ambient, everything explicit

A shared runtime is only safe if sessions can't reach the host. `mode: "empty"` starts a session with **no host shell, no host file system and no default tools**. You register tools that run in *your* process against *your* data, then allow-list them per session:

```ts
const session = await client.createSession({
  gitHubToken: user.githubToken,          // or gitHubTokenProvider for rotating tokens
  mode: "empty",
  tools: [lookupOrder],
  availableTools: ["custom:lookup_order"], // explicit per-session allow-list
});
```

**Identity moves from the process to the session.** Pass the requesting user's credential, or a `gitHubTokenProvider` callback that fetches short-lived tokens, and every model and tool call is attributed to that user. That removes the usual "the agent runs as the service account" problem, though your tools still have to enforce tenant boundaries themselves.

## Sessions that outlive processes

Two abstractions make sessions durable:

- A **session journal**: an append-only event log of messages, tool calls, results, plans and checkpoints. Any runtime that can read it can resume the session with its full history.
- **`sessionFs`**: you decide where that journal and the session's files live (object storage, a database, tenant-scoped paths), so local disk becomes disposable.

In practice, any service instance can call `resumeSession(id)` after checking that the caller owns the session. A web client can disconnect while a long task keeps running. A teammate can attach Copilot CLI to inspect or steer it. Idle sandboxes can stop and resume with their disks intact. For several live clients on one session, the SDK can sit behind the open **Agent Host Protocol (AHP)**, which VS Code's agent host already uses.

## Pick where the agent thinks and where it acts

Microsoft splits the design into two questions: where the model loop runs and where shell and file work runs. Besides the classic container-per-session setup, the post walks through these architectures on one runtime:

1. **Shared sessions**: no sandbox, and tools are your APIs or MCP servers. Cheapest, but not enough for coding.
2. **Promote when needed**: start shared, then move a session one-way into its own sandbox when it needs a shell. Same ID, same history.
3. **Shared loop, sandboxed environment**: the model loop stays shared, while host-owned `bash`/`view`/`edit` tools execute inside a container that has no agent of its own.
4. **Coordinator and workers**: a coordinator fans out self-contained tasks to worker sessions, each in its own sandbox, and waits without spending model calls.
5. **Mixed**: a coordinator that has its own sandbox *and* delegates to workers. Most flexible, most complex.

Microsoft is explicit that sharing a runtime **is not** an isolation boundary for compiling code or running untrusted scripts. Those still need a container. If you don't want to host any of this yourself, Copilot cloud sandboxes and Foundry managed agents run the same harness for you.

## Why it matters

For teams building agent features into SaaS products, the expensive parts were usually cold starts, per-session containers and identity plumbing. 2.0 tackles all three. The design choices are also worth copying in your own harness even if you never use this SDK: empty-by-default tool surfaces, per-session identity, append-only journals, and sandboxes only for sessions that need them.
