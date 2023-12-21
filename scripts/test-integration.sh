#!/bin/bash

# Read environment variables from env.test
DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh

# Check if postgres-test container is running
if ! docker ps | grep -q "todos-postgres-test"; then
  # Start postgres-test container
  docker-compose -f docker-compose.test.yml up -d
else
  echo "todos-postgres-test container is already running"
fi

# Run wait-for-it
bash $DIR/wait-for-it.sh -h "${POSTGRES_HOST}" -p "${POSTGRES_PORT}"

# Interupt if wait-for-it failed
if [ $? -ne 0 ]; then
  echo "wait-for-it failed"
  exit 1
fi

# Run migrations
pnpm dotenv -e .env.test -- pnpm prisma migrate dev --name init

echo "Successfully migrated database"

# Run jest
pnpm dotenv -e .env.test -- pnpm jest
