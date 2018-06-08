const bunyan = require('bunyan');
const config = require('../config/log');

const logger = bunyan.createLogger(config);

logger.addSerializers({
  err: bunyan.stdSerializers.err,
});

module.exports = logger;
