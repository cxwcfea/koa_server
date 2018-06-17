const { makeClassInvoker } = require('awilix-koa');
const Router = require('koa-router');
const controller = require('./auth.controller');
const validator = require('./auth.validator');
const smsValidator = require('../sms/sms.validator');

module.exports = (app) => {
  const router = new Router({ prefix: '/api/auth' });
  const api = makeClassInvoker(controller);
  const validate = makeClassInvoker(validator);
  const sms = makeClassInvoker(smsValidator);

  router.post('/register', sms('mobileCaptcha'), validate('namePasswd'), api('register'));
  router.post('/login', validate('namePasswd'), api('login'));

  app.use(router.routes()).use(router.allowedMethods());
};
