var request = require('request');

exports.askQuestion = function askQuestion (question, callback) {
  // var answers = "test";
  request('http://www.thomas-bayer.com/sqlrest/CUSTOMER/'+question, function (err, resp, body) {
    if (!err && resp.statusCode == 200) {
      callback(null, {'questionText': question, 'answers': body});
    }
  });
}
