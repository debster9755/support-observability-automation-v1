"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import type { DashboardFilters, Insight, KnowledgeBaseDraft, IssueType, ProductKey } from "@/types";
import { generateCases } from "@/lib/mock-data/generator";
import { computeKpis, computeTrends, computeTopIssueTypes, computeRegionVolume } from "@/lib/mock-data/selectors";
import { detectAnomalies } from "@/lib/analytics/anomaly";
import { buildKbDraft } from "@/lib/content/kb-templates";
import DashboardShell from "@/components/dashboard/DashboardShell";

const DEFAULT_FILTERS: DashboardFilters = {
  product: "All",
  region: "All",
  priority: "All",
  dateRange: "30d",
};

export default function Home() {
  const [filters, setFilters] = useState<DashboardFilters>(DEFAULT_FILTERS);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);
  const [kbModalOpen, setKbModalOpen] = useState(false);
  const [kbDraft, setKbDraft] = useState<KnowledgeBaseDraft | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cases = useMemo(() => generateCases(42, 450, 30), []);

  const snapshot = useMemo(() => computeKpis(cases, filters), [cases, filters]);
  const trends = useMemo(() => computeTrends(cases, filters), [cases, filters]);
  const anomalies = useMemo(() => detectAnomalies(snapshot, null), [snapshot]);
  const regionData = useMemo(() => computeRegionVolume(cases, filters), [cases, filters]);
  const topCaseData = useMemo(() => computeTopIssueTypes(cases, filters), [cases, filters]);

  const trendingIssueType: IssueType = (topCaseData[0]?.issueType as IssueType) ?? "month-end-close-sync-failure";
  const trendingProduct: ProductKey = (topCaseData[0]?.product as ProductKey) ?? "Aico";

  const fetchInsight = useCallback(async () => {
    setInsightLoading(true);
    setInsightError(null);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          snapshot,
          anomalies,
          topIssue: trendingIssueType,
          topProduct: trendingProduct,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setInsightError(data.error ?? "Failed to load recommendations");
        return;
      }
      setInsight({
        ...data.insight,
        anomaliesTriggered: anomalies,
        trendingIssueType,
        trendingProduct,
      });
    } catch {
      setInsightError("Network error — check connection");
    } finally {
      setInsightLoading(false);
    }
  }, [snapshot, anomalies, trendingIssueType, trendingProduct]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchInsight, 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchInsight]);

  const handleGenerateKb = () => {
    const draft = buildKbDraft(trendingIssueType, trendingProduct);
    setKbDraft(draft);
    setKbModalOpen(true);
  };

  return (
    <DashboardShell
      cases={cases}
      snapshot={snapshot}
      trends={trends}
      anomalies={anomalies}
      insight={insight}
      insightLoading={insightLoading}
      insightError={insightError}
      filters={filters}
      onFilterChange={setFilters}
      regionData={regionData}
      topCaseData={topCaseData}
      trendingIssueType={trendingIssueType}
      trendingProduct={trendingProduct}
      onGenerateKb={handleGenerateKb}
      kbDraft={kbDraft}
      kbModalOpen={kbModalOpen}
      onKbClose={() => setKbModalOpen(false)}
    />
  );
}
