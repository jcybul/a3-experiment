const http = require('http');
const fs = require('fs');
const mime = require('mime');


const defaultPort = 3000;


function saveResultsData(data, res) {



    res.writeHead(200, "OK");
    res.end("Data saved");
}


function waitForData(req, callback) {
    let buffer = "";
    req.on('data', data => buffer += data)
    req.on('end', () => callback(buffer))
}

function sendFile(response, filename) {
    const type = mime.getType(filename)

    fs.readFile(filename, function (err, content) {

        // if the error = null, then we've loaded the file successfully
        if (err === null) {
            response.writeHeader(200, {'Content-Type': type})
            response.end(content)

        } else {
            // file not found, error code 404
            response.writeHeader(404)
            response.end('404 Error: File Not Found')
        }
    })
}


function handleRequest(req, res) {
    // Handle static file serving, but probably won't be needed since we are using github pages
    // Could also be used to fetch the results from the server
    if (req.method === "GET") {
        if (req.url === '/') {
            return sendFile(res, 'public/index.html');
        } else {
            return sendFile(res, "public" + req.url);
        }
    }

    // Handle new data being sent to the server
    if (req.method === "POST" && req.url.startsWith("/api/results")) {
        return waitForData(req, data => saveResultsData(data, res));
    }

    // Default to bad request message
    response.writeHead(400, "Bad Request");
    response.end("Unknown route: " + req.method + ": " + req.url);
}



const server = http.createServer(handleRequest);
server.listen(process.env.PORT || defaultPort);