var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fs = require('fs');
var http = require('http');
var accountRouter = require('./routers/account');
var studentRouter = require('./routers/student');
var managerRouter = require('./routers/manager');

var useHttps = false;

// https connection
if(process.argv.length > 2 && process.argv[2] === "-https") {
    useHttps = true;
}

var app = express();

app.use(cookieParser());
app.use(session({secret: "secret"}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/account', accountRouter);
app.use('/student', studentRouter);
app.use('/manager', managerRouter);

// 404 Error handling route
app.get('*', (req, res) => {
    res.status(404).send("Resource not found");
});

httpServer = http.createServer(app);
httpServer.listen(process.env.PORT || 80, () => {
    console.log('HTTP server running')
});

if(useHttps) {
    var https = require('https');
    var cert, privkey;
    cert = fs.readFileSync('C:/Certbot/live/terrytang.dev/fullchain.pem');
    privkey = fs.readFileSync('C:/Certbot/live/terrytang.dev/privkey.pem');
    httpsServer = https.createServer({key: privkey, cert: cert}, app);
    httpsServer.listen(443, () => {
        console.log("HTTPS server running");
    });
}

const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();