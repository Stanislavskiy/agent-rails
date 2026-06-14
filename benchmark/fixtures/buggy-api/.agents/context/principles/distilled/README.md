# Distilled Principles

> READ-ONLY — auto-generated. Edit `docs/` to change these.

## Code conventions

- Route handlers must validate all required fields and return 400 with `{ error: "..." }` on failure
- Use `res.status(N).json(...)` — never `res.send()` for API responses
- New resources are returned with 201 status; existing resources with 200
- Return 404 with `{ error: "Not found" }` for unknown IDs — never crash or return undefined

## Validation rules

- String fields: check for truthiness AND `.trim()` to reject whitespace-only values
- Numeric fields: check `value != null && value > 0` for positive-only constraints
- Missing body fields: return 400 immediately, do not proceed

## Test conventions

- Tests use `node:test` + `node:assert/strict` — no additional test runner
- Each test file starts and stops its own server on a random port (`app.listen(0)`)
- Tests assert HTTP status codes AND response body shape
- One `describe` block per endpoint
