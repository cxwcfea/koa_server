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
}

module.exports = AuthController;
