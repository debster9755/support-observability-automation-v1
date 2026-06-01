import type { IssueType, ProductKey, KnowledgeBaseDraft } from "@/types";

type TemplateKey = `${IssueType}::${ProductKey}` | IssueType;

const TEMPLATES: Partial<Record<TemplateKey, Omit<KnowledgeBaseDraft, "issueType" | "product">>> = {
  "month-end-close-sync-failure::Aico": {
    title: "Aico: Month-End Close Sync Failure — ERP Integration Guide",
    summary: "ERP data fails to synchronize with Aico during the financial close window, blocking reconciliation tasks and close workflow progression.",
    symptoms: [
      "Journal entries in Oracle/SAP not reflected in Aico closing task list",
      "Reconciliation items showing stale account balances",
      "Close workflow stuck in 'Pending ERP Sync' status",
      "Data freshness timestamp not updating beyond a fixed point in time",
    ],
    rootCauses: [
      "ERP API session token expired during extended close window",
      "Network timeout between Aico cloud and on-premise ERP connector",
      "ERP batch job competing with Aico sync during peak close hours",
      "OAuth scope mismatch after ERP system update",
    ],
    resolutionSteps: [
      "Navigate to Aico Admin → ERP Connections and verify connector status",
      "Force-refresh the OAuth token for the affected ERP integration",
      "Trigger a manual sync from the Closing Task Manager",
      "If sync fails, check ERP connector logs for timeout or auth errors",
      "Escalate to Engineering with connector logs if issue persists after 2 attempts",
    ],
    escalationCriteria: [
      "Issue persists after 2 manual sync attempts",
      "Affects quarter-end or year-end close (auto-P1 escalation)",
      "Multiple clients in the same region reporting simultaneously",
    ],
    preventionNotes:
      "Schedule Aico sync jobs 30 minutes before peak close windows. Configure OAuth token refresh to 2-hour intervals during month-end. Pre-test ERP connector health on Day 28 of each month.",
  },

  "consolidation-data-mismatch::AARO": {
    title: "AARO: Group Consolidation Data Mismatch — Multi-Entity Reconciliation",
    summary: "Subsidiary entity data imported via AARO Integrator does not match expected group totals, causing consolidation errors in group reports.",
    symptoms: [
      "Intercompany eliminations producing non-zero differences",
      "Group P&L report totals diverge from sum of subsidiary entries",
      "AARO showing 'Unmatched Transaction' warnings post-ETL run",
      "Currency-adjusted figures inconsistent across reporting entities",
    ],
    rootCauses: [
      "Account mapping table not updated after chart of accounts change in subsidiary ERP",
      "Intercompany transaction not reversed in both entities within the same period",
      "Exchange rate table cached from prior period (stale FX rates)",
      "ETL schedule misalignment — subsidiary data extracted before period close",
    ],
    resolutionSteps: [
      "Run AARO Integrator diagnostic: Admin → Data Sources → Validate Mappings",
      "Check account mapping version against subsidiary ERP chart of accounts",
      "Verify exchange rate table update completed for current period",
      "Force full re-extraction for affected subsidiary entities",
      "Re-run consolidation elimination rules after data correction",
    ],
    escalationCriteria: [
      "Mismatch exceeds reporting materiality threshold (>0.1% of group total)",
      "Issue blocks statutory reporting deadline",
      "Affects more than 3 subsidiary entities simultaneously",
    ],
    preventionNotes:
      "Automate account mapping validation as part of period-end checklist. Set exchange rate freeze date 2 days before group report generation. Configure AARO alerts for ETL completion delays.",
  },

  "forecasting-model-access::Mercur": {
    title: "Mercur: Forecasting Model Access Failure — FP&A User Permissions",
    summary: "Users cannot access or edit forecasting models in Mercur, blocking budget cycle workflows and scenario planning activities.",
    symptoms: [
      "Users receiving 'Access Denied' when opening forecast model",
      "Budget workflow tasks showing as locked despite approved access",
      "Scenario versions not visible to planning team members",
      "Read-only view when edit access is expected",
    ],
    rootCauses: [
      "SSO group membership not synced to Mercur role assignments after directory change",
      "Model version locked by another session that did not release cleanly",
      "Budget cycle governance workflow advanced to a stage that restricts editing",
      "License seat limit reached — concurrent user cap exceeded",
    ],
    resolutionSteps: [
      "Verify user SSO group membership in identity provider (Azure AD/Okta)",
      "Re-sync Mercur role assignments: Admin → Users → Sync Directory",
      "Check model lock status: Admin → Models → Active Sessions",
      "Force-release stale session locks if session is >4 hours old",
      "Confirm license seat availability in Admin → Licensing",
    ],
    escalationCriteria: [
      "Access failure affects >3 users during active budget cycle",
      "Model is locked and original session owner is unreachable",
      "Issue coincides with budget submission deadline",
    ],
    preventionNotes:
      "Schedule Mercur-SSO sync daily during budget season. Set model auto-unlock after 2-hour idle session. Monitor concurrent license utilization weekly during Q1/Q3 planning cycles.",
  },

  "currency-translation-error::AARO": {
    title: "AARO: Currency Translation Error — Multi-Currency Consolidation",
    summary: "Currency translation applied incorrectly during consolidation, producing mismatched functional/presentation currency figures in group reports.",
    symptoms: [
      "FX variance account showing unexpected balances",
      "Translation differences not reconciling to retained earnings movement",
      "Group report currency figures inconsistent with subsidiary local amounts",
      "IFRS OCI (Other Comprehensive Income) section showing anomalous FX items",
    ],
    rootCauses: [
      "Wrong exchange rate type applied (closing vs. average rate) to balance sheet vs. P&L",
      "Subsidiary functional currency not updated after legal entity restructure",
      "Missing exchange rate for a currency pair in the current period",
      "Hyperinflationary economy entity not flagged for IAS 29 treatment",
    ],
    resolutionSteps: [
      "Verify exchange rate configuration: Admin → Rates → Period Rate Table",
      "Confirm correct rate type assignment per account class (balance sheet = closing, P&L = average)",
      "Check subsidiary functional currency setting matches legal entity profile",
      "Re-run currency translation for affected entity after correction",
    ],
    escalationCriteria: [
      "Translation error affects audited financial statements",
      "Variance exceeds materiality threshold",
      "Issue involves a hyperinflationary economy subsidiary",
    ],
    preventionNotes:
      "Lock exchange rate table 3 days before consolidation run. Automate functional currency validation as period-end control. Alert on missing FX rates before ETL execution.",
  },

  "erp-integration-timeout::Aico": {
    title: "Aico: ERP Integration Timeout — Connector Health Recovery",
    summary: "Aico ERP connector times out during data fetch, interrupting live reconciliation and close workflow automation.",
    symptoms: [
      "ERP connector status showing 'Timeout' or 'Disconnected' in Aico Admin",
      "Account balances not refreshing from ERP source",
      "Closing tasks dependent on live ERP data blocked from completion",
    ],
    rootCauses: [
      "Network firewall rule change blocking connector port",
      "ERP system under high load during peak usage (month-end)",
      "Connector authentication token expired (default: 8-hour TTL)",
      "ERP API rate limit triggered by high-frequency sync schedule",
    ],
    resolutionSteps: [
      "Check connector health: Aico Admin → ERP Connections → Test Connection",
      "Review network firewall logs for blocked traffic on connector port",
      "Re-authenticate ERP connector with fresh credentials",
      "Temporarily reduce sync frequency if rate limit is the cause",
      "Escalate to Engineering with connector diagnostic logs if unresolved",
    ],
    escalationCriteria: [
      "Timeout persists >30 minutes during live close window",
      "Multiple ERP connectors affected simultaneously",
      "Network team confirms no firewall changes — potential ERP-side issue",
    ],
    preventionNotes:
      "Implement connector health monitoring with 5-minute check interval. Pre-authenticate ERP connectors on Day 27 of each month. Configure automatic token refresh 30 minutes before TTL expiry.",
  },
};

