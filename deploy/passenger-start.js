/**
 * Start file for cPanel "Setup Node.js App" (Phusion Passenger), e.g. Namecheap shared hosting.
 * The GitHub Actions workflow copies this next to the standalone server.js of each release.
 *
 * Secrets (admin users, GitHub token, MySQL login) live in a JSON file outside the web root,
 * by default ~/cobalthelm-config/env.json (override with APP_ENV_FILE). Values already set in the
 * environment win.
 */
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const envFile = process.env.APP_ENV_FILE || path.join(os.homedir(), 'cobalthelm-config', 'env.json');
try {
  const values = JSON.parse(fs.readFileSync(envFile, 'utf8'));
  for (const [key, value] of Object.entries(values)) {
    if (process.env[key] === undefined && value !== null) process.env[key] = String(value);
  }
} catch (err) {
  console.error(`Could not read ${envFile}: ${err.message}`);
}
process.env.NODE_ENV = 'production';

require(path.join(__dirname, 'server.js'));
