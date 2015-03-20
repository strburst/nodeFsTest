var http = require('http')
var fs   = require('fs')
var url  = require('url');
var mime = require('mime');

function urlToPath(urlStr) {
  var path = url.parse(urlStr).pathname;
  return decodeURIComponent(path);
  // return '.' + decodeURIComponent(path);
}

var methods = {};

methods.GET = function(path, respond) {
  console.log("GET " + path);
  fs.stat(path, function(error, stats) {
    if (error && error.code == 'ENOENT') {
      respond(404, 'File not found');
    } else if (error) {
      respond(500, 'Internal server error: ' + error.toString());
    } else if (stats.isDirectory()) {
      fs.readdir(path, function(error, files) {
        if (error) {
          respond(500, 'Internal server error: ' + error.toString());
        } else {
          respond(200, files.join('\n'));
        }
      });
    } else {
      respond(200, fs.createReadStream(path), mime.lookup(path));
    }
  })
};

var server = http.createServer(function(request, response) {

  function respond(code, body, type) {
    if (!type) type = 'text/plain';
    response.writeHead(code, {'Content-Type': type});
    if (body && body.pipe) {
      body.pipe(response);
    } else {
      response.end(body);
    }
  }

  if (request.method in methods) {
    methods[request.method](urlToPath(request.url), respond, request);
  } else {
    respond(405, 'Method ' + request.method + ' not allowed');
  }

});

server.listen(80);
