const redis = require('redis');
const { redis: redisConfig } = require('./env.config');

const redisClient = redis.createClient({
  username: redisConfig.username,
  password: redisConfig.password,
  socket: {
    host: redisConfig.host,
    port: redisConfig.port,
  }
});

redisClient.connect()
  .then(() => console.log('Redis connected'))
  .catch(console.error);

module.exports = redisClient;
