const axios = require('axios');
const querystring = require('querystring');

const config = require('../../config');

class SmsService {
  constructor({ logger, redis, utils }) {
    this.logger = logger;
    this.redis = redis;
    this.utils = utils;
  }

  sendSms(mobile, content, sign = '【椰子壳】') {
    const message = `${content}${sign}`;
    this.logger.info(`send ${message} to ${mobile}`);

    if (config.env !== 'production') {
      this.logger.warn(`not really send the sms for env: ${config.env}`);
      return Promise.resolve({ error: 0 });
    }

    return axios.post('http://sms-api.luosimao.com/v1/send.json', querystring.stringify({
      mobile,
      message,
    }), {
      auth: {
        username: 'api',
        password: '529a388a963b344ad163b33575360eee',
      },
    }).then((res) => {
      const { data } = res;
      this.logger.info('result from external sms service', data);
      return data;
    });
  }

  saveCaptcha(mobile, captcha) {
    return this.redis.setAsync(mobile, JSON.stringify({ captcha, count: 0 }), 'EX', 1800);
  }

  async verifyCaptcha(mobile, captcha) {
    const value = await this.redis.getAsync(mobile);
    if (!value) {
      throw new this.utils.ApiError(this.utils.getErrorMessage('captchaNotFound', 'captchaNotFound'), 403, 'auth:miss_captcha');
    }
    const doc = JSON.parse(value);
    if (doc.count > 5) {
      this.redis.del(mobile);
      throw new this.utils.ApiError(this.utils.getErrorMessage('captchaNotFound', 'captchaNotFound'), 403, 'auth:captcha_too_many_fail');
    }

    if (doc.captcha !== captcha) {
      doc.count += 1;
      await this.redis.setAsync(mobile, JSON.stringify(doc), 'EX', 1800);
      throw new this.utils.ApiError(this.utils.getErrorMessage('captchaNotMatch', 'captchaNotMatch'), 403, 'auth:captcha_not_match');
    }

    this.redis.del(mobile);
    return true;
  }
}

module.exports = SmsService;
