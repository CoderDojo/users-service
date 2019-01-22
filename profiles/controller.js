const { raw } = require('objection');
const ProfileModel = require('./models/ProfileModel');
const { NoUserFound } = require('./errors');

class ProfilesController {
  static async delete(id, builder = ProfileModel.query()) {
    return builder.where({ id }).delete();
  }
  static async softDelete(id, builder = ProfileModel.query()) {
    const email = `deleted-account+${id}@coderdojo.org`;
    return builder.
      where({ id }).
      patch({ 
        email, 
        name: '',
        lastName: '',
        firstName: '',
        phone: '',
    }).returning('*');
  }
}

module.exports = ProfilesController;
