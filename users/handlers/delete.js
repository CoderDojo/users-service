const UsersController = require('../controller');
const ProfilesController = require('../../profiles/controller');
const UserModel = require('../models/UserModel');
const modelHandler = require('../../util/builderHandler');
const { NoUserFound } = require('../errors');

module.exports = [
  modelHandler(UserModel),
  async (req, res, next) => {
    let result;
    const deleteUser = req.body.soft ? UsersController.softDelete : UsersController.delete;
    const deleteProfile = req.body.soft ? ProfilesController.softDelete : ProfilesController.delete;
    result = await deleteUser(req.params.id);
    if (!result) {
      return next(NoUserFound);
    }
    await deleteProfile(req.params.id);
    return res.sendStatus(200);
  },
];
