const proxy = require('proxyquire').noCallThru();
const sinon = require('sinon');

const UsersController = {};

describe('users/handlers:delete', () => {
  let sandbox;
  let next;
  let req;
  let res;
  let handlers;

  before(() => {
    sandbox = sinon.createSandbox();
    UsersController.delete = sandbox.stub();
    UsersController.softDelete = sandbox.stub();
    UsersController.exists = sandbox.stub();
    handlers = proxy('../../../../users/handlers/delete', {
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
      locals: {},
      status: sandbox.stub().returns(res),
      send: sandbox.stub(),
      sendStatus: sandbox.stub(),
    };
  });
  it('should load the user', async () => {
    req.params = {
      id: 'userId1',
    };
    await handlers[0](req, res, next);
    expect(UsersController.exists).to.have.been.calledOnce.and.calledWith('userId1');
  });
  it('should return 404 when the user doesn\'t exists', async () => {
    req.params = {
      id: 'userId1',
    };
    req.body = {};
    const error = new Error();
    error.status = 404;
    UsersController.exists.throws(error);
    await handlers[0](req, res, next);
    expect(next).to.have.been.calledOnce;
    expect(next).to.have.been.calledWith(sinon.match.instanceOf(Error).and(sinon.match.has('status', 404)));
    expect(res.sendStatus).to.not.have.been.called;
  });

  it('should soft-delete the user', async () => {
    req.params = {
      id: 'userId1',
    };
    req.body = {
      soft: true,
    };
    UsersController.softDelete.resolves({ id: 'userId1' });
    await handlers[1](req, res, next);
    expect(UsersController.softDelete).to.have.been.calledOnce;
    expect(UsersController.softDelete).to.have.been.calledWith('userId1');
    expect(next).to.not.have.been.called;
    expect(res.sendStatus).to.have.been.calledWith(200);
  });
  it('should hard-delete the user', async () => {
    req.params = {
      id: 'userId1',
    };
    req.body = {};
    UsersController.delete.resolves({ id: 'userId1' });
    await handlers[1](req, res, next);
    expect(UsersController.delete).to.have.been.calledOnce;
    expect(UsersController.delete).to.have.been.calledWith('userId1');
    expect(next).to.not.have.been.called;
    expect(res.sendStatus).to.have.been.calledWith(200);
  });
});
