const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');

function register(app, { store }) {
  const router = express.Router();
  router.use(requireAuth(store));

  router.get('/', (req, res) => {
    res.json(store.customers);
  });

  router.post('/', (req, res) => {
    const { name, email } = req.body || {};
    if (!name || !email || !email.includes('@')) {
      return res.status(400).json({ error: 'Datos de cliente inválidos' });
    }
    const customer = { id: store.nextId('customers'), name, email };
    store.customers.push(customer);
    return res.status(201).json(customer);
  });

  app.use('/api/customers', router);
}

module.exports = { register };
