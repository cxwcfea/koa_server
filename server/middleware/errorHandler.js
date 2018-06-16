const { INTERNAL_ERROR } = require('../constants/error');

module.exports = () => async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      error.code = 'db:validation';
      ctx.status = 400;
    } else {
      ctx.status = error.status || INTERNAL_ERROR.status;
    }

    ctx.type = 'application/json';
    ctx.body = {
      code: error.code || INTERNAL_ERROR.code,
      message: error.message || INTERNAL_ERROR.message,
    };

    ctx.log.warn(
      { error, event: 'error' },
      `Error occured on the request: ${ctx.state.reqId}`,
    );
  }
};
