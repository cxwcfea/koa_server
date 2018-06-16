class AuthValidator {
  constructor({
    utils,
    logger,
    validator,
  }) {
    this.utils = utils;
    this.logger = logger;
    this.validator = validator;
  }

  nameAndPasswd(ctx, next) {
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
      const message = this.utils
        .getErrorMessage(error.details[0].path[0], error.details[0].message);
      ctx.throw(400, message, { code: 'auth:param_error' });
    }
    ctx.state.reqParams = value;
    return next();
  }
}

module.exports = AuthValidator;