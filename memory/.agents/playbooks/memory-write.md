# Playbook: Memory Write
> Follow when capturing a learning. Use add_memory / search_memory (mem0 MCP tools).
> DO NOT call add_memory directly — always go through these steps.

## When to use
When `capture-learning.md` routes to mem0, or a routine's capture step identifies a new learning.

## Category reference

| Category | Use when |
|---|---|
| `gotcha` | Unexpected behavior, footgun, non-obvious trap |
| `pattern` | Reusable approach that works well in this codebase |
| `resolution` | How a recurring problem was solved |
| `constraint` | External limit or system-imposed restriction |
| `integration` | Behavior specific to a third-party service or API |

## Steps

1. **Derive slug + category**
   - Slug: 2–5 words, kebab-case, concept-first (e.g. `stripe-idempotency-key`, not `found-bug-in-stripe`)
   - Category: one from the table above

2. **Search for duplicates**
   ```
   search_memory("[slug] [summary keywords]", filter={category, user_id: [PROJECT_NAME]})
   ```
   - Results found → UPDATE path (step 3a)
   - No results → CREATE path (step 3b)

3a. **UPDATE** — add bullet to content, bump updated date in metadata.
    Promote `confidence` to `confirmed` only if no conflicts exist.
    Call `update_memory(id, updated_content, updated_metadata)`.

3b. **CREATE** — call `add_memory(content, metadata={slug, category, confidence: observed, updated: YYYY-MM-DD})`

    Content format:
    ```
    When this applies: [1–2 sentences — narrow trigger, not "when using postgres" but the specific scenario]

    What we know:
    - [Imperative or factual statement]
    - [Prefix contradicting observations with [YYYY-MM-DD] — never silently overwrite]

    Source: [task type + brief context where this was discovered]
    ```

## Cross-conflict check (after CREATE)
```
search_memory([summary], user_id=[PROJECT_NAME])
```
No category filter. If any other entry covers the same concept, note the conflict in both entries' content.

## Confidence lifecycle
`observed → confirmed → deprecated` — one-way. Deprecated entries are never deleted.

## Output
Confirm: slug, category, confidence level, any conflicts flagged.
