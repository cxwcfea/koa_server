const { makeClassInvoker } = require('awilix-koa');
const Router = require('koa-router');
const controller = require('./order.controller');

module.exports = (app) => {
  const router = new Router({ prefix: '/api/orders' });
  const api = makeClassInvoker(controller);

  router.get('/', api('list'));

  app.use(router.routes()).use(router.allowedMethods());
};
