var fs = require('fs');
var uuid = require('node-uuid');

var json = require('./json');

var lpath = './links/';

var tree;

function readFilesOf(branch){
	for ( var i in branch ){
		var link = branch[i];
		if ( link["type"] == "menu" ){
			tree[link["file"]] = json.read(lpath + link["file"] + ".json");
			readFilesOf(tree[link["file"]]);
		}
	}
}

function refreshFile(file){
	json.write(lpath + file + ".json", tree[file]);
}

function removeMenu(menu){
	for (var item in tree[menu]){
		if (tree[menu][item]["type"] == "menu"){
			removeMenu(tree[menu][item]["file"]);
		}
		else{
			delete tree[menu][item];
		}
	}
	delete tree[menu];
	console.log(fs.unlink(lpath + menu + ".json"));
}

function start(){
	var root = lpath + 'root.json';
	if (!fs.existsSync(root)){
		fs.writeFileSync(root, JSON.stringify({}));
	}
	tree = {
		"root": json.read(root)
	};
	readFilesOf(tree["root"]);
	//console.log(tree);
}

exports.createlink = function(menu, title, href){
	if (tree.hasOwnProperty(menu)) {
		var uid;
		do{
			uid = uuid.v4();
		} while(tree[menu].hasOwnProperty(uid));
		tree[menu][uid] = {
			"type": "link",
			"href": href,
			"title": title,
		}
		refreshFile(menu);
		return tree[menu];
	}
	return null;
};

exports.createmenu = function(menu, title){
	if (tree.hasOwnProperty(menu)) {
		var uid;
		do{
			uid = uuid.v4();
		} while(tree[menu].hasOwnProperty(uid) || tree.hasOwnProperty(uid));
		tree[uid] = {};
		tree[menu][uid] = {
			"type": "menu",
			"file": uid,
			"title": title,
		}
		refreshFile(uid);
		refreshFile(menu);
		return tree[menu];
	}
	return null;
}

exports.removelink = function(menu, id){
	if (tree.hasOwnProperty(menu)){
		if (tree[menu].hasOwnProperty(id)){
			if (tree[menu][id]["type"] == "menu"){
				removeMenu(id);
			}
			delete tree[menu][id];
			refreshFile(menu);
			return tree[menu];
		}
	}
	return null;
};

exports.tree = function(){
	return tree;
};

start();