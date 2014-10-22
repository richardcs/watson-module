var assert = require('chai').assert;
var request = require('request');
var freeport = require('freeport');
var webapp = require('../app/webapp');

describe('An HTTP Server', function () {

  before(function(done) {
    freeport(function(err, port) {
      this.uri = 'http://localhost:' + port;
      this.server = webapp.listen(port, done);
    }.bind(this));
  });

  it('should make a request', function(done) {
    request(this.uri, function(err, resp, body) {
      if (err) {
        throw err;
      }

      assert.equal(resp.statusCode, 200);
      assert.equal(body, 'hello');
      done();
    })
  })
});
