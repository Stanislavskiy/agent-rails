# Contributing to Agent Rails

This document is for developers/agents maintaining the template itself.

---

## Design goals

Every change to this template must hold against five founding principles:

**1. Agent-vendor agnostic**
No tool-specific syntax, no Claude-only features, no OpenAI-specific conventions. Every file must work as plain instructions that any agent — Claude Code, Copilot, Codex, Gemini, or a custom system — can follow without modification.

**2. Token budget conscious**
Agents load only what a task needs. The routing table in `AGENTS.md` is the enforcement mechanism — new context must earn its place in a specific task type, not load globally. Every file added to `.agents/` has a token cost paid on every invocation. Justify it.

**3. Scalable**
The template must work for a 3-person startup and a 300-person enterprise on a monorepo with hundreds of services. Avoid assumptions about team size, codebase structure, or number of agents running in parallel. Placeholders stay generic. Structure stays flat.

**4. Enterprise-ready**
Designed for codebases where correctness, auditability, and consistency across contributors matter. Human gates in routines, append-only ADRs, and the distillation pipeline all exist to serve this goal. Do not remove safety mechanisms to simplify the happy path.

**5. Optimized for machines**
Files are instructions for agents, not documentation for humans. Use directives over descriptions, structured data over prose, and complete unambiguous paths over shorthand. Avoid formatting that requires inference to parse — if a flat list communicates the same thing as an ASCII tree, use the flat list. Annotations that exist only to help a human reader understand the template belong in `README.md` or `CONTRIBUTING.md`, not in the files agents load during tasks.

---

## What belongs in this template

The template contains **structure and conventions** — never project-specific content.

| Belongs here | Does not belong here |
|---|---|
| Layer folders and their README/TEMPLATE files | Filled-in architecture.md or domain.md |
| Prompt and routine templates with `[PLACEHOLDERS]` | Prompts written for a specific stack |
| Generic principles that apply to any project | Project-specific rules or team conventions |
| CI workflow skeleton with TODO comments | Wired-up CI that calls a specific runner |
| Example ADR template | Actual ADRs about real decisions |

If content only makes sense for one project, it belongs in that project's `AGENTS.workspace.md` or `.agents/context/` — not here.

---

## Adding a new layer or file

Before adding, answer:

1. **Does it already fit an existing layer?** Context, playbooks, prompts, routines, and ADRs cover: know, do-X, full-task, orchestrate, and decided. If the new content fits one of these, extend that layer instead.
2. **What task type loads it?** If it has no entry in the routing table, agents will never load it unprompted. Either wire it into the routing table or document that it is referenced explicitly from prompts/routines.
3. **What is the token cost?** Estimate the file size relative to what it replaces or adds. A file loaded on every bug-fix task should be under 1–2KB. A file loaded only in deep-context tasks can be larger.
4. **Is it vendor-neutral?** Read it as if you are a generic instruction-following agent with no knowledge of Claude, Copilot, or any specific tool. It must still make sense.

---

## File format rules

- **Directives over prose.** `DO NOT call X directly` is better than `It is generally advisable to avoid calling X directly because...`
- **Complete paths.** Always write `.agents/context/architecture.md`, never `architecture.md` or `context/architecture.md`. Agents resolve paths from repo root.
- **Placeholders in brackets.** Use `[PLACEHOLDER]` for content the integrating team fills in. Do not leave empty sections.
- **No comments explaining the template to agents.** Meta-instructions like "teams fill this in" are for human readers only — move them to a `> Note:` blockquote or remove them.

---

## Plugins

`plugins/` contains optional addons that the CLI applies during `init`. Each plugin has two parts:

- **New files** — placed in `plugins/<name>/` mirroring the destination structure, copied as-is. `manifest.json` is excluded from the copy.
- **`manifest.json`** — a JSON array of patch operations applied to base `template/` files after they are copied.

### Patch operations

| Op | What it does |
|---|---|
| `insert_after_line` | Find first line containing `match`, insert `content` after it |
| `insert_before_line` | Find first line containing `match`, insert `content` before it |
| `append_to_line` | Find first line starting with `match`, append `content` to its end |
| `append_to_section` | Find `##` heading equal to `section`, append `content` before the next `##` or EOF |
| `append_to_file` | Trim trailing blank lines, then append `content` |

`content` is a string (single line) or array of strings (multiple lines).

### Adding a new plugin

1. Create `plugins/<name>/manifest.json` with the patch operations
2. Place any new files under `plugins/<name>/` mirroring destination paths
3. Wire it into `cli/init.js` — add a prompt, call `copyAddonFiles` then `applyManifest`

### Maintaining an existing plugin

When a base `template/` file changes, check whether any patch in a plugin's `manifest.json` matches against the changed content. If a `match` string was removed or renamed, update the manifest entry. No content is duplicated — only match strings need to stay in sync.

---

## Benchmark

`benchmark/` measures agent task completion, token consumption, and context window utilization against real API calls.

### Running

```sh
cd benchmark && npm install
ANTHROPIC_API_KEY=... node run.js --task fix-bug-null-check
ANTHROPIC_API_KEY=... node run.js --all --report
ANTHROPIC_API_KEY=... node run.js --type bug-fix --runs 5
```

### Options

| Flag | Default | Description |
|---|---|---|
| `--task <id>` | — | Run one task by ID |
| `--type <type>` | — | Run all tasks of a task type |
| `--all` | — | Run all 7 tasks |
| `--report` | false | Print summary table after `--all`; also measures routing efficiency |
| `--baseline` | false | Load full context (ignores routing) — used to measure routing savings |
| `--model <model>` | `claude-sonnet-4-6` | Override model |
| `--runs <n>` | `3` | Runs per task; results reported as mean ± stddev |

Results are written to `benchmark/results/` (gitignored).

### Adding a task

1. Create `benchmark/tasks/<id>.json` with: `id`, `type`, `fixture`, `description`, `expected_behavior`, `target_files`, `success_criteria`
2. Criterion types: `contains` (string match), `not_contains`, `rubric` (LLM-graded 0–2)
3. Use `buggy-api` fixture for bug-fix tasks; `simple-api` for feature/refactor/review

### Adding a fixture

Fixtures are pre-initialized projects in `benchmark/fixtures/<name>/`. They must include:
- `AGENTS.md` (filled in with real project identity — no `[PLACEHOLDER]` values)
- `.agents/context/architecture.md`, `domain.md`, `principles/distilled/README.md`
- Source files that tasks can target

---

## Testing a change

There is no automated test suite for agent behavior. Validate manually:

1. Read the changed file as if you are an agent with no prior context. Are the instructions unambiguous?
2. Check that every path referenced in the file exists in the repo (or is a clearly marked placeholder).
3. If you changed `AGENTS.md`, verify the routing table still covers all task types and that no path is missing the `.agents/` prefix.
4. If you added a new routine, add an entry to `.agents/routines/INDEX.md`.
5. If you added a new directory or layer, update the key paths list in `AGENTS.md` and the layer table in `README.md`.
