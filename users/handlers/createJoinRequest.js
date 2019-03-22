const UsersController = require('../controller');
const { NoRequestToJoinFound } = require('../errors');

module.exports = [
  async (req, res, next) => {
    const userId = req.params.userId;
    const { dojoId } = req.body;
    try {
      const joinRequest = await UsersController.loadJoinRequest({ userId, dojoId });
      return res.status(409).send(joinRequest);
    } catch (e) {
      if (e === NoRequestToJoinFound) {
        return next();
      }
      next(e);
    }
  },
  async (req, res, next) => {
    const { userType, dojoId } = req.body;
    const userId = req.params.userId;
    const joinRequest = await UsersController.createJoinRequest(userId, userType, dojoId);
    // Ensure the format is the same, even though it comes from a different place
    // (post-registration in the sys_user vs querying from v_join_requests
    return res.send({ userId, ...joinRequest });
  },
];
