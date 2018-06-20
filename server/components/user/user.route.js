const { makeClassInvoker } = require('awilix-koa');
const Router = require('koa-router');

const controller = require('./user.controller');
const validator = require('./user.validator');
const { auth } = require('../../utils');

module.exports = (app) => {
  const router = new Router({ prefix: '/api/user' });
  const api = makeClassInvoker(controller);
  const validate = makeClassInvoker(validator);

  router.put('/profile', auth, validate('profile'), api('updateProfile'));

  app.use(router.routes()).use(router.allowedMethods());
};
