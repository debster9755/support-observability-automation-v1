import type { SupportCase, KpiSnapshot, KpiTrends, TrendPoint, DashboardFilters } from "@/types";

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function filterCases(cases: SupportCase[], filters: DashboardFilters): SupportCase[] {
  const now = new Date("2026-06-01T00:00:00Z").getTime();
  const days = parseInt(filters.dateRange);
  const cutoff = now - days * 24 * 60 * 60 * 1000;

  return cases.filter((c) => {
    if (filters.product !== "All" && c.product !== filters.product) return false;
    if (filters.region !== "All" && c.region !== filters.region) return false;
    if (filters.priority !== "All" && c.priority !== filters.priority) return false;
    const ts = new Date(c.createdAt).getTime();
    if (ts < cutoff) return false;
    return true;
  });
}

export function computeKpis(cases: SupportCase[], filters: DashboardFilters): KpiSnapshot {
  const fc = filterCases(cases, filters);
  const closed = fc.filter((c) => c.status === "Closed" || c.status === "Resolved" || c.status === "Reopened");
  const p1 = fc.filter((c) => c.priority === "P1");
  const p2 = fc.filter((c) => c.priority === "P2");
  const p3 = fc.filter((c) => c.priority === "P3");
  const p1p2 = fc.filter((c) => c.priority === "P1" || c.priority === "P2");

  const closedP1 = p1.filter((c) => c.resolutionTimeHours !== null);
  const closedP2 = p2.filter((c) => c.resolutionTimeHours !== null);
  const closedP3 = p3.filter((c) => c.resolutionTimeHours !== null);

  const mttrP1Hours = avg(closedP1.map((c) => c.resolutionTimeHours!));
  const mttrP2Hours = avg(closedP2.map((c) => c.resolutionTimeHours!));
  const mttrP3Hours = avg(closedP3.map((c) => c.resolutionTimeHours!));

  const p1Count = p1.length;
  const proactiveDetectionRate = p1Count > 0
    ? p1.filter((c) => c.detectedProactively).length / p1Count
    : 0;

  const closedCount = closed.length;
  const firstContactResolutionRate = closedCount > 0
    ? closed.filter((c) => c.escalationTier === "L1").length / closedCount
    : 0;

  const p1p2Count = p1p2.length;
  const slaComplianceRateP1P2 = p1p2Count > 0
    ? p1p2.filter((c) => c.slaStatus === "Met").length / p1p2Count
    : 1;

  const rated = fc.filter((c) => c.csat !== null);
  const csatPositiveRate = rated.length > 0
    ? rated.filter((c) => c.csat !== null && c.csat >= 4).length / rated.length
    : 0;

  const reopenRate = closedCount > 0
    ? fc.filter((c) => c.reopened).length / Math.max(fc.length, 1)
    : 0;

  const ttfrP1Minutes = avg(p1.map((c) => c.firstResponseTimeMinutes));
  const ttfrP2Minutes = avg(p2.map((c) => c.firstResponseTimeMinutes));
  const ttfrP3Minutes = avg(p3.map((c) => c.firstResponseTimeMinutes));

  const openCases = fc.filter((c) => c.status === "Open" || c.status === "InProgress").length;
  const engCases = fc.filter((c) => c.escalationTier === "Engineering").length;

  return {
    mttrP1Hours: Math.round(mttrP1Hours * 10) / 10,
    mttrP2Hours: Math.round(mttrP2Hours * 10) / 10,
    mttrP3Hours: Math.round(mttrP3Hours * 10) / 10,
    proactiveDetectionRate: Math.round(proactiveDetectionRate * 1000) / 1000,
    firstContactResolutionRate: Math.round(firstContactResolutionRate * 1000) / 1000,
    slaComplianceRateP1P2: Math.round(slaComplianceRateP1P2 * 1000) / 1000,
    csatPositiveRate: Math.round(csatPositiveRate * 1000) / 1000,
    reopenRate: Math.round(reopenRate * 1000) / 1000,
    ttfrP1Minutes: Math.round(ttfrP1Minutes * 10) / 10,
    ttfrP2Minutes: Math.round(ttfrP2Minutes * 10) / 10,
    ttfrP3Minutes: Math.round(ttfrP3Minutes * 10) / 10,
    totalCases: fc.length,
    openCases,
    escalationToEngineeringRate: fc.length > 0 ? Math.round((engCases / fc.length) * 1000) / 1000 : 0,
  };
}

