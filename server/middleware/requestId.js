const uuidV4 = require('uuid/v4');

const { REQUEST_ID_HEADER } = require('../constants');

module.exports = (options = {}) => {
  const {
    header = REQUEST_ID_HEADER,
    propertyName = 'reqId',
    generator = uuidV4,
  } = options;

  return async function requestId(ctx, next) {
    const reqId = ctx.request.get(header) || generator();
    ctx.state[propertyName] = reqId;
    ctx.set(header, reqId);
    await next();
  };
};
