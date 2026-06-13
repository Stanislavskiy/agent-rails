# Agent Repo Template

A minimal context layer that helps AI agents work consistently across your codebase — regardless of which agent tool you use.

---

## Integrate

1. Copy into your repo: `.agents/`, `.github/`, `AGENTS.md`, `AGENTS.workspace.md`, `AGENTS.local.md.example`, `.gitignore`
2. Fill in the placeholders:
   - `AGENTS.md` — project name, stack, default branch
   - `.agents/context/architecture.md` — system topology, services, infra
   - `.agents/context/domain.md` — core entities, business rules, glossary
3. Wire up `.github/workflows/distill-principles.yml` with your agent runner (see the TODO comment inside)
4. Add project docs to `docs/` — the pipeline populates `principles/distilled/` on every push

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
| Introducing a new pattern or library | Create an ADR from `.agents/adr/YYYYMMDD-template.md` |
| Workspace context changes | Update `AGENTS.workspace.md` |

> `principles/distilled/` is read-only — never edit it manually. It is regenerated from `docs/` by the distillation pipeline.
