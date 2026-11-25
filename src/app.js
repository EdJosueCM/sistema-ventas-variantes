const path = require('node:path');
const express = require('express');
const { createStore } = require('./store');
const auth = require('./modules/auth');
const products = require('./modules/products');
const customers = require('./modules/customers');

function createApp() {
  const app = express();
  const store = createStore();
  const ctx = { store };

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  [auth, products, customers].forEach((mod) => mod.register(app, ctx));

  app.use('/api', (req, res) => res.status(404).json({ error: 'Recurso no encontrado' }));

  return app;
}

module.exports = { createApp };
