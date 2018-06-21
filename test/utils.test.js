const { expect } = require('chai');

const { generateCaptcha } = require('../server/utils');

describe('Utils', () => {
  before(() => {
  });

  after(() => {
  });

  describe('generateCaptcha', () => {
    it('should return a digital string which lengh match the specified value', () => {
      const captcha = generateCaptcha(7);

      expect(captcha).to.match(/^\d{7,7}$/);
    });
  });
});
