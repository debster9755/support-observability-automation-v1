import type { IssueType, ProductKey, RegionKey } from "@/types";

export const PRODUCTS: ProductKey[] = ["Aico", "AARO", "Mercur"];
export const PRODUCT_WEIGHTS = [35, 35, 30];

export const REGIONS: RegionKey[] = ["EMEA", "AMER", "APAC", "NORDICS"];
export const REGION_WEIGHTS = [40, 25, 20, 15];

export const COUNTRIES_BY_REGION: Record<RegionKey, string[]> = {
  NORDICS: ["NO", "SE", "FI", "DK", "IS"],
  EMEA: [
    "DE", "GB", "FR", "NL", "CH", "AT", "BE", "ES", "IT", "PL",
    "CZ", "RO", "ZA", "AE", "SA", "NG", "EG", "IL", "TR", "PT",
    "HU", "SK", "HR", "SI", "RS", "UA", "KE", "GH",
  ],
  AMER: [
    "US", "CA", "MX", "BR", "AR", "CL", "CO", "PE", "EC", "UY",
    "PA", "CR", "DO", "GT", "PY", "BO", "VE", "HN", "NI", "SV",
    "TT", "JM", "BB", "BS",
  ],
  APAC: [
    "JP", "AU", "SG", "IN", "CN", "KR", "NZ", "HK", "TH", "MY",
    "PH", "ID", "VN", "TW", "BD", "LK", "PK", "NP", "KZ", "UZ",
    "AZ", "GE", "AM", "MN", "MM", "KH", "LA", "BN", "PG", "FJ",
    "MV", "MU", "RE", "MQ", "GP", "CW", "TC", "VG", "KY", "BM",
    "AI", "MS", "LC", "VC", "GD", "WS", "TO", "VU", "SB", "KI",
    "NC", "PF", "CK", "NU", "TK", "TV", "NR", "PW", "FM", "MH",
    "GU", "MP", "AS", "WF", "YT", "PM", "TF", "HM", "CC", "CX",
    "NF", "IO", "SH", "AC", "TA", "PN", "FK", "GS", "AQ", "BV",
    "TM", "TJ", "KG", "AF", "IR",
  ],
};

export const ISSUE_TYPES_BY_PRODUCT: Record<ProductKey, { type: IssueType; weight: number }[]> = {
  Aico: [
    { type: "month-end-close-sync-failure", weight: 30 },
    { type: "erp-integration-timeout", weight: 20 },
    { type: "account-reconciliation-error", weight: 15 },
    { type: "audit-trail-gap", weight: 10 },
    { type: "sso-authentication-failure", weight: 10 },
    { type: "api-rate-limit-exceeded", weight: 8 },
    { type: "intercompany-reconciliation-failure", weight: 7 },
  ],
  AARO: [
    { type: "consolidation-data-mismatch", weight: 28 },
    { type: "intercompany-reconciliation-failure", weight: 20 },
    { type: "currency-translation-error", weight: 18 },
    { type: "lease-ifrs16-calculation-bug", weight: 12 },
    { type: "group-reporting-data-gap", weight: 12 },
    { type: "erp-integration-timeout", weight: 10 },
  ],
  Mercur: [
    { type: "forecasting-model-access", weight: 25 },
    { type: "budget-variance-sync-issue", weight: 22 },
    { type: "planning-model-corruption", weight: 18 },
    { type: "bi-dashboard-rendering-failure", weight: 15 },
    { type: "group-reporting-data-gap", weight: 12 },
    { type: "sso-authentication-failure", weight: 8 },
  ],
};

export const ISSUE_LABELS: Record<IssueType, string> = {
  "month-end-close-sync-failure": "Month-End Close Sync Failure",
  "erp-integration-timeout": "ERP Integration Timeout",
  "consolidation-data-mismatch": "Consolidation Data Mismatch",
  "intercompany-reconciliation-failure": "Intercompany Reconciliation Failure",
  "currency-translation-error": "Currency Translation Error",
  "forecasting-model-access": "Forecasting Model Access",
  "budget-variance-sync-issue": "Budget Variance Sync Issue",
  "audit-trail-gap": "Audit Trail Gap",
  "account-reconciliation-error": "Account Reconciliation Error",
  "lease-ifrs16-calculation-bug": "IFRS 16 Lease Calculation Bug",
  "group-reporting-data-gap": "Group Reporting Data Gap",
  "planning-model-corruption": "Planning Model Corruption",
  "bi-dashboard-rendering-failure": "BI Dashboard Rendering Failure",
  "sso-authentication-failure": "SSO Authentication Failure",
  "api-rate-limit-exceeded": "API Rate Limit Exceeded",
};

export const PRODUCT_COLORS: Record<ProductKey, string> = {
  Aico: "#3b82f6",
  AARO: "#8b5cf6",
  Mercur: "#10b981",
};

export const PRIORITY_WEIGHTS_BY_PRODUCT: Record<ProductKey, number[]> = {
  Aico: [15, 40, 45],
  AARO: [12, 45, 43],
  Mercur: [8, 35, 57],
};

export const SLA_THRESHOLDS = {
  P1: { resolveHours: 4, ttfrMinutes: 15 },
  P2: { resolveHours: 8, ttfrMinutes: 60 },
  P3: { resolveHours: 24, ttfrMinutes: 240 },
};
