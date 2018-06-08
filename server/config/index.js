require('dotenv-safe').config();

const env = process.env.NODE_ENV || 'development';
const config = {
  env,
  name: process.env.APP_NAME || 'koa-api-server',
  host: process.env.APP_HOST || '0.0.0.0',
  port: process.env.APP_PORT || 3000,
};

module.exports = config;
