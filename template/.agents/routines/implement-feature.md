# Routine: Implement Feature
> Multi-step multi-agent workflow. Complete steps in order. Do not skip or merge steps.
> Each step is a separate agent session. Pass state only via scratch artifacts.

## Inputs
**Feature:** [one-sentence description]
**Scope:** [path/to/module or service name]
**Acceptance criteria:**
1. [criterion — observable, testable]
2. [criterion]

---

## Step 1 — Plan · think
Reads: `AGENTS.md` + `.agents/context/principles/distilled/` + `.agents/context/principles/` + `.agents/context/architecture.md` + `.agents/context/domain.md`
Actions:
- Design implementation approach
- List files to create/modify and why
- Identify patterns to follow and risks
- Do NOT write any code
Produces: `.agents/scratch/implement-feature-plan.md` (compact format — max 30 lines)
Gate: human reviews and approves plan — do NOT proceed until approved
On failure: revise plan based on feedback, re-present for approval

---

## Step 2 — Implement · act
Reads: `.agents/context/principles/distilled/` + `.agents/scratch/implement-feature-plan.md`
Actions:
- Execute plan exactly as approved — one logical commit per concern
- Do not deviate from plan scope without returning to Step 1
Gate: project compiles; all pre-existing tests pass
On failure: loop-back to Step 1 with failure context appended to plan

---

## Step 3 — Test · act  ∥ parallelizable with Step 4
Reads: `.agents/context/principles/distilled/` + file paths listed in `.agents/scratch/implement-feature-plan.md`
Actions:
- Write tests covering all new behavior described in acceptance criteria
- Tests must assert behavior, not implementation details
Gate: all tests pass including new ones
On failure: loop-back to Step 2 with failing test details

---

## Step 4 — Verify · verify  ∥ parallelizable with Step 3
Reads: `.agents/context/principles/distilled/` + git diff only
Actions:
- Review diff against principles checklist
- Flag findings with: file, line, severity (critical | high | medium | low), reason
Produces: `.agents/scratch/implement-feature-review.md`
Gate: no critical or high findings
On failure: loop-back to Step 2 with findings from `scratch/implement-feature-review.md`

---

## Step 5 — Document · act
Reads: `docs/` + git diff only
Actions:
- Identify docs that describe changed behavior and update them
- If docs changed: trigger distillation pipeline
Gate: docs accurately reflect new behavior
On failure: escalate — ambiguous doc/code relationship requires human decision
