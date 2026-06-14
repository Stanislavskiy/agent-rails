function mean(values) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stddev(values) {
  if (values.length < 2) return 0;
  const m = mean(values);
  return Math.sqrt(values.reduce((sum, v) => sum + (v - m) ** 2, 0) / values.length);
}

function stat(values) {
  return { mean: Math.round(mean(values) * 100) / 100, stddev: Math.round(stddev(values) * 100) / 100 };
}

export function aggregateRuns(runs) {
  return {
    input_tokens: stat(runs.map((r) => r.input_tokens)),
    output_tokens: stat(runs.map((r) => r.output_tokens)),
    context_window_pct: stat(runs.map((r) => r.context_window_pct)),
    latency_ms: stat(runs.map((r) => r.latency_ms)),
    completion_rate: stat(runs.map((r) => r.completion_rate)),
  };
}

export function buildSummary(results) {
  const byType = {};
  for (const r of results) {
    (byType[r.task_type] ??= []).push(r);
  }

  const byTaskType = {};
  const routingEfficiency = {};

  for (const [type, tasks] of Object.entries(byType)) {
    byTaskType[type] = {
      avg_input_tokens: Math.round(mean(tasks.map((t) => t.metrics.input_tokens.mean))),
      avg_output_tokens: Math.round(mean(tasks.map((t) => t.metrics.output_tokens.mean))),
      avg_completion_rate: Math.round(mean(tasks.map((t) => t.metrics.completion_rate.mean)) * 1000) / 1000,
      task_count: tasks.length,
    };

    const withBaseline = tasks.filter((t) => t.baseline_input_tokens != null);
    if (withBaseline.length > 0) {
      const routed = mean(withBaseline.map((t) => t.metrics.input_tokens.mean));
      const baseline = mean(withBaseline.map((t) => t.baseline_input_tokens));
      routingEfficiency[type] = {
        routed_tokens: Math.round(routed),
        baseline_tokens: Math.round(baseline),
        savings_pct: Math.round(((baseline - routed) / baseline) * 100),
      };
    }
  }

  return { by_task_type: byTaskType, routing_efficiency: routingEfficiency };
}

export function printSummaryTable(summary) {
  console.log('\n=== Benchmark Summary ===\n');
  const header = ['Task Type', 'Avg Input Tokens', 'Avg Output Tokens', 'Completion Rate', 'Tasks'];
  const widths = [20, 18, 19, 17, 6];
  console.log(header.map((h, i) => h.padEnd(widths[i])).join(''));
  console.log('-'.repeat(widths.reduce((a, b) => a + b, 0)));

  for (const [type, data] of Object.entries(summary.by_task_type)) {
    const row = [
      type,
      String(data.avg_input_tokens),
      String(data.avg_output_tokens),
      `${(data.avg_completion_rate * 100).toFixed(1)}%`,
      String(data.task_count),
    ];
    console.log(row.map((v, i) => v.padEnd(widths[i])).join(''));
  }

  if (Object.keys(summary.routing_efficiency).length > 0) {
    console.log('\n=== Routing Efficiency (routed vs. full context) ===\n');
    for (const [type, data] of Object.entries(summary.routing_efficiency)) {
      console.log(
        `  ${type}: ${data.routed_tokens} tokens (routed) vs ${data.baseline_tokens} tokens (baseline) — ${data.savings_pct}% savings`,
      );
    }
  }

  console.log();
}
