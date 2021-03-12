var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    res.send("Account endpoint page. This is used to serve all APIs related to account management (registration, log in, etc.).");
});

router.post('/register', function(req, res) {
    if(req.header('Content-Type') !== 'application/x-www-form-urlencoded') {
        res.status(400).send("Wrong form Content-Type. Should be application/x-www-form-urlencoded.");
        return;
    }

    if(req.session.userid) {
        res.status(400).send("The client has already logged in.");
        console.log(req.session.userid);
        return;
    }

    let fullName = req.body.fullname;
    let uscId = req.body.uscid;
    let password = req.body.password;
    let uscEmail = req.body.uscemail;
    let accountType = req.body.accounttype;

    // Firebase is going to handle profile picture upload
    // let profilePic = req.body.profilepic;

    if(fullName === undefined ||
        uscId === undefined ||
        password === undefined ||
        uscEmail === undefined ||
        accountType === undefined) {
        res.status(400).send("Missing form data.");
    }

    // Stub: Check if same uscId already exists in database and store it if needed

    // Temporary field; this should be guaranteed to be its userid
    req.session.userid = uscId;
    res.sendStatus(200);
});

router.post('/login', function (req, res) {
    if(req.header('Content-Type') !== 'application/x-www-form-urlencoded') {
        res.status(400).send("Wrong form Content-Type. Should be application/x-www-form-urlencoded.");
        return;
    }

    if(req.session.userid) {
        res.sendStatus(200);
        return;
    }

    let username = req.body.username;
    let password = req.body.password;

    if(username === undefined ||
        password === undefined) {
        res.status(400).send("Missing form data.");
        return;
    }

    // Stub: Validate user credentials in the database

    // Temporary field; this should be guaranteed to be its userid
    req.session.userid = username;
    res.sendStatus(200);
});

module.exports = router;