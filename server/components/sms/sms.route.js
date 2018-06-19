const { makeClassInvoker } = require('awilix-koa');
const Router = require('koa-router');

const controller = require('./sms.controller');
const validator = require('./sms.validator');

module.exports = (app) => {
  const router = new Router({ prefix: '/api/sms' });
  const api = makeClassInvoker(controller);
  const validate = makeClassInvoker(validator);

  router.get('/captcha', validate('mobile'), api('sendCaptcha'));

  app.use(router.routes()).use(router.allowedMethods());
};
