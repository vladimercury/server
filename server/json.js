var fs = require('fs');

exports.read = function(file){
	return JSON.parse(fs.readFileSync(file, 'utf8'));
}

exports.write = function(file, data){
	fs.writeFileSync(file, JSON.stringify(data));
}