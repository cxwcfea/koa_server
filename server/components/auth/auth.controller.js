const { getErrorMessage } = require('../../utils');

class AuthController {
  constructor({
    logger,
    validator,
    authService,
  }) {
    this.logger = logger;
    this.validator = validator;
    this.authService = authService;
  }

  async register(ctx) {
    const schema = {
      name: this.validator
        .string()
        .trim()
        .min(3)
        .max(32)
        .required(),
      password: this.validator.string().min(8).max(32).required(),
    };
    const { error, value } = this.validator.validate(ctx.request.body, schema);
    if (error) {
      const message = getErrorMessage(error.details[0].path[0], error.details[0].message);
      ctx.throw(400, message, { code: 'auth:param_error' });
    }

    const token = await this.authService.register(value.name, value.password);
    ctx.body = { token };
  }

  async login(ctx) {
    const schema = {
      name: this.validator
        .string()
        .trim()
        .min(3)
        .max(32)
        .required(),
      password: this.validator.string().min(8).max(32).required(),
    };
    const { error, value } = this.validator.validate(ctx.request.body, schema);
    if (error) {
      const message = getErrorMessage(error.details[0].path[0], error.details[0].message);
      ctx.throw(400, message, { code: 'auth:param_error' });
    }

    const token = await this.authService.login(value.name, value.password);
    ctx.body = { token };
  }
}

module.exports = AuthController;
