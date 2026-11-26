#!/usr/bin/env bash
# Runs on the hosting account after a release is unpacked: switch the app to it and restart.
#   activate.sh <release-name>     switch to releases/<release-name>
#   activate.sh --rollback         switch back to the previous release
set -euo pipefail
APP="$HOME/cobalthelm-app"
cd "$APP"

if [[ "${1:-}" == "--rollback" ]]; then
  prev=$(cat .previous 2>/dev/null || true)
  [[ -n "$prev" && -d "releases/$prev" ]] || { echo "No previous release to roll back to." >&2; exit 1; }
  target="$prev"
else
  target="$1"
  [[ -f "releases/$target/start.js" ]] || { echo "releases/$target is incomplete." >&2; exit 1; }
  current=$(readlink current 2>/dev/null | sed 's#^releases/##' || true)
  [[ -n "$current" && "$current" != "$target" ]] && echo "$current" > .previous
fi

ln -sfn "releases/$target" current.new
mv -T current.new current
mkdir -p tmp
touch tmp/restart.txt
echo "Active release: $target"

# Keep the active release, the previous one and the newest three.
keep=$(printf '%s\n%s\n' "$target" "$(cat .previous 2>/dev/null || true)")
ls -1t releases | tail -n +4 | while read -r old; do
  grep -qxF "$old" <<<"$keep" || rm -rf -- "releases/$old"
done
