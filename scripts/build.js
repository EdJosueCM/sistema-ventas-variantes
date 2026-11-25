// Empaqueta la aplicación en dist/ para publicarla como artefacto del pipeline.
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const pkg = require('../package.json');

const include = ['src', 'public', 'config', 'package.json', 'package-lock.json'];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);

for (const entry of include) {
  const from = path.join(root, entry);
  if (fs.existsSync(from)) {
    fs.cpSync(from, path.join(dist, entry), { recursive: true });
  }
}

function gitCommit() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execSync('git rev-parse HEAD', { cwd: root }).toString().trim();
  } catch {
    return 'desconocido';
  }
}

const buildInfo = {
  name: pkg.name,
  version: pkg.version,
  commit: gitCommit(),
  builtAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(dist, 'build-info.json'), `${JSON.stringify(buildInfo, null, 2)}\n`);

console.log(`Build generado en dist/ (v${buildInfo.version}, commit ${buildInfo.commit.slice(0, 7)})`);
