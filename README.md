# Pacera Support Nexus

A functional prototype support observability dashboard for **Pacera Technology** — a PE-backed B2B SaaS platform unifying three Nordic financial software products (Aico, AARO, Mercur).

Provides real-time visibility across leadership and Tech & Customer Support org. Uses deterministic mock ticket data, anomaly detection rules, and Claude (Anthropic LLM) to surface prioritized recommendations.

**Live on Vercel:** [https://pacera-support-nexus.vercel.app](https://pacera-support-nexus.vercel.app)

---

## What It Does

- **Support Observability** — 7 core KPIs (MTTR, MTTD, FCR, SLA Compliance, CSAT, Reopen Rate, TTFR) with 7-bucket sparklines and period-over-period deltas
- **Anomaly Detection** — pre-LLM rules engine flags critical deviations (SLA breach, P1 response slip, reopen spikes) instantly
- **LLM Recommendations** — Claude analyzes flagged metrics and returns 3 prioritized actions (finance-domain specific)
- **Top Case Types** — ranked by volume across all Pacera products, color-coded by product line
- **Escalation Pipeline** — live Kanban view across L1 / L2 / Engineering / Customer Success
- **KB Article Generation** — one-click draft of a Knowledge Base article for the top trending issue

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + React + TypeScript |
| Styling | Tailwind CSS v4 (`@theme inline` tokens) |
| Charts | Recharts |
| Animation | framer-motion |
| LLM | Anthropic SDK (`@anthropic-ai/sdk`) |
| Data | Deterministic mock data (seeded PRNG) |
| Hosting | Vercel |

---

## Architecture

```
Mock Generator (seed=42, 450 cases, 30 days)
       │
       ▼
Filter State (product / region / priority / date range)
       │
       ├──► KPI Selectors ──► Anomaly Engine ──► Claude API ──► Insight Widget
       │         │                                                     │
       │     KpiTrends                                          LLM Recommendations
       │
       ├──► Region Volume ──► RegionChart
       ├──► Top Issue Types ──► TopCaseTypes
       └──► Active Cases ──► EscalationPipeline
                                     │
                               KB Templates ──► KbModal
```

### Module Boundaries

```
app/
  page.tsx              — all client state: cases, filters, KPIs, insight, modal
  api/insights/route.ts — POST handler, calls Claude, returns structured JSON
  globals.css           — Tailwind v4 @theme tokens (dark Pacera palette)

types/index.ts          — all TypeScript interfaces (SupportCase, KpiSnapshot, etc.)

lib/
  mock-data/
    rng.ts              — mulberry32 deterministic PRNG
    constants.ts        — product/issue affinity weights, region to country map
    generator.ts        — generateCases(seed, count, days) -> SupportCase[]
    selectors.ts        — computeKpis(), computeTrends(), computeTopIssueTypes()
  analytics/
    anomaly.ts          — detectAnomalies() -> AnomalyFlag[] (7 rules, pre-LLM)
  content/
    kb-templates.ts     — buildKbDraft(issueType, product) -> KnowledgeBaseDraft

components/
  dashboard/            — DashboardShell, Header, KpiGrid, KpiCard, Sparkline,
                          RegionChart, TopCaseTypes, EscalationPipeline,
                          InsightsPanel, KbModal
  ui/                   — Badge, FilterSelect, LoadingDots
```

---

## Mock Data Strategy

All data is generated at runtime via a seeded `mulberry32` PRNG — identical output on every page load and every Vercel build.

**450 cases** over **30 days** across **140+ countries**:

| Product | Key Issue Types |
|---|---|
| Aico | Month-End Close Sync Failure, ERP Integration Timeout, Account Reconciliation Error |
| AARO | Consolidation Data Mismatch, Intercompany Reconciliation Failure, Currency Translation Error |
| Mercur | Forecasting Model Access, Budget Variance Sync Issue, Planning Model Corruption |

Region distribution: EMEA 40% · Americas 25% · APAC 20% · Nordics 15%

---

## KPI Definitions & Targets

| KPI | Target | Anomaly Threshold |
|---|---|---|
| MTTR P1 | <4 hrs | >4 hrs = Warning, >5.5 = Critical |
| MTTR P2 | <8 hrs | >8 hrs = Warning |
| SLA Compliance P1+P2 | >95% | <95% = Critical |
| CSAT Positive Rate | >85% | <85% = Warning |
| Ticket Reopen Rate | <5% | >8% = Critical |
| TTFR P1 | <15 min | >15 min = Critical |
| FCR | 70-80% | <70% or >5pp drop = Warning |
| Proactive Detection | >40% | <40% = Warning |

---

## Anomaly Detection Rules (pre-LLM)

Anomaly flags appear immediately on page load — zero LLM latency — and are injected into the Claude prompt:

| Rule | Condition | Severity |
|---|---|---|
| SLA_BREACH | SLA compliance <95% | Critical |
| TTFR_SLIP_P1 | P1 TTFR >15 min | Critical |
| REOPEN_SPIKE | Reopen rate >8% + >50% worse than prior | Critical |
| MTTR_REGRESSION | P1 MTTR increased >20% | Warning |
| FCR_DECLINE | FCR dropped >5 percentage points | Warning |
| CSAT_EROSION | CSAT <85% | Warning |
| PROACTIVE_LOW | Proactive detection <40% | Warning |

---

## LLM Integration

**Endpoint:** `POST /api/insights`
**Model:** `claude-haiku-4-5-20251001` (override via `ANTHROPIC_MODEL`)
**Prompt caching:** system prompt uses `cache_control: { type: "ephemeral" }` to reduce latency and cost

**Input:** structured KPI snapshot + anomaly flags + top trending issue
**Output:** `{ trend, likelyCause, recommendedActions[3] }` — finance-domain specific

---

## Local Setup

```bash
# 1. Clone
git clone <your-repo-url>
cd pacera-support-nexus

# 2. Install
npm install

# 3. Configure LLM
cp .env.example .env.local
# Edit .env.local and add: ANTHROPIC_API_KEY=sk-ant-...

# 4. Run
npm run dev
# Open http://localhost:3000
```

The dashboard works without an API key (anomaly flags and charts render immediately). LLM recommendations require the key.

---

## Vercel Deployment

1. Push to GitHub
2. Import project at vercel.com/new
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy — no other configuration required

The API key is used server-side only. It never reaches the client browser.

---

## Validation

```bash
npm run build    # Must compile cleanly
npm run lint     # ESLint check
npm run dev      # Local preview at localhost:3000
```

---

*Pacera Support Nexus · Mock data · No real Zendesk/Salesforce connection · Powered by Claude*
