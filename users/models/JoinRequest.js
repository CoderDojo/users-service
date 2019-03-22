const { Model } = require('objection');
const shortid = require('shortid');

class JoinRequest extends Model {
  static get tableName() {
    return 'cd_v_join_requests';
  }
  static create(userType, dojoId) {
    return {
      id: shortid.generate(),
      dojoId,
      userType,
      timestamp: new Date(),
    };
  }
}

module.exports = JoinRequest;
