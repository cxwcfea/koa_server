const supertest = require('supertest');
const { expect } = require('chai');
const server = require('../server/server');

describe('Demo', () => {
  let request;
  let app;

  before(() => {
    app = server.listen();
    request = supertest(app);
  });

  after((done) => {
    app.close(done);
  });

  describe('GET /api/test', () => {
    it('<200> should always return with the API server information', async () => {
      const res = await request
        .get('/api/test')
        .expect('Content-Type', /json/)
        .expect(200);

      const { name } = res.body;
      expect(name).to.eq('Hello Koa');
    });
  });
});
