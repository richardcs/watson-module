var request = require('request');
var kue = require('kue');
var config = require('config');
var qanda = require('./watson-implementation');

var queue = kue.createQueue({ prefix: 'q', redis: config.get('kue') });

var job = queue.create(config.get('queue'), { webhook: 'http://www.google.com', query: 'How much jam in a charmed quark?' }).save( function(err) {
    if( !err ) {
        console.log( job.id );
    }
});

queue.process(config.get('queue'), function(job) {
    var data = job.data;
    console.log(data.webhook);
    console.log(data.query);
    query(data.query, function(err, res) {
        if (!err) {
            post(data.webhook, res, function(err, res) {
                if (err)
                    console.log("err", err);
            });
        }
    });
});


function query(query, callback) {
    console.log('query: ' + query);
    qanda.askQuestion(query, callback);
}

function post(webhook, body, callback) {
    console.log('POSTing '  +JSON.stringify(body) + ' to ' + webhook);
    request.post({url: webhook, body: body, json: true},  callback);
}

module.exports = { query: query, post: post };
    


