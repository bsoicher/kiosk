const finalhandler = require("finalhandler");
const serveStatic = require("serve-static");
const http = require("http");
const open = require("open");

// Serve dist folder as static
var port = 8080;
var serve = serveStatic("dist");

// Create server
var server = http.createServer(function (req, res) {
  serve(req, res, finalhandler(req, res));
})

// Listen
server.listen(port);
console.log(`Server running on port ${port}`);

// Open in firefox
open(`http://localhost:${port}`, {
  app: {
    name: "firefox",
    //arguments: ["--kiosk"]
  }
});
