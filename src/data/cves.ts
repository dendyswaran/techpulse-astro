import type { CollectionEntry } from 'astro:content';

export interface CveReference {
  label: string;
  url: string;
}

export interface CveRecord {
  /** Canonical uppercase identifier (e.g. "CVE-2026-108142" or "GHSA-cf8x-9m69") */
  id: string;
  /** Lowercase URL path parameter (e.g. "cve-2026-108142") */
  slugId: string;
  vendor: string;
  product: string;
  component: string;
  shortLabel: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  cvss: string;
  cwe: string;
  vector: string;
  priority: string;
  publishedDate: string;
  affected: string;
  patched: string;
  /** Slug of the primary TechPulse deep-dive article */
  articleSlug: string;
  summary: string;
  remediationSteps: string[];
  references: CveReference[];
}

export function toCveSlug(id: string): string {
  return id.trim().toLowerCase();
}

export const CURATED_CVE_RECORDS: CveRecord[] = [
  {
    id: 'CVE-2026-119025',
    slugId: 'cve-2026-119025',
    vendor: 'sindresorhus (npm open) / Model Context Protocol / OpenCode',
    product: 'npm open; MCP Inspector; OpenCode',
    component: 'Windows/WSL PowerShell URL launcher (index.js -EncodedCommand)',
    shortLabel: 'npm open PowerShell Injection',
    severity: 'HIGH',
    cvss: '7.7 (CVSS 4.0, VulnCheck)',
    cwe: 'CWE-78 (OS Command Injection)',
    vector: 'Network; a malicious or hijacked remote MCP server supplies a crafted OAuth authorization URL that runs when the client connects (Windows and WSL only)',
    priority: 'P1 — Update Developer Tooling on Windows/WSL Now',
    publishedDate: '2026-10-29',
    affected: 'open 7.2.0 to before 11.0.0; MCP Inspector 2.0.0–2.11.0; OpenCode 1.0.137–1.18.32',
    patched: 'open 11.0.0; MCP Inspector 2.12.0; OpenCode 1.18.33',
    articleSlug: 'ai-dev-tool-cves-npm-open-cve-2026-119025-langflow-mcp',
    summary:
      'On Windows and WSL, the npm package open placed the target URL unescaped inside a PowerShell double-quoted string and executed it with -EncodedCommand. Because PowerShell evaluates $(...) subexpressions and URL serialization preserves those characters, a remote MCP server can return an OAuth authorization_endpoint containing a payload that runs as soon as MCP Inspector or OpenCode connects, with no tool call or approval.',
    remediationSteps: [
      'Upgrade open to 11.0.0 or later in projects and global tools (check with npm ls open).',
      'Upgrade MCP Inspector to 2.12.0 and OpenCode to 1.18.33 or later.',
      'Only connect MCP clients to trusted remote servers and remove stale server entries whose domains you no longer control.',
    ],
    references: [
      { label: 'VulnCheck Advisory — CVE-2026-119025', url: 'https://www.vulncheck.com/advisories/open-7.2.0-before-11.0.0-os-command-injection-via-powershell-on-windows' },
      { label: 'GHSA-q978-78c7-phqw — MCP Inspector', url: 'https://github.com/modelcontextprotocol/inspector/security/advisories/GHSA-q978-78c7-phqw' },
      { label: 'NVD — CVE-2026-119025', url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-119025' },
    ],
  },
  {
    id: 'CVE-2026-110186',
    slugId: 'cve-2026-110186',
    vendor: 'IBM / Langflow',
    product: 'Langflow OSS',
    component: 'Code generation service (reachable through MCP tool enumeration)',
    shortLabel: 'Langflow Unauthenticated RCE',
    severity: 'CRITICAL',
    cvss: '9.8 (CVSS 3.1, IBM)',
    cwe: "CWE-94 (Improper Control of Generation of Code ('Code Injection'))",
    vector: 'Network; unauthenticated (AV:N/AC:L/PR:N/UI:N)',
    priority: 'P0 — Patch Internet-Facing Langflow Immediately',
    publishedDate: '2026-10-29',
    affected: 'Langflow OSS 1.0.0 through 1.12.8',
    patched: 'Langflow OSS 1.13.0',
    articleSlug: 'ai-dev-tool-cves-npm-open-cve-2026-119025-langflow-mcp',
    summary:
      'Langflow OSS could allow a remote, unauthenticated attacker to execute arbitrary code due to improper control of code generation. IBM says the flaw is exploitable through model context protocol (MCP) tool enumeration. It was disclosed alongside an auto-login authentication bypass and several authenticated code execution bugs.',
    remediationSteps: [
      'Upgrade to Langflow OSS 1.13.0 or later (pip or the langflowai/langflow:1.13.0 image); IBM lists no workarounds.',
      'Back up the database, secret key, and uploaded files before upgrading.',
      'Remove public internet exposure and rotate API keys stored in flows if the instance was reachable.',
    ],
    references: [
      { label: 'IBM Security Bulletin — Langflow OSS', url: 'https://www.ibm.com/support/pages/security-bulletin-langflow-oss-affected-multiple-vulnerabilities-2' },
      { label: 'NVD — CVE-2026-110186', url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-110186' },
    ],
  },
  {
    id: 'CVE-2026-93680',
    slugId: 'cve-2026-93680',
    vendor: 'IBM / Langflow',
    product: 'Langflow OSS',
    component: 'Auto-login security control',
    shortLabel: 'Langflow Auth Bypass',
    severity: 'CRITICAL',
    cvss: '9.8 (CVSS 3.1, IBM)',
    cwe: 'CWE-287 (Improper Authentication)',
    vector: 'Network; unauthenticated (AV:N/AC:L/PR:N/UI:N)',
    priority: 'P0 — Patch Internet-Facing Langflow Immediately',
    publishedDate: '2026-10-29',
    affected: 'Langflow OSS 1.0.0 through 1.12.8',
    patched: 'Langflow OSS 1.13.0',
    articleSlug: 'ai-dev-tool-cves-npm-open-cve-2026-119025-langflow-mcp',
    summary:
      'An incomplete remediation of the Langflow auto-login security control lets a remote attacker bypass authentication, opening the door to the authenticated code execution flaws fixed in the same release.',
    remediationSteps: [
      'Upgrade to Langflow OSS 1.13.0 or later.',
      'Disable auto-login and require authentication on every deployment.',
      'Review user accounts and flows created recently for signs of unauthorized access.',
    ],
    references: [
      { label: 'IBM Security Bulletin — Langflow OSS', url: 'https://www.ibm.com/support/pages/security-bulletin-langflow-oss-affected-multiple-vulnerabilities-2' },
      { label: 'NVD — CVE-2026-93680', url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-93680' },
    ],
  },
  {
    id: 'CVE-2026-117612',
    slugId: 'cve-2026-117612',
    vendor: 'Jenkins Project',
    product: 'Jenkins (core)',
    component: 'XStream deserialization (resolves-to attribute)',
    shortLabel: 'Jenkins XStream RCE',
    severity: 'HIGH',
    cvss: 'High (Jenkins)',
    cwe: 'CWE-502 (Deserialization of Untrusted Data)',
    vector: 'Network; requires Overall/Read plus a user account or config.xml POST permission',
    priority: 'P1 — Patch CI/CD Controllers Within 72 Hours',
    publishedDate: '2026-10-28',
    affected: 'Jenkins weekly 2.587 and earlier; LTS 2.580.1 and earlier',
    patched: 'Jenkins weekly 2.588; LTS 2.580.2',
    articleSlug: 'jenkins-security-advisory-october-2026-xstream-rce-cve-2026-117612',
    summary:
      'The custom XStream converter in Jenkins did not apply the JEP-200 deserialization filter to classes referenced by the resolves-to attribute, letting attackers with Overall/Read and a user account (or config.xml POST permission) instantiate arbitrary types and potentially achieve remote code execution on the controller.',
    remediationSteps: [
      'Upgrade Jenkins weekly to 2.588 or Jenkins LTS to 2.580.2.',
      'Audit who holds Overall/Read and any */Configure permissions; remove broad grants to anonymous or all authenticated users.',
      'Rotate controller-held credentials if untrusted users had configure permissions before patching.',
    ],
    references: [
      {
        label: 'Jenkins Security Advisory 2026-10-28',
        url: 'https://www.jenkins.io/security/advisory/2026-10-28/',
      },
      {
        label: 'NVD — CVE-2026-117612',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-117612',
      },
    ],
  },
  {
    id: 'CVE-2026-117618',
    slugId: 'cve-2026-117618',
    vendor: 'Jenkins Project',
    product: 'Jenkins (core)',
    component: 'Setup wizard / Jenkins own user database signup endpoint',
    shortLabel: 'Jenkins Setup-Wizard Admin Race',
    severity: 'HIGH',
    cvss: 'High (Jenkins)',
    cwe: 'CWE-362 (Race Condition)',
    vector: 'Network; unauthenticated, during initial setup',
    priority: 'P1 — Patch Before Exposing New Controllers',
    publishedDate: '2026-10-28',
    affected: 'Jenkins weekly 2.587 and earlier; LTS 2.580.1 and earlier',
    patched: 'Jenkins weekly 2.588; LTS 2.580.2',
    articleSlug: 'jenkins-security-advisory-october-2026-xstream-rce-cve-2026-117612',
    summary:
      'An endpoint that lets unauthenticated users create the first account when no accounts exist did not check whether the setup wizard had completed, so an unauthenticated attacker could create an administrator account while the initial account was being replaced.',
    remediationSteps: [
      'Upgrade Jenkins weekly to 2.588 or Jenkins LTS to 2.580.2.',
      'Never expose a fresh Jenkins installation to untrusted networks before setup is complete.',
      'Review the user list on recently provisioned controllers for unexpected administrator accounts.',
    ],
    references: [
      {
        label: 'Jenkins Security Advisory 2026-10-28',
        url: 'https://www.jenkins.io/security/advisory/2026-10-28/',
      },
      {
        label: 'NVD — CVE-2026-117618',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-117618',
      },
    ],
  },
  {
    id: 'CVE-2026-103409',
    slugId: 'cve-2026-103409',
    vendor: 'Juniper Networks',
    product: 'Session Smart Router',
    component: 'Insecure root-level HTTP endpoint (pre-onboarding)',
    shortLabel: 'Juniper SSR Unauth Admin',
    severity: 'CRITICAL',
    cvss: '9.8',
    cwe: 'CWE-306 (Missing Authentication for Critical Function)',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    priority: 'P0 — Patch Edge Routers Within 24-48 Hours',
    publishedDate: '2026-10-28',
    affected: 'Session Smart Router before 7.0.5, 7.1.x before 7.1.7, 7.2.x before 7.2.3 (only before onboarding to Mist/Conductor)',
    patched: '7.0.5, 7.1.7, 7.2.3 and later',
    articleSlug: 'juniper-ssr-sophos-utm-unauthenticated-root-cve-2026-103409-118633',
    summary:
      'A missing-authentication flaw lets an unauthenticated network attacker obtain administrative privileges on a Juniper Session Smart Router by passing crafted URL parameters to an insecure endpoint running as root. It is only exploitable before the device is onboarded to Mist or Conductor.',
    remediationSteps: [
      'Upgrade Session Smart Router to 7.0.5, 7.1.7, 7.2.3, or later.',
      'Prioritize routers that are staged but not yet onboarded to Mist/Conductor.',
      'Keep management interfaces off untrusted networks.',
    ],
    references: [
      {
        label: 'Juniper JSA112183 Security Bulletin',
        url: 'https://supportportal.juniper.net/s/article/2026-10-On-Demand-Security-Bulletin-Session-Smart-Router-and-Session-Smart-Conductor-Multiple-internally-discovered-vulnerabilities-resolved',
      },
      {
        label: 'GitHub Advisory — CVE-2026-103409',
        url: 'https://github.com/advisories/GHSA-4j2g-4264-38mr',
      },
    ],
  },
  {
    id: 'CVE-2026-103406',
    slugId: 'cve-2026-103406',
    vendor: 'Juniper Networks',
    product: 'Session Smart Conductor',
    component: 'AutomatedProvisioner (salt minion ID handling)',
    shortLabel: 'Juniper Conductor Root Command Injection',
    severity: 'CRITICAL',
    cvss: '9.8',
    cwe: 'CWE-78 (OS Command Injection)',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    priority: 'P0 — Patch Conductors Within 24-48 Hours',
    publishedDate: '2026-10-28',
    affected: 'Session Smart Conductor before 7.0.5, 7.1.x before 7.1.7, 7.2.x before 7.2.3',
    patched: '7.0.5, 7.1.7, 7.2.3 and later',
    articleSlug: 'juniper-ssr-sophos-utm-unauthenticated-root-cve-2026-103409-118633',
    summary:
      'An OS command injection in the Session Smart Conductor AutomatedProvisioner lets a remote attacker execute arbitrary commands as root by supplying a specially crafted salt minion ID during key management.',
    remediationSteps: [
      'Upgrade Session Smart Conductor to 7.0.5, 7.1.7, 7.2.3, or later.',
      'Restrict network reachability of Conductor provisioning and management services.',
      'Review Conductor logs for unexpected minion key requests.',
    ],
    references: [
      {
        label: 'Juniper JSA112183 Security Bulletin',
        url: 'https://supportportal.juniper.net/s/article/2026-10-On-Demand-Security-Bulletin-Session-Smart-Router-and-Session-Smart-Conductor-Multiple-internally-discovered-vulnerabilities-resolved',
      },
      {
        label: 'NVD — CVE-2026-103406',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-103406',
      },
    ],
  },
  {
    id: 'CVE-2026-118633',
    slugId: 'cve-2026-118633',
    vendor: 'Sophos',
    product: 'Sophos UTM (SG UTM)',
    component: 'Email proxy with scanning enabled',
    shortLabel: 'Sophos UTM Pre-Auth Root RCE',
    severity: 'CRITICAL',
    cvss: '9.2',
    cwe: 'CWE-35 (Path Traversal)',
    vector: 'CVSS:4.0/AV:N/AC:L/AT:P/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N',
    priority: 'P0 — Manual Patch or Retire End-of-Life UTM Now',
    publishedDate: '2026-10-28',
    affected: 'Sophos UTM all versions (SG UTM 9.724 and earlier) using the email proxy with scanning',
    patched: 'Sophos UTM 9.724 plus manual patch KBA-000049692, or migrate to Sophos Firewall',
    articleSlug: 'juniper-ssr-sophos-utm-unauthenticated-root-cve-2026-103409-118633',
    summary:
      'A path traversal in Sophos UTM lets an unauthenticated remote attacker run commands as root after winning a race condition by sustaining repeated attacks for a few minutes, when the email proxy is used with scanning enabled. UTM is end-of-life, so the fix must be installed manually.',
    remediationSteps: [
      'Identify every Sophos UTM acting as an SMTP gateway with email scanning enabled.',
      'Update to 9.724 and install the manual patch from Sophos KBA-000049692.',
      'Plan migration to a supported Sophos Firewall; until patched, consider disabling email proxy scanning or blocking external access to it.',
    ],
    references: [
      {
        label: 'Sophos Security Advisory sophos-sa-20261028-utm-rce',
        url: 'https://www.sophos.com/en-us/security-advisories/sophos-sa-20261028-utm-rce',
      },
      {
        label: 'Rapid7 — CVE-2026-118633',
        url: 'https://www.rapid7.com/db/vulnerabilities/cve-2026-118633/',
      },
    ],
  },
  {
    id: 'CVE-2026-111497',
    slugId: 'cve-2026-111497',
    vendor: 'OpenJS Foundation',
    product: 'Node.js Runtime',
    component: 'Node.js Brotli Stream Decoder (zlib / brotli)',
    shortLabel: 'Node.js Brotli RCE',
    severity: 'CRITICAL',
    cvss: '9.8',
    cwe: 'CWE-787 (Out-of-bounds Write)',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    priority: 'P0 — Emergency Runtime Patch (Within 24 Hours)',
    publishedDate: '2026-10-27',
    affected: 'Node.js 20.x, 22.x < 22.23.4, 24.x < 24.22.1, 26.x < 26.12.1',
    patched: 'Node.js v22.23.4, v24.22.1, v26.12.1 (or v20.20.4 / v22.22.4 / v24.16.0 / v25.10.0)',
    articleSlug: 'nodejs-october-2026-brotli-rce-cve-2026-111497',
    summary:
      'A critical heap out-of-bounds write in the Node.js native Brotli decompression stream allows unauthenticated remote attackers to corrupt V8/C++ heap structures via a crafted HTTP Content-Encoding: br payload, leading to remote code execution or immediate worker process crash.',
    remediationSteps: [
      'Upgrade production Node.js runtimes immediately to patched October 2026 releases (v22.23.4+, v24.22.1+, or v26.12.1+).',
      'If immediate runtime upgrade is blocked, strip or reject inbound Content-Encoding: br headers at the reverse proxy, CDN, or ingress load balancer.',
      'Audit downstream runtimes and serverless containers that bundle or port Node.js zlib/Brotli stream bindings (including Bun < v1.4.4).',
    ],
    references: [
      {
        label: 'Node.js Official Security Releases Advisory',
        url: 'https://nodejs.org/en/blog/vulnerability/',
      },
      {
        label: 'NVD — CVE-2026-111497 Detail',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-111497',
      },
    ],
  },
  {
    id: 'CVE-2026-112346',
    slugId: 'cve-2026-112346',
    vendor: 'All Hands AI',
    product: 'OpenHands Agent SDK & Runtime',
    component: 'OpenHands Agent Runtime Command Injection',
    shortLabel: 'OpenHands Agent RCE',
    severity: 'CRITICAL',
    cvss: '9.8',
    cwe: 'CWE-78 (OS Command Injection)',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
    priority: 'P0 — Immediate Isolation & Upgrade',
    publishedDate: '2026-10-27',
    affected: 'OpenHands SDK < 1.52.0 / OpenHands Runtime < 0.34.2',
    patched: 'OpenHands SDK 1.52.0 / OpenHands v0.34.2',
    articleSlug: 'ai-agent-infra-cves-openhands-mcp-toolbox-consul-k8s',
    summary:
      'An unauthenticated command injection flaw in the OpenHands AI agent execution bridge allows untrusted repository content or prompt-injected tool arguments to break out of the intended workspace command wrapper and execute arbitrary host/container shell commands.',
    remediationSteps: [
      'Upgrade OpenHands SDK to version 1.52.0+ (or runtime v0.34.2+) across all developer and CI/CD agent runners.',
      'Run autonomous coding agents strictly inside ephemeral, unprivileged microVMs or gVisor/Kata sandboxes with no host Docker socket access.',
      'Rotate any API keys, Git credentials, or cloud tokens that were mounted inside affected agent runtime environments.',
    ],
    references: [
      {
        label: 'OpenHands GitHub Security Advisories',
        url: 'https://github.com/All-Hands-AI/OpenHands/security/advisories',
      },
      {
        label: 'NVD — CVE-2026-112346 Detail',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-112346',
      },
    ],
  },
  {
    id: 'CVE-2026-97631',
    slugId: 'cve-2026-97631',
    vendor: 'TianoCore / EDK II',
    product: 'UEFI Network Boot Firmware (EDK II)',
    component: 'TianoCore EDK II UEFI PXE Base Code Driver',
    shortLabel: 'EDK2 UEFI PXE Ring-0',
    severity: 'CRITICAL',
    cvss: '9.5',
    cwe: 'CWE-120 (Buffer Copy without Checking Size of Input)',
    vector: 'CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H',
    priority: 'P0 — Disable Unused PXE Boot & Apply Vendor UEFI Updates',
    publishedDate: '2026-10-28',
    affected: 'UEFI firmware built on TianoCore EDK II with NetworkPkg/UefiPxeBcDxe and PXE network boot enabled',
    patched: 'EDK II Upstream Fix / Server Vendor BIOS & UEFI Updates',
    articleSlug: 'uefi-edk2-pxe-cve-2026-97631-boot-firmware',
    summary:
      'A 16-year-old buffer overflow in the ICMPv4/ICMPv6 error handlers (PxeBcIcmpErrorDpcHandle and PxeBcIcmp6ErrorDpcHandle) of TianoCore EDK II’s PXE Base Code driver copies oversized ICMP error packets past a fixed 504-byte buffer, enabling ring-0 code execution during network boot prior to OS and Secure Boot enforcement.',
    remediationSteps: [
      'Disable PXE / network boot in BIOS/UEFI configuration on all servers and workstations that boot from local storage.',
      'Isolate bare-metal provisioning VLANs so only hardened DHCP/TFTP boot servers can send ICMP traffic to hosts during PXE boot.',
      'Apply vendor UEFI/BIOS firmware updates incorporating the upstream TianoCore EDK II NetworkPkg patch as they are released.',
    ],
    references: [
      {
        label: 'TianoCore EDK II Official Security Advisories',
        url: 'https://github.com/tianocore/edk2/security/advisories',
      },
      {
        label: 'Ars Technica — Code-execution flaw in UEFI firmware affects most servers',
        url: 'https://arstechnica.com/security/2026/10/code-execution-flaw-in-uefi-firmware-threatens-most-servers-on-planet-earth/',
      },
      {
        label: 'NVD — CVE-2026-97631 Detail',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-97631',
      },
    ],
  },
  {
    id: 'CVE-2026-93328',
    slugId: 'cve-2026-93328',
    vendor: 'Google Cloud / GenAI',
    product: 'MCP Toolbox for Databases (genai-toolbox)',
    component: 'Google GenAI MCP Toolbox Credential Leak',
    shortLabel: 'Google MCP Toolbox Leak',
    severity: 'CRITICAL',
    cvss: '9.3',
    cwe: 'CWE-200 (Exposure of Sensitive Information) / SSRF',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:L/A:N',
    priority: 'P1 — Upgrade MCP Toolbox & Rotate Database Credentials',
    publishedDate: '2026-10-27',
    affected: 'MCP Toolbox (genai-toolbox) 1.2.0 – 1.4.0 (< 0.8.4 / < 1.5.0)',
    patched: 'MCP Toolbox v1.5.0 / genai-toolbox v0.8.4',
    articleSlug: 'ai-agent-infra-cves-openhands-mcp-toolbox-consul-k8s',
    summary:
      'A connection-string validation and metadata reflection flaw in MCP Toolbox for Databases allows crafted Model Context Protocol tool invocations to exfiltrate upstream database credentials and cloud service account tokens to untrusted model contexts.',
    remediationSteps: [
      'Upgrade genai-toolbox / MCP Toolbox for Databases to version 1.5.0 (or v0.8.4+) immediately.',
      'Bind MCP server listeners exclusively to localhost or authenticated mTLS internal service meshes.',
      'Rotate database credentials and IAM service account tokens previously passed to vulnerable MCP Toolbox instances.',
    ],
    references: [
      {
        label: 'Google Cloud / GenAI Toolbox Security Advisories',
        url: 'https://github.com/googleapis/genai-toolbox/security/advisories',
      },
      {
        label: 'NVD — CVE-2026-93328 Detail',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-93328',
      },
    ],
  },
  {
    id: 'CVE-2026-109618',
    slugId: 'cve-2026-109618',
    vendor: 'The PHP Group',
    product: 'PHP Engine (SAPI Multipart Parser)',
    component: 'PHP SAPI Multipart Parser (php2shell)',
    shortLabel: 'PHP SAPI Pre-Auth RCE',
    severity: 'CRITICAL',
    cvss: '9.2',
    cwe: 'CWE-122 (Heap-based Buffer Overflow)',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
    priority: 'P0 — Emergency PHP Runtime Upgrade',
    publishedDate: '2026-10-27',
    affected: 'PHP < 8.5.12, < 8.4.27 (8.4.x < 8.4.6), < 8.3.36 (8.3.x < 8.3.19), < 8.2.35 (8.2.x < 8.2.28)',
    patched: 'PHP 8.5.12, 8.4.27 (8.4.6), 8.3.36 (8.3.19), 8.2.35 (8.2.28)',
    articleSlug: 'php2shell-rce-cve-2026-109618-ditemukan-ai',
    summary:
      'Known as "php2shell", this pre-authentication heap buffer corruption in rfc1867 multipart/form-data boundary parsing triggers before application PHP scripts execute, enabling remote code execution on exposed PHP-FPM and Apache mod_php endpoints.',
    remediationSteps: [
      'Upgrade PHP runtimes to patched maintenance releases (PHP 8.5.12, 8.4.27 / 8.4.6, 8.3.36 / 8.3.19, or 8.2.35 / 8.2.28) and restart php-fpm workers.',
      'Enforce strict WAF multipart boundary length and header count limits at the edge proxy for endpoints that do not accept file uploads.',
      'Verify container base images (php:fpm-alpine / debian) are rebuilt against the latest October 2026 upstream packages.',
    ],
    references: [
      {
        label: 'PHP Official ChangeLog & Security Releases',
        url: 'https://www.php.net/ChangeLog-8.php',
      },
      {
        label: 'NVD — CVE-2026-109618 Detail',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-109618',
      },
    ],
  },
  {
    id: 'GHSA-cf8x-9m69-3gg3',
    slugId: 'ghsa-cf8x-9m69-3gg3',
    vendor: 'Oven',
    product: 'Bun Runtime',
    component: 'Bun HTTP/3 QPACK Header Decoder',
    shortLabel: 'Bun HTTP/3 QPACK DoS',
    severity: 'HIGH',
    cvss: '9.2',
    cwe: 'CWE-400 (Uncontrolled Resource Consumption)',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:H',
    priority: 'P1 — Upgrade Bun to v1.4.4+',
    publishedDate: '2026-10-27',
    affected: 'Bun < v1.4.4',
    patched: 'Bun v1.4.4',
    articleSlug: 'bun-v1-4-4-http3-qpack-brotli-emudhra-security',
    summary:
      'A flaw in Bun’s HTTP/3 QPACK dynamic table decompression state machine allows remote attackers to trigger unbounded memory allocation or crash the Bun.serve HTTP/3 listener with a sequence of malformed QUIC header frames (tracked upstream as GHSA-cf8x-9m69 / GHSA-cf8x-9m69-3gg3).',
    remediationSteps: [
      'Run `bun upgrade` to update all production and CI environments to Bun v1.4.4 or newer.',
      'Note that Bun v1.4.4 also backports the critical Node.js Brotli stream fix (CVE-2026-111497) and updates the Mozilla root CA bundle.',
    ],
    references: [
      {
        label: 'Bun Official Blog — Bun v1.4.4 Release Notes',
        url: 'https://bun.sh/blog',
      },
      {
        label: 'GitHub Advisory Database — Oven Bun Advisories',
        url: 'https://github.com/oven-sh/bun/security/advisories',
      },
    ],
  },
  {
    id: 'CVE-2026-108142',
    slugId: 'cve-2026-108142',
    vendor: 'Veeam',
    product: 'Veeam Backup & Replication 13',
    component: 'Veeam Backup & Replication 13 CDP Coordinator Service',
    shortLabel: 'Veeam B&R 13 Bypass',
    severity: 'CRITICAL',
    cvss: '9.1',
    cwe: 'CWE-287 (Improper Authentication / Authorization Bypass)',
    vector: 'CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H',
    priority: 'P0 — Patch Backup Servers Immediately (High Ransomware Risk)',
    publishedDate: '2026-10-28',
    affected: 'Veeam Backup & Replication 13.1 <= 13.1.1.18, 13.0 <= 13.0.2.29, and Veeam Software Appliance (12.x not affected)',
    patched: 'Veeam Backup & Replication 13.1.2 (13.1.2.57) or 13.0.3 (13.0.3.63)',
    articleSlug: 'veeam-backup-replication-13-cve-2026-108142',
    summary:
      'An unauthenticated authorization bypass in the Continuous Data Protection (CDP) Coordinator Service of Veeam Backup & Replication 13 allows remote attackers on the network to bypass authentication checks on Windows-based B&R 13 servers and the Veeam Software Appliance.',
    remediationSteps: [
      'Upgrade Veeam Backup & Replication 13 immediately to build 13.1.2 (13.1.2.57) or 13.0.3 (13.0.3.63).',
      'Isolate backup management interfaces and CDP Coordinator Service ports from general corporate VLANs using strict host firewall rules.',
      'Verify that offline or immutable backup repositories (hardened Linux repositories or object-locked cloud buckets) are active and untampered.',
    ],
    references: [
      {
        label: 'Veeam Security Bulletins & Knowledge Base',
        url: 'https://www.veeam.com/knowledge-base.html',
      },
      {
        label: 'NVD — CVE-2026-108142 Detail',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-108142',
      },
    ],
  },
  {
    id: 'CVE-2026-91403',
    slugId: 'cve-2026-91403',
    vendor: 'Oracle / OpenJDK',
    product: 'Oracle Java SE & GraalVM (JSSE)',
    component: 'Oracle Java SE / GraalVM JSSE TLS Handshake State Machine',
    shortLabel: 'Oracle Java JSSE TLS',
    severity: 'CRITICAL',
    cvss: '9.1',
    cwe: 'CWE-295 (Improper Certificate / Handshake Validation)',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N',
    priority: 'P0 — Apply Oracle Out-of-Band Security Alert Patch',
    publishedDate: '2026-10-27',
    affected: 'Oracle Java SE / OpenJDK 8u511 (8u431), 11.0.33 (11.0.25), 17.0.21 (17.0.13), 21.0.13 (21.0.5), 25.0.5 (25.0.1), 27.0.1 & GraalVM',
    patched: 'Oracle October 2026 Out-of-Band Security Alert Patch / Updated OpenJDK Builds',
    articleSlug: 'oracle-java-jsse-cve-2026-91403-out-of-band-alert',
    summary:
      'An out-of-band critical vulnerability in the Java Secure Socket Extension (JSSE) TLS 1.3 handshake state machine allows a network attacker to bypass peer validation constraints under specific session resumption and ALPN negotiation paths.',
    remediationSteps: [
      'Apply the Oracle October 2026 Out-of-Band Security Alert update (or equivalent Temurin, Corretto, Azul Zulu, or Red Hat OpenJDK builds) across all JVM workloads.',
      'Prioritize internet-facing Spring Boot, Netty, Tomcat, Kafka, and gRPC services that terminate TLS directly inside the JVM via JSSE.',
    ],
    references: [
      {
        label: 'Oracle Critical Patch Updates, Security Alerts and Bulletins',
        url: 'https://www.oracle.com/security-alerts/',
      },
      {
        label: 'NVD — CVE-2026-91403 Detail',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-91403',
      },
    ],
  },
  {
    id: 'CVE-2026-106076',
    slugId: 'cve-2026-106076',
    vendor: 'Veeam',
    product: 'Veeam Backup for Microsoft 365',
    component: 'Veeam Backup for Microsoft 365 Cross-Tenant SQL Injection',
    shortLabel: 'Veeam M365 Cross-Tenant SQLi',
    severity: 'CRITICAL',
    cvss: '9.0',
    cwe: 'CWE-89 (SQL Injection)',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H',
    priority: 'P0 — Upgrade Multi-Tenant M365 Backup Servers',
    publishedDate: '2026-10-28',
    affected: 'Veeam Backup for Microsoft 365 < 8.6 Patch 1 (8.6.0.5011)',
    patched: 'Veeam Backup for Microsoft 365 8.6 P1 (build 8.6.0.5011)',
    articleSlug: 'veeam-backup-replication-13-cve-2026-108142',
    summary:
      'A critical SQL injection flaw in Veeam Backup for Microsoft 365 allows an authenticated organization-transfer peer to inject arbitrary SQL queries into the source server’s PostgreSQL configuration database, leading to cross-tenant configuration read/write and code execution under the PostgreSQL service account.',
    remediationSteps: [
      'Upgrade Veeam Backup for Microsoft 365 to version 8.6 Patch 1 (build 8.6.0.5011) immediately, especially in multi-tenant service provider deployments.',
      'Restrict network reachability of organization-transfer and REST API ports to explicitly allowlisted tenant peers.',
    ],
    references: [
      {
        label: 'Veeam Knowledge Base — Security Bulletins',
        url: 'https://www.veeam.com/knowledge-base.html',
      },
      {
        label: 'NVD — CVE-2026-106076 Detail',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-106076',
      },
    ],
  },
  {
    id: 'CVE-2026-110720',
    slugId: 'cve-2026-110720',
    vendor: 'HashiCorp',
    product: 'Consul on Kubernetes (consul-k8s)',
    component: 'HashiCorp consul-k8s Admission Webhook Auth Bypass',
    shortLabel: 'Consul-k8s Webhook Bypass',
    severity: 'HIGH',
    cvss: '8.8',
    cwe: 'CWE-287 (Improper Authentication)',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H',
    priority: 'P1 — Upgrade consul-k8s Helm Chart & Controllers',
    publishedDate: '2026-10-27',
    affected: 'consul-k8s 0.42.0 up to 2.0.4 (1.4.x – 1.6.x)',
    patched: 'consul-k8s 1.8.18, 2.1.0 (or 1.6.3 / 1.5.5 / 1.4.8)',
    articleSlug: 'ai-agent-infra-cves-openhands-mcp-toolbox-consul-k8s',
    summary:
      'An admission webhook and service-mesh token validation flaw in HashiCorp consul-k8s allows an attacker with limited pod creation or service-account privileges in a Kubernetes namespace to spoof sidecar injection annotations and impersonate upstream mesh services.',
    remediationSteps: [
      'Upgrade consul-k8s control plane components via Helm or consul-k8s CLI to patched versions (1.8.18 / 2.1.0 or patched 1.4–1.6 maintenance builds).',
      'Audit Kubernetes MutatingWebhookConfiguration and service mesh ACL tokens in multi-tenant clusters.',
    ],
    references: [
      {
        label: 'HashiCorp Official Security Advisories',
        url: 'https://discuss.hashicorp.com/c/security/57',
      },
      {
        label: 'NVD — CVE-2026-110720 Detail',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-110720',
      },
    ],
  },
  {
    id: 'CVE-2026-111500',
    slugId: 'cve-2026-111500',
    vendor: 'OpenJS Foundation',
    product: 'Node.js Runtime',
    component: 'Node.js TLS ALPN Callback Race Condition',
    shortLabel: 'Node.js TLS ALPN Race',
    severity: 'HIGH',
    cvss: '8.1',
    cwe: 'CWE-362 (Concurrent Execution using Shared Resource / Race Condition)',
    vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H',
    priority: 'P1 — Apply October 2026 Node.js Security Release',
    publishedDate: '2026-10-27',
    affected: 'Node.js 22.x, 24.x, 25.x / 26.x',
    patched: 'Node.js v22.22.4+, v24.16.0+, v25.10.0+ / v26.12.1+',
    articleSlug: 'nodejs-october-2026-brotli-rce-cve-2026-111497',
    summary:
      'A race condition in Node.js TLS socket initialization when custom ALPNCallback handlers interact with asynchronous SNI context resolution can cause use-after-free memory corruption under concurrent TLS handshakes.',
    remediationSteps: [
      'Upgrade Node.js to the October 2026 security release line across all TLS-terminating Node.js servers.',
      'Avoid mutating shared TLS SecureContext buffers inside custom ALPNCallback hooks.',
    ],
    references: [
      {
        label: 'Node.js Official Security Releases Advisory',
        url: 'https://nodejs.org/en/blog/vulnerability/',
      },
      {
        label: 'NVD — CVE-2026-111500 Detail',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-111500',
      },
    ],
  },
  {
    id: 'CVE-2026-111508',
    slugId: 'cve-2026-111508',
    vendor: 'OpenJS Foundation',
    product: 'Node.js Runtime',
    component: 'Node.js Permission Model Filesystem Policy Bypass',
    shortLabel: 'Node.js Permission Bypass',
    severity: 'HIGH',
    cvss: '7.7',
    cwe: 'CWE-22 (Improper Limitation of a Pathname to a Restricted Directory)',
    vector: 'CVSS:3.1/AV:L/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N',
    priority: 'P2 — Upgrade Node.js & Use OS-Level Sandboxing',
    publishedDate: '2026-10-27',
    affected: 'Node.js 20.x, 22.x, 24.x, 25.x / 26.x',
    patched: 'Node.js v20.20.4, v22.22.4, v24.16.0, v25.10.0 / v26.12.1',
    articleSlug: 'nodejs-october-2026-brotli-rce-cve-2026-111497',
    summary:
      'A path canonicalization flaw in the Node.js Permission Model (--permission) allows untrusted scripts using relative symlink traversal and Buffer-encoded paths to read or write files outside --allow-fs-read and --allow-fs-write boundaries.',
    remediationSteps: [
      'Upgrade Node.js to the patched October 2026 release line.',
      'Do not rely solely on --permission for untrusted multi-tenant code execution; pair it with Linux namespaces, seccomp, or microVM isolation.',
    ],
    references: [
      {
        label: 'Node.js Official Security Releases Advisory',
        url: 'https://nodejs.org/en/blog/vulnerability/',
      },
      {
        label: 'NVD — CVE-2026-111508 Detail',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-111508',
      },
    ],
  },
  {
    id: 'GHSA-54x7-74r2',
    slugId: 'ghsa-54x7-74r2',
    vendor: 'Oven',
    product: 'Bun Runtime',
    component: 'Bun Node.js Brotli Stream Compatibility Port',
    shortLabel: 'Bun Brotli Stream Port',
    severity: 'HIGH',
    cvss: '7.5',
    cwe: 'CWE-787 (Out-of-bounds Write)',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H',
    priority: 'P1 — Upgrade Bun to v1.4.4+',
    publishedDate: '2026-10-27',
    affected: 'Bun < v1.4.4',
    patched: 'Bun v1.4.4',
    articleSlug: 'bun-v1-4-4-http3-qpack-brotli-emudhra-security',
    summary:
      'Bun’s node:zlib Brotli decompression stream bindings shared the upstream boundary calculation issue addressed in CVE-2026-111497, allowing crafted Brotli streams to trigger out-of-bounds memory faults in Bun processes prior to v1.4.4.',
    remediationSteps: [
      'Upgrade Bun to v1.4.4 or newer across all server and build environments.',
    ],
    references: [
      {
        label: 'Bun Official Blog — Bun v1.4.4 Release',
        url: 'https://bun.sh/blog',
      },
    ],
  },
  {
    id: 'CVE-2026-111510',
    slugId: 'cve-2026-111510',
    vendor: 'OpenJS Foundation',
    product: 'Node.js Runtime',
    component: 'Node.js HTTP/2 CONTINUATION Frame Flood Mitigation',
    shortLabel: 'Node.js HTTP/2 Flood',
    severity: 'HIGH',
    cvss: '7.5',
    cwe: 'CWE-400 (Uncontrolled Resource Consumption)',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H',
    priority: 'P1 — Upgrade Node.js HTTP/2 Listeners',
    publishedDate: '2026-10-27',
    affected: 'Node.js 20.x, 22.x, 24.x, 25.x / 26.x',
    patched: 'Node.js v20.20.4, v22.22.4, v24.16.0, v25.10.0 / v26.12.1',
    articleSlug: 'nodejs-october-2026-brotli-rce-cve-2026-111497',
    summary:
      'An incomplete frame counter reset in Node.js node:http2 session handling allows remote clients sending interleaved HEADER and CONTINUATION frames to exhaust event-loop CPU and memory before maxSessionMemory limits terminate the stream.',
    remediationSteps: [
      'Upgrade Node.js to the October 2026 security release line.',
      'Terminate public HTTP/2 traffic at a hardened edge proxy (Envoy, Cloudflare, Nginx, or AWS ALB) with strict frame rate limits.',
    ],
    references: [
      {
        label: 'Node.js Official Security Releases Advisory',
        url: 'https://nodejs.org/en/blog/vulnerability/',
      },
      {
        label: 'NVD — CVE-2026-111510 Detail',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-111510',
      },
    ],
  },
  {
    id: 'CVE-2026-111498',
    slugId: 'cve-2026-111498',
    vendor: 'OpenJS Foundation',
    product: 'Node.js Runtime (llhttp)',
    component: 'Node.js llhttp Chunked Extension Request Smuggling',
    shortLabel: 'Node.js llhttp Smuggling',
    severity: 'MEDIUM',
    cvss: '6.5',
    cwe: 'CWE-444 (Inconsistent Interpretation of HTTP Requests)',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:L/A:N',
    priority: 'P2 — Upgrade Node.js & Normalize Reverse Proxy Framing',
    publishedDate: '2026-10-27',
    affected: 'Node.js 20.x, 22.x, 24.x, 25.x / 26.x',
    patched: 'Node.js v20.20.4, v22.22.4, v24.16.0, v25.10.0 / v26.12.1',
    articleSlug: 'nodejs-october-2026-brotli-rce-cve-2026-111497',
    summary:
      'Inconsistent parsing of quoted-pair characters inside HTTP/1.1 Transfer-Encoding: chunked extensions in llhttp allows HTTP request smuggling when Node.js sits behind an upstream proxy that strips or forwards chunk extensions differently.',
    remediationSteps: [
      'Upgrade Node.js to the patched October 2026 release.',
      'Configure upstream reverse proxies to normalize or reject HTTP/1.1 chunk extensions prior to forwarding requests to Node.js backends.',
    ],
    references: [
      {
        label: 'Node.js Official Security Releases Advisory',
        url: 'https://nodejs.org/en/blog/vulnerability/',
      },
      {
        label: 'NVD — CVE-2026-111498 Detail',
        url: 'https://nvd.nist.gov/vuln/detail/CVE-2026-111498',
      },
    ],
  },
];

/**
 * Merges curated CVE records with any additional `cveIds` declared in article
 * frontmatter so that adding a new markdown article with `cveIds` automatically
 * generates `/cve/[id]` pages without requiring manual edits to `cves.ts`.
 */
export function getMergedCveRecords(
  articles: CollectionEntry<'articles'>[]
): CveRecord[] {
  const map = new Map<string, CveRecord>();

  for (const rec of CURATED_CVE_RECORDS) {
    map.set(rec.slugId, rec);
  }

  const sortedArticles = [...articles].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  for (const article of sortedArticles) {
    const ids = article.data.cveIds || [];
    for (const rawId of ids) {
      const slugId = toCveSlug(rawId);
      if (map.has(slugId)) continue;

      const isGhsa = rawId.toUpperCase().startsWith('GHSA-');
      const canonicalId = isGhsa ? rawId : rawId.toUpperCase();
      const sev = article.data.severity || 'HIGH';
      const cvssStr = article.data.cvss ? String(article.data.cvss) : '8.0';
      const dateStr = article.data.pubDate.toISOString().split('T')[0];
      const primaryTag = article.data.tags?.[0] || 'System Runtime';

      map.set(slugId, {
        id: canonicalId,
        slugId,
        vendor: primaryTag,
        product: `${primaryTag} Infrastructure`,
        component: `${canonicalId} (${article.data.title.split(':')[0]})`,
        shortLabel: `${primaryTag} ${canonicalId}`,
        severity: sev,
        cvss: cvssStr,
        cwe: 'CWE-Other (Security Advisory)',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        priority:
          sev === 'CRITICAL'
            ? 'P0 — Emergency Patch Required'
            : 'P1 — Scheduled Security Update',
        publishedDate: dateStr,
        affected: article.data.affectedVersions || 'See full TechPulse advisory analysis',
        patched: article.data.patchedVersions || 'Apply latest vendor security update',
        articleSlug: article.slug,
        summary: article.data.subtitle,
        remediationSteps:
          article.data.tldr && article.data.tldr.length > 0
            ? article.data.tldr
            : [
                `Upgrade affected ${primaryTag} deployments to ${article.data.patchedVersions || 'the latest vendor-patched release'}.`,
              ],
        references: [
          ...(article.data.sources || []),
          ...(canonicalId.startsWith('CVE-')
            ? [
                {
                  label: `NVD — ${canonicalId} Official Record`,
                  url: `https://nvd.nist.gov/vuln/detail/${canonicalId}`,
                },
              ]
            : []),
        ],
      });
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => parseFloat(b.cvss) - parseFloat(a.cvss)
  );
}
