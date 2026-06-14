# Domain Model
> Scope: core entities, relationships, business rules, glossary.
> For DB/infra details → `architecture.md`. For code patterns → `principles/`.

## Glossary
> Define terms that have a specific meaning in this project. Agents must use these names exactly.

- `[Entity]`: [precise definition, distinguish from similar terms]
- `[Entity]`:
- `[Concept]`:

## Core Entities
> List the 5–10 most important domain objects. Skip obvious CRUD scaffolding.

### `[EntityName]`
```
Key fields  : id, [field], [field], [status-enum]
Lifecycle   : [draft → active → archived]
Owns        : [child entities it controls]
Rules       :
  - [Invariant: e.g. "price must be > 0"]
  - [Constraint: e.g. "cannot transition from archived back to active"]
```

### `[EntityName]`
```
Key fields  :
Lifecycle   :
Owns        :
Rules       :
```

## Relationships
```
[EntityA] 1──────< [EntityB]    [EntityA owns many EntityB]
[EntityB] >──────< [EntityC]    [many-to-many via junction table]
[EntityD] 1──────1 [EntityE]    [one-to-one, EntityD is authoritative]
```

## Business Rules
> Rules that cut across entities or have non-obvious implications for code.

```
RULE-001  [Name]   : [Description. Which entities it affects. What triggers it.]
RULE-002  [Name]   : [Description.]
RULE-003  [Name]   : [Description.]
```

## State Machines
> Include only for entities with non-trivial lifecycle transitions.

```
[EntityName] states:
  DRAFT ──[submit]──→ PENDING ──[approve]──→ ACTIVE
                              ↘─[reject]──→ REJECTED
  ACTIVE ──[archive]──→ ARCHIVED
  
  Forbidden: ARCHIVED → any state
  Side-effect on ACTIVE: triggers [event/notification]
```

## External Integrations
- `[System]` — [purpose] · data: [entity/event names] · contract: [path or URL]
