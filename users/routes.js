const express = require('express');
const validations = require('./validations');
const handlers = require('./handlers');

const router = express.Router();
router.delete('/:id', validations.delete, handlers.delete);
router.get('/', validations.get, handlers.get);
router.get('/:id', validations.load, handlers.load);

module.exports = router;
