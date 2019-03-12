const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('users/controller:joinRequest:delete', () => {
  let UserModel;
  let sandbox;
  let deleteJR;
  before(() => {
    sandbox = sinon.createSandbox();
  });
  beforeEach(() => {
    sandbox.reset();
    UserModel = {
      query: sandbox.stub().returnsThis(),
      findOne: sandbox.stub(),
      patch: sandbox.stub(),
    };
    const ctrl = proxyquire('../../../../users/controller', {
      './models/UserModel': UserModel,
    });
    deleteJR = ctrl.deleteJoinRequest;
  });
  it('should remove the specified join request', async () => {
    UserModel.findOne.resolves({
      id: 1,
      joinRequests: [{ id: 'jrAlpha' }, { id: 'jr1' }],
      $query: sandbox.stub().returns(UserModel),
    });
    await deleteJR('u1', 'jr1');
    expect(UserModel.findOne).to.have.been.calledOnce.and
      .calledWith({ id: 'u1' });
    expect(UserModel.patch).to.have.been.calledOnce.and
      .calledWith({ joinRequests: [{ id: 'jrAlpha' }] });
  });
});
