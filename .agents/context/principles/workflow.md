# Workflow Principles

## Checklist

### Architectural Decisions
- Check `adr/INDEX.md` before any design decision to avoid contradicting prior ADRs
- Create a new ADR in `adr/` when introducing a new architectural pattern, library, or breaking convention

### Scope
- Apply the smallest change that solves the problem
- DO NOT refactor unrelated code or expand scope beyond the stated task
- DO NOT modify protected paths listed in AGENTS.md without explicit instruction

### Documentation Sync
- Update `docs/` when changing behavior that is documented there
- DO NOT edit `context/principles/distilled/` directly — changes must go through `docs/` and the distillation pipeline
