/**
 * Created by wesswang on 2015/2/2.
 */
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");
port = process.argv[2] || 8082;

http.createServer(function(request, response) {

    console.log(request.url);

    var uri = url.parse(request.url).pathname, filename = path.join(process.cwd(), uri);

    path.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }


            var dot  = filename.lastIndexOf(".");
            var extension  = filename.substring((dot + 1));
            var contentType = "text/html";
            //console.log(extension);


            if (extension === 'html') contentType = 'text/html';
            else if (extension === 'htm') contentType = 'text/html';
            else if (extension === 'css') contentType = 'text/css';
            else if (extension === 'js') contentType = 'text/javascript';
            else if (extension === 'png') contentType = 'image/png';
            else if (extension === 'jpg') contentType = 'image/jpg';
            else if (extension === 'jpeg') contentType = 'image/jpeg';
            else if (extension === 'woff2') contentType = ' application/font-woff2';
            else { console.log("NO CORRECT EXTENSION"); }


            response.writeHead(200, {"Content-Type": contentType});
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");