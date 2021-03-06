class SmsValidator {
  constructor({
    utils,
    logger,
    validator,
    smsService,
  }) {
    this.utils = utils;
    this.logger = logger;
    this.validator = validator;
    this.smsService = smsService;
    this.mobileSchema = {
      mobile: this.validator.string().trim().regex(this.utils.regex.mobile).required(),
    };
  }

  mobile(ctx, next) {
    const schema = this.mobileSchema;
    const { error, value } = this.validator.validate(ctx.request.query, schema);
    if (error) {
      const message = this.utils
        .getErrorMessage(error.details[0].path[0], error.details[0].message);
      ctx.throw(400, message, { code: 'auth:missing_mobile' });
    }
    ctx.state.reqParams = value;
    return next();
  }

  async verifyCaptcha(ctx, next) {
    const schema = {
      ...this.mobileSchema,
      captcha: this.validator.string().trim().regex(this.utils.regex.captcha).required(),
      password: this.validator.any().allow(),
    };
    const { error, value } = this.validator.validate(ctx.request.body, schema);
    if (error) {
      const message = this.utils
        .getErrorMessage(error.details[0].path[0], error.details[0].message);
      ctx.throw(400, message, { code: 'auth:params_error' });
    }

    delete ctx.request.body.captcha;
    ctx.state.reqParams = value;

    await this.smsService.verifyCaptcha(ctx.state.reqParams.mobile, ctx.state.reqParams.captcha);
    return next();
  }
}

module.exports = SmsValidator;
