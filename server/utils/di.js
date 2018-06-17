const { asClass, asValue, createContainer } = require('awilix');
const Promise = require('bluebird');
const glob = require('glob');
const joi = require('joi');
const path = require('path');
const redis = require('redis');

const config = require('../config');
const DB = require('../db/mysql');
const models = require('../db/model');
const utilFuncs = require('../utils');
const ApiError = require('../utils/apiError');
const regex = require('../utils/regex');

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

DB.models = models;
const utils = {
  ApiError,
  regex,
  ...utilFuncs,
};

const container = createContainer();

const serviceFiles = glob.sync(path.join(__dirname, '..', 'components', '**/*.service.js'), {});
const services = {};

serviceFiles.forEach((file) => {
  const name = file.split('/').pop().split('.')[0];
  services[`${name}Service`] = asClass(require(file)).scoped(); // eslint-disable-line global-require
});

container.register(services);

container.register({
  utils: asValue(utils),
  db: asValue(DB),
  redis: asValue(redisClient),
  validator: asValue(joi),
});

module.exports = container;
