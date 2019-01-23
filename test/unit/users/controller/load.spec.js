const sinon = require('sinon');
const { load } = require('../../../../users/controller');
describe('users/controller:load', () => {
  let queryBuilder;
  before(() => {
    sandbox = sinon.createSandbox();
  });
  beforeEach(() => {
    sandbox.reset();
    queryBuilder = {
      where: sandbox.stub().returnsThis(),
      allowEager: sandbox.stub().returnsThis(),
      eager: sandbox.stub().returnsThis(),
      columns: sandbox.stub().returnsThis(),
      findOne: sandbox.stub(),
    };
  });
  it('should load a user with no eager', async () => {
    queryBuilder.findOne.resolves({ id: 1 });
    const res = await load({ id: 1 }, undefined, queryBuilder);
    expect(queryBuilder.allowEager).to.have.been.calledOnce.and.calledWith('[profile]');
    expect(queryBuilder.eager).to.have.been.calledOnce.and.calledWith('[]');
    expect(queryBuilder.columns).to.have.been.calledOnce;
    expect(queryBuilder.findOne).to.have.been.calledOnce.and.calledWith({ id: 1 });
    expect(res).to.eql({ id: 1 });
  });
  it('should load a user with an objectionjs supported eager', async () => {
    queryBuilder.findOne.resolves({ id: 1, profile: { userId: 1 } });
    const res = await load({ id: 1 }, '[profile]', queryBuilder);
    expect(queryBuilder.allowEager).to.have.been.calledOnce.and.calledWith('[profile]');
    expect(queryBuilder.eager).to.have.been.calledOnce.and.calledWith('[profile]');
    expect(queryBuilder.columns).to.have.been.calledOnce;
    expect(queryBuilder.findOne).to.have.been.calledOnce.and.calledWith({ id: 1 });
    expect(res).to.eql({ id: 1, profile: { userId: 1 } });
  });
  it('should load a user with a custom eager', async () => {
    const withChildren = sandbox.stub().resolves([{ userId: 2 }]);
    queryBuilder.findOne.resolves({ id: 1, profile: { userId : 1, children: [2], withChildren } });
    const res = await load({ id: 1 }, '[profile, children]', queryBuilder);
    expect(queryBuilder.allowEager).to.have.been.calledOnce.and.calledWith('[profile]');
    expect(queryBuilder.eager).to.have.been.calledOnce.and.calledWith('[profile]');
    expect(queryBuilder.columns).to.have.been.calledOnce;
    expect(queryBuilder.findOne).to.have.been.calledOnce.and.calledWith({ id: 1 });
    expect(withChildren).to.have.been.calledOnce;
    expect(res).to.eql({ id: 1, profile: { userId : 1, children: [2], withChildren, childrenProfiles: [{ userId: 2 }]} });
  });
  it('should throw an error if the user is not found', async () => {
    queryBuilder.findOne.resolves(undefined);
    try {
      expect(await load({ id: 1 }, '[profile, children]', queryBuilder)).to.throw;
    } catch (e) {
      expect(queryBuilder.allowEager).to.have.been.calledOnce.and.calledWith('[profile]');
      expect(queryBuilder.eager).to.have.been.calledOnce.and.calledWith('[profile]');
      expect(queryBuilder.columns).to.have.been.calledOnce;
      expect(queryBuilder.findOne).to.have.been.calledOnce.and.calledWith({ id: 1 });
      expect(e).to.be.an.instanceOf(Error); 
      expect(e.message).to.be.equal('Invalid userId'); 
    }
  });
});
