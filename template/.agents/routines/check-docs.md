# Routine: Check Docs Correctness
> Multi-step multi-agent workflow. Complete steps in order. Do not skip or merge steps.
> Each step is a separate agent session. Pass state only via scratch artifacts.

## Inputs
**Target:** [docs/path or "all"]
**Check depth:** [surface — spot-check claims | thorough — verify all code references]

---

## Step 1 — Inventory · think
Reads: `docs/` file listing only — do NOT read code yet
Actions:
- List all docs in scope
- For each doc: record path + what module/behavior it claims to describe
Produces: `.agents/scratch/docs-inventory.md` (compact — one line per doc)
Gate: all docs in scope listed with their mapped module

---

## Step 2 — Verify · think
Reads: `.agents/scratch/docs-inventory.md` + only the code files referenced in inventory
Actions:
- For each doc, read the code it describes and compare claims vs reality
- Flag discrepancies:
  - `stale` — content has drifted but intent is correct
  - `incorrect` — factually wrong (wrong API, wrong behavior)
  - `missing` — behavior exists in code but is undocumented
Produces: `.agents/scratch/docs-findings.md` ordered by severity
Gate: all docs in scope verified

---

## Step 3 — Report
Reads: `.agents/scratch/docs-findings.md`
Actions: surface findings to human — summary + full list
Gate: human reviews and decides: fix, defer, or close
On close with no action: delete scratch artifacts and end routine

---

## Step 4 — Fix · act  (only if instructed)
Reads: `.agents/scratch/docs-findings.md` + affected `docs/` files only
Actions:
- Update docs to match current code reality
- DO NOT change code to match docs — docs follow code
- If substantive changes: trigger distillation pipeline
Gate: each updated doc accurately reflects current code behavior
On failure: escalate — doc/code conflict that cannot be resolved by documentation alone requires human decision
