var http = require('http');
var PythonShell = require('python-shell');
var port = 8000;
var querystring = require('querystring');
var url = require('url');
var logger = require('./logger');
var requestId = 1;

var log = (level, message) => {
    logger(level, message);
};

var getPythonMessage = (req, res) => {
    return new Promise((resolve, reject) => {
        var queryData = url.parse(req.url, true).query;
        executeScript(queryData.name)
            .then((message) => resolve(message))
            .catch(reject);
    });
};

var executeScript = (name) => {
    return new Promise((resolve, reject) => {
        if (!name) {
            return reject("Invalid query parameter");
        }
        var shell = new PythonShell('my_script.py', { mode: 'text', pythonOptions: ['-u'], scriptPath: 'script/' });
        shell.on('message', function (message) {
            log(2, "Python script exected successfully");
            return resolve(message);
        });
        var input = JSON.stringify({ name: name });
        log(2, "Run scrint with parameter: " + input);
        shell.send(input);
    })
    // shell.end(function (err) {
    //     if (err) throw err;
    //     log(4, "Python script exected successfully");
    //     // console.log('finished');
    // });
};

var server = http.createServer(function (req, res) {
    req.id = requestId++;
    if (req.method == "GET" && req.url.indexOf('/getpythonmessage') == 0) {
        getPythonMessage(req, res)
            .then((message) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(message);
            })
            .catch((e) => {
                log(1, e);
                res.statusCode = 422;
                res.end(e);
            });
    } else {
        log(4, "Got invalid request");
        res.statusCode = 405;
        res.end("This action is not available.");
    }
});

server.listen(port);
log(2, "server is listing on port: " + port);