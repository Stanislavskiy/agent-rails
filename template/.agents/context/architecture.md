# Architecture
> Scope: system topology, service boundaries, data flow, infrastructure.
> For code style/patterns → `principles/`. For domain rules → `domain.md`.

## System Topology
```
[Draw ASCII or describe layers]

Client → [API Gateway] → [Service A] ──┬── [DB A]
                      ↘ [Service B] ──┴── [Cache]
                                      ↘── [Queue] → [Worker]
```

## Services / Modules
- `[service-a]` — [one line responsibility] · owns: [db/table] · consumes: [service-b API]
- `[service-b]` — [one line responsibility] · owns: [db/table] · consumes: [queue topic]

## Data Flow
```
[Describe the critical happy path, e.g.:]
Request → Auth middleware → Rate limiter → Handler → Repository → DB
                                        ↘ Event bus → Async worker
```

## Infrastructure
- hosting: [provider/service] ([region, tier])
- container: [Docker / K8s / ECS] ([cluster details])
- database: [engine@version] ([primary + replica?])
- cache: [Redis / Memcached] ([TTL strategy])
- queue: [SQS / RabbitMQ / Kafka] ([topics/queues])
- cdn: [CloudFront / Cloudflare] ([assets, edge rules])
- secrets: [Vault / SSM / Doppler] ([rotation policy])
- ci-cd: [GitHub Actions / GitLab] ([pipeline file path])
- observability: [Datadog / Grafana] ([key dashboards])

## Deployment Environments
- dev: branch=develop, auto-deploy=on push
- staging: branch=main, auto-deploy=on push (mirrors prod data shape)
- prod: branch=tags v*, deploy=manual approval ([rollback procedure])

## Scalability Touchpoints
- **Horizontal scale:** `[which services scale out, HPA rules if K8s]`
- **Bottlenecks:** `[known hotspots, e.g. DB connection pool, specific queue]`
- **Rate limits:** `[external APIs with quotas the agent must not spam]`

## Security Boundaries
- Trust boundary: `[e.g. all inbound traffic terminates at API gateway]`
- Service-to-service auth: `[JWT / mTLS / IAM roles]`
- Never do: `[e.g. direct DB access from frontend, plain-text secrets in env]`
