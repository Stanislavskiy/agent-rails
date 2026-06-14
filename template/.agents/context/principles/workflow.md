# Workflow Principles

## Checklist

### Architectural Decisions
- Check `.agents/adr/INDEX.md` before any design decision to avoid contradicting prior ADRs
- Create a new ADR in `.agents/adr/` when introducing a new architectural pattern, library, or breaking convention

### Scope
- Apply the smallest change that solves the problem
- DO NOT refactor unrelated code or expand scope beyond the stated task
- DO NOT modify protected paths listed in AGENTS.md without explicit instruction

### Routines
- Use `.agents/routines/` for multi-step tasks — do not merge steps or skip gates
- Check `.agents/routines/INDEX.md` to find the matching workflow before starting

### Scratch Artifact Format
Every scratch artifact must follow this structure (max 30 lines):

```
## Decision
[1–2 sentences]
## Files
- path/to/file — [why, one line]
## Pattern
[principle name + path reference]
## Risks
- [one line each]
```

- Write file paths + one-line reason — not file contents
- Reference principle names/paths — not full principle text
- No explanatory paragraphs

### Documentation Sync
- Update `docs/` when changing behavior that is documented there
- DO NOT edit `.agents/context/principles/distilled/` directly — changes must go through `docs/` and the distillation pipeline
