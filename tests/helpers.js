const request = require('supertest');
const { createApp } = require('../src/app');

async function loginAs(app, username = 'admin', password = 'admin123') {
  const res = await request(app).post('/api/auth/login').send({ username, password });
  return `Bearer ${res.body.token}`;
}

module.exports = { createApp, loginAs, request };
