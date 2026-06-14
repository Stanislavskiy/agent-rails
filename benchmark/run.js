#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { loadContext, loadAllContext, formatContext } from './lib/context-loader.js';
import { runAgent, SYSTEM } from './lib/agent.js';
import { evaluateCriteria } from './lib/eval.js';
import { aggregateRuns, buildSummary, printSummaryTable } from './lib/metrics.js';
import { countContextBreakdown } from './lib/token-counter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, 'fixtures');
const TASKS_DIR = join(__dirname, 'tasks');
const RESULTS_DIR = join(__dirname, 'results');

const MAX_CONTEXT_TOKENS = 200_000;

const { values: opts } = parseArgs({
  options: {
    task: { type: 'string' },
    type: { type: 'string' },
    all: { type: 'boolean', default: false },
    report: { type: 'boolean', default: false },
    baseline: { type: 'boolean', default: false },
    model: { type: 'string', default: 'claude-sonnet-4-6' },
    runs: { type: 'string', default: '3' },
  },
});

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
  process.exit(1);
}

function loadTask(taskId) {
  const p = join(TASKS_DIR, `${taskId}.json`);
  if (!existsSync(p)) throw new Error(`Task not found: ${taskId}`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

function loadAllTasks() {
  return readdirSync(TASKS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(TASKS_DIR, f), 'utf8')));
}

function buildTaskPrompt(task, fixtureDir) {
  const promptFile = join(fixtureDir, `.agents/prompts/${task.type}.md`);
  const promptTemplate = existsSync(promptFile) ? readFileSync(promptFile, 'utf8') : '';

  const targetContent =
    task.target_files.length > 0
      ? task.target_files
          .map((f) => `--- FILE: ${f} ---\n${readFileSync(join(fixtureDir, f), 'utf8').trimEnd()}`)
          .join('\n\n')
      : '';

  const diff = task.diff ? `## Diff to Review\n\`\`\`diff\n${task.diff}\n\`\`\`` : '';

  return [
    promptTemplate,
    '---',
    `## Task\n${task.description}`,
    `**Expected behavior:** ${task.expected_behavior}`,
    targetContent && `## Target Files\n\n${targetContent}`,
    diff,
  ]
    .filter(Boolean)
    .join('\n\n');
}

async function runSingleTask(task, options) {
  const fixtureDir = join(FIXTURES_DIR, task.fixture);
  if (!existsSync(fixtureDir)) throw new Error(`Fixture not found: ${task.fixture}`);

  const contextFiles = options.baseline
    ? loadAllContext(fixtureDir)
    : loadContext(fixtureDir, task.type);

  const contextText = formatContext(contextFiles);
  const taskPrompt = buildTaskPrompt(task, fixtureDir);
  const numRuns = parseInt(options.runs, 10);

  console.log(`\nTask: ${task.id} (${task.type}, fixture: ${task.fixture})`);
  console.log(`Context files loaded: ${contextFiles.map((f) => f.path).join(', ')}`);
  console.log(`Runs: ${numRuns}, Model: ${options.model}`);

  const runResults = [];

  for (let i = 0; i < numRuns; i++) {
    process.stdout.write(`  Run ${i + 1}/${numRuns}... `);
    const agentResult = await runAgent(contextText, taskPrompt, options.model);
    const criteriaResults = await evaluateCriteria(agentResult.content, task.success_criteria);
    const passed = criteriaResults.filter((c) => c.passed).length;
    const completionRate = passed / criteriaResults.length;

    runResults.push({
      input_tokens: agentResult.input_tokens,
      output_tokens: agentResult.output_tokens,
      context_window_pct: (agentResult.input_tokens / MAX_CONTEXT_TOKENS) * 100,
      latency_ms: agentResult.latency_ms,
      completion_rate: completionRate,
      criteria_results: criteriaResults,
      output_preview: agentResult.content.slice(0, 300),
    });

    console.log(
      `done (${agentResult.input_tokens} in / ${agentResult.output_tokens} out, ` +
        `${(completionRate * 100).toFixed(0)}% criteria, ${agentResult.latency_ms}ms)`,
    );
  }

  const aggregated = aggregateRuns(runResults);

  let baselineInputTokens = null;
  if (!options.baseline && options.report) {
    const baselineFiles = loadAllContext(fixtureDir);
    const baselineText = formatContext(baselineFiles);
    const baselineResult = await runAgent(baselineText, taskPrompt, options.model);
    baselineInputTokens = baselineResult.input_tokens;
    console.log(`  Baseline (full context): ${baselineInputTokens} tokens`);
  }

  const contextBreakdown = await countContextBreakdown(SYSTEM, contextFiles);

  const result = {
    task_id: task.id,
    task_type: task.type,
    fixture: task.fixture,
    model: options.model,
    baseline: options.baseline ?? false,
    timestamp: new Date().toISOString(),
    runs: numRuns,
    metrics: aggregated,
    context_files: contextFiles.map((f) => f.path),
    context_breakdown: contextBreakdown,
    baseline_input_tokens: baselineInputTokens,
    criteria_results: runResults[runResults.length - 1].criteria_results,
    output_preview: runResults[runResults.length - 1].output_preview,
  };

  mkdirSync(RESULTS_DIR, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const outPath = join(RESULTS_DIR, `${ts}-${task.id}.json`);
  writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
  console.log(`  Saved: ${outPath}`);

  return result;
}

async function main() {
  let tasks = [];

  if (opts.task) {
    tasks = [loadTask(opts.task)];
  } else if (opts.type) {
    tasks = loadAllTasks().filter((t) => t.type === opts.type);
    if (tasks.length === 0) throw new Error(`No tasks found for type: ${opts.type}`);
  } else if (opts.all) {
    tasks = loadAllTasks();
  } else {
    console.error('Usage: node run.js [--task <id>] [--type <type>] [--all] [--report] [--baseline] [--model <model>] [--runs <n>]');
    process.exit(1);
  }

  console.log(`Running ${tasks.length} task(s) with model ${opts.model}, ${opts.runs} run(s) each`);

  const results = [];
  for (const task of tasks) {
    const result = await runSingleTask(task, opts);
    results.push(result);
  }

  if (opts.report && results.length > 1) {
    const summary = buildSummary(results);
    printSummaryTable(summary);

    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const summaryPath = join(RESULTS_DIR, `summary-${ts}.json`);
    writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
    console.log(`Summary saved: ${summaryPath}`);
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