export function computeTrends(cases: SupportCase[], filters: DashboardFilters): KpiTrends {
  const now = new Date("2026-06-01T00:00:00Z").getTime();
  const days = parseInt(filters.dateRange);
  const periodMs = days * 24 * 60 * 60 * 1000;
  const buckets = 7;
  const bucketMs = periodMs / buckets;

  const trendPoint = (
    bucketIndex: number,
    getValue: (bucket: SupportCase[]) => number
  ): TrendPoint => {
    const start = now - periodMs + bucketIndex * bucketMs;
    const end = start + bucketMs;
    const bucket = cases.filter((c) => {
      if (filters.product !== "All" && c.product !== filters.product) return false;
      if (filters.region !== "All" && c.region !== filters.region) return false;
      if (filters.priority !== "All" && c.priority !== filters.priority) return false;
      const ts = new Date(c.createdAt).getTime();
      return ts >= start && ts < end;
    });
    return { date: `D${bucketIndex + 1}`, value: getValue(bucket) };
  };

  const mttr: TrendPoint[] = Array.from({ length: buckets }, (_, i) =>
    trendPoint(i, (b) => {
      const nums = b.filter((c) => c.resolutionTimeHours !== null).map((c) => c.resolutionTimeHours!);
      return Math.round(avg(nums) * 10) / 10;
    })
  );

  const slaCompliance: TrendPoint[] = Array.from({ length: buckets }, (_, i) =>
    trendPoint(i, (b) => {
      const p1p2 = b.filter((c) => c.priority === "P1" || c.priority === "P2");
      if (p1p2.length === 0) return 95;
      return Math.round((p1p2.filter((c) => c.slaStatus === "Met").length / p1p2.length) * 1000) / 10;
    })
  );

  const csat: TrendPoint[] = Array.from({ length: buckets }, (_, i) =>
    trendPoint(i, (b) => {
      const rated = b.filter((c) => c.csat !== null);
      if (rated.length === 0) return 85;
      return Math.round((rated.filter((c) => c.csat !== null && c.csat >= 4).length / rated.length) * 1000) / 10;
    })
  );

  const fcr: TrendPoint[] = Array.from({ length: buckets }, (_, i) =>
    trendPoint(i, (b) => {
      const closed = b.filter((c) => c.status === "Closed" || c.status === "Resolved" || c.status === "Reopened");
      if (closed.length === 0) return 72;
      return Math.round((closed.filter((c) => c.escalationTier === "L1").length / closed.length) * 1000) / 10;
    })
  );

  const reopenRate: TrendPoint[] = Array.from({ length: buckets }, (_, i) =>
    trendPoint(i, (b) => {
      if (b.length === 0) return 4;
      return Math.round((b.filter((c) => c.reopened).length / b.length) * 1000) / 10;
    })
  );

  const ttfrP1: TrendPoint[] = Array.from({ length: buckets }, (_, i) =>
    trendPoint(i, (b) => {
      const p1 = b.filter((c) => c.priority === "P1");
      return Math.round(avg(p1.map((c) => c.firstResponseTimeMinutes)) * 10) / 10;
    })
  );

  const proactiveDetection: TrendPoint[] = Array.from({ length: buckets }, (_, i) =>
    trendPoint(i, (b) => {
      const p1 = b.filter((c) => c.priority === "P1");
      if (p1.length === 0) return 35;
      return Math.round((p1.filter((c) => c.detectedProactively).length / p1.length) * 1000) / 10;
    })
  );

  return { mttr, slaCompliance, csat, fcr, reopenRate, ttfrP1, proactiveDetection };
}

export function computeTopIssueTypes(
  cases: SupportCase[],
  filters: DashboardFilters
): { issueType: string; count: number; product: string }[] {
  const now = new Date("2026-06-01T00:00:00Z").getTime();
  const days = parseInt(filters.dateRange);
  const cutoff = now - days * 24 * 60 * 60 * 1000;

  const fc = cases.filter((c) => {
    if (filters.product !== "All" && c.product !== filters.product) return false;
    if (filters.region !== "All" && c.region !== filters.region) return false;
    if (filters.priority !== "All" && c.priority !== filters.priority) return false;
    return new Date(c.createdAt).getTime() >= cutoff;
  });

  const counts: Record<string, { count: number; products: Record<string, number> }> = {};
  for (const c of fc) {
    if (!counts[c.issueType]) counts[c.issueType] = { count: 0, products: {} };
    counts[c.issueType].count++;
    counts[c.issueType].products[c.product] = (counts[c.issueType].products[c.product] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([issueType, data]) => {
      const topProduct = Object.entries(data.products).sort((a, b) => b[1] - a[1])[0][0];
      return { issueType, count: data.count, product: topProduct };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export function computeRegionVolume(
  cases: SupportCase[],
  filters: DashboardFilters
): { region: string; count: number }[] {
  const now = new Date("2026-06-01T00:00:00Z").getTime();
  const days = parseInt(filters.dateRange);
  const cutoff = now - days * 24 * 60 * 60 * 1000;

  const fc = cases.filter((c) => {
    if (filters.product !== "All" && c.product !== filters.product) return false;
    if (filters.priority !== "All" && c.priority !== filters.priority) return false;
    return new Date(c.createdAt).getTime() >= cutoff;
  });

  const counts: Record<string, number> = {};
  for (const c of fc) {
    counts[c.region] = (counts[c.region] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count);
}

export function computeDelta(current: number, trends: { value: number }[]): number {
  if (trends.length < 2) return 0;
  const first = trends[0].value;
  if (first === 0) return 0;
  return Math.round(((current - first) / first) * 1000) / 10;
}
