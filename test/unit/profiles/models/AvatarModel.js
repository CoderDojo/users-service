const proxy = require('proxyquire');

describe('AvatarModel', () => {
  const sandbox = sinon.createSandbox();
  const Model = class {};
  const LargeObjectManager = class {};
  let AvatarModel;
  let client;
  beforeEach(() => {
    sandbox.reset();
    sandbox.restore();
    client = {
      acquireConnection: sandbox.stub().resolves({}),
      releaseConnection: sandbox.stub(),
    };
    LargeObjectManager.prototype.unlink = sandbox.stub();
    AvatarModel = proxy('../../../../profiles/models/AvatarModel', {
      objection: {
        Model,
      },
      'pg-large-object': {
        LargeObjectManager,
      },
    });
  });
  describe('delete', () => {
    it('should acquire a connection', async () => {
      Model.knex = sandbox.stub().returns({ client });
      const avatar = new AvatarModel(1);
      await avatar.delete();
      expect(Model.knex).to.have.been.calledOnce;
      expect(client.acquireConnection).to.have.been.calledOnce;
      expect(client.releaseConnection).to.have.been.calledOnce.and.calledWith();
    });
    it('should unlink the avatar by its oid', async () => {
      Model.knex = sandbox.stub().returns({ client });
      const avatar = new AvatarModel(1);
      await avatar.delete();
      expect(LargeObjectManager.prototype.unlink).to.have.been.calledOnce.and.calledWith(1);
    });
  });
  describe('constructor', () => {
    it('should assign the oid to the instance', () => {
      const avatar = new AvatarModel(1);
      expect(avatar.oid).to.equal(1);
    });
  });
});
