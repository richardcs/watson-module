var request = require('request');
module.exports = {
    query: function (query) {
        console.log('query: ' + query);
        return '34 cats/(ironing board)^2';
    },

    post: function (webhook, body, callback) {
        //console.log('POSTing '  +JSON.stringify(body) + ' to ' + webhook);
        request.post({url: webhook, body: body, json: true},  callback);
    }
};

