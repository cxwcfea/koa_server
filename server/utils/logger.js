const bunyan = require('bunyan');
const config = require('../config/log');

const logger = bunyan.createLogger(config);

logger.addSerializers({
  error: bunyan.stdSerializers.err,
});

module.exports = logger;
