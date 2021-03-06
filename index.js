var http = require('http');  // http api
var fs   = require('fs');    // file-system api
var url  = require('url');   // url-parsing library
var mime = require('mime');  // MIME-lookup library
var port = process.env.PORT || 8000;         // port to listen on
var absPath = process.env.ABSPATH || true;   // view whole file system?

/**
 * Convert a url to a path on the filesystem.
 * @param {urlStr} String with the requested url
 */
function urlToPath(urlStr) {
  var path = decodeURIComponent(url.parse(urlStr).pathname);
  if (absPath) {
    return path;      // relative to root
  } else {
    return '.' + path; // relative to pwd
  }
}

var htmlHeader = fs.readFileSync('commonHeader.html');
var htmlFooter = fs.readFileSync('local.js') +
                 fs.readFileSync('commonFooter.html');

// Hold HTTP request handling functions for different request methods
var methods = {};

/**
 * Handle an HTTP GET request.
 * @param {path} The requested path in the file system
 * @param {respond} Callback to send response to
 */
methods.GET = function(path, respond) {
  console.log("GET " + path);
  // fs.stat gets statistics about a file/directory
  fs.stat(path, function(error, stats) {
    if (error && error.code == 'ENOENT') {
      respond(404, 'File not found');
    } else if (error) {
      respond(500, 'Internal server error: ' + error.toString());
    } else if (stats.isDirectory()) {
      // fs.readdir returns an array of filenames in a directory
      fs.readdir(path, function(error, files) {
        if (error) {
          respond(500, 'Internal server error: ' + error.toString());
        } else {
          respond(200, htmlHeader + 'var files = '  + JSON.stringify(files) +
              '\n' + htmlFooter, 'text/html');
        }
      });
    } else {
      // respond with the file data
      respond(200, fs.createReadStream(path), mime.lookup(path));
    }
  })
};

// Initialize an http server. The callback is called whenever a request arrives
var server = http.createServer(function(request, response) {

  /**
   * Send an HTTP response.
   * @param {code} Respose code, e.g. 404 for HTTP 404 NOT FOUND
   * @param {body} String of text or a readable stream to send
   * @param {type} MIME type of data being sent, e.g. 'text/html'
   */
  function respond(code, body, type) {
    if (!type) type = 'text/plain';
    response.writeHead(code, {'Content-Type': type});
    if (body && body.pipe) {
      // Body was a readable stream; write it to output
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

server.listen(port);
