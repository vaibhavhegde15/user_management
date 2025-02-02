const redis = jest.createMockFromModule('redis');

const mockRedisClient = {
  connect: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue(null),
  setEx: jest.fn().mockResolvedValue('OK'),
  del: jest.fn().mockResolvedValue(1),
  quit: jest.fn(),
};

redis.createClient = jest.fn(() => mockRedisClient);

module.exports = redis;
