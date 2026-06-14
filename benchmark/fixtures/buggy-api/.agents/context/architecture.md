# Architecture

## System topology

```
Client → Express (src/app.js) → Route handlers (src/routes/) → In-memory DB (src/db.js)
```

## Services / modules

| Module | Path | Responsibility |
|---|---|---|
| App | `src/app.js` | Express setup, middleware, route mounting |
| Users routes | `src/routes/users.js` | GET /users, GET /users/:id, POST /users |
| Products routes | `src/routes/products.js` | GET /products, POST /products |
| DB | `src/db.js` | In-memory arrays + auto-incrementing IDs |
| Server | `src/server.js` | Binds app to port (not imported in tests) |

## Data flow

Request → Express JSON middleware → Route handler → db object mutation → JSON response

## Infrastructure

- Hosting: local / Node.js process
- Container: none
- DB: in-memory (arrays in `src/db.js`)
- Cache: none
- CI: not configured

## Constraints

- No real persistence — db resets on process restart
- Single-process, no clustering
- No auth layer
