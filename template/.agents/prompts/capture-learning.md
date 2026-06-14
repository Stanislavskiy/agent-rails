# Prompt: Capture Learning
> Run when a developer flags a correction, footgun, or important note during a task.
> Complete the capture, then resume the interrupted task.

## Input
**Note:** [what the developer said — quote it exactly]
**Task in progress:** [one line — what were you working on]

---

## Classify and route

Choose exactly one destination:

- **`AGENTS.local.md`** — personal, temporary, or experimental (not shared)
  → Add to Known Issues or Temporary Constraints as a single bullet

- **`.agents/context/principles/[relevant].md`** — recurring agent behavior rule
  → One line, imperative mood: `DO NOT <verb> ...` or `Use / Prefer / Ensure ...`
  → Add under the most relevant `###` subsection; create one if none fits

- **`docs/[relevant].md`** — factual correction about the codebase or its behavior
  → Update the relevant doc; flag that the distillation pipeline should run after this session

- **`.agents/playbooks/[name].md`** — recurring project-specific sub-task procedure
  → Create from `.agents/playbooks/TEMPLATE.md`; describe the steps concretely

- **`.agents/memory/entries/[slug].md`** — agent-discovered pattern, gotcha, or resolution
  → Applies when: learned during task execution, scoped to specific conditions, sub-ADR formality
  → DO NOT write directly — follow `.agents/playbooks/memory-write.md`
  → Signals: unexpected system behavior, approach that worked in specific conditions, a watch-out

- **`.agents/adr/`** — architectural decision with lasting consequences
  → Create a new ADR from `.agents/adr/YYYYMMDD-template.md`; update `.agents/adr/INDEX.md`

## Constraints
- One note = one destination — do not fan out to multiple files
- Do not add commentary or explanation beyond the note itself
- Do not trigger distillation mid-task — flag it for after the session ends
- ADR vs memory: learning changes HOW WE BUILD → ADR; learning records WHAT WAS DISCOVERED → memory entry
- principles/ vs memory: applies universally to all future tasks → principle; applies in specific conditions → memory entry

## Output
Confirm: file written, location, and one-line summary of what was captured.
Then resume the interrupted task.
