const request = require('supertest');
const app = require('../app');
const server = require('../../server');
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
jest.mock('mysql2');
jest.mock('redis');

let token = '';
let passwordTimeStamp = new Date();
describe('User Routes', () => {
  beforeAll(async () => {
    jest.spyOn(userModel, 'getUserByEmail').mockImplementation(async () => {
      return { id: 1, role: 'admin', name: 'Admin User', email: 'admin@example.com', password: await bcrypt.hash('admin', 10), passwordTimeStamp: passwordTimeStamp };
    });
    jest.spyOn(userModel, 'getPasswordTimeStampById').mockImplementation(async () => {
      return {  passwordTimeStamp: passwordTimeStamp };
    });
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin',
      });

    token = loginRes.body.token;
  });
  afterAll(() => {
    server.close();
  });

  test('GET /users should return an array of users', async () => {
    jest.spyOn(userModel, 'getAllUsers').mockImplementation(() => {
      return [{ id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' }];
    });

    const response = await request(app)
      .get('/api/v1/users')
      .set('authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('GET /users/:id should return a user object', async () => {
    jest.spyOn(userModel, 'getUserById').mockImplementation(() => {
      return { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin'};
    });

    const response = await request(app)
      .get('/api/v1/users/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('name', 'Admin User');
  });

  test('POST /users should create a user (admin only)', async () => {
    jest.spyOn(userModel, 'createUser').mockImplementation(() => {
      return 3;
    });

    const response = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test User', email: 'test@example.com', role: 'admin', password: 'test' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id', 3);
  });

  test('PUT /users/:id should update a user (admin only)', async () => {
    jest.spyOn(userModel, 'updateUser').mockImplementation(() => {
      return 1
    });

    const response = await request(app)
      .put('/api/v1/users/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Admin Updated' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User updated');
  });

  test('DELETE /users/:id should remove a user (admin only)', async () => {
    jest.spyOn(userModel, 'deleteUser').mockImplementation(() => {
      return 1;
    });

    const response = await request(app)
      .delete('/api/v1/users/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User deleted');
  });

  
  test('should return 404 for non-existing usert', async () => {
    jest.spyOn(userModel, 'getUserById').mockImplementation(() => {
      return undefined;
    });

    const response = await request(app)
      .get('/api/v1/users/999')
      .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message', 'User not found');
  });
});
