const { raw } = require('objection');
const UserModel = require('./models/UserModel');
const { NoUserFound } = require('./errors');
const nativeEager = require('../util/nativeEager');

class UsersController {
  static async delete(id, builder = UserModel.query()) {
    return builder.where({ id }).delete();
  }
  static async softDelete(id, builder = UserModel.query()) {
    // TODO : how to handle passwords ?
    const email = `deleted-account+${id}@coderdojo.org`;
    return builder
      .where({ id })
      .patch({ 
        active: false,
        nick: email,
        email, 
        name: '',
        lastName: '',
        firstName: '',
    }).returning('*');
  }
  static async load(query, related, builder = UserModel.query()) {
    const supportedRelated = nativeEager.extract(UserModel.related, related);
    const userProfile = await builder
      .allowEager(nativeEager.format(UserModel.related))
      .eager(supportedRelated)
      .columns(UserModel.publicFields)
      .findOne(query);
    if (!userProfile) {
      throw NoUserFound;
    }
    // This is honestly a patch on a wooden leg
    if (userProfile.profile && related && related.indexOf('children') > -1) {
      userProfile.profile.childrenProfiles = await userProfile.profile.withChildren();
    }
    return userProfile;
  }
  static async exists(id) {
    const user = await UserModel.query().findById(id);
    if (!user) {
      throw NoUserFound;
    }
    return true;
  }
}

module.exports = UsersController;
