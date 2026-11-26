#!/usr/bin/env python3
"""Install the newest site build on the hosting account (cPanel / Namecheap). Python 3.6+.

Run from cron every 2 minutes (see deploy/README.md):
  1. Ask GitHub for the newest successful "Deploy to Namecheap" run on DEPLOY_BRANCH (default main).
  2. If it isn't the release already live, download its "release" artifact, unpack it into
     ~/cobalthelm-app/releases/<name> and switch to it (activate.sh restarts the app).
  3. Check that https://<site>/revision.txt serves the new commit; if not, switch back.
A build that failed this check is remembered and not retried.

Settings come from ~/cobalthelm-config/env.json: GITHUB_TOKEN (Actions: read), GITHUB_REPO,
DEPLOY_BRANCH, NEXT_PUBLIC_SITE_URL.
"""
import io
import json
import os
import subprocess
import sys
import tarfile
import time
import urllib.error
import urllib.request
import zipfile

HOME = os.path.expanduser("~")
APP = os.path.join(HOME, "cobalthelm-app")
CONFIG = os.environ.get("APP_ENV_FILE", os.path.join(HOME, "cobalthelm-config", "env.json"))
FAILED = os.path.join(APP, ".failed-revisions")
WORKFLOW = "deploy-namecheap.yml"


def log(msg):
    print(time.strftime("%Y-%m-%d %H:%M:%S"), msg, flush=True)


def github(path, token, raw=False):
    req = urllib.request.Request("https://api.github.com" + path)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("User-Agent", "cobalthelm-deploy")
    # Not forwarded on the redirect to the artifact storage URL.
    req.add_unredirected_header("Authorization", "Bearer " + token)
    with urllib.request.urlopen(req, timeout=120) as r:
        body = r.read()
    return body if raw else json.loads(body.decode())


def live_revision(site):
    try:
        with urllib.request.urlopen(site + "/revision.txt?t=%d" % time.time(), timeout=30) as r:
            return r.read().decode().strip()
    except Exception:
        return ""


def current_revision():
    try:
        with open(os.path.join(APP, "current", "REVISION")) as f:
            return f.read().strip()
    except OSError:
        return ""


def main():
    with open(CONFIG) as f:
        cfg = json.load(f)
    token, repo = cfg["GITHUB_TOKEN"], cfg.get("GITHUB_REPO", "kingkpono2/Vanokibs-whitelabel")
    branch = cfg.get("DEPLOY_BRANCH", "main")
    site = cfg.get("NEXT_PUBLIC_SITE_URL", "https://cobalthelm.com").rstrip("/")

    runs = github("/repos/%s/actions/workflows/%s/runs?branch=%s&status=success&per_page=1" % (repo, WORKFLOW, branch), token)
    if not runs.get("workflow_runs"):
        return
    run = runs["workflow_runs"][0]
    sha = run["head_sha"]
    failed = open(FAILED).read().split() if os.path.exists(FAILED) else []
    if sha == current_revision() or sha in failed:
        return

    arts = github("/repos/%s/actions/runs/%d/artifacts" % (repo, run["id"]), token)
    art = next((a for a in arts.get("artifacts", []) if a["name"] == "release" and not a.get("expired")), None)
    if not art:
        log("run %d has no release artifact" % run["id"])
        return
    log("installing %s (run %d)" % (sha[:12], run["id"]))
    data = github("/repos/%s/actions/artifacts/%d/zip" % (repo, art["id"]), token, raw=True)
    tgz = zipfile.ZipFile(io.BytesIO(data)).read("release.tgz")

    name = time.strftime("%Y%m%d-%H%M%S", time.gmtime()) + "-" + sha[:7]
    dest = os.path.join(APP, "releases", name)
    os.makedirs(dest)
    with tarfile.open(fileobj=io.BytesIO(tgz), mode="r:gz") as tar:
        for member in tar.getmembers():
            target = os.path.realpath(os.path.join(dest, member.name))
            if not (target == dest or target.startswith(dest + os.sep)):
                raise RuntimeError("unsafe path in release: " + member.name)
        tar.extractall(dest)

    subprocess.check_call(["bash", os.path.join(dest, "activate.sh"), name])
    for _ in range(12):
        time.sleep(10)
        if live_revision(site) == sha:
            log("live: %s" % name)
            return
    log("%s did not come up; rolling back" % name)
    with open(FAILED, "a") as f:
        f.write(sha + "\n")
    subprocess.call(["bash", os.path.join(dest, "activate.sh"), "--rollback"])


if __name__ == "__main__":
    try:
        main()
    except urllib.error.HTTPError as exc:
        log("GitHub error %s on %s" % (exc.code, exc.geturl()))
        sys.exit(1)
    except Exception as exc:
        log("deploy failed: %r" % exc)
        sys.exit(1)
