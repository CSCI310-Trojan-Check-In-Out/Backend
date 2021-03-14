const express = require('express');
const router = express.Router();

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

    let fullName = req.body.fullName;
    let uscId = req.body.uscId;
    let password = req.body.password;
    let uscEmail = req.body.uscEmail;
    let accountType = req.body.accountType;

    // Firebase is going to handle profile picture upload
    // let profilePic = req.body.profilepic;

    if(fullName === undefined ||
        uscId === undefined ||
        password === undefined ||
        uscEmail === undefined ||
        accountType === undefined) {
        res.status(400).send("Missing form data.");
        return;
    }

    // TODO: Check if same uscId already exists in database and store it if needed

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

    // TODO: Validate user credentials in the database

    // Temporary field; this should be guaranteed to be its userid
    req.session.userid = username;
    res.sendStatus(200);
});

router.post('/logout', function(req, res) {
    req.session.regenerate(function(err) {
        if(err) {
            console.log(err);
        }
        res.sendStatus(200);
    });
});

router.post('/changePassword', function(req, res) {
    if(req.header('Content-Type') !== 'application/x-www-form-urlencoded') {
        res.status(400).send("Wrong form Content-Type. Should be application/x-www-form-urlencoded.");
        return;
    }

    if(!req.session.userid) {
        res.status(400).send("The client is not logged in.");
        return;
    }

    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    // TODO: Validate user credentials with session.userid and oldPassword, update to newPassword if valid

    req.sendStatus(200);
});



module.exports = router;
