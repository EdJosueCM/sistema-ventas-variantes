const express = require('express');
const { requireAuth } = require('../middleware/requireAuth');

const round = (value) => Math.round(value * 100) / 100;

function register(app, { store, pricingRules }) {
  const router = express.Router();
  router.use(requireAuth(store));

  router.get('/', (req, res) => {
    res.json(store.sales);
  });

  router.post('/', (req, res) => {
    const { customerId, items } = req.body || {};
    const customer = store.customers.find((c) => c.id === customerId);
    if (!customer) {
      return res.status(400).json({ error: 'Cliente no encontrado' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'La venta debe tener al menos un producto' });
    }

    const lines = [];
    for (const { productId, quantity } of items) {
      const product = store.products.find((p) => p.id === productId);
      if (!product) {
        return res.status(400).json({ error: `Producto ${productId} no encontrado` });
      }
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ error: 'Cantidad inválida' });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ error: `Stock insuficiente para ${product.name}` });
      }
      lines.push({ product, quantity });
    }

    const subtotal = round(lines.reduce((sum, line) => sum + line.product.price, 0));

    // Las características opcionales (p. ej. descuentos) pueden ajustar el total de la venta.
    let total = subtotal;
    const adjustments = [];
    for (const rule of pricingRules) {
      const result = rule({ subtotal, total, body: req.body, store });
      if (result) {
        total = round(result.total);
        adjustments.push(result.adjustment);
      }
    }

    lines.forEach(({ product, quantity }) => {
      product.stock -= quantity;
    });

    const sale = {
      id: store.nextId('sales'),
      customerId,
      seller: req.user.username,
      date: new Date().toISOString(),
      items: lines.map(({ product, quantity }) => ({
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        quantity,
      })),
      subtotal,
      adjustments,
      total,
    };
    store.sales.push(sale);
    return res.status(201).json(sale);
  });

  app.use('/api/sales', router);
}

module.exports = { register };
