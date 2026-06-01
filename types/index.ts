export type ProductKey = "Aico" | "AARO" | "Mercur";
export type RegionKey = "EMEA" | "AMER" | "APAC" | "NORDICS";
export type Priority = "P1" | "P2" | "P3";
export type SlaStatus = "Met" | "Breached" | "AtRisk";
export type EscalationTier = "L1" | "L2" | "Engineering" | "CustomerSuccess";
export type TicketSource = "Zendesk" | "Salesforce";
export type TicketStatus = "Open" | "InProgress" | "Resolved" | "Closed" | "Reopened";

export type IssueType =
  | "month-end-close-sync-failure"
  | "erp-integration-timeout"
  | "consolidation-data-mismatch"
  | "intercompany-reconciliation-failure"
  | "currency-translation-error"
  | "forecasting-model-access"
  | "budget-variance-sync-issue"
  | "audit-trail-gap"
  | "account-reconciliation-error"
  | "lease-ifrs16-calculation-bug"
  | "group-reporting-data-gap"
  | "planning-model-corruption"
  | "bi-dashboard-rendering-failure"
  | "sso-authentication-failure"
  | "api-rate-limit-exceeded";

export interface SupportCase {
  id: string;
  product: ProductKey;
  issueType: IssueType;
  region: RegionKey;
  country: string;
  priority: Priority;
  status: TicketStatus;
  slaStatus: SlaStatus;
  escalationTier: EscalationTier;
  source: TicketSource;
  resolutionTimeHours: number | null;
  firstResponseTimeMinutes: number;
  reopened: boolean;
  csat: 1 | 2 | 3 | 4 | 5 | null;
  detectedProactively: boolean;
  createdAt: string;
  closedAt: string | null;
}

export interface KpiSnapshot {
  mttrP1Hours: number;
  mttrP2Hours: number;
  mttrP3Hours: number;
  proactiveDetectionRate: number;
  firstContactResolutionRate: number;
  slaComplianceRateP1P2: number;
  csatPositiveRate: number;
  reopenRate: number;
  ttfrP1Minutes: number;
  ttfrP2Minutes: number;
  ttfrP3Minutes: number;
  totalCases: number;
  openCases: number;
  escalationToEngineeringRate: number;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface KpiTrends {
  mttr: TrendPoint[];
  slaCompliance: TrendPoint[];
  csat: TrendPoint[];
  fcr: TrendPoint[];
  reopenRate: TrendPoint[];
  ttfrP1: TrendPoint[];
  proactiveDetection: TrendPoint[];
}

export type AnomalySeverity = "Critical" | "Warning" | "Info";

export interface AnomalyFlag {
  id: string;
  severity: AnomalySeverity;
  kpi: string;
  description: string;
  currentValue: number;
  threshold: number;
  direction: "above" | "below";
}

export interface Insight {
  trend: string;
  likelyCause: string;
  recommendedActions: string[];
  anomaliesTriggered: AnomalyFlag[];
  trendingIssueType: IssueType;
  trendingProduct: ProductKey;
}

export interface KnowledgeBaseDraft {
  title: string;
  issueType: IssueType;
  product: ProductKey;
  summary: string;
  symptoms: string[];
  rootCauses: string[];
  resolutionSteps: string[];
  escalationCriteria: string[];
  preventionNotes: string;
}

export interface DashboardFilters {
  product: ProductKey | "All";
  region: RegionKey | "All";
  priority: Priority | "All";
  dateRange: "7d" | "14d" | "30d";
}
