# Prompt: Implement Feature
> Copy this block into your agent session. Fill ALL placeholders before running.

---

## Context (load before this prompt)
- `AGENTS.md`
- `.agents/context/principles/distilled/`
- `.agents/context/principles/` _(for new patterns or architecture decisions)_
- `.agents/context/domain.md`
- `.agents/context/architecture.md` _(if new service or infra change)_

## Task
Implement the following feature according to project conventions.

**Feature:** [One-sentence description]
**Scope:** `[path/to/module or service name]`
**Acceptance criteria:**
1. [Criterion — observable, testable]
2. [Criterion]
3. [Criterion]

## Inputs
- **Existing code to extend:** `[file or pattern reference]`
- **Related entity/domain concept:** `[from domain.md]`
- **Dependencies allowed:** `[list, or "existing deps only"]`

## Constraints
- Must follow: `[specific pattern from principles/, e.g. Repository pattern]`
- Must not touch: `[protected paths]`
- Test coverage: unit tests required for all new public functions

## Output expected
- [ ] Implementation file(s) at `[target path pattern]`
- [ ] Unit tests at `[test path pattern]`
- [ ] Updated barrel export if applicable
- [ ] Migration file if DB schema changes

## Definition of Done
- All specified acceptance criteria met
- `lint` and `typecheck` pass
- No new circular dependencies introduced
