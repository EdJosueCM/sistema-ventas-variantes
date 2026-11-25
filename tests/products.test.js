const { createApp, loginAs, request } = require('./helpers');

describe('Productos', () => {
  test('lista los productos iniciales', async () => {
    const app = createApp();
    const token = await loginAs(app);
    const res = await request(app).get('/api/products').set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  test('registra un producto nuevo', async () => {
    const app = createApp();
    const token = await loginAs(app);
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', token)
      .send({ name: 'Parlantes', price: 30, stock: 8 });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 4, name: 'Parlantes', price: 30, stock: 8 });
  });

  test('rechaza un producto con precio inválido', async () => {
    const app = createApp();
    const token = await loginAs(app);
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', token)
      .send({ name: 'Gratis', price: -5, stock: 1 });

    expect(res.status).toBe(400);
  });
});
