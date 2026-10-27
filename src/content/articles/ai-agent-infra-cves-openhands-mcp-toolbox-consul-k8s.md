---
title: "Critical CVEs Hit AI Agent and Cloud Infrastructure: OpenHands SDK RCE, Google MCP Toolbox File Exfiltration, and Consul-k8s ACL Bypass"
subtitle: "Three critical advisories published on October 26, 2026 share one lesson: default-open settings in agent sandboxes, MCP servers, and service meshes are an attack surface."
pubDate: 2026-10-27
category: "security"
tags: ["CVE-2026-112346", "CVE-2026-93328", "CVE-2026-110720", "OpenHands", "MCP", "Consul", "Kubernetes", "AI Agents"]
readingTime: "6 min read"
author:
  name: "Mazzden"
  role: "Principal Security Analyst"
featured: true
tldr:
  - "CVE-2026-112346 (CVSS 4.0 9.3): OpenHands Software Agent SDK before 1.52.0 binds its sandbox agent server to 0.0.0.0 with authentication disabled, letting anyone who can reach the port run commands as root and read plaintext secrets. Upgrade to 1.52.0."
  - "CVE-2026-93328 (CVSS 4.0 9.3): Google Cloud MCP Toolbox for Databases 1.2.0 through 1.4.0 lets unauthenticated callers read, overwrite, or exfiltrate host files through the cloud-storage source. Upgrade to 1.5.0 and explicitly set allowedBuckets and allowedLocalRoots."
  - "CVE-2026-110720 (CVSS 3.1 9.9, HCSEC-2026-50): consul-k8s 0.42.0 up to 2.0.4 with manageSystemACLs=true lets a ServiceAccount from another namespace impersonate a Consul component. Upgrade to 2.1.0 or 1.8.18."
  - "None of the three were in CISA's KEV catalog at publication, but all are low-complexity and network-reachable, so patch before exploitation starts."
cveIds: ["CVE-2026-112346", "CVE-2026-93328", "CVE-2026-110720"]
severity: "CRITICAL"
cvss: 9.9
affectedVersions: "OpenHands SDK < 1.52.0; MCP Toolbox 1.2.0–1.4.0; consul-k8s 0.42.0 up to 2.0.4"
patchedVersions: "OpenHands SDK 1.52.0; MCP Toolbox 1.5.0; consul-k8s 1.8.18, 2.1.0"
sources:
  - label: "VulnCheck — OpenHands Software Agent SDK Unauthenticated Sandbox Agent Server RCE"
    url: "https://www.vulncheck.com/advisories/openhands-software-agent-sdk-unauthenticated-sandbox-agent-server-rce"
  - label: "OpenHands software-agent-sdk v1.52.0 release"
    url: "https://github.com/OpenHands/software-agent-sdk/releases/tag/v1.52.0"
  - label: "OpenCVE — CVE-2026-93328 (MCP Toolbox for Databases)"
    url: "https://app.opencve.io/cve/CVE-2026-93328"
  - label: "googleapis/mcp-toolbox v1.5.0 release"
    url: "https://github.com/googleapis/mcp-toolbox/releases/tag/v1.5.0"
  - label: "HashiCorp HCSEC-2026-50 — Consul-k8s cross-namespace authorization bypass"
    url: "https://discuss.hashicorp.com/t/hcsec-2026-50-consul-k8s-vulnerable-to-a-cross-namespace-authorization-bypass-in-component-acl-binding-rules/77915"
  - label: "CVE Record — CVE-2026-110720"
    url: "https://www.cve.org/CVERecord?id=CVE-2026-110720"
---

NVD published 759 CVEs on October 26, 2026, and most of them won't matter to a typical engineering team. Three do. They sit in the layer that's grown fastest this year, the tooling that runs AI agents and the cloud plumbing underneath it, and all three come down to the same root cause: a default that trusts anyone who can reach the network.

## CVE-2026-112346: OpenHands SDK sandbox open to the network

