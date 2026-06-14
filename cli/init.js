#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { confirm, select } from '@inquirer/prompts';
import { walk } from './lib/walk.js';
import {
  backupAgentsDir,
  copyAddonFiles,
  copyIfAbsent,
  copyTemplateFiles,
  isBinary,
  mergeAgentsDir,
  mergeGitignore,
  replaceAgentsDir,
} from './lib/copy.js';
import { PLACEHOLDERS, replacePlaceholders } from './lib/placeholders.js';
import { promptForValues } from './lib/prompts.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_ROOT = resolve(__dirname, '../template');
const MEMORY_ROOT = resolve(__dirname, '../memory');

function parseArgs(argv) {
  const args = argv.slice(2);
  const force = args.includes('--force');
  const targetArg = args.find((a) => !a.startsWith('--'));
  return { targetArg, force };
}

async function main() {
  const { targetArg, force } = parseArgs(process.argv);

  if (!targetArg) {
    console.error('Usage: agent-init <target-directory> [--force]');
    process.exit(1);
  }

  const targetDir = resolve(process.cwd(), targetArg);

  if (resolve(targetDir) === resolve(TEMPLATE_ROOT, '..')) {
    console.error('Error: Cannot initialize into the template repo itself.');
    process.exit(1);
  }

  if (existsSync(targetDir) && readdirSync(targetDir).length > 0 && !force) {
    const ok = await confirm({
      message: `"${targetDir}" is non-empty. Continue anyway?`,
      default: false,
    });
    if (!ok) {
      console.log('Aborted.');
      process.exit(0);
    }
  }

  // --- .agents/ conflict resolution ---
  const agentsTarget = join(targetDir, '.agents');
  let agentsBackups = [];

  if (existsSync(agentsTarget)) {
    agentsBackups = backupAgentsDir(targetDir);

    const choice = await select({
      message: '.agents/ already exists. How should it be handled?',
      choices: [
        { name: 'Merge  — template files overwrite conflicts, existing unique files kept', value: 'merge' },
        { name: 'Replace — copy fresh from template', value: 'replace' },
      ],
    });

    if (choice === 'replace') {
      replaceAgentsDir(TEMPLATE_ROOT, targetDir);
    } else {
      mergeAgentsDir(TEMPLATE_ROOT, targetDir);
    }
  }

  // --- copy everything except special-cased items ---
  copyTemplateFiles(TEMPLATE_ROOT, targetDir);

  // --- .gitignore merge ---
  mergeGitignore(TEMPLATE_ROOT, targetDir);

  // --- skip-if-present files ---
  const skipped = [];
  const agentsLocalSrc = join(TEMPLATE_ROOT, 'AGENTS.local.md');
  const agentsLocalDest = join(targetDir, 'AGENTS.local.md');
  if (existsSync(agentsLocalSrc) && !copyIfAbsent(agentsLocalSrc, agentsLocalDest)) {
    skipped.push('AGENTS.local.md');
  }

  const workspaceSrc = join(TEMPLATE_ROOT, 'AGENTS.workspace.md');
  const workspaceDest = join(targetDir, 'AGENTS.workspace.md');
  if (!copyIfAbsent(workspaceSrc, workspaceDest)) {
    skipped.push('AGENTS.workspace.md');
  }

  // --- optional memory addon ---
  const includeMemory = await confirm({
    message: 'Include agent memory layer? (self-hosted mem0 — requires Docker)',
    default: false,
  });
  if (includeMemory) {
    copyAddonFiles(MEMORY_ROOT, targetDir);
  }

  // --- placeholder substitution ---
  console.log('\nFill in project identity (used in AGENTS.md):\n');
  const values = await promptForValues(PLACEHOLDERS);

  const modified = [];
  for (const filePath of walk(targetDir)) {
    const raw = readFileSync(filePath);
    if (isBinary(raw)) continue;
    const original = raw.toString('utf8');
    const updated = replacePlaceholders(original, values);
    if (updated !== original) {
      writeFileSync(filePath, updated, 'utf8');
      modified.push(filePath.replace(targetDir + '/', ''));
    }
  }

  // --- summary ---
  console.log('\n✓ Done!\n');

  if (agentsBackups.length > 0) {
    for (const { original, backup } of agentsBackups) {
      console.log(`  ${original} → ${backup}`);
    }
  }
  if (skipped.length > 0) {
    console.log(`  Skipped (already existed): ${skipped.join(', ')}`);
  }
  if (modified.length > 0) {
    console.log(`  Placeholders filled in: ${modified.join(', ')}`);
  }

  console.log('\nNext steps:');
  console.log('  1. Review AGENTS.md and fill in the remaining [bracketed] sections');
  console.log('  2. Fill in .agents/context/architecture.md and .agents/context/domain.md');
  console.log('  3. Commit the .agents/ directory to your repo');
  if (includeMemory) {
    console.log('\n  Memory layer included:');
    console.log('  4. Follow the Memory section in the template README to start the local stack');
  }
  console.log();
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
