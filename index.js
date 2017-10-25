var http = require('http');
var PythonShell = require('python-shell');
var port = 8000;
var querystring = require('querystring');
var url = require('url');

var handleGetData = (req, res) => {
    var queryData = url.parse(req.url, true).query;
    if(queryData.name){
        executeScript(queryData.name,()=>{
            res.statusCode = 200;
            res.end("Successful");
        });
    } else {
        res.statusCode = 422;
        res.end("Invalid query parameter");
    }
};

var server = http.createServer(function(req, res) {
    if (req.method == "GET" && req.url.indexOf('/getpythonmessage') == 0) {
        handleGetData(req,res);
    } else {
        res.statusCode = 405;
        res.end("This action is not available.");
    }
});



var executeScript = (name, cb) =>{
    var shell = new PythonShell('my_script.py', { mode: 'text',scriptPath:'script/'});
    shell.on('message', function (message) {
        console.log(message);
      });
      shell.send(name);
      cb();
    //   shell.end(function (err) {
    //     if (err) throw err;
    //     console.log('finished');
    // });
}; 

server.listen(port);
console.log("server is listing on port: " + port);