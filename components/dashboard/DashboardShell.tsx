"use client";

import type {
  SupportCase, KpiSnapshot, KpiTrends, AnomalyFlag, Insight,
  DashboardFilters, IssueType, ProductKey, KnowledgeBaseDraft,
} from "@/types";
import Header from "./Header";
import KpiGrid from "./KpiGrid";
import RegionChart from "./RegionChart";
import TopCaseTypes from "./TopCaseTypes";
import EscalationPipeline from "./EscalationPipeline";
import InsightsPanel from "./InsightsPanel";
import KbModal from "./KbModal";

interface DashboardShellProps {
  cases: SupportCase[];
  snapshot: KpiSnapshot;
  trends: KpiTrends;
  anomalies: AnomalyFlag[];
  insight: Insight | null;
  insightLoading: boolean;
  insightError: string | null;
  filters: DashboardFilters;
  onFilterChange: (f: DashboardFilters) => void;
  regionData: { region: string; count: number }[];
  topCaseData: { issueType: string; count: number; product: string }[];
  trendingIssueType: IssueType;
  trendingProduct: ProductKey;
  onGenerateKb: () => void;
  kbDraft: KnowledgeBaseDraft | null;
  kbModalOpen: boolean;
  onKbClose: () => void;
}

export default function DashboardShell({
  cases, snapshot, trends, anomalies, insight, insightLoading, insightError,
  filters, onFilterChange, regionData, topCaseData,
  trendingIssueType, trendingProduct, onGenerateKb,
  kbDraft, kbModalOpen, onKbClose,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Header
        filters={filters}
        onFilterChange={onFilterChange}
        totalCases={snapshot.totalCases}
        openCases={snapshot.openCases}
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        <KpiGrid snapshot={snapshot} trends={trends} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <RegionChart data={regionData} />
            <TopCaseTypes data={topCaseData} />
          </div>
          <div>
            <InsightsPanel
              anomalies={anomalies}
              insight={insight}
              insightLoading={insightLoading}
              insightError={insightError}
              trendingIssueType={trendingIssueType}
              trendingProduct={trendingProduct}
              onGenerateKb={onGenerateKb}
            />
          </div>
        </div>

        <EscalationPipeline cases={cases} />

        <footer className="text-center text-xs text-[#484f58] py-4">
          Pacera Support Nexus · Mock data · 450 cases · 140+ countries · Powered by Claude
        </footer>
      </main>

      <KbModal draft={kbDraft} isOpen={kbModalOpen} onClose={onKbClose} />
    </div>
  );
}
