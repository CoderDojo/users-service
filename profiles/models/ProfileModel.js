const { Model, raw } = require('objection');

class ProfileModel extends Model {
  static get tableName() {
    return 'cd_profiles';
  }
  // Note: the definition of publicFields here returns all data because accessing the profile means you have access to it :) 
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
  withChildren() {
    const userId = `%${this.userId}%`;
    return ProfileModel.query().select(ProfileModel.publicFields).where(raw('parents::text'), 'LIKE', userId).as('children');
  }
}

module.exports = ProfileModel;
