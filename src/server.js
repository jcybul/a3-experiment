const app = require('./app');
const https = require('https');
const http = require('http');
const fs = require('fs');

const regex = /^-----BEGIN CERTIFICATE-----\r?\n((?:(?!-----).*\r?\n)*)-----END CERTIFICATE-----/gm;

// This line is from the Node.js HTTPS documentation.
const options = {
    key: fs.readFileSync('../cert2/meggitt.dev.key', 'utf-8'),
    cert: fs.readFileSync('../cert2/cf120b6b55e88913.crt', 'utf-8'),
    ca: fs.readFileSync('../cert2/gd_bundle-g2-g1.crt', 'utf-8').match(regex),
};


// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);
