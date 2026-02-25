# Snapshot: fortknox

Static-site snapshot of **https://fortknoxselfstorage.com.au/**

> ⚠️  Only clone pages you have permission to copy.
> Cloning may violate the source site's Terms of Service.

## Quick start

```bash
# 1. Ensure the shared Docker network exists
docker network create caddy-net || true

# 2. Build & run
docker compose up -d --build

# 3. Verify
docker ps | grep fortknox
```

## Caddy reverse-proxy snippet

Add a block like this to your **Caddyfile** (on the host running your
central Caddy container):

```
fortknox.yourdomain.com {
    reverse_proxy fortknox:80
}
```

Then reload Caddy:

```bash
docker exec -w /etc/caddy caddy caddy reload
```

## Files

| Path | Description |
|------|-------------|
| `site/` | Downloaded HTML, CSS, JS, and assets |
| `Dockerfile` | Builds an nginx:alpine image with the site |
| `docker-compose.yml` | Runs the container on `caddy-net` |

## Notes

- The container exposes port **80** internally (no host port published
  by default).  Caddy reaches it via the `caddy-net` Docker network.
- To test locally without Caddy, uncomment the `ports:` section in
  `docker-compose.yml`.
