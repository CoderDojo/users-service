const sinon = require('sinon');
const proxy = require('proxyquire');

describe.only('users/controller:delete', () => {
  let queryBuilder;
  before(() => {
    sandbox = sinon.sandbox.create();
  });
  beforeEach(() => {
    sandbox.reset();
    queryBuilder = {
      where: sandbox.stub().returnsThis(),
      allowEager: sandbox.stub().returnsThis(),
      eager: sandbox.stub().returnsThis(),
      patch: sandbox.stub().returnsThis(),
      returning: sandbox.stub(),
    };
    userController = proxy('../../../../users/controller', {
      './models/UserModel': {
        query: sandbox.stub().returns(queryBuilder),    
      },
    });
  });
  describe('softDelete', () => {
    it('should delete a single user when cascade is off', async () => {
      const $query = sandbox.stub().returns(queryBuilder);
      const hasChildren = sandbox.stub().returns(true);
      queryBuilder.returning.onCall(0).resolves([{ id: 'userId1', profile: { children: ['childrenUserId1'], $query }}]);
      queryBuilder.returning.onCall(1).resolves({ children: ['childrenUserId1'], hasChildren });
      const res = await userController.softDelete('userId1', false, queryBuilder);
      expect(queryBuilder.allowEager).to.have.been.calledOnce.and.calledWith('[profile]');
      expect(queryBuilder.eager).to.have.been.calledOnce.and.calledWith('profile');
      expect(queryBuilder.where).to.have.been.calledOnce.and.calledWith({ id: 'userId1' });
      expect(queryBuilder.patch).to.have.been.calledTwice;
      expect(queryBuilder.patch.getCall(0)).to.have.been.calledWith({
        active: false,
        nick: 'deleted-account+userId1@coderdojo.org',
        email: 'deleted-account+userId1@coderdojo.org',
        name: '',
        firstName: '',
        lastName: '',
        password: undefined
      });
      expect(queryBuilder.patch.getCall(1)).to.have.been.calledWith({ 
        email: 'deleted-account+userId1@coderdojo.org',
        name: '',
        firstName: '',
        lastName: '',
        phone: '',
      });
    });
    it('should delete a single user when cascade is on and there is no children', async () => {
      const $query = sandbox.stub().returns(queryBuilder);
      const hasChildren = sandbox.stub().returns(false);
      queryBuilder.returning.onCall(0).resolves([{ id: 'userId1', profile: { children: null, $query }}]);
      queryBuilder.returning.onCall(1).resolves({ children: null, hasChildren });
      const res = await userController.softDelete('userId1', true, queryBuilder);
      expect(queryBuilder.allowEager).to.have.been.calledOnce.and.calledWith('[profile]');
      expect(queryBuilder.eager).to.have.been.calledOnce.and.calledWith('profile');
      expect(queryBuilder.where).to.have.been.calledOnce.and.calledWith({ id: 'userId1' });
      expect(queryBuilder.patch).to.have.been.calledTwice;
      expect(queryBuilder.patch.getCall(0)).to.have.been.calledWith({ 
        active: false,
        nick: 'deleted-account+userId1@coderdojo.org',
        email: 'deleted-account+userId1@coderdojo.org',
        name: '',
        firstName: '',
        lastName: '',
        password: undefined
      });
      expect(queryBuilder.patch.getCall(1)).to.have.been.calledWith({ 
        email: 'deleted-account+userId1@coderdojo.org',
        name: '',
        firstName: '',
        lastName: '',
        phone: '',
      });
    });
    it('should delete multiple users when cascade is on and there are children', async () => {
      const $query = sandbox.stub().returns(queryBuilder);
      const spy = sandbox.spy(userController, 'softDelete');
      const hasChildren = sandbox.stub().returns(true);
      // Adult profile
      queryBuilder.returning.onCall(0).resolves([{ id: 'userId1', profile: { children: ['childrenUserId1'], $query }}]);
      queryBuilder.returning.onCall(1).resolves({ children: ['childrenUserId1'], hasChildren });
      // Child profile
      queryBuilder.returning.onCall(2).resolves([{ id: 'childrenUserId1', profile: { $query }}]);
      queryBuilder.returning.onCall(3).resolves({ hasChildren });
      const res = await userController.softDelete('userId1', true, queryBuilder);
      expect(queryBuilder.allowEager).to.have.been.calledTwice;
      expect(queryBuilder.allowEager.getCall(0)).to.have.been.calledWith('[profile]');
      expect(queryBuilder.allowEager.getCall(1)).to.have.been.calledWith('[profile]');
      expect(queryBuilder.eager).to.have.been.calledTwice;
      expect(queryBuilder.eager.getCall(0)).to.have.been.calledWith('profile');
      expect(queryBuilder.eager.getCall(1)).to.have.been.calledWith('profile');
      expect(queryBuilder.where).to.have.been.calledTwice;
      expect(queryBuilder.where.getCall(0)).to.have.been.calledWith({ id: 'userId1' });
      expect(queryBuilder.where.getCall(1)).to.have.been.calledWith({ id: 'childrenUserId1' });
      expect(queryBuilder.patch).to.have.been.callCount(4);
      expect(queryBuilder.patch.getCall(0)).to.have.been.calledWith({ 
        active: false,
        nick: 'deleted-account+userId1@coderdojo.org',
        email: 'deleted-account+userId1@coderdojo.org',
        name: '',
        firstName: '',
        lastName: '',
        password: undefined
      });
      expect(queryBuilder.patch.getCall(1)).to.have.been.calledWith({ 
        email: 'deleted-account+userId1@coderdojo.org',
        name: '',
        firstName: '',
        lastName: '',
        phone: '',
      });
      expect(queryBuilder.patch.getCall(2)).to.have.been.calledWith({ 
        active: false,
        nick: 'deleted-account+childrenUserId1@coderdojo.org',
        email: 'deleted-account+childrenUserId1@coderdojo.org',
        name: '',
        firstName: '',
        lastName: '',
        password: undefined
      });
      expect(queryBuilder.patch.getCall(3)).to.have.been.calledWith({ 
        email: 'deleted-account+childrenUserId1@coderdojo.org',
        name: '',
        firstName: '',
        lastName: '',
        phone: '',
      });
      // One for our call, one for the child account
      expect(spy).to.have.been.calledTwice; 
      expect(spy.getCall(1)).to.have.been.calledWith('childrenUserId1', false);
    });
  });
});
