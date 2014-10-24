var express = require('express');
var bodyParser = require('body-parser');
var winston = require('winston');
var config = require('config');
var kue = require('kue');
var watson = require('./watson');

var jobs = kue.createQueue({ prefix: 'q', redis: config.get('kue') }); // create jobs queue
var queueName = config.get('queue');
var app = express(); // setup the web server

app.use( bodyParser.json() );                          // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({ extended: false }) ); // to support URL-encoded bodies

app.post('/', function(req, res) {
    var query = req.body.query,
        webhook = req.body.webhook;

    if (query && webhook) {
      winston.info('you posted query: '+query+', and webhook:'+webhook);
      res.status(201).send('query ('+query+') is running and will respond to webhook ('+webhook+') if watson hears you');
      var job = jobs.create(queueName, {
          title: query
        , query: query
        , webhook: webhook
      }).save( function(err){
         if( !err ) {
           winston.info( job.id )
         } else {
           winston.error( 'Job for query: ' + query + ' and webhook: ' + webhook + ' failed: ' + err )
         }
      });
    } else {
      res.status(412).send('query and/or webhook parameters are missing');
    }
});

app.get('/', function (req, res) {
  res.status(200).send('Syntax: http://<address>/query=<some term>&webhook=<some webhook>');
});

app.use(function(req, res, next){
  res.status(404).send('Sorry cant find that!');
});

module.exports = app;
