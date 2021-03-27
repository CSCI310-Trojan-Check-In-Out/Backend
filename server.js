const fs = require("fs");
const http = require("http");
const app = require("./app");

var useHttps = false;

// https connection
if (process.argv.length > 2 && process.argv[2] === "-https") {
    useHttps = true;
}

httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 80, () => {
    console.log("HTTP server running");
});

if (useHttps) {
    var https = require("https");
    var cert, privkey;
    cert = fs.readFileSync("C:/Certbot/live/terrytang.dev/fullchain.pem");
    privkey = fs.readFileSync("C:/Certbot/live/terrytang.dev/privkey.pem");
    httpsServer = https.createServer({ key: privkey, cert: cert }, app);
    httpsServer.listen(443, () => {
        console.log("HTTPS server running");
    });
}