# Playbook: Memory Write
> Follow this playbook whenever capturing a learning to `.agents/memory/`.
> DO NOT write directly to any file under `.agents/memory/` — always go through these steps.

## When to use
When `capture-learning.md` routes a note to `.agents/memory/`, or when a routine post-task
step identifies a new pattern, gotcha, or resolution worth persisting across sessions.

## Steps

1. **Derive slug** — 2–5 words, kebab-case, concept-first (e.g. `stripe-idempotency-key`, not `found-bug-in-stripe`)

2. **Determine category** — classify the learning:
   - `gotcha` — unexpected behavior or footgun
   - `pattern` — reusable approach that works well here
   - `resolution` — how a recurring problem was solved
   - `constraint` — external limit or system-imposed restriction
   - `integration` — behavior specific to a third-party service

3. **Exact slug scan** — grep `.agents/memory/INDEX-[category].md` slug column for the candidate slug. If found → go to step 5 (UPDATE).

4. **Semantic scan** — read every `summary` in the category index. If any describes the same concept (same system + same behavior + same scope) → go to step 5 using that entry's slug. If no match → go to step 6 (CREATE).

5. **UPDATE path:**
   - Additive observation → append bullet to `## What we know`, bump `updated` date
   - Contradicting observation → append bullet prefixed `[YYYY-MM-DD]`, set `Conflicts with: self`, set `confidence: observed`
   - Confirming observation → promote `confidence: confirmed` **only if** `Conflicts with: n/a`
   - Update the matching pipe-delimited line in `INDEX-[category].md` (updated date + confidence fields)

6. **CREATE path** (only if steps 3 and 4 both found nothing):
   - Copy `.agents/memory/TEMPLATE.md` to `.agents/memory/entries/[slug].md`
   - Fill all fields — use `n/a` where not applicable, never leave a field blank
   - Append a pipe-delimited line to `.agents/memory/INDEX-[category].md`: `[slug] | [summary] | YYYY-MM-DD | observed`

7. **Cross-conflict scan** — compare the new/updated `summary` against summaries in all five category indices. If any other entry describes the same concept, set `Conflicts with: [other-slug]` in both entry files.

## Output
Confirm: slug written or updated, which index file was updated, confidence level, any conflicts flagged.
