const Promise = require('bluebird');
const redis = require('redis');

const config = require('../config');
const logger = require('../utils/logger');

const redisOption = {};
if (config.env === 'production') {
  redisOption.host = config.redis.host;
  redisOption.password = config.redis.redis.passwd;
}
const redisClient = redis.createClient(redisOption);
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
redisClient.once('ready', () => {
  logger.info('redis connnection ready');
});
redisClient.on('error', (err) => {
  logger.error('can\'t connect to redis', err);
  process.exit(1);
});

module.exports = redisClient;
