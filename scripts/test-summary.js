// Registra el resultado de las pruebas en el resumen de la ejecución de GitHub Actions.
const fs = require('node:fs');
const path = require('node:path');

const resultsFile = path.join(__dirname, '..', 'reports', 'jest-results.json');
const summaryFile = process.env.GITHUB_STEP_SUMMARY;

if (!fs.existsSync(resultsFile)) {
  console.error('No se encontró reports/jest-results.json');
  process.exit(0);
}

const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
const status = results.success ? '✅ Pruebas superadas' : '❌ Pruebas fallidas';

const lines = [
  `## ${status}`,
  '',
  '| Total | Exitosas | Fallidas |',
  '|---|---|---|',
  `| ${results.numTotalTests} | ${results.numPassedTests} | ${results.numFailedTests} |`,
  '',
];

const failed = results.testResults.flatMap((suite) =>
  suite.assertionResults
    .filter((t) => t.status === 'failed')
    .map((t) => `- **${path.basename(suite.name)}** › ${t.fullName}`),
);
if (failed.length > 0) {
  lines.push('### Pruebas fallidas', '', ...failed, '');
}

const output = lines.join('\n');
console.log(output);
if (summaryFile) fs.appendFileSync(summaryFile, `${output}\n`);
