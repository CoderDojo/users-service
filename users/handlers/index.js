/* eslint-disable global-require */
module.exports = {
  delete: require('./delete'),
  search: require('./search'),
  load: require('./load'),
  joinRequests: {
    create: require('./createJoinRequest'),
    delete: require('./deleteJoinRequest'),
    load: require('./loadJoinRequest'),
  },
};
/* eslint-enable global-require */
