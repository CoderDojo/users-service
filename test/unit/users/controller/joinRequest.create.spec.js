const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe.only('users/controller:joinRequest:create', () => {
  let JRModel;
  let UserModel;
  let sandbox;
  let create;
  before(() => {
    sandbox = sinon.createSandbox();
  });
  beforeEach(() => {
    sandbox.reset();
    JRModel = { create: sandbox.stub().returns({ id: 'jr1' }) };
    UserModel = {
      query: sandbox.stub().returnsThis(),
      findOne: sandbox.stub(),
      patch: sandbox.stub(),
    };
    const ctrl = proxyquire('../../../../users/controller', {
      './models/UserModel': UserModel,
      './models/JoinRequest': JRModel,
    });
    create = ctrl.createJoinRequest;
  });
  it('should append a new join request', async () => {
    UserModel.findOne.resolves({
      id: 1,
      joinRequest: [],
      $query: sandbox.stub().returns(UserModel),
    });
    const res = await create(1, 'champion', 'dojo1');
    expect(JRModel.create).to.have.been.calledOnce.and
      .calledWith('champion', 'dojo1');
    expect(UserModel.findOne).to.have.been.calledOnce.and
      .calledWith({ id: 1 });
    expect(UserModel.patch).to.have.been.calledOnce.and
      .calledWith({ joinRequests: [{ id: 'jr1' }] });
    expect(res).to.eql({ id: 'jr1' });
  });
  it('should set an empty array when its not set', async () => {
    // Variance is within the userModel return value
    // There is no value for joinRequests
    UserModel.findOne.resolves({
      id: 1,
      $query: sandbox.stub().returns(UserModel),
    });
    const res = await create(1, 'champion', 'dojo1');
    expect(JRModel.create).to.have.been.calledOnce.and
      .calledWith('champion', 'dojo1');
    expect(UserModel.findOne).to.have.been.calledOnce.and
      .calledWith({ id: 1 });
    expect(UserModel.patch).to.have.been.calledOnce.and
      .calledWith({ joinRequests: [{ id: 'jr1' }] });
    expect(res).to.eql({ id: 'jr1' });
  });
  it('should append to an existing join requests', async () => {
    // Variance is within the userModel return value
    // There is no value for joinRequests
    UserModel.findOne.resolves({
      id: 1,
      joinRequests: [{ id: 'jrAlpha' }],
      $query: sandbox.stub().returns(UserModel),
    });
    const res = await create(1, 'champion', 'dojo1');
    expect(JRModel.create).to.have.been.calledOnce.and
      .calledWith('champion', 'dojo1');
    expect(UserModel.findOne).to.have.been.calledOnce.and
      .calledWith({ id: 1 });
    expect(UserModel.patch).to.have.been.calledOnce.and
      .calledWith({ joinRequests: [{ id: 'jrAlpha' }, { id: 'jr1' }] });
    expect(res).to.eql({ id: 'jr1' });
  });
});
