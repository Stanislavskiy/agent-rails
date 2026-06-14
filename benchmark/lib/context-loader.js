import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROUTING = {
  'bug-fix': [
    'AGENTS.md',
    '.agents/context/principles/distilled/README.md',
    '.agents/context/architecture.md',
  ],
  'new-feature': [
    'AGENTS.md',
    '.agents/context/principles/distilled/README.md',
    '.agents/context/principles/workflow.md',
    '.agents/context/architecture.md',
    '.agents/context/domain.md',
  ],
  'refactor': [
    'AGENTS.md',
    '.agents/context/principles/distilled/README.md',
  ],
  'code-review': [
    'AGENTS.md',
    '.agents/context/principles/distilled/README.md',
  ],
};

function walkDir(dir, base = dir, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkDir(full, base, results);
    } else {
      results.push(relative(base, full));
    }
  }
  return results;
}

export function loadContext(fixtureDir, taskType) {
  const paths = ROUTING[taskType] ?? [];
  return paths
    .map((p) => {
      const full = join(fixtureDir, p);
      if (!existsSync(full)) return null;
      return { path: p, content: readFileSync(full, 'utf8') };
    })
    .filter(Boolean);
}

export function loadAllContext(fixtureDir) {
  const allPaths = walkDir(fixtureDir);
  const textExts = new Set(['.md', '.js', '.json', '.ts', '.txt', '.yml', '.yaml']);
  return allPaths
    .filter((p) => {
      const ext = p.slice(p.lastIndexOf('.'));
      return textExts.has(ext);
    })
    .map((p) => {
      const full = join(fixtureDir, p);
      return { path: p, content: readFileSync(full, 'utf8') };
    });
}

export function formatContext(files) {
  return files
    .map((f) => `--- FILE: ${f.path} ---\n${f.content.trimEnd()}`)
    .join('\n\n');
}
