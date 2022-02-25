const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const morgan = require("morgan");

const app = express();

app.use(morgan("[:date[iso]] :method :url :status :res[content-length] - :response-time ms"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("public"));
app.get("/", (_, res) => res.redirect("/index.html"));

app.post("/api/results", (req, res) => saveResultsData(req.body, res));


const dataFile = "public/data.csv";

function extractCSVLine(data, columns) {
    let ret = "";
    for (const column of columns) {
        if (!data.hasOwnProperty(column)) {
            ret += "?,";
            continue;
        }

        const field = data[column];
        if (Number.isInteger(field) || (typeof field === "string" && /^\d+$/.test(field))) {
            ret += `${field},`;
        } else {
            ret += `"${field}",`;
        }
    }

    return ret;
}

function saveResultsData(data, res) {
    const columns = ["userId", "questionNumber", "graphType", "timestamp", "correctAnswer", "answer"];

    if (!fs.existsSync(dataFile)) {
        console.log("Data file does not exist yet, creating a new file");
        // Create file and add csv header to label columns
        const headerLine = columns.map(x => `"${x}"`).join(",") + ",\"serverTime\",\n";
        fs.writeFileSync(dataFile, headerLine);
    }

    // Use the simple approach of just dumping everything in a csv then sorting through it later
    const csvLine = extractCSVLine(data, columns) + `${new Date().getTime()},`;
    console.log(`Received data line "${csvLine}" from message ${JSON.stringify(data)}`);
    fs.appendFile(dataFile, csvLine + "\n", function (err) {
        if (err) {
            console.log(`An error occurred while appending the csv file: ${err.message}`);
            res.writeHead(500, "Internal Server Error");
            res.end(err.message);
        } else {
            res.writeHead(200, "OK");
            res.end("Data saved");
        }
    });
}

module.exports = app;