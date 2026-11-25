const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');

function register(app, { store }) {
  const router = express.Router();
  router.use(requireAuth(store));

  router.get('/', (req, res) => {
    res.json(store.products);
  });

  router.post('/', (req, res) => {
    const { name, price, stock } = req.body || {};
    if (!name || typeof price !== 'number' || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ error: 'Datos de producto inválidos' });
    }
    const product = { id: store.nextId('products'), name, price, stock };
    store.products.push(product);
    return res.status(201).json(product);
  });

  app.use('/api/products', router);
}

module.exports = { register };
