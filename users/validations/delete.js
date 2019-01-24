const { checkSchema } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  checkSchema({
    id: {
      in: ['params'],
      isUUID: true,
    },
    soft: {
      in: ['body'],
      isBoolean: true,
      optional: true,
    },
    cascade: {
      in: ['body'],
      isBoolean: true,
      optional: true,
    },
  }),
  ValidationHelper.handleErrors,
];
