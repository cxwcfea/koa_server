const { asValue } = require('awilix');

function reqSerializer(ctx = {}) {
  return {
    method: ctx.method,
    path: ctx.path,
    url: ctx.url,
    headers: ctx.headers,
    protocol: ctx.protocol,
    ip: ctx.ip,
    query: ctx.query,
  };
}

function resSerializer(ctx = {}) {
  return {
    status: ctx.status,
    responseTime: `${ctx.responseTime}ms`,
    type: ctx.type,
    headers: (ctx.response || {}).headers,
    body: ctx.body ? ctx.body : '',
  };
}

module.exports = (options = {}) => {
  const { logger = null } = options;

  if (typeof logger !== 'object' || logger === null) {
    throw new TypeError('Logger required');
  }

  return async function log(ctx, next) {
    const startTime = new Date();
    ctx.log = logger.child({ reqId: ctx.state.reqId });

    ctx.state.container.register({
      logger: asValue(ctx.log),
    });

    ctx.log.addSerializers({
      req: reqSerializer,
      res: resSerializer,
    });

    ctx.log.info('Request start');

    try {
      await next();
    } catch (err) {
      ctx.log.error(
        { err, event: 'error' },
        `Unhandled exception occured on the request: ${ctx.state.reqId}`,
      );
      throw err;
    }

    ctx.responseTime = new Date() - startTime;
    ctx.log.info(
      { req: ctx, res: ctx, event: 'response' },
      'Request complete',
    );
  };
};

