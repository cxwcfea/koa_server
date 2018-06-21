const config = require('./server/config');
const server = require('./server/server');
const logger = require('./server/utils/logger');

server.listen(config.port, () => logger.info(`Server started on ${config.port}`));
