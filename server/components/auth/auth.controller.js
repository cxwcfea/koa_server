const { asValue } = require('awilix');

class AuthController {
  constructor({
    utils,
    logger,
    validator,
    authService,
  }) {
    this.utils = utils;
    this.logger = logger;
    this.validator = validator;
    this.authService = authService;
  }

  async register(ctx) {
    const token =
      await this.authService.register(ctx.state.reqParams.name, ctx.state.reqParams.password);
    ctx.body = { token };
  }

  async login(ctx) {
    const token =
      await this.authService.login(ctx.state.reqParams.name, ctx.state.reqParams.password);
    ctx.body = { token };
  }

  async authenticate(ctx, next) {
    const authHeader = ctx.headers.authorization;
    if (!authHeader) {
      throw new this.utils.ApiError('token must be supplied', 401, 'auth:no_auth_header');
    }
    const token = authHeader.split(' ')[1];
    const user = await this.authService.isAuthorized(token);
    ctx.state.container.register({
      currentUser: asValue(user),
    });
    return next();
  }

  async updatePassword(ctx) {
    await this.authService.updatePassword(ctx.state.reqParams.name, ctx.state.reqParams.password);
    ctx.status = 201;
  }
}

module.exports = AuthController;
