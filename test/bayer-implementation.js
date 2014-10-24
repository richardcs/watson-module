var winston = require('winston');
var assert = require('chai').assert;
var bayer = require('../app/bayer-implementation');

describe('Testing the bayer API implementation', function () {

  it('it should return on a normal function', function(done) {
    var question = "4";
    bayer.askQuestion(question, function(req, resp) {
      var q = resp.questionText, a = resp.answers;
      winston.info('test/bayer-implementation:', 'q = '+q, 'a = '+a);
      assert.equal(question, q);
      assert.isNotNull(a);
      done();
    });
  });

});
