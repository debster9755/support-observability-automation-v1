# Pacera Support Nexus

A support observability prototype for **Pacera Technology** — a PE-backed B2B SaaS company unifying three Nordic financial software products (Aico, AARO, Mercur) serving 700+ enterprise clients across 140+ countries.

**Live:** [https://pacera-support-nexus.vercel.app](https://pacera-support-nexus.vercel.app)

---

## Problems Being Addressed

- **No unified view** — three legacy support teams (Aico, AARO, Mercur) operate in silos; leadership has no single dashboard to track health across the combined org
- **Reactive escalation** — critical issues (P1 SLA breaches, first-response slippages) are caught late because there are no automated thresholds or alerts
- **Ticket pattern blindness** — the most frequently recurring issue types across products are not surfaced, so root-cause elimination is impossible
- **Manual reporting overhead** — support managers spend hours each week manually compiling KPI reports for leadership instead of acting on insights
- **No LLM-assisted guidance** — when anomalies appear, analysts have no structured starting point for diagnosis or corrective action
- **Knowledge fragmentation** — resolution steps for known recurring issues live in engineers' heads, not in a shared, searchable Knowledge Base

---

## Why Solving These Matters

- Pacera was formed in January 2026 as a multi-product roll-up; the merged support org is under pressure to prove combined operational efficiency to the PE sponsor
- Enterprise finance software clients (ERP close cycles, group consolidations, FP&A planning) have zero tolerance for unresolved P1 issues — a single missed SLA can trigger contract penalties or churn
- A fragmented support function makes it impossible to demonstrate cross-product synergies, which directly impacts valuation at the next investor review
- Without KPI visibility, leadership cannot make data-driven resourcing decisions (headcount, tooling, escalation routing) across the unified org

---

## Top Business Benefits

- **Instant leadership visibility** — real-time KPI dashboard (MTTR, SLA compliance, CSAT, reopen rate, FCR) eliminates weekly manual reporting
- **Faster issue resolution** — proactive anomaly detection catches P1 SLA risks before they breach, reducing resolution time and customer impact
- **Recurring issue elimination** — top case-type ranking by product lets engineering target the highest-volume problems for permanent fixes, reducing repeat ticket volume
- **Scalable knowledge capture** — one-click KB article generation converts resolved issues into reusable playbooks, cutting time-to-resolution for future similar cases
- **AI-assisted decision-making** — Claude surfaces finance-domain specific root causes and prioritised actions, reducing the diagnostic burden on senior engineers
- **Cross-product benchmarking** — regional and product-level filters allow leadership to compare support health across Aico, AARO, and Mercur objectively

---

## Risk of Not Solving

- **Customer churn** — enterprise finance clients running month-end close, group consolidation, and FP&A cycles cannot absorb unresolved support issues; delayed responses trigger escalations and contract reviews
- **PE sponsor scrutiny** — without measurable operational KPIs, Pacera cannot demonstrate post-merger integration progress to Accel-KKR at portfolio reviews
- **Team burnout** — reactive firefighting in a siloed, unmonitored support org accelerates attrition of experienced engineers who know how to resolve complex cross-product issues
- **Compounding technical debt** — recurring issues that are never systematically identified accumulate, increasing engineering costs quarter over quarter
- **Competitive disadvantage** — B2B SaaS competitors with modern support observability can respond faster, demonstrate higher SLA performance in procurement processes, and win renewals

---

## Target Business Outcomes

- Reduce **P1 Mean Time to Resolution** to under 4 hours across all three product lines
- Achieve **SLA compliance above 95%** for P1 and P2 tickets consistently
- Reduce **ticket reopen rate** below 5% through KB-driven first-contact resolution
- Surface the **top 5 recurring issue types** per product and drive engineering fixes that reduce ticket volume by 20%+ per quarter
- Eliminate **manual weekly KPI reporting** — leadership accesses live data on demand
- Increase **CSAT positive rate** above 85% by improving resolution speed and first-contact quality
- Establish a **shared Knowledge Base** covering the top 20 issue types across Aico, AARO, and Mercur within the first 90 days post-launch

---

## Role of AI

AI (Anthropic Claude) is integrated as a **real-time operational advisor**, not a search tool:

- **Anomaly diagnosis** — when KPI thresholds are breached, Claude analyses the full metric snapshot in finance-domain context and identifies the most likely root cause (e.g. "Month-end close spike in EMEA driving P1 TTFR degradation")
- **Prioritised action recommendations** — Claude returns exactly 3 ranked actions per anomaly event, calibrated to support operations for ERP, consolidation, and FP&A platforms
- **Knowledge Base authoring** — one-click generation of structured KB articles (symptoms, root causes, resolution steps, escalation criteria) for the top trending issue type, reducing documentation effort from hours to seconds
- **Context-aware framing** — the AI prompt includes product identity, region, priority, and anomaly severity, ensuring recommendations are specific to Pacera's multi-product, multi-region environment — not generic IT advice

AI does not replace analyst judgment — it eliminates the blank-page problem and ensures every incident starts with a structured, informed hypothesis.

---

## How to Use

**Live demo (no setup required):**
> Open [https://pacera-support-nexus.vercel.app](https://pacera-support-nexus.vercel.app) — the dashboard loads with 450 realistic mock tickets across 30 days.

**Navigation:**
1. Use the **filter bar** at the top to slice by product (Aico / AARO / Mercur), region, priority, or date range — all panels update instantly
2. Read **KPI cards** to see current health vs. target, with trend sparklines and period-over-period delta
3. Check **Insights Panel** for live anomaly flags (instant) and Claude's AI recommendations (2–3 second response)
4. View **Top Case Types** to identify the highest-volume recurring issues by product
5. Check **Escalation Pipeline** to see where open cases are sitting across L1 / L2 / Engineering / Customer Success
6. Click **Generate KB Article** in the Insights panel to produce a draft Knowledge Base article for the top trending issue

**Run locally:**

```bash
git clone https://github.com/debster9755/support-observability-automation-v1.git
cd support-observability-automation-v1/pacera-support-nexus
npm install
cp .env.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
# Open http://localhost:3000
```

The dashboard is fully functional without an API key — anomaly flags, charts, and the escalation pipeline all work immediately. AI recommendations require `ANTHROPIC_API_KEY`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + React + TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| LLM | Anthropic Claude (`@anthropic-ai/sdk`) |
| Data | Deterministic seeded mock data (no database) |
| Hosting | Vercel |

---

*Pacera Support Nexus · Prototype · Mock data only · No real Zendesk/Salesforce connection*
