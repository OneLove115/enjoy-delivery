import * as fs from "fs";
import * as path from "path";
import { AuditConfig, AuditModule, AuditResult } from "../types";

export const deploymentAudit: AuditModule = {
  name: "deployment",
  category: "Deployment",
  description: "Deployment config, environment variables, and build safety",

  async run(config: AuditConfig): Promise<AuditResult[]> {
    const results: AuditResult[] = [];
    const rootDir = path.join(config.srcDir, "..");

    // Check vercel.json exists and is valid
    const vercelPath = path.join(rootDir, "vercel.json");
    if (fs.existsSync(vercelPath)) {
      try {
        const vc = JSON.parse(fs.readFileSync(vercelPath, "utf-8"));
        results.push({
          category: "Deployment",
          test_name: "vercel_config_valid",
          status: "pass",
          details: "vercel.json is valid JSON",
          severity: "high",
          fix_recommendation: "",
          duration_ms: 0,
        });

        // Check for security headers in vercel.json
        const hasHeaders = vc.headers && vc.headers.length > 0;
        results.push({
          category: "Deployment",
          test_name: "vercel_security_headers",
          status: hasHeaders ? "pass" : "warn",
          details: hasHeaders
            ? `${vc.headers.length} header rules configured`
            : "No custom headers in vercel.json (may be set in next.config)",
          severity: "medium",
          fix_recommendation: "Configure security headers in vercel.json or next.config",
          duration_ms: 0,
        });
      } catch {
        results.push({
          category: "Deployment",
          test_name: "vercel_config_valid",
          status: "fail",
          details: "vercel.json contains invalid JSON",
          severity: "high",
          fix_recommendation: "Fix JSON syntax in vercel.json",
          duration_ms: 0,
        });
      }
    }

    // Check .env.example exists
    const envExamplePath = path.join(rootDir, ".env.example");
    results.push({
      category: "Deployment",
      test_name: "env_example_exists",
      status: fs.existsSync(envExamplePath) ? "pass" : "warn",
      details: fs.existsSync(envExamplePath)
        ? ".env.example found for documenting required variables"
        : "No .env.example file found",
      severity: "medium",
      fix_recommendation: "Create .env.example with all required environment variables",
      duration_ms: 0,
    });

    // Check .gitignore includes .env (check both local and monorepo root)
    const gitignorePaths = [
      path.join(rootDir, ".gitignore"),
      path.join(rootDir, "..", "..", ".gitignore"),
    ];
    let envIgnored = false;
    for (const gitignorePath of gitignorePaths) {
      if (fs.existsSync(gitignorePath)) {
        const gitignore = fs.readFileSync(gitignorePath, "utf-8");
        if (gitignore.includes(".env")) {
          envIgnored = true;
          break;
        }
      }
    }
    results.push({
      category: "Deployment",
      test_name: "gitignore_env_files",
      status: envIgnored ? "pass" : "fail",
      details: envIgnored ? ".env files are in .gitignore" : ".env files NOT in .gitignore",
      severity: "critical",
      fix_recommendation: "Add .env* to .gitignore immediately",
      duration_ms: 0,
    });

    // Check for .env files that shouldn't be committed
    const envFiles = [".env", ".env.local", ".env.production"];
    for (const envFile of envFiles) {
      const envPath = path.join(rootDir, envFile);
      if (fs.existsSync(envPath)) {
        // Check if it's tracked by git
        try {
          const { execSync } = await import("child_process");
          const tracked = execSync(`git ls-files --error-unmatch "${envPath}" 2>&1`, {
            encoding: "utf-8",
            cwd: rootDir,
          });
          if (tracked) {
            results.push({
              category: "Deployment",
              test_name: `env_not_tracked:${envFile}`,
              status: "fail",
              details: `${envFile} is tracked by git!`,
              severity: "critical",
              fix_recommendation: `Remove ${envFile} from git: git rm --cached ${envFile}`,
              duration_ms: 0,
            });
          }
        } catch {
          // Not tracked = good
        }
      }
    }

    // Check next.config exists
    const nextConfigs = ["next.config.js", "next.config.mjs", "next.config.ts"];
    const hasNextConfig = nextConfigs.some((f) => fs.existsSync(path.join(rootDir, f)));
    results.push({
      category: "Deployment",
      test_name: "next_config_exists",
      status: hasNextConfig ? "pass" : "warn",
      details: hasNextConfig ? "Next.js config file found" : "No next.config file found",
      severity: "low",
      fix_recommendation: "Create next.config.mjs for production optimizations",
      duration_ms: 0,
    });

    // Check package.json has build script
    const pkgPath = path.join(rootDir, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      results.push({
        category: "Deployment",
        test_name: "build_script_exists",
        status: pkg.scripts?.build ? "pass" : "fail",
        details: pkg.scripts?.build ? `Build script: ${pkg.scripts.build}` : "No build script",
        severity: "critical",
        fix_recommendation: "Add build script to package.json",
        duration_ms: 0,
      });

      results.push({
        category: "Deployment",
        test_name: "start_script_exists",
        status: pkg.scripts?.start ? "pass" : "fail",
        details: pkg.scripts?.start ? `Start script: ${pkg.scripts.start}` : "No start script",
        severity: "high",
        fix_recommendation: "Add start script to package.json",
        duration_ms: 0,
      });
    }

    // Check TypeScript config
    const tsConfigPath = path.join(rootDir, "tsconfig.json");
    if (fs.existsSync(tsConfigPath)) {
      const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, "utf-8"));
      const strict = tsConfig.compilerOptions?.strict;
      results.push({
        category: "Deployment",
        test_name: "typescript_strict_mode",
        status: strict ? "pass" : "warn",
        details: strict ? "TypeScript strict mode enabled" : "TypeScript strict mode not enabled",
        severity: "medium",
        fix_recommendation: "Enable strict mode in tsconfig.json for better type safety",
        duration_ms: 0,
      });
    }

    return results;
  },
};
