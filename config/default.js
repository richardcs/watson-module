exports.port = process.env.PORT || 3000;
exports.queue = "watson";

exports.redis = {
    host: "localhost",
    port: 6379
};

exports.watson = {
    username: process.env.WATSON_USERNAME || "35211d6f-7d28-4ea5-9283-ce5efb1b51c4",
    password: process.env.WATSON_PASSWORD || "2UKUVMprDIOh",
    endpoint: process.env.WATSON_ENDPOINT || "https://gateway.watsonplatform.net:443/qagw/service"
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
