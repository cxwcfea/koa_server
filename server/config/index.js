const env = process.env.NODE_ENV || 'development';
const options = { path: '../../.env' };
if (env === 'test') {
  options.path = '../../.env.test';
}

require('dotenv-safe').config(options);

const config = {
  env,
  name: process.env.APP_NAME || 'koa-api-server',
  host: process.env.APP_HOST || '0.0.0.0',
  port: process.env.APP_PORT || 3000,
  mysql: {
    db: process.env.MYSQL_DB || 'koa_api_dev',
    username: process.env.MYSQL_DB || 'root',
    password: process.env.MYSQL_PASS || '',
    host: process.env.MYSQL_HOST || 'localhost',
    port: Number.parseInt(process.env.MYSQL_PORT, 10) || 3306,
    socketPath: process.env.MYSQL_SOCKET_PATH || '/tmp/mysql.sock',
    debug: process.env.SQL_DEBUG || false,
    syncDB: process.env.MYSQL_SYNC === 'true' || false,
  },
  redis: {
    host: process.env.REDIS_HOST || '',
    passwd: process.env.REDIS_PASS || '',
  },
  jwtSecret: process.env.JWT_SECRET || 'jwtSecret',
  jwtIssuer: process.env.JWT_ISSUER || 'iss.cxwcfea.net',
};

module.exports = config;
