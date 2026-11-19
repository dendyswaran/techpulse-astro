---
title: "Microsoft's agent-framework PyPI Package Shipped a Credential Stealer: Versions 1.26.1 and 1.26.2"
subtitle: "Two malicious releases of Microsoft Agent Framework went out on November 17, 2026. A .pth hook ran the stealer every time Python started in that environment, even if the package was never imported. Wiz says the attacker appears to have used a stolen Microsoft release-pipeline signing certificate."
pubDate: 2026-11-19
category: "security"
tags: ["Supply Chain", "PyPI", "Python", "Microsoft", "Agent Framework", "Azure", "GitHub Actions", "Credential Theft"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
severity: "CRITICAL"
affectedVersions: "agent-framework 1.26.1 and 1.26.2 on PyPI (published November 17, 2026, now removed)"
patchedVersions: "agent-framework 1.26.0 (last known-good release)"
coverImage: "/images/covers/microsoft-agent-framework-pypi-compromise-credential-stealer-pth.webp"
coverAlt: "Ink-and-wash illustration of a row of identical cream parcels on a long wooden shelf, one of them with a thin dark thread trailing from a small tear and out through an open window"
coverCaption: "Illustration by TechPulse Editorial · One parcel in the row was not like the others."
tldr:
  - "On November 17, 2026 at 20:35 UTC, a malicious agent-framework 1.26.1 appeared on PyPI, followed by 1.26.2. Both were gone by about 21:30 UTC. The package (Microsoft Agent Framework) gets roughly 200,000 downloads a month. Last safe version: 1.26.0."
  - "Each version dropped a .pth file into site-packages (agent_framework_meta.pth in 1.26.1, af_runtime_diag.pth in 1.26.2). Python runs .pth files at every interpreter start, so the stealer ran whenever Python started in that environment, whether or not your code imported agent-framework."
  - "The stealer focused on Azure and Azure DevOps: secret-looking environment variables, up to 300 other processes' environments, credential files (Azure CLI, .npmrc, pip.conf, .git-credentials, Docker, Hugging Face), managed-identity tokens for 12 Azure resources and Azure DevOps OIDC tokens. 1.26.2 added GitHub Actions OIDC token requests."
  - "Wiz says the attacker appears to have used a stolen client certificate and key for Microsoft's ESRP release pipeline. Exfiltration went to a free-tier webhook.site URL capped at 100 requests; Wiz counted 50 stored requests and three unique real victims among them. If you installed either version, treat the machine as compromised and rotate everything it could reach."
sources:
  - label: "Wiz Research — Microsoft agent-framework Compromised: Credential Stealer Targets Azure and CI Pipelines"
    url: "https://www.wiz.io/blog/malicious-version-of-microsofts-agent-framework-published-to-pypi"
  - label: "GitHub Advisory Database — Malicious code in agent-framework (PyPI), GHSA-764m-3ppc-5m73"
    url: "https://github.com/advisories/GHSA-764m-3ppc-5m73"
  - label: "OSV — PYSEC-2026-4388"
    url: "https://osv.dev/vulnerability/PYSEC-2026-4388"
  - label: "BleepingComputer — Microsoft's Agent Framework PyPI package compromised to steal credentials"
    url: "https://www.bleepingcomputer.com/news/security/microsofts-agent-framework-pypi-package-compromised-to-steal-credentials/"
  - label: "SecurityWeek — Microsoft Agent Framework Releases Poisoned With Credential Stealer"
    url: "https://www.securityweek.com/microsoft-agent-framework-releases-poisoned-with-credential-stealer/"
---

**Microsoft Agent Framework** is Microsoft's open-source toolkit for building AI agents and multi-agent workflows. On **November 17, 2026**, two releases of its Python package on PyPI, **`agent-framework` 1.26.1 and 1.26.2**, shipped with a credential stealer. Wiz, Socket, StepSecurity and OX Security all documented it. The package gets about **200,000 downloads a month** (Wiz puts it at about 41,000 a week).

The timeline from Wiz, in UTC (add 7 hours for WIB):

| Time (UTC) | Event |
| --- | --- |
| Nov 12, 18:25 | Legitimate **1.26.0** published |
| Nov 17, 20:35 | Malicious **1.26.1** published |
| Nov 17, ~21:08 | Malicious **1.26.2** published |
| Nov 17, ~21:30 | Both versions no longer available on PyPI |

Both malicious versions kept their dependency on the real `agent-framework-core` 1.26.0, so the framework worked normally while the stealer ran in the background. BleepingComputer notes that the attacker still had publishing access after PyPI quarantined the first release.

## Why a .pth file is so effective

Python processes every `.pth` file in `site-packages` **when the interpreter starts**, and any line beginning with `import` gets executed. The malicious wheels dropped:

- **1.26.1:** `agent_framework_meta.pth` → imports `agent_framework_meta`, whose `_telemetry.py` starts the stealer.
- **1.26.2:** the package initializer is restored to the clean 1.26.0 file, and a new top-level `af_runtime_diag.pth` imports `af_runtime_diag.py` instead. **If you only search for the 1.26.1 file names, you'll miss it.**

The result: **any** Python process in that virtualenv, container or CI runner ran the payload. That includes test runners, linters and unrelated scripts, even if nothing ever imported `agent_framework`. The stealer forks into a detached session, sets `_AF_TEL=1` so it runs only once, and uses names like "runtime diagnostics" to pass as SDK telemetry.

## What it stole

According to Wiz, the payload targets **Azure and Azure DevOps** in particular:

- environment variables whose names contain `TOKEN`, `SECRET`, `PASSWORD`, `KEY`, `AZURE`, `AWS`, `GITHUB`, `OPENAI`, `HF_`, `FOUNDRY`, `NPM` and similar;
- secret-looking values from up to **300** other processes' `/proc/*/environ`;
- credential files: `~/.azure/`, `.npmrc`, `pip.conf`, `.netrc`, `.git-credentials`, `.docker/config.json`, Hugging Face tokens, Azure DevOps agent credentials, `.env`/JSON under `/app` and `/workspace`;
- **managed-identity tokens** from IMDS or App Service for 12 resources (ARM, Graph, Key Vault, Storage, Container Registry, Azure DevOps and others) and **Azure DevOps OIDC tokens**.

**1.26.2** added **GitHub Actions OIDC** theft. In workflows with `id-token: write`, it requests tokens for `api://AzureADTokenExchange` and `https://management.azure.com/`. Where an Entra ID federated credential trusts the workflow, those tokens can become Azure access **without any stored secret**.

Everything went in a single compressed POST to a hardcoded `webhook.site` URL, with no fallback channel.

## How it got published

Wiz could watch part of the operation because the attacker's tooling reported its progress to the same public webhook. Wiz's assessment is that the attacker **compromised a client certificate and private key for Microsoft ESRP** (Engineering System Release Pipeline), the internal service that signs and publishes the package. A first publish attempt from AWS was rejected by ESRP's IP filtering. A second, from **Microsoft-owned IP space**, succeeded. How the credentials were obtained is not yet known. The tooling identified itself as **Cairn**, an open-source AI penetration-testing framework.

There's one lucky break. The webhook was on webhook.site's **free tier**, which stores at most 100 requests and expires after 7 days. Wiz analyzed the **50** stored requests: 4 came from the attacker, 29 from sandboxes, scanners and tests, and 17 represent **three unique real victims**. On the free tier, requests beyond the cap are rejected with HTTP 410 or 429 and aren't logged.

## What to do

1. **Find exposure.** Search lockfiles, CI logs, virtualenvs and container images for `agent-framework==1.26.1` or `1.26.2`. Pin to **1.26.0**.
2. **Check for execution.** Look in `site-packages` for `agent_framework_meta.pth`, `agent_framework_meta/_telemetry.py`, `af_runtime_diag.pth` or `af_runtime_diag.py`.
3. **Check egress** for `webhook.site/d381fd80-ec62-42ad-8f5c-d1b15103c9bb`. A 200 response means that host's data was accepted.
4. **Rotate** everything the environment could reach: env secrets, Azure CLI sessions, Azure DevOps PATs and service connections, npm/PyPI/NuGet/Docker/Hugging Face tokens, git credentials.
5. **Audit Azure identities.** Review sign-ins for managed identities and federated credentials reachable from affected VMs, App Services, AKS nodes and pipelines. Stolen managed-identity and OIDC-exchanged tokens stay valid for up to 24 hours.
6. **Rebuild** from a clean environment instead of trying to clean the infected one.

The longer-term lesson is about CI defaults: lockfiles with hashes, a cooldown before adopting brand-new releases, and `id-token: write` only on jobs that need it. Each of these limits exposure to a poisoned release like this one, even when the release came through what looked like a legitimate publishing pipeline.
