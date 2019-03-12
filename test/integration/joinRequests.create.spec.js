const request = require('supertest');

describe.only('integration:joinRequests:create', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });
  it('should return 200', async () => {
    const res = await request(app)
      .post('/users/a5d60790-17c4-4a86-a023-d1558b06f118/join_requests')
      .send({
        dojoId: '338ad4a9-de9a-461c-8af1-359658cfab12',
        userType: 'champion',
      })
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body).to.have.keys(['dojoId', 'timestamp', 'userType', 'id']);
  });
  it('should return 400 on unallowed userType', async () => {
    await request(app)
      .post('/users/a5d60790-17c4-4a86-a023-d1558b06f118/join_requests')
      .send({
        dojoId: '338ad4a9-de9a-461c-8af1-359658cfab12',
        userType: 'banana',
      })
      .set('Accept', 'application/json')
      .expect(400);
  });
});

