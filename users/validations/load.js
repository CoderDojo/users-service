const { checkSchema } = require('express-validator/check');
const eventHelper = require('./helper');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  checkSchema({
    'id': {
      in: ['params'],
    }
  }),
  ValidationHelper.handleErrors,
];
