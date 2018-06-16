const { scopePerRequest } = require('awilix-koa');
const cors = require('kcors');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const Router = require('koa-router');
const glob = require('glob');
const path = require('path');

const { REQUEST_ID_HEADER } = require('./constants');
const diContainer = require('./utils/di');
const errorHandler = require('./middleware/errorHandler');
const log = require('./middleware/log');
const logger = require('./utils/logger');
const requestId = require('./middleware/requestId');

const app = new Koa();
const router = new Router();

app.proxy = true;

app.use(bodyParser({
  formLimit: '10mb',
  jsonLimit: '10mb',
}));
app.use(compress());
app.use(requestId());
app.use(cors({ exposeHeaders: [REQUEST_ID_HEADER] }));
app.use(scopePerRequest(diContainer));
app.use(errorHandler());
app.use(log({ logger }));

const routeFiles = glob.sync(path.join(__dirname, 'components', '**/*.route.js'), {});
routeFiles.forEach((file) => {
  // require('./components/orders/order.route')(app);
  require(file)(app); // eslint-disable-line global-require
});

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

// function onError(err) {
//   logger.error({ err, event: 'error' }, 'Unhandled exception occured');
// }
// app.on('error', onError);

module.exports = app;
