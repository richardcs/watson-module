/*jshint node:true*/

// app.js
// This file contains the server side JavaScript code for your application.
// This sample application uses express as web application framework (http://expressjs.com/),
// and jade as template engine (http://jade-lang.com/).

var express = require('express');
var https = require('https');
var url = require('url');
var config = require('config');
var winston = require('winston');

// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// defaults for dev outside bluemix
var service_url = config.get('watson.endpoint');
var service_username = config.get('watson.username');
var service_password = config.get('watson.password');

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
if (process.env.VCAP_SERVICES) {
  winston.info('Parsing VCAP_SERVICES');
  var services = JSON.parse(process.env.VCAP_SERVICES);
  //service name, check the VCAP_SERVICES in bluemix to get the name of the services you have
  var service_name = 'question_and_answer';

  if (services[service_name]) {
    var svc = services[service_name][0].credentials;
    service_url = svc.url;
    service_username = svc.username;
    service_password = svc.password;
  } else {
    winston.info('The service '+service_name+' is not in the VCAP_SERVICES, did you forget to bind it?');
  }

} else {
  winston.info('No VCAP_SERVICES found in ENV, using defaults for local development');
}

winston.info('service_url = ' + service_url);
winston.info('service_username = ' + service_username);
winston.info('service_password = ' + new Array(service_password.length).join("X"));

var auth = "Basic " + new Buffer(service_username + ":" + service_password).toString("base64");

function askQuestion(question, callback) {
  // Select healthcare as endpoint
  var parts = url.parse(service_url +'/v1/question/travel');
  // create the request options to POST our question to Watson
  var options = { host: parts.hostname,
    port: parts.port,
    path: parts.pathname,
    method: 'POST',
    headers: {
      'Content-Type'  :'application/json',
      'Accept':'application/json',
      'X-synctimeout' : '30',
      'Authorization' :  auth }
  };
  winston.info('wimpl', JSON.stringify(options));
  // Create a request to POST to Watson
  var watson_req = https.request(options, function(result) {
    result.setEncoding('utf-8');
    var response_string = '';

    result.on('data', function(chunk) {
      response_string += chunk;
    });

    result.on('end', function() {
        var answers_pipeline = JSON.parse(response_string), answers = answers_pipeline[0];
        winston.info('w-impl', answers_pipeline);
        callback(null, answers.question.evidencelist[0]);
    })

  });

  watson_req.on('error', function(e) {
      winston.error('w-impl', e.message);
      callback(e.message);
  });

  // create the question to Watson
  var questionData = {
    'question': {
      'evidenceRequest': {
        'items': 1 // the number of anwers
      },
      'questionText': question // the question
    }
  };

  // Set the POST body and send to Watson
  watson_req.write(JSON.stringify(questionData));
  watson_req.end();
};

exports.askQuestion = askQuestion;
