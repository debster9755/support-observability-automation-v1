"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { KnowledgeBaseDraft } from "@/types";
import Badge from "@/components/ui/Badge";

interface KbModalProps {
  draft: KnowledgeBaseDraft | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function KbModal({ draft, isOpen, onClose }: KbModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!draft) return;
    const text = [
      `# ${draft.title}`,
      `\n## Summary\n${draft.summary}`,
      `\n## Symptoms\n${draft.symptoms.map((s) => `- ${s}`).join("\n")}`,
      `\n## Root Causes\n${draft.rootCauses.map((r) => `- ${r}`).join("\n")}`,
      `\n## Resolution Steps\n${draft.resolutionSteps.map((s) => `- ${s}`).join("\n")}`,
      `\n## Escalation Criteria\n${draft.escalationCriteria.map((c) => `- ${c}`).join("\n")}`,
      `\n## Prevention\n${draft.preventionNotes}`,
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && draft && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden z-10"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="h-0.5 bg-gradient-to-r from-[#0ea5e9] via-[#8b5cf6] to-[#10b981]" />

            <div className="flex items-start justify-between p-5 border-b border-[#30363d]">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge label={draft.product} variant="product" />
                  <span className="text-xs text-[#8b949e]">Knowledge Base Article Draft</span>
                </div>
                <h2 className="text-sm font-semibold text-[#e6edf3] leading-tight">{draft.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-[#8b949e] hover:text-[#e6edf3] transition-colors p-1 rounded-md hover:bg-[#30363d]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 flex flex-col gap-4 text-sm">
              <div>
                <div className="text-xs font-semibold text-[#0ea5e9] uppercase tracking-wider mb-1.5">Summary</div>
                <p className="text-[#8b949e] leading-relaxed">{draft.summary}</p>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#f59e0b] uppercase tracking-wider mb-1.5">Symptoms</div>
                <ul className="space-y-1">
                  {draft.symptoms.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#8b949e]">
                      <span className="text-[#f59e0b] mt-0.5 shrink-0">▸</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#ef4444] uppercase tracking-wider mb-1.5">Root Causes</div>
                <ul className="space-y-1">
                  {draft.rootCauses.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#8b949e]">
                      <span className="text-[#ef4444] mt-0.5 shrink-0">▸</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#10b981] uppercase tracking-wider mb-1.5">Resolution Steps</div>
                <ol className="space-y-1">
                  {draft.resolutionSteps.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#8b949e]">
                      <span className="text-[#10b981] font-mono text-xs mt-0.5 w-4 shrink-0">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#8b5cf6] uppercase tracking-wider mb-1.5">Escalation Criteria</div>
                <ul className="space-y-1">
                  {draft.escalationCriteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-[#8b949e]">
                      <span className="text-[#8b5cf6] mt-0.5 shrink-0">▸</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#1c2330] border border-[#30363d] rounded-lg p-3">
                <div className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-1.5">Prevention Notes</div>
                <p className="text-[#8b949e] text-xs leading-relaxed">{draft.preventionNotes}</p>
              </div>
            </div>

            <div className="border-t border-[#30363d] p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#484f58]">
                <ArrowUpRight className="w-3 h-3" />
                Routing to {draft.product} Tier 2 Specialist
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md
                    bg-[#1c2330] border border-[#30363d] text-[#8b949e]
                    hover:text-[#e6edf3] hover:border-[#484f58] transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy MD"}
                </button>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs font-medium rounded-md
                    bg-[#0ea5e9] text-white hover:bg-[#0369a1] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
