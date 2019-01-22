const request = require('supertest');
const UserModel = require('../../users/models/UserModel.js');
const ProfileModel = require('../../profiles/models/ProfileModel.js');

describe('integration:users:get', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });

  it('should return only the user', async () => {
    const res = await request(app)
      .get('/users?email=hooman@test.com')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body).to.have.keys(UserModel.publicFields);
    expect(res.body.profile).to.not.exist;
  });

  it('should return the user and its profile', async () => {
    const res = await request(app)
      .get('/users?email=hooman@test.com&related=[profile]')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body).to.have.keys(UserModel.publicFields.concat(['profile']));
    expect(res.body.profile).to.have.keys(ProfileModel.publicFields);
  });
  it('should return 404', async () => {
    const res = await request(app)
      .get('/users?email=doesnt-exists@test.com')
      .set('Accept', 'application/json')
      .expect(404);
  });
});

