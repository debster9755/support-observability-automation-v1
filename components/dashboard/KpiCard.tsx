"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { TrendPoint } from "@/types";
import Sparkline from "./Sparkline";

interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  target: string;
  delta: number;
  status: "good" | "warning" | "critical" | "neutral";
  trend: TrendPoint[];
  inverted?: boolean;
  icon?: React.ReactNode;
}

const STATUS_STYLES = {
  good: { bar: "bg-emerald-500", badge: "text-emerald-400 bg-emerald-500/10" },
  warning: { bar: "bg-amber-500", badge: "text-amber-400 bg-amber-500/10" },
  critical: { bar: "bg-red-500", badge: "text-red-400 bg-red-500/10" },
  neutral: { bar: "bg-[#0ea5e9]", badge: "text-[#0ea5e9] bg-[#0ea5e9]/10" },
};

export default function KpiCard({
  label, value, unit, target, delta, status, trend, inverted = false, icon,
}: KpiCardProps) {
  const styles = STATUS_STYLES[status];
  const isPositiveDelta = inverted ? delta < 0 : delta > 0;
  const isNeutralDelta = Math.abs(delta) < 0.5;

  return (
    <div className="relative bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden flex flex-col">
      <div className={`h-0.5 w-full ${styles.bar}`} />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {icon && <span className="text-[#8b949e]">{icon}</span>}
            <span className="text-xs text-[#8b949e] font-medium uppercase tracking-wider leading-tight">
              {label}
            </span>
          </div>
          {!isNeutralDelta && (
            <span className={`flex items-center gap-0.5 text-xs font-medium rounded-full px-1.5 py-0.5 ${styles.badge}`}>
              {isPositiveDelta ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(delta).toFixed(1)}%
            </span>
          )}
          {isNeutralDelta && (
            <span className="flex items-center gap-0.5 text-xs text-[#484f58] font-medium rounded-full px-1.5 py-0.5 bg-slate-700/30">
              <Minus className="w-3 h-3" />
              0%
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-[#e6edf3] tabular-nums">{value}</span>
          {unit && <span className="text-sm text-[#8b949e]">{unit}</span>}
        </div>

        <div className="text-xs text-[#484f58]">Target: {target}</div>

        <div className="mt-auto">
          <Sparkline data={trend} color="#0ea5e9" inverted={inverted} />
        </div>
      </div>
    </div>
  );
}
