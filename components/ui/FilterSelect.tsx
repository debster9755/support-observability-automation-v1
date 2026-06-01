"use client";

interface Option {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

export default function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-[#8b949e] uppercase tracking-wider font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#1c2330] border border-[#30363d] text-[#e6edf3] rounded-md px-3 py-1.5 text-sm
          focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]/30
          cursor-pointer transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
