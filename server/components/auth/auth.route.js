const { makeClassInvoker } = require('awilix-koa');
const Router = require('koa-router');
const controller = require('./auth.controller');


module.exports = (app) => {
  const router = new Router({ prefix: '/api/auth' });
  const api = makeClassInvoker(controller);

  router.post('/register', api('register'));
  router.post('/login', api('login'));

  app.use(router.routes()).use(router.allowedMethods());
};
