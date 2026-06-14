# Prompt: Investigate & Fix Bug
> Copy this block into your agent session. Fill ALL placeholders before running.

---

## Context (load before this prompt)
- `AGENTS.md`
- `.agents/context/principles/distilled/`
- `.agents/context/architecture.md` _(if issue may be systemic)_

## Bug Report
**Summary:** [One sentence]
**Severity:** `[critical | high | medium | low]`
**Reproducible:** `[always | intermittent | unknown]`

**Steps to reproduce:**
1. [Step]
2. [Step]

**Expected:** [What should happen]
**Actual:** [What happens instead]

**Context clues:**
- Error message / stack trace: _(paste here)_
- Relevant logs: _(paste here or reference log query)_
- First observed: `[date or deploy version]`
- Affected scope: `[service, endpoint, user segment]`

## Investigation Scope
- Start in: `[file or module path]`
- Suspect area: `[brief hypothesis]`
- Do NOT modify: `[protected paths]`

## Output expected
- [ ] Root cause identified and documented in a code comment
- [ ] Fix implemented
- [ ] Regression test added that would have caught this bug
- [ ] No unrelated changes in the same PR
