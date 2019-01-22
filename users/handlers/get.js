const UsersController = require('../controller');
const UserModel = require('../models/UserModel');
const modelHandler = require('../../util/builderHandler');

module.exports = [
  async (req, res, next) => {
    let user;
    try {
      user = await UsersController.load({ email: req.query.email }, req.query.related);
    } catch (e) {
      return next(e); 
    }
    return res.send(user);
  },
];
