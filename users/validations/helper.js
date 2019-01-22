const moment = require('moment');

module.exports = {
  'query[afterDate]': {
    in: ['query'],
    isISO8601: true,
    customSanitizer: {
      options(value, { req }) {
        const utcOffset = req.query.query.utcOffset;
        return moment.utc(value * 1000).add(utcOffset, 'm').toISOString();
      },
    },
    optional: true,
  },
  'query[beforeDate]': {
    in: ['query'],
    isISO8601: true,
    customSanitizer: {
      options(value, { req }) {
        const utcOffset = req.query.query.utcOffset;
        return moment.utc(value * 1000).add(utcOffset, 'm').toISOString();
      },
    },
    optional: true,
  },
  'query[utcOffset]': {
    in: ['query'],
    toInt: true,
    custom: {
      options: (value, { req }) => {
        return !(req.query.query && (req.query.query.beforeDate || req.query.query.afterDate)) || typeof value === 'number';
      },
      errorMessage: 'query[utcOffset] is required when after_date or before_date are specified',
    },
  },
};
