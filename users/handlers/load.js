const UsersController = require('../controller');

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
