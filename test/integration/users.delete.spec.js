const request = require('supertest');

describe.only('integration:users:delete', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });

  it('should return the soft-deleted user without cascade', async () => {
    const res = await request(app)
      .delete('/users/e6bc11aa-b3e4-486e-9746-6472fd829904')
      .send({ soft: true, cascade: false })
      .set('Accept', 'application/json')
      .expect(200);
  });
  it('should return the soft-deleted user', async () => {
    const res = await request(app)
      .delete('/users/e6bc11aa-b3e4-486e-9746-6472fd829904')
      .send({ soft: true })
      .set('Accept', 'application/json')
      .expect(200);
  });
  it('should return 200 on hard delete without cascade', async () => {
    const res = await request(app)
      .delete('/users/a9c0f005-aeaa-4f9f-a495-0c2c52cffccf')
      .send({ cascade: false })
      .set('Accept', 'application/json')
      .expect(200);
  });
  it('should return 200 on hard delete with cascade', async () => {
    const res = await request(app)
      .delete('/users/e6bc11aa-b3e4-486e-9746-6472fd829904')
      .set('Accept', 'application/json')
      .expect(200);
    await request(app)
      .get('/users/5792635c-63e5-4a56-afdb-284c07cd75b8')
      .expect(404);
  });
  it('should return 404 if the id doesn\'t exists', async () => {
     const res = await request(app)
      .delete('/users/a5d60790-17c4-4a86-a023-d1558b666666')
      .set('Accept', 'application/json')
      .expect(404);
    expect(res.text).to.equal('Invalid userId');
  })
});

