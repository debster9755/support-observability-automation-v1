"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Globe } from "lucide-react";

interface RegionChartProps {
  data: { region: string; count: number }[];
}

const REGION_COLORS: Record<string, string> = {
  EMEA: "#0ea5e9",
  AMER: "#8b5cf6",
  APAC: "#10b981",
  NORDICS: "#f59e0b",
};

export default function RegionChart({ data }: RegionChartProps) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4 text-[#8b949e]" />
        <h3 className="text-sm font-semibold text-[#e6edf3]">Ticket Volume by Region</h3>
        <span className="ml-auto text-xs text-[#8b949e]">{total} total</span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
          <XAxis
            dataKey="region"
            tick={{ fill: "#8b949e", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#8b949e", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as { region: string; count: number };
              const pct = total > 0 ? ((d.count / total) * 100).toFixed(1) : 0;
              return (
                <div className="bg-[#1c2330] border border-[#30363d] rounded-lg px-3 py-2 text-xs">
                  <div className="font-semibold text-[#e6edf3]">{d.region}</div>
                  <div className="text-[#8b949e]">{d.count} cases · {pct}%</div>
                </div>
              );
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.region}
                fill={REGION_COLORS[entry.region] ?? "#0ea5e9"}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap gap-3 mt-2">
        {data.map((d) => (
          <div key={d.region} className="flex items-center gap-1.5 text-xs text-[#8b949e]">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: REGION_COLORS[d.region] ?? "#0ea5e9" }}
            />
            {d.region}: {d.count}
          </div>
        ))}
      </div>
    </div>
  );
}
