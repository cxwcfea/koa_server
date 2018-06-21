const supertest = require('supertest');
// const { expect } = require('chai');
const server = require('../../server');

describe('auth', () => {
  let request;
  let app;

  before(() => {
    app = server.listen();
    request = supertest(app);
  });

  after((done) => {
    server.cleanup();
    app.close(done);
  });

  describe('GET /api/auth/register', () => {
    it('A user should registered successfully', async () => {
      await request
        .get('/api/sms/captcha?mobile=13800138000')
        .expect(204);
    });
  });
});
