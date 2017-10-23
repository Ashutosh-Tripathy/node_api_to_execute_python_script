var http = require('http');
var port = 8000;

var handlePostRequest = (req, res) =>{
	
};

var server =http.createServer(function (req, res) {
	if(req.method == "POST"){
		handlePostRequest(req, res);
	} else {
		res.end("This action is not available.");
	}
});

server.listen(port);
console.log("server is listing on port: " + port);
