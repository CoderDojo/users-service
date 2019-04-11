const proxy = require('proxyquire').noCallThru();
const sinon = require('sinon');

const UsersController = {};
describe('users/handlers:joinRequest:load', () => {
  let sandbox;
  let next;
  let req;
  let res;
  let handlers;
  let Errors;

  before(() => {
    sandbox = sinon.createSandbox();
    UsersController.loadJoinRequest = sandbox.stub();
    Errors = {
      NoRequestToJoinFound: new Error(),
    };
    handlers = proxy('../../../../users/handlers/loadJoinRequest', {
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
  it('should load the join request', async () => {
    req.params = {
      id: 'req1',
    };
    UsersController.loadJoinRequest.resolves({ id: 'req1' });
    await handlers[0](req, res, next);
    expect(UsersController.loadJoinRequest).to.have.been.calledOnce.and
      .calledWith({ id: 'req1' });
    expect(res.send).to.have.been.calledWith({ id: 'req1' });
  });
  it('should return an error if the join request is not found', async () => {
    req.params = {
      id: 'req1',
    };
    UsersController.loadJoinRequest.throws(Errors.NoRequestToJoinFound);
    await handlers[0](req, res, next);
    expect(UsersController.loadJoinRequest).to.have.been.calledOnce.and
      .calledWith({ id: 'req1' });
    expect(next).to.have.been.calledOnce.and.calledWith(Errors.NoRequestToJoinFound);
  });
});
