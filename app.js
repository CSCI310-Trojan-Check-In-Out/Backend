var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fs = require('fs');
var http = require('http');
var https = require('https');
var cert, privkey, useHttps = false;
var accountRouter = require('./routers/account');
var studentRouter = require('./routers/student');
var managerRouter = require('./routers/manager');

if(process.argv.length > 2 && process.argv[2] === "-https") {
    cert = fs.readFileSync('C:/Certbot/live/terrytang.dev/fullchain.pem');
    privkey = fs.readFileSync('C:/Certbot/live/terrytang.dev/privkey.pem');
    useHttps = true;
}

var app = express();

app.use(cookieParser());
app.use(session({secret: "secret"}));

app.use('/account', accountRouter);
app.use('/student', studentRouter);
app.use('/manager', managerRouter);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 80, () => {
    console.log('HTTP server running')
});

if(useHttps) {
    httpsServer = https.createServer({key: privkey, cert: cert}, app);
    httpsServer.listen(443, () => {
        console.log("HTTPS server running");
    });
}