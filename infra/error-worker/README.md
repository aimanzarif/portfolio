# zarep-error-fallback (Cloudflare Worker)

Shows a themed "The laptop is down." page when the origin can't be reached:
laptop off, Cloudflare Tunnel down (530 / error 1033), Nginx Proxy Manager or the
container not answering (502, 504), timeouts (522, 524) and similar.

Everything else passes straight through, including the app's own 404 and 500 pages.
API calls get a JSON error instead of HTML; images and other assets keep the origin's error.

Runs on the Cloudflare free plan (100,000 requests per day). No KV, no secrets.

## Deploy

```
cd infra/error-worker
npx wrangler login      # once
npx wrangler deploy
```

Routes are in `wrangler.toml` (zarep.my and staging.zarep.my). Add other subdomains the same way.

## Test it

Stop the staging container, then open https://staging.zarep.my:

```
docker stop portfolio-staging     # NPM now returns 502 -> themed page
docker start portfolio-staging
```

The fallback response carries an `x-zarep-fallback: <original status>` header.

## Remove it

```
npx wrangler delete
```
