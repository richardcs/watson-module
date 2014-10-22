var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({ extended: false }) ); // to support URL-encoded bodies

app.post('/', function(req, res) {
    var query = req.body.query,
        webhook = req.body.webhook;
    if (typeof query !== 'undefined' && query &&
      typeof webhook !== 'undefined' && webhook) {
      console.log('you posted query: '+query+', and webhook:'+webhook);
      res.status(201).send('query ('+query+') is running and will respond to webhook ('+webhook+') if watson hears you');
    } else {
      res.status(412).send('query and/or webhook parameters are missing');
    }
});

app.get('/', function (req, res) {
  res.send('Syntax: http://<address>/query=<some term>&webhook=<some webhook>');
});

app.use(function(req, res, next){
  res.status(404).send('Sorry cant find that!');
});

module.exports = app;