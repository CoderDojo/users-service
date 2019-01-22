/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  app_name: ['users-service'],
  agent_enabled: '',
  license_key: '',
  logging: {
    level: 'info',
  },
  transaction_tracer: {
    record_sql: 'obfuscated',
  },
  allow_all_headers: true,
  attributes: {
    include: [
      'request.parameters.*',
    ],
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*',
    ],
  },
};
