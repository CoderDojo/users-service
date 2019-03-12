const UsersController = require('../controller');

module.exports = [
  // Verifiy it exists first
  // An error will be thrown if it doesn't
  async (req, res, next) => {
    try {
      await UsersController.loadJoinRequest(req.params.id);
      next();
    } catch (e) {
      return next(e);
    }
  },
  // Delete it from the array of join requests
  async (req, res, next) => {
    const { userId, id } = req.params;
    await UsersController.deleteJoinRequest(userId, id);
    return res.sendStatus(200);
  },
];
