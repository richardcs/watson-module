var assert = require('chai').assert;
var winston = require('winston');
var request = require('request');
var express = require('express');
var bodyParser = require('body-parser');
var freeport = require('freeport');
var rewire = require('rewire');
var kue = require('kue');
var config = require('config');

var watson = rewire('../app/watson');

var app = express();
var queue = kue.createQueue({ prefix: 'q', redis: config.get('kue') });

app.use( bodyParser.json() );                          // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({ extended: false }) ); // to support URL-encoded bodies

watson.__set__("qanda", require('../app/mock-implementation'));

describe('A service that pulls { webhook: url, query: query } objects off a queue, makes the query and POSTs the respone to the webhook', function () {
    before(function(done) {
        freeport(function(err, port) {
            this.uri = "http://localhost:" + port + "/";
            this.server = app.listen(port, done);
        }.bind(this));
    });

    it('should make a query to a webservice and return a response', function(done) {
        watson.query("4", function(err, res) {
            if (err) {
                winston.error(err);
                assert(false);
            } else {
                var expectedResponse = 'mock-answers';
                var actualResponse = res.answers;
                assert.equal(actualResponse, expectedResponse);
            }
            done();
        });
    });

    it('should POST a response to a webhook', function(done) {
        var postAddress = 'webhook-test';
        app.post('/'+postAddress, function (req, res, next) {
            winston.info('request received', new Date());
            res.status(200).end();
        });
        watson.post(this.uri + postAddress, { message: 'a post body' }, function(err, res, body) {
            if (err) {
                winston.error(err);
                assert(false);
            }
            assert.equal(res.statusCode, 200)
            done();
        });
    });

    it('should leverage the kue appropriately', function(done) {
        var postAddress = 'kue-test';
        app.post('/'+postAddress, function (req, res, next) {
            assert.equal(req.body.answers, 'mock-answers');
            done();
        });
        var job = queue.create(config.get('queue'), { webhook: this.uri + postAddress, query: '4' });
        job.save();
    });

});
