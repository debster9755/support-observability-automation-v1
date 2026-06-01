import type { KpiSnapshot, AnomalyFlag } from "@/types";

export function detectAnomalies(
  snapshot: KpiSnapshot,
  prev: KpiSnapshot | null
): AnomalyFlag[] {
  const flags: AnomalyFlag[] = [];

  if (snapshot.slaComplianceRateP1P2 < 0.95) {
    flags.push({
      id: "SLA_BREACH",
      severity: "Critical",
      kpi: "SLA Compliance",
      description: `SLA compliance at ${(snapshot.slaComplianceRateP1P2 * 100).toFixed(1)}% — below 95% contractual floor`,
      currentValue: Math.round(snapshot.slaComplianceRateP1P2 * 1000) / 10,
      threshold: 95,
      direction: "below",
    });
  }

  if (snapshot.ttfrP1Minutes > 15) {
    flags.push({
      id: "TTFR_SLIP_P1",
      severity: "Critical",
      kpi: "TTFR P1",
      description: `P1 first response averaging ${snapshot.ttfrP1Minutes.toFixed(1)} min — exceeds 15-minute SLA`,
      currentValue: snapshot.ttfrP1Minutes,
      threshold: 15,
      direction: "above",
    });
  }

  const reopenPct = snapshot.reopenRate * 100;
  if (reopenPct > 8) {
    const prevPct = prev ? prev.reopenRate * 100 : 0;
    const worseByPct = prevPct > 0 ? ((reopenPct - prevPct) / prevPct) * 100 : 100;
    if (worseByPct > 50 || prevPct === 0) {
      flags.push({
        id: "REOPEN_SPIKE",
        severity: "Critical",
        kpi: "Reopen Rate",
        description: `Reopen rate at ${reopenPct.toFixed(1)}% — exceeds 8% threshold with >50% degradation`,
        currentValue: Math.round(reopenPct * 10) / 10,
        threshold: 8,
        direction: "above",
      });
    }
  }

  if (prev && snapshot.mttrP1Hours > 0) {
    const increase = ((snapshot.mttrP1Hours - prev.mttrP1Hours) / Math.max(prev.mttrP1Hours, 0.1)) * 100;
    if (increase > 20) {
      flags.push({
        id: "MTTR_REGRESSION",
        severity: "Warning",
        kpi: "MTTR P1",
        description: `P1 MTTR regressed ${increase.toFixed(0)}% to ${snapshot.mttrP1Hours.toFixed(1)} hrs`,
        currentValue: snapshot.mttrP1Hours,
        threshold: prev.mttrP1Hours * 1.2,
        direction: "above",
      });
    }
  }

  if (prev) {
    const drop = (prev.firstContactResolutionRate - snapshot.firstContactResolutionRate) * 100;
    if (drop > 5) {
      flags.push({
        id: "FCR_DECLINE",
        severity: "Warning",
        kpi: "FCR",
        description: `FCR dropped ${drop.toFixed(1)} percentage points to ${(snapshot.firstContactResolutionRate * 100).toFixed(1)}%`,
        currentValue: Math.round(snapshot.firstContactResolutionRate * 1000) / 10,
        threshold: Math.round(prev.firstContactResolutionRate * 1000) / 10 - 5,
        direction: "below",
      });
    }
  }

  if (snapshot.csatPositiveRate < 0.85) {
    flags.push({
      id: "CSAT_EROSION",
      severity: "Warning",
      kpi: "CSAT",
      description: `CSAT positive rate at ${(snapshot.csatPositiveRate * 100).toFixed(1)}% — below 85% target`,
      currentValue: Math.round(snapshot.csatPositiveRate * 1000) / 10,
      threshold: 85,
      direction: "below",
    });
  }

  if (snapshot.proactiveDetectionRate < 0.40) {
    flags.push({
      id: "PROACTIVE_LOW",
      severity: "Warning",
      kpi: "Proactive Detection",
      description: `Proactive detection at ${(snapshot.proactiveDetectionRate * 100).toFixed(1)}% — below 40% target`,
      currentValue: Math.round(snapshot.proactiveDetectionRate * 1000) / 10,
      threshold: 40,
      direction: "below",
    });
  }

  return flags.sort((a, b) => {
    const order = { Critical: 0, Warning: 1, Info: 2 };
    return order[a.severity] - order[b.severity];
  });
}
