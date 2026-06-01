"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { ISSUE_LABELS, PRODUCT_COLORS } from "@/lib/mock-data/constants";
import type { IssueType, ProductKey } from "@/types";

interface TopCaseTypesProps {
  data: { issueType: string; count: number; product: string }[];
}

export default function TopCaseTypes({ data }: TopCaseTypesProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: ISSUE_LABELS[d.issueType as IssueType] ?? d.issueType,
    color: PRODUCT_COLORS[d.product as ProductKey] ?? "#0ea5e9",
  }));

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-[#8b949e]" />
        <h3 className="text-sm font-semibold text-[#e6edf3]">Top Case Types</h3>
        <span className="ml-auto text-xs text-[#8b949e]">by volume</span>
      </div>

      <div className="flex gap-3 mb-3 flex-wrap">
        {[
          { label: "Aico", color: "#3b82f6" },
          { label: "AARO", color: "#8b5cf6" },
          { label: "Mercur", color: "#10b981" },
        ].map((p) => (
          <div key={p.label} className="flex items-center gap-1.5 text-xs text-[#8b949e]">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: p.color }} />
            {p.label}
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 30)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 40, bottom: 0, left: 4 }}
        >
          <XAxis
            type="number"
            tick={{ fill: "#8b949e", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="label"
            type="category"
            tick={{ fill: "#8b949e", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={180}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as { label: string; count: number; product: string };
              return (
                <div className="bg-[#1c2330] border border-[#30363d] rounded-lg px-3 py-2 text-xs">
                  <div className="font-semibold text-[#e6edf3]">{d.label}</div>
                  <div className="text-[#8b949e]">{d.count} cases · {d.product}</div>
                </div>
              );
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} label={{ position: "right", fill: "#8b949e", fontSize: 10 }}>
            {chartData.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
