const { Model, QueryBuilder } = require('objection');
const Profile = require('../../profiles/models/ProfileModel.js');

class UserModel extends Model {
  static get tableName() {
    return 'sys_user';
  }

  static get QueryBuilder() {
    return class extends QueryBuilder {
      softDelete() {
        return this.patch({
          active: false,
          nick: '',
          email: null,
          name: '',
          lastName: '',
          firstName: '',
          phone: null,
          salt: null,
          pass: null,
          modified: new Date(),
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
