export interface AiModelRecord {
  id: string;
  name: string;
  shortName: string;
  provider: string;
  tier: 'frontier-api' | 'open-weight';
  license: string;
  releaseDate: string;
  architecture: string;
  totalParamsB: number | null; // null if proprietary undisclosed
  activeParamsB: number | null;
  paramsLabel: string;
  contextTokens: number;
  contextLabel: string;
  maxOutputTokens: number;
  // API Pricing in USD per 1,000,000 tokens
  inputPricePer1M: number;
  cachedInputPricePer1M: number;
  outputPricePer1M: number;
  apiProviderNote: string;
  // Open-Weight / Local VRAM sizing parameters
  isOpenWeight: boolean;
  kvCacheGbPer1kTokensFp16: number; // KV cache GB per 1,000 tokens at FP16
  localCliCommand: string;
  recommendedGpu: string;
  articleSlug?: string;
  summary: string;
  strengths: string[];
  workloads: string[];
}

export interface GpuPreset {
  id: string;
  name: string;
  shortLabel: string;
  vramGb: number;
  bandwidthGbs: number;
  category: 'consumer' | 'apple-silicon' | 'workstation' | 'datacenter';
  notes: string;
}

export interface QuantizationPreset {
  id: 'fp16' | 'q8_0' | 'q5_k_m' | 'q4_k_m' | 'iq3_m';
  label: string;
  bitsPerWeight: number;
  bytesPerParam: number;
  kvScale: number;
  perplexityNote: string;
}

export const QUANTIZATION_PRESETS: QuantizationPreset[] = [
  {
    id: 'fp16',
    label: 'FP16 / BF16 (16-bit)',
    bitsPerWeight: 16.0,
    bytesPerParam: 2.0,
    kvScale: 1.0,
    perplexityNote: 'Lossless reference weights; maximum precision for evaluation.',
  },
  {
    id: 'q8_0',
    label: 'Q8_0 / FP8 (8-bit)',
    bitsPerWeight: 8.5,
    bytesPerWeight: 1.06,
    bytesPerParam: 1.06,
    kvScale: 0.55,
    perplexityNote: 'Near-zero degradation (<0.004 PPL delta); ideal when VRAM permits.',
  } as any,
  {
    id: 'q5_k_m',
    label: 'Q5_K_M (5.5-bit)',
    bitsPerWeight: 5.6,
    bytesPerParam: 0.70,
    kvScale: 0.55,
    perplexityNote: 'High-retention k-quant; strong balance for coding and structured output.',
  },
  {
    id: 'q4_k_m',
    label: 'Q4_K_M / AWQ (4.8-bit)',
    bitsPerWeight: 4.8,
    bytesPerParam: 0.60,
    kvScale: 0.5,
    perplexityNote: 'Industry standard local deployment quantization (~99% quality retention).',
  },
  {
    id: 'iq3_m',
    label: 'IQ3_M / EXL2 (3.4-bit)',
    bitsPerWeight: 3.4,
    bytesPerParam: 0.43,
    kvScale: 0.5,
    perplexityNote: 'Aggressive importance-matrix quantization to fit larger models in constrained VRAM.',
  },
];

