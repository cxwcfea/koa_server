class SmsController {
  constructor({ utils, logger, smsService }) {
    this.utils = utils;
    this.logger = logger;
    this.smsService = smsService;
    this.generateCaptcha = utils.generateCaptcha.bind(this, 6);
  }

  async sendCaptcha(ctx) {
    const { mobile } = ctx.state.reqParams;
    const captcha = this.generateCaptcha();

    await this.smsService.saveCaptcha(mobile, captcha);
    const result = await this.smsService.sendSms(mobile, `验证码${captcha},三十分钟内有效`);
    if (result.error !== 0) {
      throw new this.utils.ApiError(result.msg, 400, 'external:error');
    }
    ctx.status = 204;
  }
}

module.exports = SmsController;
