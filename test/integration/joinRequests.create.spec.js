const request = require('supertest');

describe('integration:joinRequests:create', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });
  it('should return 200', async () => {
    const res = await request(app)
      .post('/users/a5d60790-17c4-4a86-a023-d1558b06f118/join_requests')
      .send({
        dojoId: '571b783c-7378-47f0-a1ee-4e0e9d135349',
        userType: 'champion',
      })
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body).to.have.keys(['dojoId', 'timestamp', 'userType', 'id', 'userId']);
  });
  it('should return 409 on duplicate', async () => {
    const res = await request(app)
      .post('/users/a5d60790-17c4-4a86-a023-d1558b06f118/join_requests')
      .send({
        dojoId: '571b783c-7378-47f0-a1ee-4e0e9d135349',
        userType: 'champion',
      })
      .set('Accept', 'application/json')
      .expect(409);
    expect(res.body).to.have.keys(['dojoId', 'timestamp', 'userType', 'id', 'userId']);
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

