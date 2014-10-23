var config = require('config');
var winston = require('winston');
var app = require('./app/webapp');

var port = config.get('port');

app.listen(port, function() {
  winston.info('Server started on 0.0.0.0:'+port);
});
