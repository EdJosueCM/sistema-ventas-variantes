// Valida todas las variantes de config/ contra el modelo de características.
// Se ejecuta en el pipeline de CI: si alguna configuración es inválida, el flujo falla.
const path = require('node:path');
const { validateConfig } = require('../src/config/validator');
const { loadModel, listVariants, readJson, configDir } = require('../src/config/loader');
const registry = require('../src/features/registry');

const model = loadModel();
let hasErrors = false;

for (const variant of listVariants()) {
  const config = readJson(path.join(configDir, `${variant}.json`));
  const errors = validateConfig(config, model, registry);

  if (errors.length === 0) {
    const enabled = Object.keys(config.features).filter((f) => config.features[f]);
    console.log(`✔ ${variant}: válida (${enabled.join(', ')})`);
  } else {
    hasErrors = true;
    console.error(`✘ ${variant}: inválida`);
    errors.forEach((e) => console.error(`  - ${e}`));
  }
}

process.exit(hasErrors ? 1 : 0);
