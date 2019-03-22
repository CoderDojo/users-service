const { checkSchema } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  checkSchema({
    userId: {
      in: ['params'],
      isUUID: true,
    },
    id: {
      in: ['params'],
    },
  }),
  ValidationHelper.handleErrors,
];
