const express = require('express');
const validations = require('./validations');
const handlers = require('./handlers');

const userRouter = express.Router();
userRouter.delete('/:id', validations.delete, handlers.delete);
userRouter.get('/', validations.search, handlers.search);
userRouter.get('/:id', validations.load, handlers.load);

// Join requests
userRouter.delete('/:userId/join_requests/:id', validations.joinRequests.delete, handlers.joinRequests.delete);
userRouter.post('/:userId/join_requests', validations.joinRequests.create, handlers.joinRequests.create);
const joinRequestsRouter = express.Router();
joinRequestsRouter.get('/:id', validations.joinRequests.load, handlers.joinRequests.load);

module.exports = {
  user: userRouter,
  joinRequests: joinRequestsRouter,
};
