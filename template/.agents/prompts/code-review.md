# Prompt: Code Review
> Copy this block into your agent session. Fill ALL placeholders before running.

---

## Context (load before this prompt)
- `AGENTS.md`
- `.agents/context/principles/distilled/`

## Scope
**PR / branch:** [branch name or PR URL]
**Changed files:** [list or "see git diff"]
**Review focus:** `[full | security | performance | quick-scan]`

## Review Checklist
- [ ] Correctness — logic errors, edge cases, missing error handling
- [ ] Principles compliance — verify against `.agents/context/principles/distilled/`
- [ ] Security — injection, auth bypass, data exposure, unvalidated input
- [ ] Performance — N+1 queries, missing indexes, blocking operations
- [ ] Test coverage — new paths covered, assertions test behavior not implementation

## Constraints
- DO NOT suggest style changes unless they violate a documented principle
- Flag but do not fix issues outside the changed files
- Each finding must include: file path, line, severity (`critical | high | medium | low`), explanation

## Output expected
- [ ] Verdict: `approved` or `changes-requested`
- [ ] Summary: 2–3 sentences
- [ ] Findings list ordered by severity
