const { asClass, asValue, createContainer } = require('awilix');
const glob = require('glob');
const joi = require('joi');
const path = require('path');

const DB = require('../db/mysql');
const models = require('../db/model');
const utilFuncs = require('../utils');
const ApiError = require('../utils/apiError');
const regex = require('../utils/regex');
const redisClient = require('../utils/redis');

DB.models = models;
const utils = {
  ApiError,
  regex,
  ...utilFuncs,
};

const serviceFiles = glob.sync(path.join(__dirname, '..', 'components', '**/*.service.js'), {});
const services = {};
serviceFiles.forEach((file) => {
  const name = file.split('/').pop().split('.')[0];
  services[`${name}Service`] = asClass(require(file)).scoped(); // eslint-disable-line global-require
});

const container = createContainer();
container.register(services);
container.register({
  utils: asValue(utils),
  db: asValue(DB),
  redis: asValue(redisClient),
  validator: asValue(joi),
});

module.exports = container;
