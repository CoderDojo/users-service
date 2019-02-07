const UsersController = require('../controller');

module.exports = [
  async (req, res, next) => {
    let user;
    try {
      // Right now, this only handles search by email, which should return an unique resource
      // However, in a future, we should be able to search by anything
      // Hence, this should not use `load`, but `list` (which doesn't exists at time of writing)
      // The API format should stay the same, though
      user = await UsersController.load({ email: req.query.email }, req.query.related);
    } catch (e) {
      // This is specific to `load` usage
      // To be removed once switched to `list`
      if (e.status === 404) {
        return res.send({ results: [], total: 0 });
      }
      return next(e);
    }
    return res.send({ results: [user], total: 1 });
  },
];
