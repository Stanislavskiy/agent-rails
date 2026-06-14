# Prompt: Refactor
> Copy this block into your agent session. Fill ALL placeholders before running.

---

## Context (load before this prompt)
- `AGENTS.md`
- `.agents/context/principles/distilled/`

## Task
Refactor the target code to improve [quality dimension] without changing observable behavior.

**Target:** `[file path(s) or module]`
**Quality goal:** `[readability | performance | testability | reduce duplication | enforce pattern]`

**Specific problems to fix:**
- [ ] [e.g. function exceeds 80 lines]
- [ ] [e.g. duplicated logic in X and Y]
- [ ] [e.g. direct DB access outside repository layer]

## Constraints
- **Behavior must not change** — all existing tests must pass after refactor
- Do not expand scope beyond listed files without explicit instruction
- Do not change public API / exported signatures unless listed as a goal
- If a new pattern is introduced, add a brief comment citing the relevant principle

## Output expected
- [ ] Refactored file(s)
- [ ] All previously passing tests still pass
- [ ] New tests if refactor exposed untested paths
- [ ] No net increase in lines of code (target: reduction)
