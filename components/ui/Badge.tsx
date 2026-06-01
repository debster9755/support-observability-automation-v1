"use client";

interface BadgeProps {
  label: string;
  variant?: "product" | "priority" | "status" | "severity" | "default";
  color?: string;
  size?: "sm" | "md";
}

const VARIANT_STYLES: Record<string, string> = {
  "product-Aico": "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  "product-AARO": "bg-violet-500/20 text-violet-300 border border-violet-500/30",
  "product-Mercur": "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  "priority-P1": "bg-red-500/20 text-red-300 border border-red-500/30",
  "priority-P2": "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  "priority-P3": "bg-slate-500/20 text-slate-300 border border-slate-500/30",
  "status-Met": "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  "status-Breached": "bg-red-500/20 text-red-300 border border-red-500/30",
  "status-AtRisk": "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  "severity-Critical": "bg-red-500/20 text-red-300 border border-red-500/30",
  "severity-Warning": "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  "severity-Info": "bg-sky-500/20 text-sky-300 border border-sky-500/30",
  default: "bg-slate-700/50 text-slate-300 border border-slate-600/50",
};

export default function Badge({ label, variant = "default", size = "sm" }: BadgeProps) {
  const key = variant !== "default" ? `${variant}-${label}` : "default";
  const style = VARIANT_STYLES[key] ?? VARIANT_STYLES.default;
  const padding = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${padding} ${style}`}>
      {label}
    </span>
  );
}
