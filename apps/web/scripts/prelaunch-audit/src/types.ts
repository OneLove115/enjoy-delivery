export type Severity = "low" | "medium" | "high" | "critical";
export type Status = "pass" | "fail" | "skip" | "warn";
export type AuditMode = "live" | "static" | "full";

export interface AuditResult {
  category: string;
  test_name: string;
  status: Status;
  details: string;
  severity: Severity;
  fix_recommendation: string;
  duration_ms: number;
}

export interface AuditConfig {
  project: string;
  baseUrl: string;
  environment: "staging" | "production";
  mode: AuditMode;
  srcDir: string;
  publicPages: string[];
  cors: {
    allowedOrigins: string[];
    disallowedOrigins: string[];
  };
  legal: {
    requiredPages: string[];
  };
  seo: {
    sitemapPath: string;
    robotsPath: string;
  };
  categories?: string[];
  failFast: boolean;
  timeout: number;
  concurrency: number;
}

export interface AuditModule {
  name: string;
  category: string;
  description: string;
  run(config: AuditConfig): Promise<AuditResult[]>;
}

export interface AuditReport {
  project: string;
  environment: string;
  mode: AuditMode;
  timestamp: string;
  duration_ms: number;
  results: AuditResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    skipped: number;
    critical_failures: number;
  };
}
