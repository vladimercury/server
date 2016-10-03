var http = require('http');
var static = require('node-static');
var file = new static.Server('./all');

var json = require('./json');

function createServer(port){
	http.createServer(handleRequest).listen(port);
	console.log('Server running on port ' + port);
}

function handleRequest(req, res){
	file.serve(req,res);
}

console.log(json.read('./db/links.json'));