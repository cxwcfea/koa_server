/* eslint global-require: off */

const fs = require('fs');
const _ = require('lodash');
const logger = require('../utils/logger');

const files = fs.readdirSync(`${__dirname}/models`);

const models = {};
files.forEach((file) => {
  logger.info(`import model from file ${file}...`);
  const name = file.substring(0, file.length - 3);
  models[_.capitalize(name)] = require(`${__dirname}/models/${file}`);
});

module.exports = models;
