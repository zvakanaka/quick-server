const chai = require('chai');
const should = chai.should();

const utils = require('../controllers/utils/utils.js');

describe('Getting nice date', function() {
  it('should get today when no date provided as input', function() {
    utils.niceDate().length.should.be.at.least(8);
    utils.niceDate().should.not.equal('Invalid Date');
  });

  it('should get date string when date provided as input', function() {
    utils.niceDate(convertDateToUTC(new Date(0))).should.equal('Jan 1, 1970');
  });
});

// test helpers
function convertDateToUTC(date) { // https://stackoverflow.com/a/14006555/4151489
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}
