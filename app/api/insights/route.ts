import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { KpiSnapshot, AnomalyFlag } from "@/types";

interface InsightRequest {
  snapshot: KpiSnapshot;
  anomalies: AnomalyFlag[];
  topIssue: string;
  topProduct: string;
}

const SYSTEM_PROMPT = `You are a senior support operations analyst for Pacera, a B2B SaaS company providing financial close (Aico), group consolidation (AARO), and FP&A (Mercur) software to 700+ enterprise clients across 140+ countries.

Respond ONLY with a JSON object in this exact schema:
{
  "trend": "string (1-2 sentences describing the overall support performance trend)",
  "likelyCause": "string (1-2 sentences identifying the most likely root cause, finance-domain specific)",
  "recommendedActions": ["action1", "action2", "action3"]
}

Rules:
- Each recommendedAction must be 20 words or fewer
- Reference specific Pacera products (Aico, AARO, Mercur) or finance workflows where relevant
- Focus on actionable, operational improvements
- No text outside the JSON object`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "LLM not configured" }, { status: 500 });
  }

  let body: InsightRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { snapshot, anomalies, topIssue, topProduct } = body;

  const flagLines = anomalies.length > 0
    ? anomalies.map((f) => `[${f.severity}] ${f.description} (value: ${f.currentValue}, threshold: ${f.threshold})`).join("\n")
    : "No critical anomalies detected.";

  const userPrompt = `Current KPI snapshot (filtered view):
- MTTR P1: ${snapshot.mttrP1Hours} hrs (target <4 hrs)
- MTTR P2: ${snapshot.mttrP2Hours} hrs (target <8 hrs)
- SLA Compliance P1+P2: ${(snapshot.slaComplianceRateP1P2 * 100).toFixed(1)}% (target >95%)
- CSAT Positive Rate: ${(snapshot.csatPositiveRate * 100).toFixed(1)}% (target >85%)
- Reopen Rate: ${(snapshot.reopenRate * 100).toFixed(1)}% (target <5%)
- TTFR P1: ${snapshot.ttfrP1Minutes} min (target <15 min)
- FCR: ${(snapshot.firstContactResolutionRate * 100).toFixed(1)}% (target 70-80%)
- Proactive Detection: ${(snapshot.proactiveDetectionRate * 100).toFixed(1)}% (target >40%)
- Total Cases: ${snapshot.totalCases} | Open: ${snapshot.openCases}

Anomaly flags triggered:
${flagLines}

Top trending issue type: ${topIssue} across ${topProduct}

Provide your analysis as the JSON schema specified.`;

  try {
    const client = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

    const response = await client.messages.create({
      model,
      max_tokens: 400,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "LLM response malformed" }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (
      typeof parsed.trend !== "string" ||
      typeof parsed.likelyCause !== "string" ||
      !Array.isArray(parsed.recommendedActions)
    ) {
      return NextResponse.json({ error: "LLM response schema invalid" }, { status: 500 });
    }

    return NextResponse.json({ insight: parsed });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return NextResponse.json({ error: "LLM call failed" }, { status: 502 });
  }
}
