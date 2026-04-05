import { AuditModule } from "../types";
import { corsAudit } from "./cors";
import { errorHandlingAudit } from "./error-handling";
import { frontendAudit } from "./frontend";
import { seoAudit } from "./seo";
import { legalAudit } from "./legal";
import { deploymentAudit } from "./deployment";

export const allAudits: AuditModule[] = [
  corsAudit,
  errorHandlingAudit,
  frontendAudit,
  seoAudit,
  legalAudit,
  deploymentAudit,
];
