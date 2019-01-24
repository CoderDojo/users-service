const proxy = require('proxyquire');

describe('UserModel', () => {
  const sandbox = sinon.createSandbox();
  let UserModel;
  beforeEach(() => {
    sandbox.reset();
    UserModel = proxy('../../../../users/models/UserModel', {
      objection: {
        Model: class { },
        QueryBuilder: class { },
      },
    });
  });
  describe('softDelete', () => {
    it('should define softDelete', () => {
      const qB = new UserModel.QueryBuilder();
      expect(qB.softDelete).to.be.an('function');
    });
    it('should call patch', async () => {
      const qB = new UserModel.QueryBuilder();
      qB.patch = sandbox.stub();
      await qB.softDelete();
      expect(qB.patch).to.have.been.calledOnce.and.calledWith({
        active: false,
        nick: sinon.match(/deleted-account\+\d+@coderdojo.org/),
        email: sinon.match(/deleted-account\+\d+@coderdojo.org/),
        name: '',
        lastName: '',
        firstName: '',
        password: undefined,
      });
    });
  });
});
