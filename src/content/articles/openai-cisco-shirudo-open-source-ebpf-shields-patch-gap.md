---
title: "Shirudo: OpenAI and Cisco Open-Source an eBPF Runtime That Lets Agents Shield Running Linux Systems Before the Patch Lands"
subtitle: "Announced November 23, 2026, Shirudo ships signed eBPF and Java-bytecode 'shields' that block a vulnerable code path on a live system, with every load recorded in a TPM. In the demo, a Codex-generated shield stopped a Java4Shell exploit against a running Elasticsearch node without a restart. It's BSD-2 licensed, built from Isovalent's Tetragon lineage, and still pre-release."
pubDate: 2026-11-25
category: "tech-update"
tags: ["Shirudo", "eBPF", "OpenAI", "Cisco", "Isovalent", "Linux", "Runtime Security", "Open Source", "Codex"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/openai-cisco-shirudo-open-source-ebpf-shields-patch-gap.webp"
coverAlt: "Muted editorial illustration of a small paper shield slotted into a gap in a long running conveyor belt, while parcels keep moving past it"
coverCaption: "Illustration by TechPulse Editorial · Hold the line while the fix ships."
tldr:
  - "OpenAI and Cisco launched Shirudo (Japanese for 'shield') on November 23, 2026: an open-source, eBPF-based Linux security platform for blocking a vulnerable code path on a running system while the real patch rolls out."
  - "Mitigations, called shields or 'upatches', are eBPF programs or Java bytecode. They're signed, pulled from an OCI registry, verified by the kernel against a sealed keyring, and every change to the loaded set is measured into a TPM."
  - "In the demo, Codex generated a shield that adds an input check to java.util.Base64's decoder. Attached to a running Elasticsearch 9.5.5 node, it rejected a Java4Shell (CVE-2026-114938) exploit attempt without a restart. Cisco says it also blocked PHP2Shell attempts."
  - "Isovalent says Shirudo is a rewrite of Tetragon for agents: instead of a human policy language, agents write the mitigation as code. It runs as a one-shot CLI with no long-running daemon."
  - "It's BSD-2-Clause (BPF programs dual BSD/GPL) and explicitly pre-release. Production targets need a kernel with Shirudo's patches and signed-loader ABI, plus TPM 2.0."
sources:
  - label: "OpenAI — OpenAI and Cisco introduce Shirudo"
    url: "https://openai.com/index/introducing-shirudo"
  - label: "Cisco Newsroom — Cisco and OpenAI Launch Shirudo, A New Project to Safeguard Agentic AI"
    url: "https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2026/m11/cisco-and-openai-launch-shirudo-a-new-project-to-safeguard-agentic-ai.html"
  - label: "Isovalent (Thomas Graf, Liz Rice) — Cisco and OpenAI introduce Shirudo"
    url: "https://isovalent.com/blog/post/cisco-openai-shirudo/"
  - label: "GitHub — shirudo-dev/shirudo"
    url: "https://github.com/shirudo-dev/shirudo"
  - label: "shirudo.dev — project site and docs"
    url: "https://shirudo.dev/"
---

Our security coverage keeps hitting the same problem. A bug is disclosed, a patch ships, and then the patch takes days or weeks to reach everything, because testing and restarts are slow. [Java4Shell](/articles/java4shell-cve-2026-114938-openjdk-base64-decoder-rce) is a good example: a single JDK bug that touches almost every Java service. **Shirudo** is OpenAI and Cisco's attempt to cover that gap, and it's built for agents to drive.

## What it is

OpenAI and Cisco announced Shirudo on **November 23, 2026** as an open-source runtime "that helps operators protect running Linux systems without needing to wait for the patch or restarts." OpenAI describes the tradeoff it's built for: an exploit and a legitimate request often use the same Linux operation, so blocking that operation outright can take the service down. A Shirudo **shield** is meant to block only the behavior the exploit needs, test that legitimate traffic still gets through, and go live only after an operator approves it.

OpenAI lists four design goals:

- **Live protection:** eBPF shields block vulnerable code paths without a restart, and you can watch what a shield would do before enforcing it.
- **Defense at machine speed:** agents get programmable controls to investigate a bug, build a shield and validate it against both the exploit and real workloads. Humans decide what ships.
- **Trusted deployment:** shields are signed and verified before loading, and the kernel's eBPF verifier checks them against its safety rules.
- **Hardware-backed verification:** a TPM keeps a verifiable record of every protection loaded or removed.

## How it works

The [GitHub README](https://github.com/shirudo-dev/shirudo) and Isovalent's post fill in the mechanics:

- After boot, Shirudo **restricts BPF program loads to signed loaders**. Its guards attach from the initrd and protect Shirudo's own state, even from root on the target, unless the attacker also has the operator's signing key.
- Mitigations ship as **upatches**: small programs built, signed and pushed by an operator host to an **OCI registry** as `.bee` packages. Targets **pull** them with one-shot commands. There's no permanently running daemon on either side.
- Each change to the loaded set **extends a per-boot TPM register**, and `shirudo attest` returns TPM-signed evidence that an operator can verify offline.
- Shields aren't limited to the kernel. **Signed Java agents** are verified in userspace and loaded by configured JVMs, which is how the Java4Shell demo worked.

Isovalent's Thomas Graf and Liz Rice say Shirudo "has its roots in Tetragon," the eBPF runtime-security project Isovalent open-sourced in 2022. They call it a rewrite for the agentic era. Their argument is that human-oriented policy languages limit agents, so agents should write mitigations directly as code: eBPF or application bytecode.

## The Java4Shell demo

In Isovalent's walkthrough, Codex acts as the control plane. It takes the vulnerability information, builds and validates a reproducer, picks the best place to mitigate (eBPF or the Java runtime), and iterates until a shield works. For Java4Shell the result was **Java bytecode** that adds validation to `java.util.Base64$Decoder.decode0`. Attached to a running **Elasticsearch 9.5.5** node, the shield logged `Base64 guard rejected candidate` on the exploit input and Elasticsearch kept serving. Cisco says Shirudo also produced working detections and blocks for the PHP flaw ([PHP2Shell](/articles/php2shell-rce-cve-2026-109618-ditemukan-ai)). After deployment, the shield's "hit" count shows how often someone is trying to exploit the shielded bug.

## Caveats

- **It's pre-release.** The README says production targets need a Linux kernel with Shirudo's kernel patches and the signed-loader ABI, plus **TPM 2.0**. The quickstart runs in a local VM with a software TPM. CI covers x86-64, with host tests on arm64. riscv64 validation is pending.
- **A shield is not a patch.** OpenAI frames it as buying time, and its stated goal is to ship tested shields alongside vulnerability disclosures.
- **Approval stays with the operator.** The agent loop can be more or less autonomous, but both OpenAI and Cisco describe deployment as operator-gated.

## Why it matters for developers

If you run Linux services you can't restart on demand, such as JVM fleets, databases or appliances, Shirudo is worth trying in a lab now. It's **BSD-2-Clause**, with BPF programs dual-licensed BSD/GPL. There's a VM quickstart, an Isovalent self-guided lab, and a technical deep-dive webinar on **December 15**. The project is asking for reproducer tests, shields, and reports of where a shield breaks legitimate traffic.
