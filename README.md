# Agent Repo Template

A minimal context layer that helps AI agents work consistently across your codebase — regardless of which agent tool you use.

---

## How it works

### The layer model

Instead of giving every agent your entire codebase, this template routes agents to the minimum context each task actually needs. `AGENTS.md` is the entry point — it tells the agent what to load based on task type. Everything else loads on demand.

The `.agents/` folder has five distinct layers, each with a different role:

| Layer | Answers | Written by |
|-------|---------|------------|
| `context/` | What to *know* — architecture, domain, development rules | Developers |
| `playbooks/` | How to *do X* — project-specific sub-task procedures | Developers |
| `prompts/` | What *task* to run — standalone single-session templates | Developers |
| `routines/` | How to *orchestrate* — multi-session workflows with gates | Developers |
| `adr/` | What was *decided* — append-only architecture record | Developers + agents |

### Principles and distillation

`context/principles/` has two tiers:

- **`principles/`** — hand-written agent rules. Maintained directly by the team. Imperative format: `DO NOT X`, `Use Y`.
- **`principles/distilled/`** — auto-generated from `docs/` by an AI distillation agent on every push to `docs/**`. Never edited manually.

`docs/` is the single source of truth. The distillation pipeline converts human-written documentation into compact, checkable rules that agents load during tasks. When docs change, the rules update automatically.

### Prompts vs. routines

**Prompts** are single-session task templates. One agent, one session, one output. Good for atomic tasks: fix a bug, review a PR, run a refactor.

**Routines** are multi-session workflows. Each step runs in a fresh agent session with a deliberately narrow context ceiling. Use routines when:
- The task requires a human review gate before code is written (e.g., approve the plan)
- Different phases need different context to avoid anchoring bias (the agent that implements should not also review)
- The task is too large to complete reliably in one session

### Playbooks

Playbooks are project-specific procedures — *how we do X in this codebase*. They differ from principles (which are rules: "DO NOT call X directly") and prompts (which are full tasks). A playbook describes the steps: file locations, tooling invocations, naming conventions for a recurring sub-task like writing a test or generating a migration.

Agents don't discover playbooks automatically. Each playbook must be wired into a routine step or a principle so it loads in the right context. See `.agents/playbooks/TEMPLATE.md` for instructions.

Prose playbooks work well for interactive agent use. For automated pipelines they become the spec for native tool implementations — MCP tools, function_calling schemas, or slash commands.

---

## Integrate

1. Install dependencies:

```sh
cd cli && npm install
```

2. Run the CLI from the repo root:

```sh
node cli/init.js <path/to/your-project>
```

The CLI will:
1. Copy all template files from `template/` into your project
2. Walk you through filling in the identity placeholders in `AGENTS.md` (project name, stack, default branch)
3. Merge the agent `.gitignore` entries into your existing `.gitignore` without duplicates
4. Handle conflicts if `.agents/` already exists — backup or merge

After init:
- Fill in `.agents/context/architecture.md` — system topology, services, infra
- Fill in `.agents/context/domain.md` — core entities, business rules, glossary
- Wire up `.github/workflows/distill-principles.yml` with your agent runner (see the TODO comment inside)
- Add project docs to `docs/` — the pipeline populates `principles/distilled/` on every push

> If you prefer manual setup: copy everything inside `template/` into your repo root and fill in the `[bracketed]` placeholders by hand.

---

## Daily use

**Always start an agent session by loading `AGENTS.md` first.** It tells the agent what else to load based on the task type.

### Single-step tasks — use a prompt

```
Load: AGENTS.md
Run:  .agents/prompts/fix-bug.md   ← fill in the Inputs section before running
```

Prompts are in `.agents/prompts/`. Each one specifies which context to load and what output to produce.

### Multi-step tasks — use a routine

Check `.agents/routines/INDEX.md` for the matching workflow (implement-feature, fix-bug, refactor, check-docs).

Each routine is a sequence of steps. **Run each step as a separate agent session** — fresh context per step is by design.

```
Step 1: new session → loads full context → produces a scratch artifact
Step 2: new session → loads only distilled principles + scratch artifact
...
```

State passes between sessions via `.agents/scratch/` (gitignored). Every step has a Gate — do not proceed until it passes. Human gates require your explicit review before the next step starts.

### Workspace and personal context

`AGENTS.workspace.md` is committed — use it for sprint focus, known issues, temporary constraints, and workspace-specific conventions shared across the team.

`AGENTS.local.md` is gitignored — use it for personal experiments or local overrides. Copy from `AGENTS.local.md.example` to get started.

---

## Maintain

| When | What to do |
|------|------------|
| Behavior or API changes | Update `docs/` — distillation runs automatically on push |
| Team convention changes | Edit `.agents/context/principles/` directly |
| Recurring sub-task with project-specific steps | Add a playbook from `.agents/playbooks/TEMPLATE.md` |
| Introducing a new pattern or library | Create an ADR from `.agents/adr/YYYYMMDD-template.md` |
| Workspace context changes | Update `AGENTS.workspace.md` |

> `principles/distilled/` is read-only — never edit it manually. It is regenerated from `docs/` by the distillation pipeline.
