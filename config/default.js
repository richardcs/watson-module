exports.port = process.env.PORT || 3000;
exports.queue = "watson";

exports.redis = {
    host: "localhost",
    port: 6379
};

exports.watson = {
    username: process.env.WATSON_USERNAME || "richard.levenberg@connectsolutions.com",
    password: process.env.WATSON_PASSWORD || "gDs6vK4qX5",
    endpoint: process.env.WATSON_ENDPOINT || "https://gateway.watsonplatform.net/qagw/service/"
};

if (process.env.REDISTOGO_URL) {
    var parsed = require('url').parse(process.env.REDISTOGO_URL);
    exports.kue = {
        port: parsed.port,
        auth: parsed.auth.split(":")[1],
        host: parsed.hostname
    };
} else {
    exports.kue = {
        port: process.env.KUE_PORT || 6379,
        host: process.env.KUE_HOST || "localhost"
    };
}