**Product:** OpenHands Software Agent SDK  
**Affected:** all versions before 1.52.0  
**Severity:** Critical, CVSS 4.0 score 9.3 (`AV:N/AC:L/AT:N/PR:N/UI:N`)  
**Weakness:** CWE-1327, binding to an unrestricted IP address

The `DockerWorkspace` and Apptainer workspace launchers start the sandbox agent server listening on **all interfaces (`0.0.0.0`)** with an **empty `session_api_keys` list**, which turns authentication off. Anyone who can reach the published container port can send unauthenticated HTTP and WebSocket requests to:

- run arbitrary shell commands **as root** inside the sandbox,
- read and modify the mounted workspace (usually your source code), and
- read **plaintext secrets** from the secrets store.

That last point is what makes this serious. Agent sandboxes typically hold API keys for model providers, Git hosts, and cloud accounts, so a sandbox takeover can quickly become a wider account compromise.

**Fix:** upgrade to SDK **1.52.0**, which ships the change in pull request #5209. Until you can, bind the agent server to loopback, firewall the published port, and rotate any secrets that lived in exposed sandboxes.

## CVE-2026-93328: MCP Toolbox for Databases reads and writes any file

**Product:** Google Cloud MCP Toolbox for Databases (`googleapis/mcp-toolbox`)  
**Affected:** 1.2.0 through 1.4.0  
**Severity:** Critical, CVSS 4.0 score 9.3  
**Weakness:** CWE-862 missing authorization, plus path traversal

The `cloud-storage` source had no restriction on which buckets or local paths a tool call could touch. With crafted tool parameters, an unauthenticated caller can **copy host files out to an attacker-controlled Google Cloud Storage bucket** or **overwrite arbitrary local files** on the Toolbox host.

Version **1.5.0** adds `allowedBuckets` and `allowedLocalRoots`, but there's a catch: if you leave those fields out, **all buckets and all paths are still allowed**. Upgrading alone doesn't close the hole. You also need to:

1. Set `allowedBuckets` to only the buckets the source needs.
2. Set `allowedLocalRoots` to dedicated, isolated directories.
3. Run Toolbox as an unprivileged OS user with tightly scoped IAM roles.
4. Keep the endpoint off the public network or behind an authenticating gateway.

This one is a good reminder that an MCP server is effectively a remote API for whoever can call its tools, whether that's your agent or an attacker using prompt injection.

## CVE-2026-110720: consul-k8s cross-namespace ACL bypass (HCSEC-2026-50)

**Product:** HashiCorp consul-k8s  
**Affected:** 0.42.0 up to 2.0.4  
**Severity:** Critical, CVSS 3.1 score 9.9 (`AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H`)  
**Weakness:** CWE-863, incorrect authorization

When `global.acls.manageSystemACLs=true`, consul-k8s creates ACL binding rules so its components can trade Kubernetes ServiceAccount tokens for Consul tokens. Those rules didn't consistently require the ServiceAccount to live in the Consul deployment's own namespace. An attacker who can create a ServiceAccount in **any other namespace**, get its token, and reach the Consul API can authenticate **as a Consul component** and inherit its privileges.

In multi-tenant clusters where teams can create ServiceAccounts in their own namespaces, that's a direct path from tenant to mesh-level control. Deployments with system ACL management turned off aren't affected.

**Fix:** upgrade to consul-k8s **2.1.0** or **1.8.18**. Until then, audit which principals can create ServiceAccounts and request tokens, and limit network access to the Consul API.

## Patch checklist

| CVE | Component | Upgrade to | Extra step |
| --- | --- | --- | --- |
| CVE-2026-112346 | OpenHands Software Agent SDK | 1.52.0 | Rotate secrets from exposed sandboxes |
| CVE-2026-93328 | MCP Toolbox for Databases | 1.5.0 | Set `allowedBuckets` and `allowedLocalRoots` |
| CVE-2026-110720 | consul-k8s | 2.1.0 or 1.8.18 | Review ServiceAccount creation rights |

None of the three were on CISA's Known Exploited Vulnerabilities list at publication. All of them are low-complexity and need no user interaction, though, so treat them as patch-now items for any internet-reachable or multi-tenant deployment.
