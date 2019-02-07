const { checkSchema } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  checkSchema({
    email: {
      in: ['query'],
    },
  }),
  ValidationHelper.handleErrors,
];
