const UsersController = require('../controller');

module.exports = [
  async (req, res, next) => {
    const { userType, dojoId } = req.body;
    const userId = req.params.userId;
    const joinRequest = await UsersController.createJoinRequest(userId, userType, dojoId);
    return res.send(joinRequest);
  },
];
