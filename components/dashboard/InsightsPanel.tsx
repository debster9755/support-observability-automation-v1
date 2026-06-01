"use client";

import { AlertTriangle, AlertCircle, BookOpen, Sparkles } from "lucide-react";
import type { AnomalyFlag, Insight, IssueType, ProductKey } from "@/types";
import { ISSUE_LABELS } from "@/lib/mock-data/constants";
import LoadingDots from "@/components/ui/LoadingDots";

interface InsightsPanelProps {
  anomalies: AnomalyFlag[];
  insight: Insight | null;
  insightLoading: boolean;
  insightError: string | null;
  trendingIssueType: IssueType;
  trendingProduct: ProductKey;
  onGenerateKb: () => void;
}

const SEVERITY_STYLES = {
  Critical: {
    border: "border-red-500/40",
    bg: "bg-red-500/5",
    icon: <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />,
    badge: "bg-red-500/20 text-red-300",
  },
  Warning: {
    border: "border-amber-500/40",
    bg: "bg-amber-500/5",
    icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />,
    badge: "bg-amber-500/20 text-amber-300",
  },
  Info: {
    border: "border-sky-500/40",
    bg: "bg-sky-500/5",
    icon: <AlertCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />,
    badge: "bg-sky-500/20 text-sky-300",
  },
};

export default function InsightsPanel({
  anomalies, insight, insightLoading, insightError,
  trendingIssueType, trendingProduct, onGenerateKb,
}: InsightsPanelProps) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#0ea5e9]" />
        <h3 className="text-sm font-semibold text-[#e6edf3]">Actionable Insights</h3>
        <span className="ml-auto text-xs text-[#8b949e]">Powered by Claude</span>
      </div>

      {anomalies.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
            Anomaly Flags ({anomalies.length})
          </div>
          {anomalies.map((flag) => {
            const s = SEVERITY_STYLES[flag.severity];
            return (
              <div
                key={flag.id}
                className={`flex items-start gap-2 border ${s.border} ${s.bg} rounded-lg px-3 py-2`}
              >
                {s.icon}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${s.badge}`}>
                      {flag.severity}
                    </span>
                    <span className="text-xs font-medium text-[#8b949e]">{flag.kpi}</span>
                  </div>
                  <div className="text-xs text-[#8b949e] mt-0.5 leading-relaxed">{flag.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {anomalies.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/30 rounded-lg px-3 py-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          All metrics within acceptable thresholds
        </div>
      )}

      <div className="border-t border-[#30363d] pt-4">
        <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-3">
          LLM Recommendations
        </div>

        {insightLoading && (
          <div className="flex items-center gap-3 text-sm text-[#8b949e] py-2">
            <LoadingDots />
            <span>Analysing support patterns…</span>
          </div>
        )}

        {insightError && !insightLoading && (
          <div className="text-xs text-[#8b949e] bg-[#1c2330] border border-[#30363d] rounded-lg px-3 py-2">
            {insightError.includes("not configured")
              ? "Add ANTHROPIC_API_KEY to .env.local to enable LLM recommendations."
              : `Error: ${insightError}`}
          </div>
        )}

        {insight && !insightLoading && (
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-xs text-[#8b949e] font-medium mb-1">Trend</div>
              <p className="text-sm text-[#e6edf3] leading-relaxed">{insight.trend}</p>
            </div>
            <div>
              <div className="text-xs text-[#8b949e] font-medium mb-1">Likely Cause</div>
              <p className="text-sm text-[#8b949e] leading-relaxed">{insight.likelyCause}</p>
            </div>
            <div>
              <div className="text-xs text-[#8b949e] font-medium mb-2">Recommended Actions</div>
              <div className="flex flex-col gap-1.5">
                {insight.recommendedActions.slice(0, 3).map((action, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-[#0ea5e9] font-mono text-xs mt-0.5 shrink-0 w-4">{i + 1}.</span>
                    <span className="text-[#e6edf3]">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-[#30363d] pt-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[#8b949e] mb-0.5">Top trending issue</div>
            <div className="text-xs font-medium text-[#e6edf3] truncate">
              {ISSUE_LABELS[trendingIssueType]} · {trendingProduct}
            </div>
          </div>
          <button
            onClick={onGenerateKb}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg
              bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 text-[#0ea5e9]
              hover:bg-[#0ea5e9]/30 hover:border-[#0ea5e9]/60 transition-all shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Generate KB Article
          </button>
        </div>
      </div>
    </div>
  );
}
