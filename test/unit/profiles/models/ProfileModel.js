const proxy = require('proxyquire');

describe('ProfileModel', () => {
  const sandbox = sinon.createSandbox();
  const Model = class {};
  const AvatarModel = class {};
  let ProfileModel;
  beforeEach(() => {
    sandbox.reset();
    sandbox.restore();
    ProfileModel = proxy('../../../../profiles/models/ProfileModel', {
      objection: {
        Model,
        QueryBuilder: class { },
      },
      './AvatarModel': AvatarModel,
    });
  });
  describe('softDelete', () => {
    it('should define softDelete', () => {
      const qB = new ProfileModel.QueryBuilder();
      expect(qB.softDelete).to.be.an('function');
    });
    it('should call patch', async () => {
      const qB = new ProfileModel.QueryBuilder();
      qB.patch = sandbox.stub();
      qB.runAfter = sandbox.stub();
      await qB.softDelete();
      expect(qB.patch).to.have.been.calledOnce.and.calledWith({
        email: null,
        lastEdited: sinon.match.date,
        name: '',
        lastName: '',
        firstName: '',
        alias: '',
        badges: [],
        linkedin: '',
        twitter: '',
        phone: '',
      });
    });
    it('should run deletion of avatar', async () => {
      const qB = new ProfileModel.QueryBuilder();
      qB.patch = sandbox.stub();
      qB.runAfter = sandbox.stub();
      await qB.softDelete();
      expect(qB.runAfter).to.have.been.calledOnce;
    });
  });
  describe('removeChild', () => {
    it('should define removeChild', () => {
      const qB = new ProfileModel.QueryBuilder();
      expect(qB.removeChild).to.be.an('function');
    });
    it('should call patch', async () => {
      const qB = new ProfileModel.QueryBuilder();
      qB.patch = sandbox.stub();
      await qB.removeChild([1, 2, 3], 2);
      expect(qB.patch).to.have.been.calledOnce.and.calledWith({
        children: [1, 3],
      });
    });
  });
  describe('afterDelete', () => {
    it('should get the avatar and delete it', async () => {
      Model.prototype.$afterDelete = sandbox.stub();
      const deleteAvatar = sandbox.stub(AvatarModel.prototype, 'delete');
      const getAvatarSpy = sandbox.spy(ProfileModel.prototype, 'getAvatar');
      const profile = new ProfileModel();
      profile.avatar = {
        oid: 'avatar1',
      };
      await profile.$afterDelete();
      expect(getAvatarSpy).to.have.been.calledOnce;
      expect(deleteAvatar).to.have.been.calledOnce;
      expect(Model.prototype.$afterDelete).to.have.been.calledOnce;
    });
    it('should do nothing if there is no avatar', async () => {
      Model.prototype.$afterDelete = sandbox.stub();
      const deleteAvatar = sandbox.stub(AvatarModel.prototype, 'delete');
      const getAvatarSpy = sandbox.spy(ProfileModel.prototype, 'getAvatar');
      const profile = new ProfileModel();
      profile.avatar = {};
      await profile.$afterDelete();
      expect(getAvatarSpy).to.have.not.been.called;
      expect(deleteAvatar).to.have.not.been.called;
      expect(Model.prototype.$afterDelete).to.have.been.calledOnce;
    });
  });
});
