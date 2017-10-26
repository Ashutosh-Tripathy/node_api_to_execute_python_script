var http = require('http');
var PythonShell = require('python-shell');
var port = 8000;
var querystring = require('querystring');
var url = require('url');

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
            reject("Invalid query parameter");
        }
        var shell = new PythonShell('my_script.py', { mode: 'text', scriptPath: 'script/' });
        shell.on('message', function (message) {
            resolve(message);
        });
        shell.send(JSON.stringify({ name: name }));
    })
    shell.end(function (err) {
        if (err) throw err;
        // console.log('finished');
    });
};

var server = http.createServer(function (req, res) {
    if (req.method == "GET" && req.url.indexOf('/getpythonmessage') == 0) {
        getPythonMessage(req, res)
            .then((message) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(message);
            })
            .catch((e) => {
                res.statusCode = 422;
                res.end(e);
                // res.end("Invalid query parameter");
            });
    } else {
        res.statusCode = 405;
        res.end("This action is not available.");
    }
});

server.listen(port);
console.log("server is listing on port: " + port);