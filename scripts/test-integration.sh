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

echo "${DATABASE_URL}"

# Run wait-for-it
bash ./wait-for-it.sh "${DATABASE_URL}"

# Run migrations
pnpx dotenv -e .env.test -- pnpx prisma migrate dev --name init

echo "Successfully migrated database"

# Run jest
pnpx dotenv -e .env.test -- pnpx jest
