const proxy = require('proxyquire').noCallThru();
const sinon = require('sinon');

const UsersController = {};

describe('users/handlers:search', () => {
  let sandbox;
  let next;
  let req;
  let res;
  let handlers;

  before(() => {
    sandbox = sinon.createSandbox();
    handlers = proxy('../../../../users/handlers/search', {
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
  it('should load the user by its email', async () => {
    req.query = {
      email: 'user@example.com',
    };
    UsersController.load = sandbox.stub().resolves({ id: '123' });
    await handlers[0](req, res, next);
    expect(UsersController.load).to.have.been.calledOnce.and.calledWith({ email: 'user@example.com' }, undefined);
    expect(res.send).to.have.been.calledOnce.and.calledWith({ results: [{ id: '123' }], total: 1 });
  });
  it('should load the user by its email and require related fields', async () => {
    req.query = {
      email: 'user@example.com',
      related: 'profile',
    };
    UsersController.load = sandbox.stub().resolves({ id: '123', profile: {} });
    await handlers[0](req, res, next);
    expect(UsersController.load).to.have.been.calledOnce.and.calledWith({ email: 'user@example.com' }, 'profile');
    expect(res.send).to.have.been.calledOnce.and.calledWith({ results: [{ id: '123', profile: {} }], total: 1 });
  });
  it('should return the error', async () => {
    req.query = {
      email: 'user@example.com',
    };
    const err = new Error('bla');
    UsersController.load = sandbox.stub().throws(err);
    await handlers[0](req, res, next);
    expect(UsersController.load).to.have.been.calledOnce.and.calledWith({ email: 'user@example.com' }, undefined);
    expect(next).to.have.been.calledOnce.and.calledWith(err);
    expect(res.send).to.not.have.been.called;
  });
  it('should hide 404', async () => {
    req.query = {
      email: 'user@example.com',
    };
    const err = new Error('bla');
    err.status = 404;
    UsersController.load = sandbox.stub().throws(err);
    await handlers[0](req, res, next);
    expect(UsersController.load).to.have.been.calledOnce.and.calledWith({ email: 'user@example.com' }, undefined);
    expect(next).to.not.have.been.called;
    expect(res.send).to.have.been.calledOnce.and.calledWith({ results: [], total: 0 });
  });
});
