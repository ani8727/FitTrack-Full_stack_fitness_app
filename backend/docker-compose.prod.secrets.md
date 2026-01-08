# Secure deployment notes for docker-compose.prod.yml

This document explains recommended, production-friendly ways to provide secrets and image tags for `docker-compose.prod.yml`.

Key recommendations
- Never commit plaintext credentials into source control. Use a host-only file (`.env.prod`) kept out of git, or better: use your cloud provider / CI secret store.
- Build images in CI and publish to a registry. Provide concrete image tags to the compose file via environment variables (see `*_IMAGE` placeholders in `docker-compose.prod.yml`).
- Prefer orchestration platforms (Kubernetes, ECS, etc.) for production. If using Docker Compose, use Docker secrets or external secret managers where possible.

Options for provisioning secrets

1) Host-local `.env.prod` (simple)

- Create a `.env.prod` on the production host (do not commit it).
- Populate with the variables listed in `backend/.env.prod.example`.
- Start compose with:

```bash
docker compose --env-file backend/.env.prod -f backend/docker-compose.prod.yml up -d
```

2) CI-injected envs (recommended for automated deployments)

- Let your CI pipeline build images and push to a registry.
- CI populates runtime environment variables (or writes `.env.prod` to the host) using the platform's secret store.

3) Docker secrets (Swarm) or external secret store

- Docker Compose v2 supports `secrets` that integrate with Swarm; see Docker docs.
- On Kubernetes, use `Secret` objects and templating (Helm / Kustomize) to inject values into deployments.

Mapping your provided credentials (example, do not place in repo)

- MongoDB Atlas: place the full connection string into `MONGO_URI`.
- PostgreSQL (Neon): place the full connection URL into `POSTGRES_URL` and user/password into `POSTGRES_USER`/`POSTGRES_PASSWORD` if needed by other tooling.
- RabbitMQ (CloudAMQP): provide `RABBITMQ_URI` or split values into `RABBITMQ_HOST`, `RABBITMQ_PORT`, `RABBITMQ_USERNAME`, `RABBITMQ_PASSWORD`.

Quick checklist before bringing up production stack

- [ ] Confirm all `*_IMAGE` variables have concrete image tags.
- [ ] Confirm `backend/.env.prod` exists on host and is excluded from git.
- [ ] Ensure `CONFIGSERVER_IMAGE` and `EUREKA_IMAGE` are reachable by the host (registry auth if private).
- [ ] Consider running services behind a reverse proxy (TLS termination) and enable HTTPS between services where appropriate.

If you'd like, I can:

- Generate a sample `.env.prod` using the exact credentials you provided (will place it in your workspace; I will not commit it), or
- Convert `docker-compose.prod.yml` to use Docker secrets (requires additional changes), or
- Generate a short CI job (GitHub Actions) template that builds images and writes `backend/.env.prod` to the host using GitHub Secrets.