export const GPU_PRESETS: GpuPreset[] = [
  {
    id: 'rtx-5060-ti-16gb',
    name: 'NVIDIA RTX 5060 Ti (16 GB GDDR7 — 448 GB/s)',
    shortLabel: 'RTX 5060 Ti 16GB',
    vramGb: 16,
    bandwidthGbs: 448,
    category: 'consumer',
    notes: 'Sweet-spot 16GB Blackwell consumer GPU; runs 14B–24B Q4_K_M models and 32B IQ3_M/Q4 cleanly.',
  },
  {
    id: 'rtx-4090-24gb',
    name: 'NVIDIA RTX 4090 (24 GB GDDR6X — 1,008 GB/s)',
    shortLabel: 'RTX 4090 24GB',
    vramGb: 24,
    bandwidthGbs: 1008,
    category: 'consumer',
    notes: 'High-bandwidth 24GB flagship; runs 32B Q4_K_M at 45+ tok/s with 32K context.',
  },
  {
    id: 'rtx-5090-32gb',
    name: 'NVIDIA RTX 5090 (32 GB GDDR7 — 1,792 GB/s)',
    shortLabel: 'RTX 5090 32GB',
    vramGb: 32,
    bandwidthGbs: 1792,
    category: 'consumer',
    notes: '32GB GDDR7 workstation card; runs 32B Q5_K_M/Q8_0 or 72B IQ3_M on a single PCIe slot.',
  },
  {
    id: 'apple-m4-max-64gb',
    name: 'Apple M4 Max Unified (64 GB — 546 GB/s)',
    shortLabel: 'M4 Max 64GB',
    vramGb: 52, // ~80% usable wired unified memory for Metal/MLX
    bandwidthGbs: 546,
    category: 'apple-silicon',
    notes: '64GB unified memory (~52GB usable wired VRAM in MLX/llama.cpp); fits 72B Q4_K_M and 109B MoE.',
  },
  {
    id: 'dual-rtx-3090-4090-48gb',
    name: 'Dual RTX 4090 / 3090 Workstation (48 GB — 1,008 GB/s)',
    shortLabel: '2× 24GB (48GB)',
    vramGb: 48,
    bandwidthGbs: 920,
    category: 'workstation',
    notes: 'Tensor-parallel 48GB dual-GPU rig; runs 72B Q4_K_M and 32B FP16 with long context.',
  },
  {
    id: 'nvidia-h100-80gb',
    name: 'NVIDIA H100 SXM (80 GB HBM3 — 3,350 GB/s)',
    shortLabel: 'H100 80GB',
    vramGb: 80,
    bandwidthGbs: 3350,
    category: 'datacenter',
    notes: 'Enterprise single-GPU node for vLLM / SGLang FP8 serving of 72B and 109B MoE models.',
  },
  {
    id: 'apple-m4-ultra-192gb',
    name: 'Apple M4 Ultra Unified (192 GB — 819 GB/s)',
    shortLabel: 'M4 Ultra 192GB',
    vramGb: 164, // ~85% usable wired memory
    bandwidthGbs: 819,
    category: 'apple-silicon',
    notes: 'High-capacity unified memory studio desktop; runs 109B MoE FP16 or 671B MoE Q2/IQ3.',
  },
  {
    id: '8x-h200-b200-cluster',
    name: '8× NVIDIA H200 / B200 Node (1,128 GB HBM3e — 38,000 GB/s)',
    shortLabel: '8× H200 (1,128GB)',
    vramGb: 1128,
    bandwidthGbs: 4800,
    category: 'datacenter',
    notes: 'Full multi-GPU NVLink node required for 671B–3T frontier open-weight MoE deployments.',
  },
];

