var http = require('http');

var url = require('url');

var path = require('path');

var fs = require('fs');

var mimeTypes = {
	'html' : 'text/html',
	'jpeg' : 'image/jpeg',
	'jpg' : 'image/jpeg',
	'png' : 'image/png',
	'js' : 'text/javascript',
	'css' : 'text/css'
};

//create server

http.createServer(function(req , res){
	var uri = url.parse(req.url).pathname;
	//process.cwd returns the current working directory of the process
	var fileName = path.join(process.cwd() , unescape(uri));
	console.log('loading ' + uri);
	var stats;
	try{
		stats = fs.lstatSync(fileName);
	}catch(e){
		res.writeHead(404 , {'Content-type' : 'text/plain'});
		res.write('404 not found\n');
		res.end();
		return;
	}
	
	//Check if the file
	if(stats.isFile()){
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
		res.writeHead(200 , {'Content-type' : mimeType});
		var fileStream = fs.createReadStream(fileName);
		fileStream.pipe(res);
	}else if(stats.isDirectory()){
		res.writeHead(302 , {'Location' : 'index.html'});
		res.end();
	}else{
		res.writeHead(500 , {'Content-type' : 'text/plain'});
		res.write('500 internal error');
		res.end();
	}
}).listen(3000);