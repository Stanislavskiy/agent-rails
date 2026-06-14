# Domain

## Glossary

- **User** — a person with a name and email address
- **Product** — an item with a name and numeric price
- **Resource** — a REST-addressable entity (User or Product)

## Core entities

### User
Fields: `id` (auto-increment integer), `name` (string), `email` (string)
Rules:
- `name` must be non-empty after trimming whitespace
- `email` is required but not validated for format

### Product
Fields: `id` (auto-increment integer), `name` (string), `price` (number)
Rules:
- `price` must be a positive number (> 0)
- `name` must be non-empty

## Relationships

- Users and Products are independent — no foreign keys

## Business rules

- IDs are assigned by the server (client must not supply them)
- Deletion is not supported in this version
- All list endpoints return all records (no pagination in v1)
