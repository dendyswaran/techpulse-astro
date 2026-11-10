---
title: "AWS Nitro Sandboxes: One Line Puts an EKS Pod, ECS Task or AI Agent in Its Own Hardware-Isolated VM"
subtitle: "AWS now carves lightweight Nitro VMs out of a running EC2 instance, so untrusted agent code no longer shares a kernel with its neighbors. It costs nothing extra on most Nitro instances."
pubDate: 2026-11-10
category: "tech-update"
tags: ["AWS", "Nitro", "Amazon EKS", "Amazon ECS", "Kubernetes", "Sandboxing", "AI Agents", "Confidential Computing"]
readingTime: "5 min read"
author:
  name: "Mazzden"
  role: "Editor-in-Chief, TechPulse"
featured: false
coverImage: "/images/covers/aws-nitro-sandboxes-eks-hardware-isolated-agent-pods.webp"
coverAlt: "Gouache illustration of a long low building with a terracotta roof whose facade is a neat grid of separate framed rooms, each sealed in its own slate border, one glowing ochre, on a sage-green lawn"
coverCaption: "Illustration by TechPulse Editorial · One building, every room with its own walls."
tldr:
  - "On November 9, 2026 AWS launched Nitro Sandboxes: lightweight VMs run by the Nitro Hypervisor that give each EKS pod, ECS task or standalone VM its own guest kernel inside a hardware-isolated slice of an EC2 instance."
  - "On EKS Auto Mode (Kubernetes 1.36+) the opt-in is runtimeClassName: isolated-sandbox. A confidential-sandbox class adds attestation, so AWS KMS releases secrets only to a sandbox running the expected image and Cedar policy."
  - "Pod Identity, VPC CNI, EBS/EFS, CloudWatch, kubectl exec/logs/port-forward all keep working, and AWS says the runtime passes every Kubernetes conformance test. Amazon Linux and Firecracker are supported on EC2."
  - "No extra charge, on most Nitro-based instances, in all commercial Regions. The obvious first use is coding agents and CI jobs that run untrusted or LLM-generated code."
sources:
  - label: "AWS What's New — Introducing AWS Nitro Sandboxes on Amazon EKS, ECS and EC2"
    url: "https://aws.amazon.com/about-aws/whats-new/2026/11/nitro-sandboxes-eks-ecs-ec2/"
  - label: "AWS Containers Blog — AWS Nitro Sandboxes: Hardware-enforced workload isolation on Amazon EKS"
    url: "https://aws.amazon.com/blogs/containers/aws-nitro-sandboxes-hardware-enforced-workload-isolation-on-amazon-eks/"
  - label: "Amazon EKS User Guide — Sandboxing with isolated and confidential pods"
    url: "https://docs.aws.amazon.com/eks/latest/userguide/sandboxing.html"
  - label: "AWS Samples — sample-eks-nitro-sandbox"
    url: "https://github.com/aws-samples/sample-eks-nitro-sandbox"
---

Containers are fast because they share the host kernel, and that is exactly why they are a poor boundary for code nobody reviewed. Coding agents now write and run that kind of code all day. On **November 9, 2026**, AWS launched **Nitro Sandboxes**, which put each workload in its own lightweight VM run by the **Nitro Hypervisor**, the same system that keeps EC2 instances apart.

## How it works

A new EC2 capability lets the Nitro Hypervisor carve a **hardware-isolated slice of CPU and memory** out of a running instance. When a sandboxed pod is scheduled:

1. The RuntimeClass steers it to a sandbox-capable node.
2. The container runtime asks EC2 for a **Nitro Partition** and boots a small VM inside it.
3. An in-guest component checks the pod spec against its **Cedar policy**, pulls the images and starts the containers unchanged.
4. The kubelet sees a normal pod. Logs, exec, probes, Pod Identity credentials, CSI volumes and VPC networking are delivered into the VM.

Neither the host nor neighboring pods can read the sandbox's memory or CPU state. Shared node resources such as network bandwidth, disk I/O, DNS, logs and conntrack entries get configurable throttles **on by default**, so one runaway agent can't starve the pods next to it.

## Two modes

- **`isolated-sandbox`**: protects the host and neighbors from whatever runs inside the pod.
- **`confidential-sandbox`**: also treats the node operator as untrusted. The Nitro Security Module signs an attestation document, and **AWS KMS** releases a key only when that document matches the system image and Cedar policy you expect. AWS says even a cluster administrator can't read the pod's memory.

An annotation, `sandbox.amazonaws.com/network-isolated: "true"`, boots the VM with only loopback networking.

## The one-line opt-in

On **EKS Auto Mode** (Kubernetes **1.36+**), both RuntimeClasses ship with the cluster:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: agent-job
spec:
  runtimeClassName: isolated-sandbox   # the only change
  containers:
    - name: agent
      image: <your-agent-image>
```

On standard EKS with managed node groups or Karpenter, you build a sandbox-enabled AMI first; the user guide walks through it. For ECS tasks it is also a one-line change. On plain EC2 you can bring your own AMI and VMM, with **Amazon Linux and Firecracker** supported out of the box.

## Why agent builders should care

AWS's launch post walks through a Claude Code agent on Bedrock that reads a GitHub issue, writes a failing test, fixes the bug and opens a PR, all inside a sandbox:

- **Model access** through Pod Identity, scoped to `bedrock:InvokeModel*`.
- **Repo access** through one short-lived, fine-grained token.
- **Egress** limited by an EKS Auto Mode `ApplicationNetworkPolicy` to DNS plus the Bedrock and GitHub hostnames.

If a prompt injection tells the agent to `curl` a payload, the connection never opens. When the pod exits, the VM is destroyed. As AWS puts it, the agent "doesn't know it's in a sandbox."

AWS also lists integrations it has validated: the Kubernetes SIG **agent-sandbox** project for warm pools (pre-booted VMs claimable in about two seconds), **Temporal** as an orchestrator, **GitLab Runner** for privileged CI builds, and self-hosted tool execution for Anthropic, OpenAI and Cursor managed agents.

## Caveats

- Cold starts are real. AWS recommends warm pools for interactive agent sessions.
- Isolation doesn't replace least privilege. The scoped IAM role, token and egress policy in the example do most of the work of limiting what a hijacked agent can reach.
- Allowing all of `github.com` still lets a compromised agent read public repos. The scoped token is what stops pushes elsewhere.

## Availability

Nitro Sandboxes are available **at no additional charge** on most Nitro-based EC2 instances in all commercial Regions. The same day, AWS also added Dynamic Resource Allocation for NVIDIA GPUs and EFA to EKS Auto Mode and Karpenter.
