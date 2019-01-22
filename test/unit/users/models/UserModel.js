const proxy = require('proxyquire');

const EventModel = proxy('../../../../users/models/UserModel', {
  objection: { Model: class { } },
});
describe('UserModel', () => {
});
