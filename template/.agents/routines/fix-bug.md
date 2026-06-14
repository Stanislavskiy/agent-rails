# Routine: Fix Bug
> Multi-step multi-agent workflow. Complete steps in order. Do not skip or merge steps.
> Each step is a separate agent session. Pass state only via scratch artifacts.

## Inputs
**Summary:** [one sentence]
**Severity:** [critical | high | medium | low]
**Reproducible:** [always | intermittent | unknown]
**Steps to reproduce:**
1. [step]
**Expected:** [what should happen]
**Actual:** [what happens instead]
**Context:** [error message, stack trace, logs]

---

## Step 1 — Investigate · think
Reads: `AGENTS.md` + `.agents/context/principles/distilled/` + `.agents/context/architecture.md`
Actions:
- Trace execution path to identify root cause
- Document hypothesis — where, why, and how the bug occurs
- Do NOT write any code
Produces: `.agents/scratch/fix-bug-findings.md` (compact format — max 30 lines)
Gate: root cause identified with specific file + line reference
On failure: escalate — cannot identify root cause without additional information

---

## Step 2 — Fix · act
Reads: `.agents/context/principles/distilled/` + `.agents/scratch/fix-bug-findings.md`
Actions:
- Apply the smallest change that resolves the root cause
- Do NOT fix unrelated issues found during investigation
Gate: bug is no longer reproducible using original steps
On failure: loop-back to Step 1 with failure context appended

---

## Step 3 — Regression Test · act
Reads: `.agents/context/principles/distilled/` + file paths from `.agents/scratch/fix-bug-findings.md`
Actions:
- Write a test that reproduces the original bug and passes with the fix applied
- Confirm all pre-existing tests still pass
Gate: new regression test passes; no pre-existing tests broken
On failure: loop-back to Step 2 with failing test details

---

## Step 4 — Verify · verify
Reads: `.agents/context/principles/distilled/` + git diff only
Actions:
- Review diff for unintended side-effects
- Confirm no protected paths were modified
Produces: `.agents/scratch/fix-bug-review.md`
Gate: no critical or high findings; no protected paths touched
On failure: escalate — unintended side-effects require human review
