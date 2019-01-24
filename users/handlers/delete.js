const UsersController = require('../controller');

module.exports = [
  async (req, res, next) => {
    try {
      await UsersController.exists(req.params.id);
    } catch (e) {
      return next(e);
    }
    return next();
  },
  async (req, res, next) => {
    const deleteUser = req.body.soft ? UsersController.softDelete : UsersController.delete;
    const cascade = req.body.cascade !== undefined ? req.body.cascade : true;
    await deleteUser(req.params.id, cascade);
    return res.sendStatus(200);
  },
];
