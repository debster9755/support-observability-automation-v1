"use client";

import { GitBranch } from "lucide-react";
import type { SupportCase, EscalationTier } from "@/types";
import Badge from "@/components/ui/Badge";
import { ISSUE_LABELS } from "@/lib/mock-data/constants";
import type { IssueType } from "@/types";

interface EscalationPipelineProps {
  cases: SupportCase[];
}

const TIERS: { id: EscalationTier; label: string; color: string; border: string }[] = [
  { id: "L1", label: "L1 Support", color: "text-sky-400", border: "border-sky-500/30" },
  { id: "L2", label: "L2 Support", color: "text-amber-400", border: "border-amber-500/30" },
  { id: "Engineering", label: "Engineering", color: "text-red-400", border: "border-red-500/30" },
  { id: "CustomerSuccess", label: "Customer Success", color: "text-emerald-400", border: "border-emerald-500/30" },
];

export default function EscalationPipeline({ cases }: EscalationPipelineProps) {
  const active = cases.filter((c) => c.status === "Open" || c.status === "InProgress");

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-4 h-4 text-[#8b949e]" />
        <h3 className="text-sm font-semibold text-[#e6edf3]">Escalation Pipeline</h3>
        <span className="ml-auto text-xs text-[#8b949e]">{active.length} active cases</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TIERS.map((tier) => {
          const tierCases = active.filter((c) => c.escalationTier === tier.id);
          const preview = tierCases.slice(0, 3);
          const overflow = tierCases.length - preview.length;

          return (
            <div
              key={tier.id}
              className={`bg-[#0d1117] border ${tier.border} rounded-lg p-3 flex flex-col gap-2`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${tier.color}`}>{tier.label}</span>
                <span className="text-xs bg-[#1c2330] text-[#8b949e] rounded-full px-2 py-0.5 font-medium tabular-nums">
                  {tierCases.length}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                {preview.map((c) => (
                  <div
                    key={c.id}
                    className="bg-[#161b22] border border-[#30363d] rounded p-2 text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-1 flex-wrap">
                      <Badge label={c.product} variant="product" size="sm" />
                      <Badge label={c.priority} variant="priority" size="sm" />
                    </div>
                    <div className="text-[#8b949e] leading-tight truncate">
                      {ISSUE_LABELS[c.issueType as IssueType] ?? c.issueType}
                    </div>
                  </div>
                ))}
                {overflow > 0 && (
                  <div className="text-center text-xs text-[#484f58] py-1">
                    +{overflow} more
                  </div>
                )}
                {tierCases.length === 0 && (
                  <div className="text-center text-xs text-[#484f58] py-3">No active cases</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
