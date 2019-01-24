const request = require('supertest');
const UserModel = require('../../users/models/UserModel.js');
const ProfileModel = require('../../profiles/models/ProfileModel.js');

describe('integration:users:load', () => {
  let app;

  beforeEach(() => {
    app = global.app;
  });
  it('should return only the user', async () => {
    const res = await request(app)
      .get('/users/a5d60790-17c4-4a86-a023-d1558b06f118')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body).to.have.keys(UserModel.publicFields);
    expect(res.body.id).to.equal('a5d60790-17c4-4a86-a023-d1558b06f118');
    expect(res.body.profile).to.not.exist;
  });
  it('should return the user and its profile', async () => {
    const res = await request(app)
      .get('/users/a5d60790-17c4-4a86-a023-d1558b06f118?related=[profile]')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body).to.have.keys(UserModel.publicFields.concat(['profile']));
    expect(res.body.id).to.equal('a5d60790-17c4-4a86-a023-d1558b06f118');
    expect(res.body.profile).to.have.keys(ProfileModel.publicFields);
    expect(res.body.profile.userId).to.equal('a5d60790-17c4-4a86-a023-d1558b06f118');
  });
  it('should return the user, its profile and its children', async () => {
    const res = await request(app)
      .get('/users/a5d60790-17c4-4a86-a023-d1558b06f118?related=[profile,children]')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res.body).to.have.keys(UserModel.publicFields.concat(['profile']));
    expect(res.body.id).to.equal('a5d60790-17c4-4a86-a023-d1558b06f118');
    expect(res.body.profile).to.have.keys(ProfileModel.publicFields.concat(['childrenProfiles']));
    expect(res.body.profile.userId).to.equal('a5d60790-17c4-4a86-a023-d1558b06f118');
    expect(res.body.profile.childrenProfiles[0]).to.have.keys(ProfileModel.publicFields);
  });

  it('should return 404', async () => {
    await request(app)
      .get('/users/a5d60790-17c4-4a86-a023-d1558b06f666')
      .set('Accept', 'application/json')
      .expect(404);
  });
});

