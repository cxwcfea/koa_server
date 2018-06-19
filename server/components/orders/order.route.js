const { makeClassInvoker } = require('awilix-koa');
const Router = require('koa-router');
const controller = require('./order.controller');
const authController = require('../auth/auth.controller');

module.exports = (app) => {
  const router = new Router({ prefix: '/api/orders' });
  const api = makeClassInvoker(controller);
  const auth = makeClassInvoker(authController);

  router.get('/', auth('authenticate'), api('list'));

  app.use(router.routes()).use(router.allowedMethods());
};
