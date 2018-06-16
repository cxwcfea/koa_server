const { makeClassInvoker } = require('awilix-koa');
const Router = require('koa-router');
const controller = require('./auth.controller');
const validator = require('./auth.validator');

module.exports = (app) => {
  const router = new Router({ prefix: '/api/auth' });
  const api = makeClassInvoker(controller);
  const validate = makeClassInvoker(validator);

  router.post('/register', validate('nameAndPasswd'), api('register'));
  router.post('/login', validate('nameAndPasswd'), api('login'));

  app.use(router.routes()).use(router.allowedMethods());
};
