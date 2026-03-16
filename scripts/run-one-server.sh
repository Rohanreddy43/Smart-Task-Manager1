#!/bin/bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"
BACKEND_STATIC_DIR="$BACKEND_DIR/src/main/resources/static"

echo "[INFO] Building frontend for Spring Boot static hosting..."
cd "$FRONTEND_DIR"
npm run build

echo "[INFO] Syncing frontend dist -> backend static resources..."
mkdir -p "$BACKEND_STATIC_DIR"
find "$BACKEND_STATIC_DIR" -mindepth 1 -delete
cp -R "$FRONTEND_DIR/dist/." "$BACKEND_STATIC_DIR/"

echo "[INFO] Starting backend server (frontend + API) on http://localhost:8080 ..."
cd "$BACKEND_DIR"
mvn -Dmaven.repo.local=/tmp/.m2 spring-boot:run
