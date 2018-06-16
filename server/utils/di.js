const { asClass, asValue, createContainer } = require('awilix');
const glob = require('glob');
const joi = require('joi');
const path = require('path');

const DB = require('../db/mysql');
const models = require('../db/model');
const ApiError = require('../utils/apiError');
const { getErrorMessage } = require('../utils');

// const logger = require('../utils/logger');

DB.models = models;
const utils = {
  ApiError,
  getErrorMessage,
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
  // logger: asValue(logger),
  utils: asValue(utils),
  db: asValue(DB),
  validator: asValue(joi),
});

module.exports = container;
