# Routine: Refactor
> Multi-step multi-agent workflow. Complete steps in order. Do not skip or merge steps.
> Each step is a separate agent session. Pass state only via scratch artifacts.

## Inputs
**Target:** [file path, module name, or pattern to refactor]
**Goal:** [one sentence — what structural problem this solves]
**Constraint:** [DO NOT change observable behavior | may change API | etc.]

---

## Step 1 — Scope · think
Reads: `AGENTS.md` + `.agents/context/principles/distilled/` + `.agents/context/principles/` + `.agents/context/architecture.md`
Actions:
- List files to change and why
- Identify patterns to apply and risks
- Flag any protected paths that will be touched
- Do NOT write any code
Produces: `.agents/scratch/refactor-plan.md` (compact format — max 30 lines)
Gate: human reviews scope — refactors touching protected paths require explicit approval before proceeding
On failure: revise scope based on feedback, re-present for approval

---

## Step 2 — Implement · act
Reads: `.agents/context/principles/distilled/` + `.agents/scratch/refactor-plan.md`
Actions:
- Execute plan exactly — one logical commit per concern
- DO NOT change observable behavior
- DO NOT fix unrelated issues found during implementation
Gate: project compiles; all pre-existing tests pass
On failure: loop-back to Step 1 with failure context appended to plan

---

## Step 3 — Verify · verify  ∥ parallelizable with Step 4
Reads: `.agents/context/principles/distilled/` + git diff only
Actions:
- Review diff against principles checklist
- Flag any behavioral changes (these are bugs, not refactor outcomes)
- Flag findings with: file, line, severity (critical | high | medium | low), reason
Produces: `.agents/scratch/refactor-review.md`
Gate: no critical or high findings; no behavioral changes detected
On failure: escalate — unintended behavior change requires human review before continuing

---

## Step 4 — Confirm Tests · act  ∥ parallelizable with Step 3
Reads: `.agents/context/principles/distilled/` + file paths from `.agents/scratch/refactor-plan.md`
Actions:
- Update tests that were tightly coupled to the prior implementation (e.g. tested internal structure, not behavior)
- DO NOT change test intent — a test that now fails because behavior changed is a bug, not a test to delete
Gate: full test suite passes
On failure: loop-back to Step 2 — a test failure likely indicates an unintended behavior change
