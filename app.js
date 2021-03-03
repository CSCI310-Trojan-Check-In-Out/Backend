const port = 80;

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var accountRouter = require('./routers/account');
var studentRouter = require('./routers/student');
var managerRouter = require('./routers/manager');

var app = express();

app.use(cookieParser());
app.use(session({secret: "secret"}));

app.use('/account', accountRouter);
app.use('/student', studentRouter);
app.use('/manager', managerRouter);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});