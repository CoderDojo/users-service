const UsersController = require('../controller');
const UserModel = require('../models/UserModel');
const modelHandler = require('../../util/builderHandler');
const { NoUserFound } = require('../errors');

module.exports = [
  async (req, res, next) => {
    let user;
    try {
      user = await UsersController.load({ id: req.params.id }, req.query.related);
    } catch (e) {
      return next(e);
    }
    return res.send(user);
  },
];