function getTemplate(
  issueType: IssueType,
  product: ProductKey
): Omit<KnowledgeBaseDraft, "issueType" | "product"> {
  const specific = TEMPLATES[`${issueType}::${product}` as TemplateKey];
  if (specific) return specific;

  return {
    title: `${product}: ${issueType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — Resolution Guide`,
    summary: `Users are experiencing ${issueType.replace(/-/g, " ")} in ${product}. This guide covers diagnostic steps and resolution procedures.`,
    symptoms: [
      `Unexpected error or degraded behavior related to ${issueType.replace(/-/g, " ")}`,
      "Support tickets escalating from L1 without resolution",
      "User-reported workflow disruption during normal operating hours",
    ],
    rootCauses: [
      "Configuration drift after recent platform update",
      "Underlying service dependency experiencing degraded performance",
      "User permission or access control misconfiguration",
    ],
    resolutionSteps: [
      `Collect diagnostic information from affected ${product} module`,
      "Verify system status and recent change log",
      "Apply standard troubleshooting sequence per support runbook",
      "Escalate to Tier 2 with full diagnostic bundle if unresolved in 30 minutes",
    ],
    escalationCriteria: [
      "Issue affects more than 5 users simultaneously",
      "Blocks a time-sensitive financial workflow (close, consolidation, budget)",
      "No resolution after applying standard troubleshooting steps",
    ],
    preventionNotes: `Monitor ${product} health dashboards proactively. Schedule regular configuration validation as part of monthly support review.`,
  };
}

export function buildKbDraft(issueType: IssueType, product: ProductKey): KnowledgeBaseDraft {
  const template = getTemplate(issueType, product);
  return { ...template, issueType, product };
}
