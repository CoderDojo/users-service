const express = require('express');
const validations = require('./validations');
const handlers = require('./handlers');

const router = express.Router();
router.delete('/:id', validations.delete, handlers.delete);
router.get('/', validations.search, handlers.search);
router.get('/:id', validations.load, handlers.load);

// Join requests
router.delete('/:userId/join_requests/:id', validations.joinRequests.delete, handlers.joinRequests.delete);
router.post('/:userId/join_requests', validations.joinRequests.create, handlers.joinRequests.create);
module.exports = router;
