var assert = require('chai').assert;
var request = require('request');
var express = require('express');
var freeport = require('freeport');
var watson = require('../app/watson');
var app = express();

app.post('/', function (req, res, next) {
    console.log('request received', new Date());
    res.status(200).end();
});

describe('A service that pulls { webhook: url, query: query } objects off a queue, makes the query and POSTs the respone to the webhook', function () {
    before(function(done) {
        freeport(function(err, port) {
            this.uri = "http://localhost:" + port + "/";
            this.server = app.listen(port, done);
        }.bind(this));
    });

    it('should make a query to a webservice and return a response', function(done) {
        var response = watson.query("What is the treatment for Aplastic Anemia?", function(err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
                done();
            }
        });
    });

    it('should POST a response to a webhook', function(done) {
        watson.post(this.uri, { message: 'a post body' }, function(err, res, body) {
            console.log("err", err);
            assert.equal(res.statusCode, 200)
            done();
        });
    });
});
