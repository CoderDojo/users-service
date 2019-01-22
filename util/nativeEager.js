const { intersection } = require('lodash');

module.exports = class NativeEager {
  // Remove eager value which are not defined by the referenced model (non-native) 
  static extract (reference, eagers) {
    if (eagers) {
      // Remove the brackets and return an array of the 'related' strings
      const parsed = eagers.slice(1, -1).split(',');
      return NativeEager.format(intersection(reference, parsed));
    }
    return '[]';
  }
  // Format an array of strings into a stringified version that can be used by objectionjs
  static format (array) {
    return `[${ array.join(',') }]`;
  }
}
