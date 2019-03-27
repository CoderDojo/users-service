const UsersController = require('../controller');

module.exports = [
  async (req, res, next) => {
    let joinRequest;
    try {
      joinRequest = await UsersController.loadJoinRequest({ id: req.params.id });
    } catch (e) {
      return next(e);
    }
    return res.send(joinRequest);
  },
];
