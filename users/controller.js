const { raw } = require('objection');
const UserModel = require('./models/UserModel');
const { NoUserFound } = require('./errors');
const nativeEager = require('../util/nativeEager');

class UsersController {
  static async delete(id, cascade, builder = UserModel.query()) {
    const userProfile = await builder
      .eager('profile')
      .findById(id);
    if (userProfile.profile.hasChildren() && cascade) {
      await Promise.all(userProfile.profile.children.map(
        childUserId => UsersController.delete(childUserId, false)
      ));
    }
    await userProfile.profile.$query().delete();
    return userProfile.$query().delete();
  }

  // does not check if exists, please do beforeHand
  static async softDelete(id, cascade, builder = UserModel.query()) {
    // TODO : how to handle passwords ?
    // TODO : avatars 
    const email = `deleted-account+${id}@coderdojo.org`;
    const res = await builder
      .allowEager('[profile]')
      .eager('profile')
      .where({ id })
      .patch({ 
        active: false,
        nick: email,
        email, 
        name: '',
        lastName: '',
        firstName: '',
        password: undefined,
    }).returning('*');
    const userProfile = res[0];
    userProfile.profile = await userProfile.profile.$query().patch({
      email,
      name: '',
      lastName: '',
      firstName: '',
      phone: '',
    }).returning('*');
    if (userProfile.profile.hasChildren() && cascade) {
      await Promise.all(userProfile.profile.children.map(
        childUserId => UsersController.softDelete(childUserId, false)
      ));
    }
    return userProfile;
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
