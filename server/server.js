var http = require('http');
var static = require('node-static');
var uuid = require('node-uuid');
var file = new static.Server('./all');

var links = require('./links');
var linksrender = require('./linksrender');

function createServer(port){
	http.createServer(handleRequest).listen(port);
	console.log('Server running on port ' + port);
}

function handleRequest(req, res){
	file.serve(req,res);
}

console.log(links.tree());