#!/usr/bin/env tsx
import * as fs from "fs";
import * as path from "path";
import { runAudit } from "./src/runner";
import { printCliReport, saveJsonReport } from "./src/reporter";
import { AuditConfig, AuditMode } from "./src/types";

function parseArgs() {
  const args = process.argv.slice(2);
  let configPath: string | undefined;
  let env = "staging";
  let mode: AuditMode = "full";
  let categories: string[] | undefined;
  let output: string | undefined;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--config":
      case "-c":
        configPath = args[++i];
        break;
      case "--env":
      case "-e":
        env = args[++i];
        break;
      case "--mode":
      case "-m":
        mode = args[++i] as AuditMode;
        break;
      case "--category":
      case "--categories":
        categories = args[++i]?.split(",");
        break;
      case "--output":
      case "-o":
        output = args[++i];
        break;
      case "--help":
      case "-h":
        printHelp();
        process.exit(0);
    }
  }

  return { configPath, env, mode, categories, output };
}

function printHelp() {
  console.log(`
  enjoy-web prelaunch_audit - Pre-launch audit system

  Usage:
    npx tsx scripts/prelaunch-audit/run.ts [options]

  Options:
    -c, --config <path>       Config file path (default: config/staging.json)
    -e, --env <environment>   staging | production (default: staging)
    -m, --mode <mode>         live | static | full (default: full)
    --categories <list>       Comma-separated: cors,error-handling,frontend,seo,legal,deployment
    -o, --output <dir>        Output directory for JSON report
    -h, --help                Show this help

  Categories:
    cors, error-handling, frontend, seo, legal, deployment

  Examples:
    npx tsx scripts/prelaunch-audit/run.ts
    npx tsx scripts/prelaunch-audit/run.ts --env production --mode live
    npx tsx scripts/prelaunch-audit/run.ts --categories cors,seo,legal
    npx tsx scripts/prelaunch-audit/run.ts --mode static
`);
}

async function main() {
  const { configPath, env, mode, categories, output } = parseArgs();

  const defaultConfigPath = path.join(__dirname, "config", `${env}.json`);
  const resolvedPath = configPath || defaultConfigPath;

  if (!fs.existsSync(resolvedPath)) {
    console.error(`  Config not found: ${resolvedPath}`);
    console.error(`  Create it or specify with --config <path>`);
    process.exit(1);
  }

  const rawConfig = JSON.parse(fs.readFileSync(resolvedPath, "utf-8"));
  const config: AuditConfig = {
    ...rawConfig,
    environment: env,
    mode,
    ...(categories ? { categories } : {}),
  };

  console.log(`\n  Pre-Launch Audit: ${config.project}`);
  console.log(`  URL: ${config.baseUrl}`);
  console.log(`  Mode: ${mode} | Env: ${env}`);

  const report = await runAudit(config);
  printCliReport(report);

  const outputDir = output || path.join(__dirname, "reports");
  saveJsonReport(report, outputDir);

  if (report.summary.critical_failures > 0) process.exit(2);
  if (report.summary.failed > 0) process.exit(1);
  process.exit(0);
}

main().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
