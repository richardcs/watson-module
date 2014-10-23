var request = require('request');
var kue = require('kue');
var config = require('config');

var queue = kue.createQueue();
queue.process(config.get('queue.name'), function(job) {
    console.log(job.title);
    console.log(job.query);
    console.log(job.webhook);
});

function query(query) {
    console.log('query: ' + query);
    return '34 cats/(ironing board)^2';
}

function post(webhook, body, callback) {
    console.log('POSTing '  +JSON.stringify(body) + ' to ' + webhook);
    request.post({url: webhook, body: body, json: true},  callback);
}

module.exports = { query: query, post: post };
    


