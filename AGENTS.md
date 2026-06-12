# AGENT ENTRY POINT

> Read this file first. Load additional context only as needed per the routing table below.

## Local Overrides

Read AGENTS.local.md

## Project Identity

- name: [PROJECT_NAME]
- type: [web-app | api | monorepo | data-pipeline | library]
- language: [LANG@VERSION]
- framework: [FRAMEWORK@VERSION]
- infra: [cloud-provider] · [container/orchestration] · [db]

## Context Routing — load ONLY what your task needs

- new-feature: `context/principles/distilled/` + `context/principles/` + `context/architecture.md` + `context/domain.md`
- bug-fix: `context/principles/distilled/` + `context/architecture.md`
- refactor/tests/CI: `context/principles/distilled/`
- infra/devops: `context/architecture.md`
- data-model/db: `context/domain.md` + `context/architecture.md`
- architecture-decision: check `adr/INDEX.md` first, then create `adr/YYYYMMDD-[slug].md`
- deep-context: `docs/` (source of truth — do not edit unless explicitly asked)
- quick-question: this file only

## Always-on rules

These apply to every task without needing a trigger:

- **Minimal fix** — apply the smallest change that solves the problem; do not expand scope across layers unless each layer is genuinely load-bearing

## Project Notes

- Default branch: `[main | develop | master]`
- [Any repo-wide notes agents should know — size, monorepo layout, known footguns]

## Repo Structure

```
AGENTS.md                ← entry point (repo root, this file)
AGENTS.local.md          ← project-level overrides (supplements this file)
.agents/                 ← agent context root
  context/               ← context enrichment for task solving
    architecture.md      ← system design, services, data flow, infra
    domain.md            ← entities, business rules, glossary
    principles/          ← agent-only development principles
      workflow.md        ← agent workflow rules (example)
      distilled/         ← READ-ONLY · auto-generated from /docs
  adr/
    INDEX.md             ← ADR index (check before design decisions)
    YYYYMMDD-[slug].md   ← ADRs (append-only)
  prompts/
    [task-slug].md       ← reusable task prompt templates
.github/
  workflows/
    distill-principles.yml ← CI trigger for distillation pipeline
docs/                    ← single source of truth (human/agent authored)
src/                     ← application source (project-specific)
```
