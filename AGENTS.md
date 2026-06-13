# AGENT ENTRY POINT

> Read this file first. Load additional context only as needed per the routing table below.

## Overrides

Read these first, before starting any task:
- AGENTS.workspace.md
- AGENTS.local.md (if it exists)

## Project Identity

- name: [PROJECT_NAME]
- type: [web-app | api | monorepo | data-pipeline | library]
- language: [LANG@VERSION]
- framework: [FRAMEWORK@VERSION]
- infra: [cloud-provider] · [container/orchestration] · [db]

## Context Routing

Load ONLY the files listed for your task type. Do not load others.

- multi-step task (feature | bug | refactor): check `.agents/routines/INDEX.md` first
- new-feature:           `.agents/context/principles/distilled/` + `.agents/context/principles/` + `.agents/context/architecture.md` + `.agents/context/domain.md`
- bug-fix:               `.agents/context/principles/distilled/` + `.agents/context/architecture.md`
- refactor/tests/CI:     `.agents/context/principles/distilled/`
- infra/devops:          `.agents/context/architecture.md`
- data-model/db:         `.agents/context/domain.md` + `.agents/context/architecture.md`
- architecture-decision: check `.agents/adr/INDEX.md` first, then create `.agents/adr/YYYYMMDD-[slug].md`
- deep-context:          `docs/`
- quick-question:        this file only

## Always-on rules

- MINIMAL FIX: Apply the smallest change that solves the problem. Do not expand scope across layers unless each layer is genuinely load-bearing.
- CAPTURE LEARNINGS: When the developer corrects an approach or flags an important note mid-task, offer to capture it using `.agents/prompts/capture-learning.md` before continuing.
- READ-ONLY DOCS: Never edit `docs/` unless the developer explicitly asks.

## Project Notes

- Default branch: `[main | develop | master]`
- [Any repo-wide notes agents should know — size, monorepo layout, known footguns]

## Key paths

- `AGENTS.workspace.md` — committed project/team context
- `AGENTS.local.md` — personal overrides (gitignored)
- `.agents/context/architecture.md` — system design, services, data flow, infra
- `.agents/context/domain.md` — entities, business rules, glossary
- `.agents/context/principles/` — agent development rules
- `.agents/context/principles/distilled/` — READ-ONLY · auto-generated from `docs/`
- `.agents/adr/INDEX.md` — architecture decision index
- `.agents/adr/YYYYMMDD-[slug].md` — individual ADRs (append-only)
- `.agents/playbooks/` — sub-task procedures (referenced from routines/prompts)
- `.agents/prompts/` — task prompt templates
- `.agents/routines/INDEX.md` — multi-step workflow index
- `.agents/scratch/` — ephemeral inter-agent state (gitignored)
- `docs/` — source of truth (human/agent authored)
