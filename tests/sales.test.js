const { createApp, loginAs, request } = require('./helpers');

describe('Ventas', () => {
  test('calcula el total y descuenta el stock', async () => {
    const app = createApp();
    const token = await loginAs(app);

    const res = await request(app)
      .post('/api/sales')
      .set('Authorization', token)
      .send({
        customerId: 1,
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.total).toBe(62.5);

    const products = await request(app).get('/api/products').set('Authorization', token);
    expect(products.body.find((p) => p.id === 1).stock).toBe(8);
  });

  test('rechaza una venta sin stock suficiente', async () => {
    const app = createApp();
    const token = await loginAs(app);

    const res = await request(app)
      .post('/api/sales')
      .set('Authorization', token)
      .send({ customerId: 1, items: [{ productId: 3, quantity: 50 }] });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Stock insuficiente/);
  });

  test('rechaza una venta para un cliente inexistente', async () => {
    const app = createApp();
    const token = await loginAs(app);

    const res = await request(app)
      .post('/api/sales')
      .set('Authorization', token)
      .send({ customerId: 99, items: [{ productId: 1, quantity: 1 }] });

    expect(res.status).toBe(400);
  });
});
