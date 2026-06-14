# Routines Index
> Multi-step multi-agent workflows. Each step is a separate agent session.
> Check here before starting any task that spans multiple concerns or requires a human review gate.

## Available Routines

- `implement-feature.md` — Plan → Implement → Test → Verify → Document (5 steps, human gate at step 1)
- `fix-bug.md`           — Investigate → Fix → Regression Test → Verify (4 steps)
- `refactor.md`          — Scope → Implement → Verify → Confirm Tests (4 steps, human gate at step 1)
- `check-docs.md`        — Inventory → Verify → Report → Fix (4 steps, human gate at step 3)

## Routine vs. prompt

- **Routine** — task spans multiple concerns, or requires human approval before code is written
- **Prompt** — single-session, single-concern, no intermediate approval needed (`prompts/`)
