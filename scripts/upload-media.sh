#!/usr/bin/env bash
# Upload a file to the public Supabase "media" bucket and print its public URL.
#
#   ./scripts/upload-media.sh ~/Desktop/risk-number.mp4
#   ./scripts/upload-media.sh ~/Desktop/risk-number.mp4 videos/risk-number.mp4
#
# Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.

set -euo pipefail

FILE="${1:-}"
if [ -z "$FILE" ] || [ ! -f "$FILE" ]; then
  echo "Usage: $0 <file> [destination-path]" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
set -a
# shellcheck disable=SC1091
. "$ROOT/.env.local"
set +a

DEST="${2:-videos/$(basename "$FILE")}"

case "$FILE" in
  *.mp4)  MIME="video/mp4" ;;
  *.webm) MIME="video/webm" ;;
  *.mov)  MIME="video/quicktime" ;;
  *.jpg|*.jpeg) MIME="image/jpeg" ;;
  *.png)  MIME="image/png" ;;
  *.webp) MIME="image/webp" ;;
  *) echo "Unsupported file type: $FILE" >&2; exit 1 ;;
esac

SIZE=$(wc -c < "$FILE" | tr -d ' ')
echo "Uploading $(basename "$FILE") ($((SIZE / 1024 / 1024))MB, $MIME) -> media/$DEST"

# x-upsert lets you re-upload the same path to replace an existing file
HTTP_CODE=$(curl -s -o /tmp/upload-media-response.json -w '%{http_code}' \
  -X POST "${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/media/${DEST}" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: ${MIME}" \
  -H "x-upsert: true" \
  --data-binary "@${FILE}")

if [ "$HTTP_CODE" != "200" ]; then
  echo "Upload failed (HTTP $HTTP_CODE):" >&2
  cat /tmp/upload-media-response.json >&2
  exit 1
fi

echo
echo "Uploaded. Public URL:"
echo "${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${DEST}"
