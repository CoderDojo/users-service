const { Model, QueryBuilder, raw } = require('objection');
const Avatar = require('./AvatarModel');

class ProfileModel extends Model {
  static get tableName() {
    return 'cd_profiles';
  }
  static get QueryBuilder() {
    return class extends QueryBuilder {
      softDelete() {
        this.runAfter((model, qB) => {
          return model.$afterDelete();
        });
        return this.patch({
          email: null,
          name: '',
          alias: '',
          lastName: '',
          firstName: '',
          phone: '',
          twitter: '',
          linkedin: '',
          // Badges contains the assertion, containing the email
          // We lose data, but the format is inconsistent
          badges: [],
          lastEdited: new Date(),
        });
      }
      removeChild(children, childId) {
        children.splice(children.indexOf(childId), 1);
        return this.patch({
          children,
        });
      }
    };
  }

  async $afterDelete(opt, queryContext) {
    await super.$afterDelete(queryContext);
    if (this.avatar && this.avatar.oid) {
      await this.getAvatar().delete();
    }
    return this;
  }

  // Note: the definition of publicFields here returns all data
  // because accessing the profile means you have access to it :)
  static get publicFields() {
    return [
      'id',
      'alias',
      'badges',
      'languagesSpoken',
      'email',
      'userId',
      'name',
      'firstName',
      'lastName',
      'dob',
      'avatar',
      'children',
      'city',
      'country',
      'gender',
      'lastEdited',
      'linkedin',
      'twitter',
      'ninjaInvites',
      'notes',
      'optionalHiddenFields',
      'parentInvites',
      'parents',
      'phone',
      'placeGeonameId',
      'private',
      'programmingLanguages',
      'projects',
      'requiredFieldsComplete',
      'userType',
    ];
  }
  hasChildren() {
    return this.children && this.children.length > 0;
  }
  hasParents() {
    return this.parents && this.parents.length > 0;
  }

  withChildren() {
    const userId = `%${this.userId}%`;
    return ProfileModel.query().select(ProfileModel.publicFields).where(raw('parents::text'), 'LIKE', userId).as('children');
  }
  getAvatar() {
    return new Avatar(this.avatar.oid);
  }
}

module.exports = ProfileModel;
