const Router = require('koa-router');
const controller = require('./order.controller');

const router = new Router({ prefix: '/api/orders' });

module.exports = (app) => {
  router.get('/', controller.list);

  app.use(router.routes()).use(router.allowedMethods());
};
