const { createApp, loginAs, request } = require('./helpers');

describe('Clientes', () => {
  test('registra y lista clientes', async () => {
    const app = createApp();
    const token = await loginAs(app);

    const created = await request(app)
      .post('/api/customers')
      .set('Authorization', token)
      .send({ name: 'María López', email: 'maria@example.com' });
    expect(created.status).toBe(201);

    const list = await request(app).get('/api/customers').set('Authorization', token);
    expect(list.body.map((c) => c.name)).toContain('María López');
  });

  test('rechaza un cliente con correo inválido', async () => {
    const app = createApp();
    const token = await loginAs(app);
    const res = await request(app)
      .post('/api/customers')
      .set('Authorization', token)
      .send({ name: 'Sin correo', email: 'no-es-correo' });

    expect(res.status).toBe(400);
  });
});
