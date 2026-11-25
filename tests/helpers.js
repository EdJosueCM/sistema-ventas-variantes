const request = require('supertest');
const { createApp } = require('../src/app');
const { loadConfig } = require('../src/config/loader');

function createTestApp(variant = 'basica', env = {}) {
  return createApp(loadConfig(variant, env));
}

async function loginAs(app, username = 'admin', password = 'admin123') {
  const res = await request(app).post('/api/auth/login').send({ username, password });
  return `Bearer ${res.body.token}`;
}

module.exports = { createApp: createTestApp, loginAs, request };
