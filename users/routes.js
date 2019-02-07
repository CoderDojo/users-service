const express = require('express');
const validations = require('./validations');
const handlers = require('./handlers');

const router = express.Router();
router.delete('/:id', validations.delete, handlers.delete);
router.get('/', validations.search, handlers.search);
router.get('/:id', validations.load, handlers.load);

module.exports = router;
