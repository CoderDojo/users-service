const request = require('supertest');

describe.only('integration:joinRequests:delete', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });
  it('should return 200', async () => {
    await request(app)
      .delete('/users/a5d60790-17c4-4a86-a023-d1558b06f118/join_requests/k_ykWBUHv')
      .set('Accept', 'application/json')
      .expect(200);
  });
  it('should return 404 when the id doesn\'t match', async () => {
    await request(app)
      .delete('/users/a5d60790-17c4-4a86-a023-d1558b06f118/join_requests/x_qsdsqd')
      .set('Accept', 'application/json')
      .expect(404);
  });
});

