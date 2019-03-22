const UserModel = require('./models/UserModel');
const JoinRequestModel = require('./models/JoinRequest');
const { NoUserFound, NoProfileFound, NoRequestToJoinFound } = require('./errors');
const nativeEager = require('../util/nativeEager');

class UsersController {
  static async delete(id, cascade, builder = UserModel.query()) {
    // TODO : replace this findById by this.load so we can generalize the profile error loading
    const userProfile = await builder
      .eager('profile')
      .findById(id);
    if (!userProfile) throw NoUserFound;
    if (!userProfile.profile) throw NoProfileFound;
    if (userProfile.profile.hasParents()) {
      await Promise.all(userProfile.profile.parents.map(async (parentUserId) => {
        const parent = await UsersController.load({ id: parentUserId }, '[profile]');
        return parent.profile.$query().removeChild(parent.profile.children, userProfile.id);
      }));
    }
    if (userProfile.profile.hasChildren() && cascade) {
      await Promise.all(userProfile.profile.children.map(
        childUserId => UsersController.delete(childUserId, false)));
    }
    // TODO : delete reference from the parent as well
    await userProfile.profile.$query().delete();
    return userProfile.$query().delete();
  }

  // does not check if exists, please do beforeHand
  static async softDelete(id, cascade, builder = UserModel.query()) {
    // TODO : replace this qb.where by this.load so we can generalize the profile error loading
    const res = await builder
      .allowEager('[profile]')
      .eager('profile')
      .where({ id })
      .softDelete()
      .returning('*');
    const userProfile = res[0];
    if (!userProfile) throw NoUserFound;
    if (!userProfile.profile) throw NoProfileFound;
    userProfile.profile = await userProfile.profile.$query().softDelete().returning('*');
    if (userProfile.profile.hasChildren() && cascade) {
      await Promise.all(userProfile.profile.children.map(
        childUserId => UsersController.softDelete(childUserId, false)));
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
  static async loadJoinRequest(query, builder = JoinRequestModel.query()) {
    const joinRequest = await builder.findOne(query);
    if (!joinRequest) throw NoRequestToJoinFound;
    return joinRequest;
  }
  static async createJoinRequest(userId, userType, dojoId) {
    const joinRequest = JoinRequestModel.create(userType, dojoId);
    const user = await UserModel.query().findOne({ id: userId });
    if (!user.joinRequests) user.joinRequests = [];
    user.joinRequests.push(joinRequest);
    await user.$query().patch({ joinRequests: user.joinRequests });
    return joinRequest;
  }
  static async deleteJoinRequest(userId, requestId) {
    const user = await UserModel.query().findOne({ id: userId });
    const index = user.joinRequests.findIndex(e => e.id === requestId);
    user.joinRequests.splice(index, 1);
    return user.$query().patch({ joinRequests: user.joinRequests });
  }
}

module.exports = UsersController;
