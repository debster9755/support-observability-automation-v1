"use client";

import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import type { TrendPoint } from "@/types";

interface SparklineProps {
  data: TrendPoint[];
  color: string;
  inverted?: boolean;
}

export default function Sparkline({ data, color, inverted = false }: SparklineProps) {
  if (!data || data.length === 0) return null;

  const first = data[0]?.value ?? 0;
  const last = data[data.length - 1]?.value ?? 0;
  const improving = inverted ? last < first : last > first;
  const lineColor = first === last ? "#484f58" : improving ? "#10b981" : "#ef4444";

  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-[#1c2330] border border-[#30363d] rounded px-2 py-1 text-xs text-[#e6edf3]">
                {payload[0]?.value ?? 0}
              </div>
            );
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={lineColor || color}
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: lineColor || color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
