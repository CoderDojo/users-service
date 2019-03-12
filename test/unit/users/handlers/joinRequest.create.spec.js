const proxy = require('proxyquire').noCallThru();
const sinon = require('sinon');

const UsersController = {};

describe('users/handlers:joinRequest:create', () => {
  let sandbox;
  let next;
  let req;
  let res;
  let handlers;

  before(() => {
    sandbox = sinon.createSandbox();
    UsersController.createJoinRequest = sandbox.stub();
    handlers = proxy('../../../../users/handlers/createJoinRequest', {
      '../controller': UsersController,
    });
    next = sandbox.stub();
  });
  beforeEach(() => {
    sandbox.reset();
    req = {
      params: {},
      body: {},
    };
    res = {
      send: sandbox.stub(),
    };
  });
  it('should create the join request', async () => {
    req.params = {
      userId: 'userId1',
    };
    req.body = {
      userType: 'champion',
      dojoId: 'd1',
    };
    await handlers[0](req, res, next);
    expect(UsersController.createJoinRequest).to.have.been.calledOnce.and
      .calledWith('userId1', 'champion', 'd1');
  });
});
