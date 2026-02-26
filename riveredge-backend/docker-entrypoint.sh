#!/bin/sh
set -e
cd /app
uv run aerich upgrade || true
exec uv run uvicorn server.main:app --host 0.0.0.0 --port 8200
