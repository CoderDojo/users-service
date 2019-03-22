const sinon = require('sinon');
const { loadJoinRequest: load } = require('../../../../users/controller');

describe('users/controller:joinRequest:load', () => {
  let queryBuilder;
  let sandbox;
  before(() => {
    sandbox = sinon.createSandbox();
  });
  beforeEach(() => {
    sandbox.reset();
    queryBuilder = {
      findOne: sandbox.stub(),
    };
  });
  it('should load a join request', async () => {
    queryBuilder.findOne.resolves({ id: 1 });
    const res = await load({ id: 1 }, queryBuilder);
    expect(queryBuilder.findOne).to.have.been.calledOnce.and.calledWith({ id: 1 });
    expect(res).to.eql({ id: 1 });
  });
  it('should throw a 404 on not found', async () => {
    queryBuilder.findOne.resolves();
    try {
      await load({ id: 1 }, queryBuilder);
    } catch (e) {
      expect(queryBuilder.findOne).to.have.been.calledOnce.and.calledWith({ id: 1 });
      expect(e.status).to.eql(404);
    }
  });
});
