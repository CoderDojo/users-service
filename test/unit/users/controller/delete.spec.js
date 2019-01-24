const sinon = require('sinon');
const proxy = require('proxyquire');

describe('users/controller:delete', () => {
  let sandbox;
  let queryBuilder;
  let userController;
  before(() => {
    sandbox = sinon.createSandbox();
  });
  beforeEach(() => {
    sandbox.reset();
    queryBuilder = {
      where: sandbox.stub().returnsThis(),
      allowEager: sandbox.stub().returnsThis(),
      eager: sandbox.stub().returnsThis(),
      softDelete: sandbox.stub().returnsThis(),
      delete: sandbox.stub().returnsThis(),
      findById: sandbox.stub(),
      returning: sandbox.stub(),
    };
    userController = proxy('../../../../users/controller', {
      './models/UserModel': {
        query: sandbox.stub().returns(queryBuilder),
      },
    });
  });
  describe('hardDelete', () => {
    it('should delete a single user when cascade is off', async () => {
      const cascade = false;
      const $query = sandbox.stub().returns(queryBuilder);
      const hasChildren = sandbox.stub().returns(true);
      queryBuilder.findById.onCall(0).resolves({ id: 'userId1', profile: { children: ['childrenUserId1'], $query, hasChildren }, $query });
      await userController.delete('userId1', cascade, queryBuilder);
      expect(queryBuilder.eager).to.have.been.calledOnce.and.calledWith('profile');
      expect(queryBuilder.findById).to.have.been.calledOnce.and.calledWith('userId1');
      expect(queryBuilder.delete).to.have.been.calledTwice;
      expect(queryBuilder.delete.getCall(0)).to.have.been.calledWith();
      expect(queryBuilder.delete.getCall(1)).to.have.been.calledWith();
    });
    it('should delete a single user when cascade is on and there is no children', async () => {
      const cascade = true;
      const $query = sandbox.stub().returns(queryBuilder);
      const hasChildren = sandbox.stub().returns(false);
      queryBuilder.findById.onCall(0).resolves({ id: 'userId1', profile: { children: null, $query, hasChildren }, $query });
      await userController.delete('userId1', cascade, queryBuilder);
      expect(queryBuilder.eager).to.have.been.calledOnce.and.calledWith('profile');
      expect(queryBuilder.findById).to.have.been.calledOnce.and.calledWith('userId1');
      expect(queryBuilder.delete).to.have.been.calledTwice;
      expect(queryBuilder.delete.getCall(0)).to.have.been.calledWith();
      expect(queryBuilder.delete.getCall(1)).to.have.been.calledWith();
    });

    it('should delete multiple users when cascade is on and there are children', async () => {
      const cascade = true;
      const spy = sandbox.spy(userController, 'delete');
      const $query = sandbox.stub().returns(queryBuilder);
      const hasChildren = sandbox.stub().returns(true);
      queryBuilder.findById.onCall(0).resolves({ id: 'userId1', profile: { children: ['childrenUserId1'], $query, hasChildren }, $query });
      queryBuilder.findById.onCall(1).resolves({ id: 'childrenUserId', profile: { children: null, $query, hasChildren }, $query });
      await userController.delete('userId1', cascade, queryBuilder);
      expect(queryBuilder.eager).to.have.been.calledTwice.and.calledWith('profile');
      expect(queryBuilder.findById).to.have.been.calledTwice;
      expect(queryBuilder.findById.getCall(0)).to.have.been.calledWith('userId1');
      expect(queryBuilder.findById.getCall(1)).to.have.been.calledWith('childrenUserId1');
      expect(queryBuilder.delete).to.have.callCount(4);
      expect(queryBuilder.delete.getCall(0)).to.have.been.calledWith();
      expect(queryBuilder.delete.getCall(1)).to.have.been.calledWith();
      expect(queryBuilder.delete.getCall(2)).to.have.been.calledWith();
      expect(queryBuilder.delete.getCall(3)).to.have.been.calledWith();
      expect(spy).to.have.been.calledTwice;
    });
  });
  describe('softDelete', () => {
    it('should delete a single user when cascade is off', async () => {
      const $query = sandbox.stub().returns(queryBuilder);
      const hasChildren = sandbox.stub().returns(true);
      queryBuilder.returning.onCall(0).resolves([{ id: 'userId1', profile: { children: ['childrenUserId1'], $query } }]);
      queryBuilder.returning.onCall(1).resolves({ children: ['childrenUserId1'], hasChildren });
      await userController.softDelete('userId1', false, queryBuilder);
      expect(queryBuilder.allowEager).to.have.been.calledOnce.and.calledWith('[profile]');
      expect(queryBuilder.eager).to.have.been.calledOnce.and.calledWith('profile');
      expect(queryBuilder.where).to.have.been.calledOnce.and.calledWith({ id: 'userId1' });
      expect(queryBuilder.softDelete).to.have.been.calledTwice;
    });
    it('should delete a single user when cascade is on and there is no children', async () => {
      const $query = sandbox.stub().returns(queryBuilder);
      const hasChildren = sandbox.stub().returns(false);
      queryBuilder.returning.onCall(0).resolves([{ id: 'userId1', profile: { children: null, $query } }]);
      queryBuilder.returning.onCall(1).resolves({ children: null, hasChildren });
      await userController.softDelete('userId1', true, queryBuilder);
      expect(queryBuilder.allowEager).to.have.been.calledOnce.and.calledWith('[profile]');
      expect(queryBuilder.eager).to.have.been.calledOnce.and.calledWith('profile');
      expect(queryBuilder.where).to.have.been.calledOnce.and.calledWith({ id: 'userId1' });
      expect(queryBuilder.softDelete).to.have.been.calledTwice;
    });
    it('should delete multiple users when cascade is on and there are children', async () => {
      const $query = sandbox.stub().returns(queryBuilder);
      const spy = sandbox.spy(userController, 'softDelete');
      const hasChildren = sandbox.stub().returns(true);
      // Adult profile
      queryBuilder.returning.onCall(0).resolves([{ id: 'userId1', profile: { children: ['childrenUserId1'], $query } }]);
      queryBuilder.returning.onCall(1).resolves({ children: ['childrenUserId1'], hasChildren });
      // Child profile
      queryBuilder.returning.onCall(2).resolves([{ id: 'childrenUserId1', profile: { $query } }]);
      queryBuilder.returning.onCall(3).resolves({ hasChildren });
      await userController.softDelete('userId1', true, queryBuilder);
      expect(queryBuilder.allowEager).to.have.been.calledTwice;
      expect(queryBuilder.allowEager.getCall(0)).to.have.been.calledWith('[profile]');
      expect(queryBuilder.allowEager.getCall(1)).to.have.been.calledWith('[profile]');
      expect(queryBuilder.eager).to.have.been.calledTwice;
      expect(queryBuilder.eager.getCall(0)).to.have.been.calledWith('profile');
      expect(queryBuilder.eager.getCall(1)).to.have.been.calledWith('profile');
      expect(queryBuilder.where).to.have.been.calledTwice;
      expect(queryBuilder.where.getCall(0)).to.have.been.calledWith({ id: 'userId1' });
      expect(queryBuilder.where.getCall(1)).to.have.been.calledWith({ id: 'childrenUserId1' });
      expect(queryBuilder.softDelete).to.have.been.callCount(4);
      // One for our call, one for the child account
      expect(spy).to.have.been.calledTwice;
      expect(spy.getCall(1)).to.have.been.calledWith('childrenUserId1', false);
    });
  });
});
