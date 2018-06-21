const supertest = require('supertest');
const { expect } = require('chai');
const server = require('../server/server');

describe('index', () => {
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

  describe('GET /api/ping', () => {
    it('<200> should always return with the API server information', async () => {
      const res = await request
        .get('/api/ping')
        .expect('Content-Type', /json/)
        .expect(200);

      const { message } = res.body;
      expect(message).to.eq('Server is running');
    });
  });
});
