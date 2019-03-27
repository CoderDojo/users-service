const request = require('supertest');

describe('integration:joinRequests:load', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });
  it('should return the join request', async () => {
    const res = await request(app)
      .get('/join_requests/SEEK32r4B')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body.id).to.equal('SEEK32r4B');
    expect(res.body.dojoId).to.equal('338ad4a9-de9a-461c-8af1-359658cfab12');
    expect(res.body.userId).to.equal('57793065-2d8e-42f5-ab8e-be6b0bb5b4f0');
  });

  it('should return 404', async () => {
    await request(app)
      .get('/join_requests/k_ykWBAAa')
      .set('Accept', 'application/json')
      .expect(404);
  });
});

