#!/usr/bin/env bash
# Exchange your 123FormBuilder account credentials for an API v2 token and
# store the token in .env.local as FORMBUILDER_TOKEN.
#
#   ./scripts/get-formbuilder-token.sh
#
# Your password is read without echoing, is never written to disk, never
# added to shell history, and never printed. Only the returned token is saved.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"

# Accounts created on the EU site use eu-api instead
API_HOST="${FORMBUILDER_API_HOST:-https://api.123formbuilder.com}"

printf '123FormBuilder email: '
read -r FB_EMAIL

printf '123FormBuilder password (input hidden): '
read -rs FB_PASSWORD
printf '\n\n'

if [ -z "$FB_EMAIL" ] || [ -z "$FB_PASSWORD" ]; then
  echo "Email and password are both required." >&2
  exit 1
fi

echo "Requesting token from ${API_HOST}/v2/token ..."

RESPONSE=$(curl -s -w '\n%{http_code}' -X POST "${API_HOST}/v2/token" \
  --data-urlencode "email=${FB_EMAIL}" \
  --data-urlencode "password=${FB_PASSWORD}")

unset FB_PASSWORD

HTTP_CODE=$(printf '%s' "$RESPONSE" | tail -n1)
BODY=$(printf '%s' "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" != "200" ] && [ "$HTTP_CODE" != "201" ]; then
  echo "Token request failed (HTTP $HTTP_CODE)." >&2
  echo "Response: $BODY" >&2
  echo >&2
  echo "If this says the endpoint is unknown, your account may be on the EU site." >&2
  echo "Retry with: FORMBUILDER_API_HOST=https://eu-api.123formbuilder.com $0" >&2
  exit 1
fi

TOKEN=$(printf '%s' "$BODY" | python3 -c '
import json, sys
try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(1)
# The token field name has moved around between doc revisions; accept the usual spellings
for key in ("token", "access_token", "accessToken", "api_token"):
    if isinstance(data, dict) and data.get(key):
        print(data[key]); break
else:
    payload = data.get("data") if isinstance(data, dict) else None
    if isinstance(payload, dict):
        for key in ("token", "access_token", "accessToken"):
            if payload.get(key):
                print(payload[key]); break
' 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "Got a 200 but could not find a token in the response." >&2
  echo "Response: $BODY" >&2
  exit 1
fi

# Replace any existing entry rather than appending a duplicate
if [ -f "$ENV_FILE" ] && grep -q '^FORMBUILDER_TOKEN=' "$ENV_FILE"; then
  TMP=$(mktemp)
  grep -v '^FORMBUILDER_TOKEN=' "$ENV_FILE" > "$TMP"
  mv "$TMP" "$ENV_FILE"
fi

printf 'FORMBUILDER_TOKEN=%s\n' "$TOKEN" >> "$ENV_FILE"
chmod 600 "$ENV_FILE"

echo "Token saved to .env.local as FORMBUILDER_TOKEN (${#TOKEN} characters)."
echo "That file is gitignored, so it will not be committed."
