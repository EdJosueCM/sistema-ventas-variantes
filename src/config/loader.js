const fs = require('node:fs');
const path = require('node:path');
const { validateConfig } = require('./validator');
const registry = require('../features/registry');

const configDir = path.join(__dirname, '..', '..', 'config');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadModel() {
  return readJson(path.join(configDir, 'feature-model.json'));
}

function listVariants() {
  return fs
    .readdirSync(configDir)
    .filter((file) => file.endsWith('.json') && file !== 'feature-model.json')
    .map((file) => path.basename(file, '.json'));
}

// Las variables de entorno FEATURE_<NOMBRE>=true|false sobrescriben el archivo de la variante.
function applyEnvOverrides(config, env) {
  const features = { ...config.features };
  for (const name of Object.keys(features)) {
    const value = env[`FEATURE_${name.toUpperCase()}`];
    if (value === 'true' || value === 'false') {
      features[name] = value === 'true';
    }
  }
  return { ...config, features };
}

function loadConfig(variant = 'basica', env = process.env) {
  const file = path.join(configDir, `${variant}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`No existe la variante "${variant}". Disponibles: ${listVariants().join(', ')}`);
  }

  const config = applyEnvOverrides(readJson(file), env);
  const errors = validateConfig(config, loadModel(), registry);
  if (errors.length > 0) {
    throw new Error(`Configuración inválida para "${variant}":\n- ${errors.join('\n- ')}`);
  }
  return config;
}

module.exports = { loadConfig, loadModel, listVariants, readJson, configDir };
