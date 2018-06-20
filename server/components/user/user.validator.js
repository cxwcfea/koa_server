class UserValidator {
  constructor({
    utils,
    logger,
    validator,
  }) {
    this.utils = utils;
    this.logger = logger;
    this.validator = validator;
  }

  profile(ctx, next) {
    const schema = {
      name: this.validator.string().trim().min(3).max(32),
      email: this.validator.string().email(),
      gender: this.validator.number().valid([1, 2]),
      birth: this.validator
        .date()
        .min('1-1-1900')
        .max('now')
        .timestamp()
        .raw(),
      avatar: this.validator.string().uri({
        scheme: ['http', 'https'],
      }),
      info: this.validator.string().min(5),
    };
    const { error, value } = this.validator.validate(ctx.request.body, schema);
    if (error) {
      ctx.throw(400, error.details[0].message, { code: 'common:invalid_param' });
    }
    ctx.state.reqParams = value;
    return next();
  }
}

module.exports = UserValidator;
