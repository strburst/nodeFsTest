#File System Test App

This is a simple Node.js file-system explorer application designed for
experimenting with Heroku and Node.js' file-system APIs. The clever bits of
routing code are from [Ch 20:
Node.js](http://eloquentjavascript.net/20_node.html) of Eloquent Javascript;
the code to render directory listings is written by me. Running this
application on a public server is probably a security risk, since it returns
information about all requested files/directories.

##Running locally

To install this package locally, simply run `npm install` in the project root.
To run this project, run `node index.js` or `npm start` and navigate to
`localhost:8000`.
