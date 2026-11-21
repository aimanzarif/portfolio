#!/usr/bin/env bash
# Run on the server: pulls the staging branch and rebuilds the staging container.
# Usage: ./scripts/deploy-staging.sh
set -euo pipefail

cd "$(dirname "$0")/.."

git fetch origin staging
git checkout staging
git reset --hard origin/staging

docker compose -f docker-compose.staging.yml up -d --build
docker image prune -f >/dev/null

echo "Staging deployed: https://staging.zarep.my"
docker compose -f docker-compose.staging.yml ps
