import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const EXCLUDE = new Set([
  'AGENTS.local.md',
  '.agents/scratch',
  '.gitignore',
  'AGENTS.workspace.md',
]);

function isExcluded(relPath) {
  for (const ex of EXCLUDE) {
    if (relPath === ex || relPath.startsWith(ex + '/')) return true;
  }
  return false;
}

export function copyTemplateFiles(templateRoot, targetDir) {
  cpSync(templateRoot, targetDir, {
    recursive: true,
    filter: (src) => {
      const rel = relative(templateRoot, src);
      if (rel === '') return true;
      return !isExcluded(rel);
    },
  });
}

export function backupAgentsDir(targetDir) {
  const timestamp = Date.now();
  const backed = [];

  const agentsSrc = join(targetDir, '.agents');
  const agentsDest = join(targetDir, `.agents.backup.${timestamp}`);
  cpSync(agentsSrc, agentsDest, { recursive: true });
  backed.push({ original: '.agents', backup: `.agents.backup.${timestamp}` });

  const mdSrc = join(targetDir, 'AGENTS.md');
  if (existsSync(mdSrc)) {
    const mdDest = join(targetDir, `AGENTS.backup.${timestamp}.md`);
    cpSync(mdSrc, mdDest);
    backed.push({ original: 'AGENTS.md', backup: `AGENTS.backup.${timestamp}.md` });
  }

  return backed;
}

export function replaceAgentsDir(templateRoot, targetDir) {
  rmSync(join(targetDir, '.agents'), { recursive: true });
  cpSync(join(templateRoot, '.agents'), join(targetDir, '.agents'), { recursive: true });
}

export function mergeAgentsDir(templateRoot, targetDir) {
  cpSync(join(templateRoot, '.agents'), join(targetDir, '.agents'), { recursive: true });
}

export function mergeGitignore(templateRoot, targetDir) {
  const templateLines = readFileSync(join(templateRoot, '.gitignore'), 'utf8').split('\n');
  const targetPath = join(targetDir, '.gitignore');

  if (!existsSync(targetPath)) {
    writeFileSync(targetPath, templateLines.join('\n'), 'utf8');
    return;
  }

  const existing = readFileSync(targetPath, 'utf8');
  const existingLines = new Set(existing.split('\n').map((l) => l.trim()));

  const toAppend = templateLines.filter((line) => {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) return false;
    return !existingLines.has(trimmed);
  });

  if (toAppend.length === 0) return;

  const separator = existing.endsWith('\n') ? '' : '\n';
  writeFileSync(targetPath, existing + separator + '\n' + toAppend.join('\n') + '\n', 'utf8');
}

export function copyIfAbsent(src, dest) {
  if (existsSync(dest)) return false;
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest);
  return true;
}

export function isBinary(buffer) {
  const check = buffer.subarray(0, 8192);
  for (let i = 0; i < check.length; i++) {
    if (check[i] === 0) return true;
  }
  return false;
}
