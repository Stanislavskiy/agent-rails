import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function toLines(content) {
  return Array.isArray(content) ? content : [content];
}

function applyOp(lines, patch) {
  switch (patch.op) {
    case 'insert_after_line': {
      const idx = lines.findIndex((l) => l.includes(patch.match));
      if (idx === -1) throw new Error(`insert_after_line: "${patch.match}" not found`);
      lines.splice(idx + 1, 0, ...toLines(patch.content));
      break;
    }
    case 'insert_before_line': {
      const idx = lines.findIndex((l) => l.includes(patch.match));
      if (idx === -1) throw new Error(`insert_before_line: "${patch.match}" not found`);
      lines.splice(idx, 0, ...toLines(patch.content));
      break;
    }
    case 'append_to_line': {
      const idx = lines.findIndex((l) => l.startsWith(patch.match));
      if (idx === -1) throw new Error(`append_to_line: no line starting with "${patch.match}"`);
      lines[idx] += patch.content;
      break;
    }
    case 'append_to_section': {
      const headingIdx = lines.findIndex((l) => l === patch.section);
      if (headingIdx === -1) throw new Error(`append_to_section: "${patch.section}" not found`);
      let insertIdx = lines.findIndex((l, i) => i > headingIdx && l.startsWith('## '));
      if (insertIdx === -1) insertIdx = lines.length;
      // Insert before any trailing blank lines that precede the next section (or EOF)
      while (insertIdx > 0 && lines[insertIdx - 1].trim() === '') insertIdx--;
      lines.splice(insertIdx, 0, ...toLines(patch.content));
      break;
    }
    case 'append_to_file': {
      // Trim trailing blank lines so the separator in content controls spacing
      while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
      lines.push(...toLines(patch.content));
      break;
    }
    default:
      throw new Error(`Unknown patch op: "${patch.op}"`);
  }
}

export function applyManifest(manifestPath, targetDir) {
  const patches = JSON.parse(readFileSync(manifestPath, 'utf8'));

  const byFile = new Map();
  for (const patch of patches) {
    if (!byFile.has(patch.file)) byFile.set(patch.file, []);
    byFile.get(patch.file).push(patch);
  }

  for (const [file, filePatches] of byFile) {
    const filePath = join(targetDir, file);
    const lines = readFileSync(filePath, 'utf8').split('\n');
    for (const patch of filePatches) applyOp(lines, patch);
    writeFileSync(filePath, lines.join('\n'), 'utf8');
  }
}
