const { INTERNAL_ERROR } = require('../constants/error');

module.exports = () => async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (e) {
    if (e.name === 'SequelizeValidationError') {
      e.code = 'db:validation';
      ctx.status = 400;
    } else {
      ctx.status = e.status || INTERNAL_ERROR.status;
    }

    ctx.type = 'application/json';
    ctx.body = {
      code: e.code || INTERNAL_ERROR.code,
      message: e.message || INTERNAL_ERROR.message,
    };

    ctx.log.warn(
      { req: ctx, res: ctx, event: 'response' },
      'Request failed',
    );
  }
};
