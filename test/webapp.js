var winston = require('winston');
var assert = require('chai').assert;
var request = require('request');
var freeport = require('freeport');
var webapp = require('../app/webapp');
var config = require('config');
var kue = require('kue');

var jobs = kue.createQueue({ prefix: 'q', redis: config.get('kue') });
    
var queueName = config.get('queue');

describe('An HTTP Server', function () {

  before(function(done) {
    freeport(function(err, port) {
      this.uri = 'http://localhost:' + port;
      this.server = webapp.listen(port, done);
      winston.info(this.uri);
    }.bind(this));

    //jobs.on('job ')
  });

  it('should make a request', function(done) {
    request(this.uri, function(err, resp, body) {
      if (err) {
        throw err;
      }

      assert.equal(resp.statusCode, 200);
      assert.equal(body, 'Syntax: http://<address>/query=<some term>&webhook=<some webhook>');
      done();
    })
  })

  it('should accept a valid post', function(done) {
    var queryValue = 'What is Herpes?';
    var webhookValue = 'my webhook value';
    request.post(this.uri, {form: {query: queryValue, webhook: webhookValue}}, function(err, res, body) {
      if (err) {
        throw err;
      }
      assert.equal(res.statusCode, 201);
      // jobs.process(queueName, function(job, done) {
      //   assert.equal(job.data.query, queryValue);
      //   assert.equal(job.data.webhook, webhookValue);
      //   done();
      // });
      done();
    })
  })

  it('should reject a post without a query', function(done) {
    request.post(this.uri, {form: {webhook:'webhook values'}}, function(err, res, body) {
      if (err) {
        throw err;
      }
      assert.equal(res.statusCode, 412);
      done();
    })
  })

  it('should reject a post without a webhook', function(done) {
    request.post(this.uri, {form: {query:'query values'}}, function(err, res, body) {
      if (err) {
        throw err;
      }
      assert.equal(res.statusCode, 412);
      done();
    })
  })

  it('should 404', function(done) {
    var uri = this.uri + '/testing';
    request(uri, function(err, res, body) {
      if (err) {
        throw err;
      }
      assert.equal(res.statusCode, 404);
      done();
    })
  })
});
