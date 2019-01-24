
const utils = require('../../../util/nativeEager');

describe('nativeEager', () => {
  describe('format', () => {
    it('should return an empty eager-formatted string for objectionjs', () => {
      expect(utils.format([])).to.equal('[]');
    });
    it('should return a eager-formatted string for objectionjs', () => {
      expect(utils.format(['banana'])).to.equal('[banana]');
    });
  });
  describe('extract', () => {
    it('should return an empty string representing an array when there is no value', () => {
      expect(utils.extract(['banana'], undefined)).to.eql('[]');
    });
    it('should return an empty array when the values are not matching the reference', () => {
      expect(utils.extract(['banana'], '[pear]')).to.eql('[]');
    });
    it('should return an array matching the reference', () => {
      expect(utils.extract(['banana', 'pear'], '[pear]')).to.eql('[pear]');
    });
  });
});
