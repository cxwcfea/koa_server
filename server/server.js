const Koa = require('koa');
const Router = require('koa-router');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');

const errorHandler = require('./middleware/errorHandler');
const log = require('./middleware/log');
const logger = require('./utils/logger');
const requestId = require('./middleware/requestId');

const orders = require('./components/orders/order.route');

const app = new Koa();
const router = new Router();

app.proxy = true;

app.use(bodyParser({
  formLimit: '10mb',
  jsonLimit: '10mb',
}));
app.use(compress());
app.use(requestId());
app.use(errorHandler());
app.use(log({ logger }));

orders(app);

router.get('/test', (ctx) => {
  // ctx.body = 'Hello Koa';
  ctx.throw(500, 'server test error');
});

router.get('/api/test', (ctx) => {
  ctx.log.info('This is a request');
  ctx.body = { name: 'Hello Koa' };
});

router.post('/api/test', (ctx) => {
  ctx.log.debug('post body', ctx.request.body);
  ctx.log.debug('raw body', ctx.request.rawBody);
  ctx.body = { name: 'good' };
});

router.get('/api/error', (ctx) => {
  // ctx.body = { code: 1, msg: 'Hello Koa' };
  ctx.throw(403, 'APIError', { code: 'auth:pass_error' });
});

app.use(router.routes()).use(router.allowedMethods());

function onError(err) {
  logger.error({ err, event: 'error' }, 'Unhandled exception occured');
}
app.on('error', onError);

module.exports = app;
