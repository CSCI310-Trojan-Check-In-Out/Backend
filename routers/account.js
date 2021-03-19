const express = require('express');
const multer = require('multer');
const upload = multer();
const router = express.Router();
// connect to database
const {pool: pool} = require('../database/db');

// example of querying database
router.get('/test', function(req, res) {
    try {
        console.log('Querying all rows from account');
        pool.query('SELECT * FROM account;', (err, val) => {
            if (err) throw err;
            console.log(JSON.stringify(val.rows));
            res.status(200).json(val.rows);
        });
    } catch (err) {
        console.error(err.message);
    }
});

router.get('/', function(req, res) {
    res.send("Account endpoint page. This is used to serve all APIs related to account management (registration, log in, etc.).");
});

router.post('/register', upload.none(), function(req, res) {
    if(!req.is('multipart/form-data')) {
        res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
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
    let email = req.body.email;
    let isAdmin = req.body.isAdmin;
    let major = req.body.major;

    // Firebase is going to handle profile picture upload
    // let image = req.body.image;

    if(fullName === undefined ||
        uscId === undefined ||
        password === undefined ||
        email === undefined ||
        isAdmin === undefined ||
        major === undefined) {
        res.status(400).send("Missing form data.");
        return;
    }
    // TODO: Check if same uscId already exists in database and store it if needed


    // Temporary field; this should be guaranteed to be its userid
    req.session.userid = uscId;
    const data = {
        id: 1,
        usc_id: 111,
        username: 'Nate',
        email: 'huan773@usc.edu',
        picture: 'picture.com',
        isAdmin: true,
        major: 'computer science',
      };
    res.status(200).send(data);
});

router.post('/login', upload.none(), function (req, res) {
    if(!req.is('multipart/form-data')) {
        res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
        return;
    }


     // TODO: change fake data
     const data = {
        id: 1,
        usc_id: 111,
        username: 'Nate',
        email: 'huan773@usc.edu',
        picture: 'picture.com',
        isAdmin: true,
        major: 'computer science',
      };

    if(req.session.userid) {
        console.log(req.session.userid + " already log in");
        res.status(200).send([data]);
        return;
    }

    let email = req.body.email;
    let password = req.body.password;

    if(email === undefined ||
        password === undefined) {
        res.status(400).send("Missing form data.");
        return;
    }

    // TODO: Validate user credentials in the database

    // Temporary field; this should be guaranteed to be its userid
    req.session.userid = email;

   
    res.status(200).send([data]);
});

router.post('/logout', upload.none(), function(req, res) {
    // if(!req.is('multipart/form-data')) {
    //     res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
    //     return;
    // }

    req.session.regenerate(function(err) {
        if(err) {
            console.log(err);
        }
        res.sendStatus(200);
    });
});

router.post('/changePassword', upload.none(), function(req, res) {
    if(!req.is('multipart/form-data')) {
        res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
        return;
    }

    if(!req.session.userid) {
        res.status(400).send("The client is not logged in.");
        return;
    }

    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    // TODO: Validate user credentials with session.userid and oldPassword, update to newPassword if valid

    res.sendStatus(200);
});

module.exports = router;