const { checkSchema } = require('express-validator/check');
const ValidationHelper = require('../../util/ValidationHelper');

module.exports = [
  checkSchema({
    userId: {
      in: ['params'],
      isUUID: true,
    },
    dojoId: {
      in: ['body'],
      isUUID: true,
    },
    userType: {
      in: ['body'],
      custom: {
        options: (value) => {
          return ['champion', 'mentor'].indexOf(value) > -1;
        },
      },
    },
  }),
  ValidationHelper.handleErrors,
];
