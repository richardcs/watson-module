exports.askQuestion = function askQuestion (question, callback) {
  callback(null, {'questionText': question, 'answers': "mock-answers"});
}
