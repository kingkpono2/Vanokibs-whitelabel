# Hosting on Namecheap (cobalthelm.com)

The site runs as a Node.js app (cPanel "Setup Node.js App", Phusion Passenger) on the Namecheap
Stellar account `cobadmyj` (server premium204.web-hosting.com, SSH port 21098).

## How a change goes live

1. A push to the deploy branch (including admin saves, which commit to GitHub) runs the
   **Deploy to Namecheap** workflow: install, type check, `next build` (standalone output),
   then the package is attached to the run as the `release` artifact.
2. Every 2 minutes, cron on the hosting account runs `~/cobalthelm-app/bin/pull-release.py`.
   It installs the newest successful run into `~/cobalthelm-app/releases/<name>`, points
   `~/cobalthelm-app/current` at it (`activate.sh`) and restarts the app.
3. It then checks that `https://cobalthelm.com/revision.txt` shows the new commit. If not, it
   switches back to the previous release and won't retry that commit.

No hosting login is stored in GitHub; the hosting account pulls with a read-only use of the
GitHub token. Log: `~/cobalthelm-app/deploy.log`.

## Files on the hosting account

| Path | What |
| --- | --- |
| `~/cobalthelm-app/current` | the live release (symlink); the Passenger startup file is `current/start.js` |
| `~/cobalthelm-app/releases/` | the last few releases |
| `~/cobalthelm-config/env.json` | secrets, mode 600: `ADMIN_USERS`, `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH`, `MYSQL_*`, `NEXT_PUBLIC_SITE_URL`, `DEPLOY_BRANCH` |
| MySQL `cobadmyj_cobalthelm` | consultation bookings (`bookings`, `booking_blocks`, created on first use) |

## By hand

- Roll back: `bash ~/cobalthelm-app/current/activate.sh --rollback`
- Restart: `touch ~/cobalthelm-app/tmp/restart.txt`
- Install now instead of waiting for cron: `python3 ~/cobalthelm-app/bin/pull-release.py`
