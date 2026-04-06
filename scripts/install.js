#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const SKILL_NAME = "agentic-orchestrator";
const TARGET_DIR = path.join(os.homedir(), ".claude", "skills", SKILL_NAME);
const SOURCE_DIR = path.resolve(__dirname, "..");

const FILES_TO_COPY = [
  "SKILL.md",
  "references/agent-roles.md",
  "references/failure-recovery.md",
  "references/model-routing.md",
  "references/output-templates.md",
  "references/stack-patterns.md",
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  ensureDir(destDir);
  fs.copyFileSync(src, dest);
}

function install() {
  console.log(`\n  Installing ${SKILL_NAME} to ${TARGET_DIR}\n`);

  ensureDir(TARGET_DIR);

  let copied = 0;
  for (const file of FILES_TO_COPY) {
    const src = path.join(SOURCE_DIR, file);
    const dest = path.join(TARGET_DIR, file);

    if (!fs.existsSync(src)) {
      console.log(`  [skip] ${file} (not found in package)`);
      continue;
    }

    copyFile(src, dest);
    console.log(`  [ok]   ${file}`);
    copied++;
  }

  console.log(`\n  Done. ${copied} files installed.`);
  console.log(`  Skill location: ${TARGET_DIR}`);
  console.log(`\n  Usage: Open Claude Code and type /agentic-orchestrator\n`);
}

// Run
try {
  install();
} catch (err) {
  console.error(`\n  Installation failed: ${err.message}`);
  console.error(`  You can manually copy the skill to: ${TARGET_DIR}\n`);
  // Don't exit(1) on postinstall — npm treats that as a hard failure
}
