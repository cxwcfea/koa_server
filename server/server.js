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
app.use(log({ logger }));
app.use(errorHandler());

const routeFiles = glob.sync(path.join(__dirname, 'components', '**/*.route.js'), {});
routeFiles.forEach((file) => {
  // require('./components/orders/order.route')(app);
  require(file)(app); // eslint-disable-line global-require
});

router.get('/api/ping', (ctx) => {
  ctx.body = { message: 'Server is running' };
});

app.use(router.routes()).use(router.allowedMethods());

function onError(err) {
  logger.error({ err, event: 'error' }, 'Unhandled exception occured');
}
app.on('error', onError);

function cleanup() {
  logger.info('server cleanup');
  diContainer.cradle.redis.quit();
  diContainer.cradle.db.sequelize.close();
}

app.cleanup = cleanup;

// restart
// process.once('SIGUSR2', () => {
//   cleanup();
// });

// For app termination
// process.on('SIGINT', () => {
//   cleanup();
//   process.exit(0);
// });

module.exports = app;
