const proxy = require('proxyquire').noCallThru();
const sinon = require('sinon');

const UsersController = {};

describe('users/handlers:joinRequest:delete', () => {
  let sandbox;
  let next;
  let req;
  let res;
  let handlers;

  before(() => {
    sandbox = sinon.createSandbox();
    UsersController.loadJoinRequest = sandbox.stub();
    UsersController.deleteJoinRequest = sandbox.stub();
    handlers = proxy('../../../../users/handlers/deleteJoinRequest', {
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
      sendStatus: sandbox.stub(),
    };
  });
  it('should check if the join request exists', async () => {
    req.params = {
      userId: 'userId1',
      id: 'jr1',
    };
    UsersController.loadJoinRequest.resolves();
    await handlers[0](req, res, next);
    expect(UsersController.loadJoinRequest).to.have.been.calledOnce.and
      .calledWith({ id: 'jr1' });
    expect(next).to.have.been.calledOnce;
  });
  it('should throw if the join request doesnt exists', async () => {
    req.params = {
      userId: 'userId1',
      id: 'jr1',
    };
    UsersController.loadJoinRequest.throws(new Error('bla'));
    await handlers[0](req, res, next);
    expect(UsersController.loadJoinRequest).to.have.been.calledOnce.and
      .calledWith({ id: 'jr1' });
    expect(next).to.have.been.calledOnce;
    expect(next.getCall(0).args[0]).to.be.an('error');
  });
  it('should delete the join request', async () => {
    req.params = {
      userId: 'userId1',
      id: 'jr1',
    };
    UsersController.deleteJoinRequest.resolves();
    await handlers[1](req, res, next);
    expect(UsersController.deleteJoinRequest).to.have.been.calledOnce.and
      .calledWith('userId1', 'jr1');
    expect(res.sendStatus).to.have.been.calledOnce.and.calledWith(200);
  });
});