export const AI_MODELS: AiModelRecord[] = [
  {
    id: 'google-gemini-4-carbon',
    name: 'Google Gemini 4 Carbon',
    shortName: 'Gemini 4 Carbon',
    provider: 'Google DeepMind',
    tier: 'frontier-api',
    license: 'Proprietary API',
    releaseDate: '2026-10-28',
    architecture: 'Proprietary frontier model (undisclosed)',
    totalParamsB: null,
    activeParamsB: null,
    paramsLabel: 'Proprietary (undisclosed)',
    contextTokens: 1048576,
    contextLabel: '1,048,576 tokens',
    maxOutputTokens: 1048576,
    inputPricePer1M: 2.00,
    cachedInputPricePer1M: 0.10,
    outputPricePer1M: 10.00,
    apiProviderNote: 'Introductory price ($4 / $20 per 1M after the intro period). Phased rollout: cyber defenders first, then Fairwind Program partners; no public developer model ID yet.',
    isOpenWeight: false,
    kvCacheGbPer1kTokensFp16: 0,
    localCliCommand: '# Not yet on the public Gemini API. Use gemini-4-argon until Carbon reaches general availability.',
    recommendedGpu: 'Cloud API Only',
    articleSlug: 'gemini-4-carbon-frontier-model-cyber-defenders',
    summary:
      'Google DeepMind’s strongest model as of October 2026, built for long-horizon agentic engineering and cybersecurity defense. Ranks #1 on the Artificial Analysis Intelligence Index v5.0 (59).',
    strengths: [
      '88.2% on SEC-bench Pro, 54.8% on ExploitGym, 71.0% on CWE-bench (vendor-reported)',
      '0.0% attack success on Gray Swan Indirect Prompt Injection benchmark',
      'Same introductory price as Gemini 4 Argon with 95% cached-input discount',
    ],
    workloads: ['Vulnerability Discovery & Patching', 'Long-Horizon Coding Agents', 'Secure Code Generation'],
  },
  {
    id: 'openai-gpt-6-1-terra',
    name: 'OpenAI GPT-6.1 Terra',
    shortName: 'GPT-6.1 Terra',
    provider: 'OpenAI',
    tier: 'frontier-api',
    license: 'Proprietary API',
    releaseDate: '2026-10-25',
    architecture: 'Sparse MoE + Hierarchical Sparse Attention (HSA)',
    totalParamsB: null,
    activeParamsB: null,
    paramsLabel: 'Proprietary Frontier MoE',
    contextTokens: 2000000,
    contextLabel: '2,000,000 tokens',
    maxOutputTokens: 131072,
    inputPricePer1M: 2.00,
    cachedInputPricePer1M: 0.25,
    outputPricePer1M: 8.00,
    apiProviderNote: 'OpenAI Platform API (87.5% prompt cache discount via HSA KV-paging)',
    isOpenWeight: false,
    kvCacheGbPer1kTokensFp16: 0,
    localCliCommand: 'curl https://api.openai.com/v1/responses -H "Authorization: Bearer $OPENAI_API_KEY" -d \'{"model":"gpt-6.1-terra","input":"..."}\'',
    recommendedGpu: 'Cloud API Only (Managed HSA Cluster)',
    articleSlug: 'openai-gpt-6-1-terra-mirendil-fern-10m-context',
    summary:
      'OpenAI’s high-throughput production frontier model engineered for repository-scale agentic loops, multi-file code synthesis, and 2M-token context retention with sub-second time-to-first-token.',
    strengths: [
      '87.5% cached input discount ($0.25 / 1M tokens) powered by Hierarchical Sparse Attention',
      '91.4% SWE-bench Verified resolution rate with deterministic JSON & tool-call schemas',
      'Sub-600ms TTFT across 500K+ token repository prompts',
    ],
    workloads: ['Autonomous Coding Agents', 'Multi-File Refactoring', 'High-Volume Enterprise RAG'],
  },
  {
    id: 'openai-gpt-6-1-sol',
    name: 'OpenAI GPT-6.1 Sol',
    shortName: 'GPT-6.1 Sol',
    provider: 'OpenAI',
    tier: 'frontier-api',
    license: 'Proprietary API',
    releaseDate: '2026-10-25',
    architecture: 'Test-Time Compute Reasoning MoE + Verification Loop',
    totalParamsB: null,
    activeParamsB: null,
    paramsLabel: 'Proprietary Reasoning Tier',
    contextTokens: 2000000,
    contextLabel: '2,000,000 tokens',
    maxOutputTokens: 196608,
    inputPricePer1M: 7.50,
    cachedInputPricePer1M: 1.50,
    outputPricePer1M: 30.00,
    apiProviderNote: 'OpenAI Platform API (includes internal reasoning tokens in output billing)',
    isOpenWeight: false,
    kvCacheGbPer1kTokensFp16: 0,
    localCliCommand: 'curl https://api.openai.com/v1/responses -H "Authorization: Bearer $OPENAI_API_KEY" -d \'{"model":"gpt-6.1-sol","reasoning":{"effort":"high"}}\'',
    recommendedGpu: 'Cloud API Only',
    articleSlug: 'openai-gpt-6-1-terra-mirendil-fern-10m-context',
    summary:
      'OpenAI’s flagship deep-reasoning and formal-verification model designed for zero-day vulnerability root-cause analysis, theorem proving, and complex distributed systems architecture.',
    strengths: [
      'Configurable test-time compute effort (low / medium / high) with self-verifying tool traces',
      'State-of-the-art binary & source-level vulnerability auditing (CVE root-cause synthesis)',
      '2M context window with 196K maximum structured output tokens',
    ],
    workloads: ['Formal Verification', 'Zero-Day Triage & Security Auditing', 'System Architecture Design'],
  },
  {
    id: 'mirendil-fern-10m',
    name: 'Mirendil Fern (10M Context)',
    shortName: 'Mirendil Fern 10M',
    provider: 'Mirendil Labs / OpenAI Ecosystem',
    tier: 'frontier-api',
    license: 'Commercial API & Enterprise VPC',
    releaseDate: '2026-10-24',
    architecture: 'Hierarchical Sparse Attention (HSA) + Ring-KV Distributed Memory',
    totalParamsB: null,
    activeParamsB: null,
    paramsLabel: 'Ultra-Long-Context Specialist',
    contextTokens: 10000000,
    contextLabel: '10,000,000 tokens',
    maxOutputTokens: 131072,
    inputPricePer1M: 1.40,
    cachedInputPricePer1M: 0.18,
    outputPricePer1M: 5.60,
    apiProviderNote: 'Mirendil API / Enterprise VPC (78% lower KV-cache footprint via HSA)',
    isOpenWeight: false,
    kvCacheGbPer1kTokensFp16: 0,
    localCliCommand: 'curl https://api.mirendil.ai/v1/chat/completions -H "Authorization: Bearer $MIRENDIL_KEY" -d \'{"model":"fern-10m","messages":[...]}\'',
    recommendedGpu: 'Cloud API or 8× H200 VPC Appliance',
    articleSlug: 'openai-gpt-6-1-terra-mirendil-fern-10m-context',
    summary:
      'Purpose-built 10-million-token context architecture capable of ingesting entire monorepos, multi-gigabyte kernel trees, and weeks of production telemetry in a single unchunked prompt.',
    strengths: [
      'True 10,000,000-token context window with 99.2% multi-needle retrieval accuracy at 9.5M depth',
      'Hierarchical Sparse Attention slashes KV-cache memory by 78% compared to dense ring attention',
      'Industry-lowest $0.18 / 1M cached token cost for persistent codebase indexing',
    ],
    workloads: ['Whole-Monorepo Ingestion', 'Kernel & Firmware Auditing', 'Cross-Repository Migration'],
  },
  {
    id: 'anthropic-claude-duet',
    name: 'Anthropic Claude Duet (4.6 Sonnet)',
    shortName: 'Claude Duet 4.6',
    provider: 'Anthropic',
    tier: 'frontier-api',
    license: 'Proprietary API',
    releaseDate: '2026-10-20',
    architecture: 'Constitutional Proactive Agent Architecture + Stateful Memory',
    totalParamsB: null,
    activeParamsB: null,
    paramsLabel: 'Proprietary Frontier Model',
    contextTokens: 1000000,
    contextLabel: '1,000,000 tokens',
    maxOutputTokens: 128000,
    inputPricePer1M: 3.00,
    cachedInputPricePer1M: 0.30,
    outputPricePer1M: 15.00,
    apiProviderNote: 'Anthropic Messages API (90% prompt caching discount on warm prefixes)',
    isOpenWeight: false,
    kvCacheGbPer1kTokensFp16: 0,
    localCliCommand: 'curl https://api.anthropic.com/v1/messages -H "x-api-key: $ANTHROPIC_API_KEY" -d \'{"model":"claude-duet-4-6","max_tokens":8192}\'',
    recommendedGpu: 'Cloud API Only (AWS Bedrock / Vertex / Anthropic)',
    articleSlug: 'anthropic-claude-duet-vs-openai-dots-agen-proaktif',
    summary:
      'Anthropic’s proactive human-in-the-loop coding and computer-use model, combining 1M context, sandboxed bash execution, and fine-grained permission boundaries.',
    strengths: [
      'Best-in-class interactive pair programming and frontend/systems code taste',
      '90% prompt cache read savings ($0.30 / 1M tokens) for long-lived IDE sessions',
      'Strict constitutional sandboxing against prompt-injected tool escalation',
    ],
    workloads: ['Interactive Pair Programming', 'Computer Use & Browser Automation', 'Security Patch Authoring'],
  },
  {
    id: 'google-gemini-3-pro',
    name: 'Google Gemini 3 Pro',
    shortName: 'Gemini 3 Pro',
    provider: 'Google DeepMind',
    tier: 'frontier-api',
    license: 'Proprietary API',
    releaseDate: '2026-10-18',
    architecture: 'Native Multimodal Sparse MoE (Text, Audio, Video, Code)',
    totalParamsB: null,
    activeParamsB: null,
    paramsLabel: 'Proprietary Multimodal MoE',
    contextTokens: 5000000,
    contextLabel: '5,000,000 tokens',
    maxOutputTokens: 65536,
    inputPricePer1M: 1.25,
    cachedInputPricePer1M: 0.15,
    outputPricePer1M: 5.00,
    apiProviderNote: 'Google Vertex AI / AI Studio (Context Caching at $0.15 / 1M tokens)',
    isOpenWeight: false,
    kvCacheGbPer1kTokensFp16: 0,
    localCliCommand: 'curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro:generateContent?key=$GEMINI_API_KEY"',
    recommendedGpu: 'Cloud API Only (Google TPU v6e / Trillium)',
    articleSlug: 'adopsi-agen-ai-sektor-publik-dan-ritel-uspto-gemini-walmart',
    summary:
      'Google’s 5M-token native multimodal model deployed across federal patent examination (USPTO) and high-throughput enterprise workflow automation.',
    strengths: [
      '5,000,000-token native multimodal window (ingests PDFs, diagrams, video, and repositories)',
      'Aggressive $1.25 / $5.00 per 1M token pricing with $0.15 / 1M cached context reads',
      'FedRAMP High & enterprise VPC grounding integration via Vertex AI',
    ],
    workloads: ['Multimodal Document & Patent Triage', 'Enterprise Grounded Search', 'Video & Log Analysis'],
  },
  {
    id: 'moonshot-kimi-k3-1-pro',
    name: 'Moonshot Kimi K3.1 Pro (3T MoE)',
    shortName: 'Kimi K3.1 Pro (3T)',
    provider: 'Moonshot AI',
    tier: 'open-weight',
    license: 'Modified MIT Open-Weight',
    releaseDate: '2026-10-22',
    architecture: 'Ultra-Sparse MoE (3,000B Total / 96B Active) + MLA + MuonClip',
    totalParamsB: 3000,
    activeParamsB: 96,
    paramsLabel: '3,000B Total / 96B Active',
    contextTokens: 2000000,
    contextLabel: '2,000,000 tokens',
    maxOutputTokens: 131072,
    inputPricePer1M: 0.90,
    cachedInputPricePer1M: 0.12,
    outputPricePer1M: 3.20,
    apiProviderNote: 'Moonshot API / Together / Fireworks or Self-Hosted Multi-Node vLLM',
    isOpenWeight: true,
    kvCacheGbPer1kTokensFp16: 0.095, // MLA compressed latent KV cache
    localCliCommand: 'vllm serve moonshotai/Kimi-K3.1-Pro-3T-FP8 --tensor-parallel-size 8 --pipeline-parallel-size 2 --enable-chunked-prefill',
    recommendedGpu: '2× 8×H200 Node (FP8) or 8× H200 / B200 Node (INT4/AWQ)',
    articleSlug: 'moonshot-kimi-k3-1-pro-open-weight-3-triliun-parameter',
    summary:
      'The largest open-weight Mixture-of-Experts foundation model ever released: 3 trillion total parameters with 96B active per token, trained via the MuonClip optimizer with Multi-Head Latent Attention (MLA).',
    strengths: [
      'Open-weight model rivaling proprietary frontier systems on SWE-bench, AIME, and long-horizon agent benchmarks',
      'Multi-Head Latent Attention (MLA) compresses KV-cache by 84% across 2M context',
      '96B active parameters deliver fast per-token generation once distributed across NVLink H200/B200 nodes',
    ],
    workloads: ['Sovereign / On-Prem Frontier Cluster', 'Long-Horizon Agent Swarms', 'Deep Codebase Synthesis'],
  },
  {
    id: 'deepseek-v3-2-671b',
    name: 'DeepSeek V3.2 / R2 (671B MoE)',
    shortName: 'DeepSeek V3.2 (671B)',
    provider: 'DeepSeek',
    tier: 'open-weight',
    license: 'MIT Open-Weight',
    releaseDate: '2026-09-15',
    architecture: 'Fine-Grained MoE (671B Total / 37B Active) + Multi-Head Latent Attention',
    totalParamsB: 671,
    activeParamsB: 37,
    paramsLabel: '671B Total / 37B Active',
    contextTokens: 256000,
    contextLabel: '256,000 tokens',
    maxOutputTokens: 65536,
    inputPricePer1M: 0.27,
    cachedInputPricePer1M: 0.07,
    outputPricePer1M: 1.10,
    apiProviderNote: 'DeepSeek API (disk-cached prefix hits at $0.07 / 1M tokens) or Self-Hosted',
    isOpenWeight: true,
    kvCacheGbPer1kTokensFp16: 0.07, // Ultra-compact MLA KV cache
    localCliCommand: 'vllm serve deepseek-ai/DeepSeek-V3.2 --tensor-parallel-size 8 --trust-remote-code',
    recommendedGpu: '8× H100/H200 (FP8) or Mac Studio M4 Ultra 192GB + Offload (IQ3_M)',
    summary:
      'Industry price-performance benchmark combining 671B total parameters with only 37B active parameters per token and ultra-compact Multi-Head Latent Attention (MLA).',
    strengths: [
      'Unbeatable API economics ($0.07/1M cached input, $1.10/1M output) under permissive MIT license',
      'Only 37B active parameters yield high token/sec throughput on multi-GPU or hybrid CPU/GPU rigs',
      'Tiny MLA KV-cache (~70 MB per 1K tokens at FP16) allows high concurrency',
    ],
    workloads: ['High-Throughput Batch Code Analysis', 'Cost-Optimized CI/CD Agents', 'Self-Hosted Enterprise LLM'],
  },
  {
    id: 'llama-4-scout-109b-moe',
    name: 'Meta Llama 4 Scout (109B MoE)',
    shortName: 'Llama 4 Scout (109B)',
    provider: 'Meta AI',
    tier: 'open-weight',
    license: 'Llama 4 Community License',
    releaseDate: '2026-08-10',
    architecture: '16-Expert MoE (109B Total / 17B Active) + iRoPE Long Context',
    totalParamsB: 109,
    activeParamsB: 17,
    paramsLabel: '109B Total / 17B Active',
    contextTokens: 1000000,
    contextLabel: '1,000,000 tokens',
    maxOutputTokens: 32768,
    inputPricePer1M: 0.18,
    cachedInputPricePer1M: 0.09,
    outputPricePer1M: 0.55,
    apiProviderNote: 'Groq / Together / Fireworks API or Local Workstation (Dual GPU / M4 Ultra)',
    isOpenWeight: true,
    kvCacheGbPer1kTokensFp16: 0.14,
    localCliCommand: 'llama-server -m Llama-4-Scout-109B-A17B-Q4_K_M.gguf -c 32768 -ngl 99 --flash-attn',
    recommendedGpu: 'NVIDIA H100 80GB, Dual RTX 5090 (64GB), or Apple M4 Max/Ultra (64GB+)',
    summary:
      'Meta’s 109B Mixture-of-Experts model activating only 17B parameters per forward pass—delivering 70B-class intelligence at 17B inference speeds.',
    strengths: [
      '17B active parameter footprint reaches 60–110+ tok/s on workstation GPUs and Apple Silicon',
      'Fits inside a single 80GB H100 or 64GB Dual-RTX 5090 / Apple M4 Max at 4-bit quantization',
      'Interleaved RoPE (iRoPE) supports up to 1M context tokens',
    ],
    workloads: ['Fast Local Agent Routing', 'Multimodal Code & UI Inspection', 'Single-Node H100 Serving'],
  },
  {
    id: 'qwen-3-5-72b-instruct',
    name: 'Qwen 3.5 72B Instruct',
    shortName: 'Qwen 3.5 72B',
    provider: 'Alibaba Qwen',
    tier: 'open-weight',
    license: 'Apache 2.0',
    releaseDate: '2026-09-28',
    architecture: 'Dense Transformer (72.7B) + GQA (8 KV Heads) + YaRN',
    totalParamsB: 72.7,
    activeParamsB: 72.7,
    paramsLabel: '72.7B Dense',
    contextTokens: 131072,
    contextLabel: '131,072 tokens',
    maxOutputTokens: 32768,
    inputPricePer1M: 0.35,
    cachedInputPricePer1M: 0.15,
    outputPricePer1M: 0.90,
    apiProviderNote: 'OpenRouter / Together / Self-Hosted Dual-GPU or Apple M4 Max 64GB',
    isOpenWeight: true,
    kvCacheGbPer1kTokensFp16: 0.32,
    localCliCommand: 'ollama run qwen3.5:72b-instruct-q4_K_M',
    recommendedGpu: 'Dual RTX 4090/3090 (48GB) or Apple M4 Max (64GB)',
    summary:
      'Apache-2.0 licensed 72.7B dense powerhouse for multilingual engineering, complex SQL/data synthesis, and local dual-GPU workstation deployment.',
    strengths: [
      'Fits comfortably in 48GB VRAM (Dual RTX 3090/4090) or 64GB Apple M4 Max at Q4_K_M (~44 GB weights)',
      'Grouped-Query Attention (GQA) keeps KV-cache predictable up to 64K–128K context',
      'Permissive Apache 2.0 license for commercial self-hosting',
    ],
    workloads: ['Self-Hosted Workstation Assistant', 'Complex SQL & System Synthesis', 'Multilingual Technical Documentation'],
  },
  {
    id: 'qwen-3-5-32b-coder',
    name: 'Qwen 3.5 32B Coder',
    shortName: 'Qwen 3.5 32B Coder',
    provider: 'Alibaba Qwen',
    tier: 'open-weight',
    license: 'Apache 2.0',
    releaseDate: '2026-10-04',
    architecture: 'Dense Transformer (32.5B) + GQA + Fill-in-the-Middle (FIM)',
    totalParamsB: 32.5,
    activeParamsB: 32.5,
    paramsLabel: '32.5B Dense',
    contextTokens: 131072,
    contextLabel: '131,072 tokens',
    maxOutputTokens: 32768,
    inputPricePer1M: 0.14,
    cachedInputPricePer1M: 0.05,
    outputPricePer1M: 0.30,
    apiProviderNote: 'Local Single-GPU (RTX 4090 24GB / RTX 5090 32GB) or OpenRouter API',
    isOpenWeight: true,
    kvCacheGbPer1kTokensFp16: 0.24,
    localCliCommand: 'ollama run qwen3.5-coder:32b-q4_K_M',
    recommendedGpu: 'NVIDIA RTX 4090 (24GB) or RTX 5090 (32GB); fits 16GB at IQ3_M',
    summary:
      'The gold-standard single-GPU open-weight coding model: 32.5B parameters trained on 12 trillion code and repository commit tokens with native IDE Fill-in-the-Middle support.',
    strengths: [
      'Fits natively on a single 24GB GPU (RTX 4090/3090) at Q4_K_M (~19.5 GB weights)',
      'Can run on 16GB GPUs (RTX 5060 Ti 16GB) using IQ3_M quantization (~14.0 GB weights)',
      'Matches proprietary mid-tier APIs across TypeScript, Rust, Go, Python, and Kubernetes manifests',
    ],
    workloads: ['Local IDE Autocomplete & Agent', 'Air-Gapped Code Review', 'Single-GPU Dev Server'],
  },
  {
    id: 'mistral-small-3-2-24b',
    name: 'Mistral Small 3.2 (24B)',
    shortName: 'Mistral Small 3.2 (24B)',
    provider: 'Mistral AI',
    tier: 'open-weight',
    license: 'Apache 2.0',
    releaseDate: '2026-09-12',
    architecture: 'Compact Dense Transformer (24B) + Tekken Tokenizer + GQA',
    totalParamsB: 24.0,
    activeParamsB: 24.0,
    paramsLabel: '24B Dense',
    contextTokens: 65536,
    contextLabel: '65,536 tokens',
    maxOutputTokens: 16384,
    inputPricePer1M: 0.10,
    cachedInputPricePer1M: 0.04,
    outputPricePer1M: 0.30,
    apiProviderNote: 'Mistral La Plateforme API or Local 16GB–24GB GPU',
    isOpenWeight: true,
    kvCacheGbPer1kTokensFp16: 0.16,
    localCliCommand: 'ollama run mistral-small3.2:24b-instruct-2509-q4_K_M',
    recommendedGpu: 'NVIDIA RTX 5060 Ti (16GB) at Q4_K_M (8K ctx) or RTX 4090 (24GB)',
    summary:
      'Low-latency 24B Apache-2.0 model engineered for fast function calling, structured JSON extraction, and tight 16GB–24GB consumer GPU deployments.',
    strengths: [
      '24B Q4_K_M weights (~14.4 GB) fit inside a 16GB RTX 5060 Ti with quantized KV-cache (`-ctk q8_0`)',
      'Ultra-low layer count delivers rapid token generation and snappy agentic tool calling',
      'Apache 2.0 licensed with zero usage restrictions',
    ],
    workloads: ['16GB–24GB Local Workstation LLM', 'Low-Latency Function Calling', 'Structured Log Parsing'],
  },
  {
    id: 'qwen-3-5-14b-instruct',
    name: 'Qwen 3.5 14B Instruct (RTX 5060 Ti 16GB Sweet Spot)',
    shortName: 'Qwen 3.5 14B',
    provider: 'Alibaba Qwen',
    tier: 'open-weight',
    license: 'Apache 2.0',
    releaseDate: '2026-10-04',
    architecture: 'Dense Transformer (14.8B) + GQA + 128K Context',
    totalParamsB: 14.8,
    activeParamsB: 14.8,
    paramsLabel: '14.8B Dense',
    contextTokens: 131072,
    contextLabel: '131,072 tokens',
    maxOutputTokens: 16384,
    inputPricePer1M: 0.07,
    cachedInputPricePer1M: 0.03,
    outputPricePer1M: 0.20,
    apiProviderNote: 'Runs 100% Free Locally on 16GB VRAM (RTX 5060 Ti / 4060 Ti 16GB)',
    isOpenWeight: true,
    kvCacheGbPer1kTokensFp16: 0.15,
    localCliCommand: 'ollama run qwen3.5:14b-instruct-q4_K_M',
    recommendedGpu: 'NVIDIA RTX 5060 Ti (16GB) — Fits Q4_K_M (32K+ ctx) & Q5_K_M cleanly!',
    summary:
      'The ultimate everyday local model for 16GB VRAM cards like the NVIDIA RTX 5060 Ti 16GB: requires only ~8.9 GB for Q4_K_M weights, leaving 7+ GB of headroom for 32K–64K context windows at ~42 tok/s.',
    strengths: [
      'Runs 100% in VRAM on NVIDIA RTX 5060 Ti 16GB at Q4_K_M (8.9 GB), Q5_K_M (10.4 GB), or even Q8_0 (15.7 GB)',
      'Sustains ~40–46 tokens/sec on GDDR7 memory bandwidth (448 GB/s) with FlashAttention enabled',
      'Strong coding, CLI assistant, and local RAG performance without API bills or data leaving your machine',
    ],
    workloads: ['NVIDIA RTX 5060 Ti 16GB Daily Driver', 'Local Cursor / Continue IDE Assistant', 'Private Document RAG'],
  },
];

