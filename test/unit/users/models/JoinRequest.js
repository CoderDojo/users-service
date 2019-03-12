const proxy = require('proxyquire');

describe('JoinRequest', () => {
  const sandbox = sinon.createSandbox();
  let Model;
  beforeEach(() => {
    sandbox.reset();
    Model = proxy('../../../../users/models/JoinRequest', {
      objection: {
        Model: class { },
        QueryBuilder: class { },
      },
    });
  });
  it('should create a new instance of a joinRequest', () => {
    const jr = Model.create('champion', 'dojo2');
    expect(jr.id).to.exist;
    expect(jr.timestamp).to.exist;
    expect(jr.userType).to.exist.and.equal('champion');
    expect(jr.dojoId).to.exist.and.equal('dojo2');
  });
});
