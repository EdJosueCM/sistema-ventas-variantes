const crypto = require('node:crypto');
const express = require('express');

function register(app, { store }) {
  const router = express.Router();

  router.post('/login', (req, res) => {
    const { username, password } = req.body || {};
    const user = store.users.find((u) => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = crypto.randomUUID();
    store.sessions.set(token, { id: user.id, username: user.username, name: user.name });
    return res.json({ token, user: { id: user.id, username: user.username, name: user.name } });
  });

  router.post('/logout', (req, res) => {
    const header = req.headers.authorization || '';
    store.sessions.delete(header.replace('Bearer ', ''));
    res.status(204).end();
  });

  app.use('/api/auth', router);
}

module.exports = { register };
