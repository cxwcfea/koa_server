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

  namePasswd(ctx, next) {
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
      ctx.throw(400, message, { code: 'auth:params_error' });
    }
    ctx.state.reqParams = value;
    return next();
  }

  mobilePasswd(ctx, next) {
    const schema = {
      mobile: this.validator.string().trim().regex(this.utils.regex.mobile).required(),
      password: this.validator.string().min(8).max(32).required(),
    };
    const { error, value } = this.validator.validate(ctx.request.body, schema);
    if (error) {
      const message = this.utils
        .getErrorMessage(error.details[0].path[0], error.details[0].message);
      ctx.throw(400, message, { code: 'auth:params_error' });
    }
    ctx.state.reqParams = { name: value.mobile, password: value.password };
    return next();
  }
}

module.exports = AuthValidator;
