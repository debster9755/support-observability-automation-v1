"use client";

import { Activity } from "lucide-react";
import type { DashboardFilters, ProductKey, RegionKey, Priority } from "@/types";
import FilterSelect from "@/components/ui/FilterSelect";

interface HeaderProps {
  filters: DashboardFilters;
  onFilterChange: (filters: DashboardFilters) => void;
  totalCases: number;
  openCases: number;
}

export default function Header({ filters, onFilterChange, totalCases, openCases }: HeaderProps) {
  const update = (patch: Partial<DashboardFilters>) =>
    onFilterChange({ ...filters, ...patch });

  return (
    <header className="bg-[#161b22] border-b border-[#30363d] sticky top-0 z-10">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0ea5e9]/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#0ea5e9]" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#e6edf3] tracking-tight">
                  PACE<span className="text-[#0ea5e9]">RA</span>
                </div>
                <div className="text-xs text-[#8b949e] leading-none">Support Nexus</div>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-[#30363d]" />

            <div className="hidden sm:flex items-center gap-4 text-xs text-[#8b949e]">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Mock Data</span>
              </div>
              <span>{totalCases} cases · {openCases} open</span>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 sm:ml-auto">
            <FilterSelect
              label="Product"
              value={filters.product}
              onChange={(v) => update({ product: v as ProductKey | "All" })}
              options={[
                { value: "All", label: "All Products" },
                { value: "Aico", label: "Aico" },
                { value: "AARO", label: "AARO" },
                { value: "Mercur", label: "Mercur" },
              ]}
            />
            <FilterSelect
              label="Region"
              value={filters.region}
              onChange={(v) => update({ region: v as RegionKey | "All" })}
              options={[
                { value: "All", label: "All Regions" },
                { value: "EMEA", label: "EMEA" },
                { value: "AMER", label: "Americas" },
                { value: "APAC", label: "APAC" },
                { value: "NORDICS", label: "Nordics" },
              ]}
            />
            <FilterSelect
              label="Priority"
              value={filters.priority}
              onChange={(v) => update({ priority: v as Priority | "All" })}
              options={[
                { value: "All", label: "All Priorities" },
                { value: "P1", label: "P1 — Critical" },
                { value: "P2", label: "P2 — High" },
                { value: "P3", label: "P3 — Medium" },
              ]}
            />
            <FilterSelect
              label="Period"
              value={filters.dateRange}
              onChange={(v) => update({ dateRange: v as "7d" | "14d" | "30d" })}
              options={[
                { value: "30d", label: "30 Days" },
                { value: "14d", label: "14 Days" },
                { value: "7d", label: "7 Days" },
              ]}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
