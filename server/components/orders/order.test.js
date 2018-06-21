const assert = require('assert');

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return 1 which is the index of 2 in the array', () => {
      assert.equal([1, 2, 3].indexOf(2), 1);
    });
  });
});
