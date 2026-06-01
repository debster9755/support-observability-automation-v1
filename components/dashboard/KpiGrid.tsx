"use client";

import { Clock, AlertTriangle, CheckCircle, BarChart3, RefreshCw, Zap, Target } from "lucide-react";
import type { KpiSnapshot, KpiTrends } from "@/types";
import KpiCard from "./KpiCard";
import { computeDelta } from "@/lib/mock-data/selectors";

interface KpiGridProps {
  snapshot: KpiSnapshot;
  trends: KpiTrends;
}

function getStatus(value: number, goodThreshold: number, warnThreshold: number, inverted = false): "good" | "warning" | "critical" {
  if (inverted) {
    if (value <= goodThreshold) return "good";
    if (value <= warnThreshold) return "warning";
    return "critical";
  } else {
    if (value >= goodThreshold) return "good";
    if (value >= warnThreshold) return "warning";
    return "critical";
  }
}

export default function KpiGrid({ snapshot, trends }: KpiGridProps) {
  const slaCompliance = snapshot.slaComplianceRateP1P2 * 100;
  const csat = snapshot.csatPositiveRate * 100;
  const fcr = snapshot.firstContactResolutionRate * 100;
  const reopenPct = snapshot.reopenRate * 100;
  const detection = snapshot.proactiveDetectionRate * 100;

  const kpis = [
    {
      label: "SLA Compliance P1+P2",
      value: slaCompliance.toFixed(1),
      unit: "%",
      target: ">95%",
      delta: computeDelta(slaCompliance, trends.slaCompliance),
      status: getStatus(slaCompliance, 95, 90),
      trend: trends.slaCompliance,
      inverted: false,
      icon: <Target className="w-3.5 h-3.5" />,
    },
    {
      label: "MTTR P1",
      value: snapshot.mttrP1Hours.toFixed(1),
      unit: "hrs",
      target: "<4 hrs",
      delta: computeDelta(snapshot.mttrP1Hours, trends.mttr),
      status: getStatus(snapshot.mttrP1Hours, 4, 5.5, true),
      trend: trends.mttr,
      inverted: true,
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    {
      label: "CSAT Positive Rate",
      value: csat.toFixed(1),
      unit: "%",
      target: ">85%",
      delta: computeDelta(csat, trends.csat),
      status: getStatus(csat, 85, 75),
      trend: trends.csat,
      inverted: false,
      icon: <CheckCircle className="w-3.5 h-3.5" />,
    },
    {
      label: "TTFR P1",
      value: snapshot.ttfrP1Minutes.toFixed(0),
      unit: "min",
      target: "<15 min",
      delta: computeDelta(snapshot.ttfrP1Minutes, trends.ttfrP1),
      status: getStatus(snapshot.ttfrP1Minutes, 15, 25, true),
      trend: trends.ttfrP1,
      inverted: true,
      icon: <Zap className="w-3.5 h-3.5" />,
    },
    {
      label: "First Contact Resolution",
      value: fcr.toFixed(1),
      unit: "%",
      target: "70–80%",
      delta: computeDelta(fcr, trends.fcr),
      status: getStatus(fcr, 70, 60),
      trend: trends.fcr,
      inverted: false,
      icon: <BarChart3 className="w-3.5 h-3.5" />,
    },
    {
      label: "Ticket Reopen Rate",
      value: reopenPct.toFixed(1),
      unit: "%",
      target: "<5%",
      delta: computeDelta(reopenPct, trends.reopenRate),
      status: getStatus(reopenPct, 5, 8, true),
      trend: trends.reopenRate,
      inverted: true,
      icon: <RefreshCw className="w-3.5 h-3.5" />,
    },
    {
      label: "Proactive Detection",
      value: detection.toFixed(1),
      unit: "%",
      target: ">40%",
      delta: computeDelta(detection, trends.proactiveDetection),
      status: getStatus(detection, 40, 30),
      trend: trends.proactiveDetection,
      inverted: false,
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {kpis.map((kpi) => (
        <KpiCard
          key={kpi.label}
          label={kpi.label}
          value={kpi.value}
          unit={kpi.unit}
          target={kpi.target}
          delta={kpi.delta}
          status={kpi.status as "good" | "warning" | "critical"}
          trend={kpi.trend}
          inverted={kpi.inverted}
          icon={kpi.icon}
        />
      ))}
    </div>
  );
}
