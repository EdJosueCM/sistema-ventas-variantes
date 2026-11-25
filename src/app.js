const path = require('node:path');
const express = require('express');
const { createStore } = require('./store');
const { loadConfig } = require('./config/loader');
const registry = require('./features/registry');

// Construye la aplicación a partir de una configuración de variante.
// Solo se registran los módulos de las características habilitadas.
function createApp(config = loadConfig('basica', {})) {
  const app = express();
  const store = createStore();
  const ctx = { store, config, pricingRules: [] };

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/api/health', (req, res) => res.json({ status: 'ok', variant: config.variant }));

  app.get('/api/config', (req, res) => {
    const enabled = Object.keys(config.features).filter((name) => config.features[name]);
    res.json({ variant: config.variant, displayName: config.displayName, features: enabled });
  });

  for (const [name, enabled] of Object.entries(config.features)) {
    if (enabled) registry[name].register(app, ctx);
  }

  app.use('/api', (req, res) => res.status(404).json({ error: 'Recurso no encontrado' }));

  return app;
}

module.exports = { createApp };
