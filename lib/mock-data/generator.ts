import type {
  SupportCase, ProductKey, RegionKey, Priority, SlaStatus,
  EscalationTier, TicketSource, TicketStatus, IssueType,
} from "@/types";
import {
  PRODUCTS, PRODUCT_WEIGHTS, REGIONS, REGION_WEIGHTS,
  COUNTRIES_BY_REGION, ISSUE_TYPES_BY_PRODUCT,
  PRIORITY_WEIGHTS_BY_PRODUCT, SLA_THRESHOLDS,
} from "./constants";
import { mulberry32, weightedPick, normalSample, clamp } from "./rng";

export function generateCases(seed: number, count: number, periodDays: number): SupportCase[] {
  const rand = mulberry32(seed);
  const now = new Date("2026-06-01T00:00:00Z").getTime();
  const periodMs = periodDays * 24 * 60 * 60 * 1000;

  const cases: SupportCase[] = [];

  for (let i = 0; i < count; i++) {
    const product = weightedPick<ProductKey>(rand, PRODUCTS, PRODUCT_WEIGHTS);
    const region = weightedPick<RegionKey>(rand, REGIONS, REGION_WEIGHTS);
    const countries = COUNTRIES_BY_REGION[region];
    const country = countries[Math.floor(rand() * countries.length)];

    const issueEntries = ISSUE_TYPES_BY_PRODUCT[product];
    const issueType = weightedPick<IssueType>(
      rand,
      issueEntries.map((e) => e.type),
      issueEntries.map((e) => e.weight)
    );

    const priorityWeights = PRIORITY_WEIGHTS_BY_PRODUCT[product];
    const priority = weightedPick<Priority>(rand, ["P1", "P2", "P3"], priorityWeights);

    const createdOffset = rand() * periodMs;
    const createdAt = new Date(now - periodMs + createdOffset).toISOString();
    const createdTs = now - periodMs + createdOffset;

    const thresholds = SLA_THRESHOLDS[priority];

    const ttfrBase = {
      P1: { mean: 12, sd: 4, min: 2, max: 40 },
      P2: { mean: 45, sd: 15, min: 10, max: 180 },
      P3: { mean: 200, sd: 60, min: 30, max: 600 },
    }[priority];

    let ttfrMinutes = clamp(normalSample(rand, ttfrBase.mean, ttfrBase.sd), ttfrBase.min, ttfrBase.max);
    const isSpiked = rand() < 0.1 && priority === "P1";
    if (isSpiked) ttfrMinutes *= clamp(2 + rand() * 2, 2, 4);

    const resolveBase = {
      P1: { mean: 3.5, sd: 1.5, min: 0.5, max: 10 },
      P2: { mean: 7, sd: 3, min: 1, max: 20 },
      P3: { mean: 20, sd: 8, min: 2, max: 48 },
    }[priority];

    const resolveHours = clamp(normalSample(rand, resolveBase.mean, resolveBase.sd), resolveBase.min, resolveBase.max);

    const isOpen = rand() < 0.18;
    let status: TicketStatus;
    let closedAt: string | null = null;
    let resolutionTimeHours: number | null = null;

    if (isOpen) {
      status = rand() < 0.5 ? "Open" : "InProgress";
    } else {
      resolutionTimeHours = resolveHours;
      const closedTs = createdTs + resolveHours * 3600 * 1000;
      closedAt = new Date(Math.min(closedTs, now)).toISOString();
      status = "Closed";
    }

    const ttfrSlaOk = ttfrMinutes <= thresholds.ttfrMinutes;
    const resolveSlaOk = resolutionTimeHours !== null
      ? resolutionTimeHours <= thresholds.resolveHours
      : true;

    let slaStatus: SlaStatus;
    if (isOpen) {
      const elapsed = (now - createdTs) / 3600000;
      const pctUsed = elapsed / thresholds.resolveHours;
      slaStatus = pctUsed > 1 ? "Breached" : pctUsed > 0.8 ? "AtRisk" : "Met";
    } else {
      if (ttfrSlaOk && resolveSlaOk) {
        slaStatus = "Met";
      } else if (!ttfrSlaOk || (resolutionTimeHours !== null && resolutionTimeHours > thresholds.resolveHours * 1.3)) {
        slaStatus = "Breached";
      } else {
        slaStatus = "AtRisk";
      }
    }

    const escalationRoll = rand();
    let escalationTier: EscalationTier;
    if (escalationRoll < 0.60) escalationTier = "L1";
    else if (escalationRoll < 0.85) escalationTier = "L2";
    else if (escalationRoll < 0.95) escalationTier = "Engineering";
    else escalationTier = "CustomerSuccess";

    const reopened = !isOpen && (slaStatus === "Breached" ? rand() < 0.08 : rand() < 0.04);
    if (reopened) status = "Reopened";

    let csat: 1 | 2 | 3 | 4 | 5 | null = null;
    if (!isOpen && rand() < 0.75) {
      if (slaStatus === "Met") {
        const r = rand();
        csat = r < 0.05 ? 3 : r < 0.20 ? 4 : 5;
      } else if (slaStatus === "Breached") {
        const r = rand();
        csat = r < 0.30 ? 1 : r < 0.55 ? 2 : r < 0.80 ? 3 : 4;
      } else {
        const r = rand();
        csat = r < 0.10 ? 3 : r < 0.45 ? 4 : 5;
      }
    }

    const proactiveChance = { P1: 0.35, P2: 0.20, P3: 0.05 }[priority];
    const detectedProactively = rand() < proactiveChance;

    const source: TicketSource = rand() < 0.6 ? "Zendesk" : "Salesforce";

    cases.push({
      id: `CASE-${String(i + 1).padStart(5, "0")}`,
      product,
      issueType,
      region,
      country,
      priority,
      status,
      slaStatus,
      escalationTier,
      source,
      resolutionTimeHours,
      firstResponseTimeMinutes: Math.round(ttfrMinutes),
      reopened,
      csat,
      detectedProactively,
      createdAt,
      closedAt,
    });
  }

  return cases;
}