export interface VramEstimate {
  weightsGb: number;
  kvCacheGb: number;
  overheadGb: number;
  totalGb: number;
  utilizationPct: number;
  status: 'fits' | 'tight' | 'multi-gpu';
  statusLabel: string;
  estimatedTokPerSec: number;
}

export function calculateVramAndSpeed(
  model: AiModelRecord,
  quantId: QuantizationPreset['id'],
  contextTokens: number,
  gpuVramGb: number,
  gpuBandwidthGbs: number
): VramEstimate {
  const quant =
    QUANTIZATION_PRESETS.find((q) => q.id === quantId) || QUANTIZATION_PRESETS[3];
  const totalB = model.totalParamsB || 0;
  const activeB = model.activeParamsB || totalB || 1;

  const weightsGb = +(totalB * quant.bytesPerParam).toFixed(2);
  const contextK = contextTokens / 1024;
  const kvCacheGb = +(
    contextK *
    model.kvCacheGbPer1kTokensFp16 *
    quant.kvScale
  ).toFixed(2);
  const overheadGb = +(0.65 + Math.min(1.5, totalB * 0.012)).toFixed(2);
  const totalGb = +(weightsGb + kvCacheGb + overheadGb).toFixed(2);

  const utilizationPct = gpuVramGb > 0 ? Math.round((totalGb / gpuVramGb) * 100) : 999;

  let status: VramEstimate['status'] = 'multi-gpu';
  let statusLabel = 'REQUIRES MULTI-GPU';

  if (totalGb <= gpuVramGb * 0.88) {
    status = 'fits';
    statusLabel = 'FITS IN VRAM';
  } else if (totalGb <= gpuVramGb * 1.02) {
    status = 'tight';
    statusLabel = 'TIGHT FIT (Q8 KV)';
  }

  // Memory-bandwidth bound token generation speed estimate
  const activeWeightsGb = Math.max(0.5, activeB * quant.bytesPerParam);
  const kvActivePenaltyGb = Math.min(activeWeightsGb * 0.35, kvCacheGb * 0.25);
  const effectiveBytesReadGb = activeWeightsGb + kvActivePenaltyGb;

  let efficiency = status === 'fits' ? 0.66 : status === 'tight' ? 0.48 : 0.14;
  const rawTokPerSec = (gpuBandwidthGbs * efficiency) / effectiveBytesReadGb;
  const estimatedTokPerSec = Math.max(1, Math.round(rawTokPerSec));

  return {
    weightsGb,
    kvCacheGb,
    overheadGb,
    totalGb,
    utilizationPct,
    status,
    statusLabel,
    estimatedTokPerSec,
  };
}
