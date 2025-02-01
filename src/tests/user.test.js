// tests/user.test.js
const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../src/config/env.config');

// Create a valid token for an admin user for testing purposes.
const token = jwt.sign({ id: 1, role: 'admin' }, jwtSecret, { expiresIn: '1h' });

describe('User API', () => {
  test('GET /api/v1/users returns an array of users', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/v1/users creates a new user', async () => {
    const userData = {
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      role: 'user',
    };
    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('userId');
  });
});
