const request = require('supertest');
const app = require('../app');
const server = require('../../server');
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
jest.mock('mysql2');
jest.mock('redis');

describe('Auth Routes', () => {
  afterAll(() => {
    server.close();
  });

  test('POST /auth/login should return a JWT token', async () => {
    jest.spyOn(userModel, 'getUserByEmail').mockImplementation(async () => {
      return { id: 1, name: 'admin', email: 'admin@example.com', password: await bcrypt.hash('admin', 10), passwordTimeStamp: new Date() };
    });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'admin' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /auth/login should return 401 on wrong password', async () => {
    jest.spyOn(userModel, 'getUserByEmail').mockImplementation(async () => {
        return { id: 1, name: 'admin', email: 'admin@example.com', password: await bcrypt.hash('admin', 10), passwordTimeStamp: new Date() };
    });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('message', 'Invalid credentials Wrong Password');
  });

  test('POST /auth/login should return 401 on user not found', async () => {
    jest.spyOn(userModel, 'getUserByEmail').mockImplementation(async () => {
        return undefined;
    });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toHaveProperty('message', 'Invalid credentials User Not Found');
  });
});
