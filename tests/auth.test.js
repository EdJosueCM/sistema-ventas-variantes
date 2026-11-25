const { createApp, request } = require('./helpers');

describe('Inicio de sesión', () => {
  test('devuelve un token con credenciales válidas', async () => {
    const res = await request(createApp())
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.username).toBe('admin');
  });

  test('rechaza credenciales inválidas', async () => {
    const res = await request(createApp())
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'incorrecta' });

    expect(res.status).toBe(401);
  });

  test('protege las rutas que requieren sesión', async () => {
    const res = await request(createApp()).get('/api/products');
    expect(res.status).toBe(401);
  });
});
