const proxy = require('proxyquire').noCallThru();
const sinon = require('sinon');

const UsersController = {};

describe('users/handlers:joinRequest:create', () => {
  let sandbox;
  let next;
  let req;
  let res;
  let handlers;
  let Errors;

  before(() => {
    sandbox = sinon.createSandbox();
    UsersController.createJoinRequest = sandbox.stub();
    UsersController.loadJoinRequest = sandbox.stub();
    Errors = {
      NoRequestToJoinFound: new Error(),
    };
    handlers = proxy('../../../../users/handlers/createJoinRequest', {
      '../controller': UsersController,
      '../errors': Errors,
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
      status: sandbox.stub().returnsThis(),
    };
  });
  it('should continue if the combination of user/dojo doesnt exists', async () => {
    req.params = {
      userId: 'userId1',
    };
    req.body = {
      userType: 'champion',
      dojoId: 'd1',
    };
    UsersController.loadJoinRequest.rejects(Errors.NoRequestToJoinFound);
    await handlers[0](req, res, next);
    expect(UsersController.loadJoinRequest).to.have.been.calledOnce.and
      .calledWith({ userId: 'userId1', dojoId: 'd1' });
    expect(next).to.have.been.calledOnce;
  });
  it('should return a 409 with the request to join if the combination exists already', async () => {
    req.params = {
      userId: 'userId1',
    };
    req.body = {
      userType: 'champion',
      dojoId: 'd1',
    };
    UsersController.loadJoinRequest.resolves({ id: 'm1' });
    await handlers[0](req, res, next);
    expect(UsersController.loadJoinRequest).to.have.been.calledOnce.and
      .calledWith({ userId: 'userId1', dojoId: 'd1' });
    expect(res.status).to.have.been.calledOnce.and
      .calledWith(409);
    expect(res.send).to.have.been.calledOnce.and
      .calledWith({ id: 'm1' });
  });

  it('should create the join request', async () => {
    req.params = {
      userId: 'userId1',
    };
    req.body = {
      userType: 'champion',
      dojoId: 'd1',
    };
    await handlers[1](req, res, next);
    expect(UsersController.createJoinRequest).to.have.been.calledOnce.and
      .calledWith('userId1', 'champion', 'd1');
  });
});
