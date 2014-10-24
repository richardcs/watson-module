var request = require('request');
var winston = require('winston');
var kue = require('kue');
var config = require('config');
var qanda = require('./watson-implementation');

var queue = kue.createQueue({ prefix: 'q', redis: config.get('kue') });

queue.process(config.get('queue'), function(job) {
    var data = job.data;
    winston.info(data.webhook);
    winston.info(data.query);
    query(data.query, function(err, res) {
        if (!err) {
            post(data.webhook, res, function(err, res) {
                if (err)
                    winston.error("err", err);
            });
        }
    });
});

function query(query, callback) {
    winston.info('query: ' + query);
    qanda.askQuestion(query, callback);
}

function post(webhook, body, callback) {
    winston.info('POSTing '  +JSON.stringify(body) + ' to ' + webhook);
    request.post({url: webhook, body: body, json: true},  callback);
}

module.exports = { query: query, post: post };
