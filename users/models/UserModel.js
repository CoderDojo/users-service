const { Model, QueryBuilder } = require('objection');
const Profile = require('../../profiles/models/ProfileModel.js');

class UserModel extends Model {
  static get tableName() {
    return 'sys_user';
  }

  static get QueryBuilder() {
    return class extends QueryBuilder {
      softDelete() {
        const email = `deleted-account+${new Date().valueOf()}@coderdojo.org`;
        // TODO : how to handle passwords ?
        return this.patch({
          active: false,
          nick: email,
          email,
          name: '',
          lastName: '',
          firstName: '',
          password: undefined,
        });
      }
    };
  }

  static get related() {
    return ['profile'];
  }
  // Note: this refers to non-system fields
  static get publicFields() {
    return [
      'id',
      'active',
      'email',
      'username',
      'firstName',
      'lastLogin',
      'lastName',
      'locale',
      'mailingList',
      'modified',
      'name',
      'nick',
      'phone',
      'roles',
      'termsConditionsAccepted',
      'when',
    ];
  }

  static get relationMappings() {
    return {
      profile: {
        relation: Model.HasOneRelation,
        modelClass: Profile,
        join: {
          from: 'cd_profiles.userId',
          to: 'sys_user.id',
        },
      },
    };
  }
}

module.exports = UserModel;
