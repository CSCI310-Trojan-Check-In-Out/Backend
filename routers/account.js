const multer = require('multer');
const Router = require('express-promise-router')
const upload = multer();
const router = new Router();

// connect to database
const {pool: pool} = require('../database/db');

// example of querying database
router.get('/test', function(req, res) {

        console.log('Querying all rows from account');
        pool.query("SELECT * FROM account;", (err, val) => {
            if (err) throw err;
            console.log(JSON.stringify(val.rows));
            res.status(200).json(val.rows);
        })
});

router.get('/', function(req, res) {
    res.send("Account endpoint page. This is used to serve all APIs related to account management (registration, log in, etc.).");
});

router.post('/register', upload.none(), async (req, res) => {
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

    const existingUserData = await pool.query("SELECT * FROM account where email = $1;", [email])
    if(existingUserData.rows.length !== 0) {
        res.status(500).send("The user already exists.");
        return;
    }
    const newUserData  = await pool.query("INSERT INTO account (id, usc_id, username, major, email, passcode, picture, " +
        "is_admin) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7) RETURNING *;",
        [uscId, fullName, major, email, password, 'NULL', parseInt(isAdmin)])

    res.json(newUserData.rows[0])
});

router.post('/login', upload.none(), async (req, res) => {
    if(!req.is('multipart/form-data')) {
        res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
        return;
    }

    let email = req.body.email;
    let password = req.body.password;

    if(email === undefined ||
        password === undefined) {
        res.status(400).send("Missing form data.");
        return;
    }

    const existingUserData = await pool.query("SELECT * FROM account where email = $1 AND passcode = $2;", [email, password])
    if(existingUserData.rows.length === 0) {
        res.status(400).send("Username or password incorrect.");
    }
    else{
        req.session.userid = email;
        res.json(existingUserData.rows[0])
    }
});

router.post('/logout', upload.none(), async (req, res) => {
    if(!req.is('multipart/form-data')) {
        res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
        return;
    }

    req.session.regenerate(function(err) {
        if(err) {
            console.log(err);
        }
        res.sendStatus(200);
    });
});

router.post('/changePassword', upload.none(), async (req, res) => {
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
    let email = req.session.userid;

    if(oldPassword === undefined && newPassword === undefined) {
        res.status(400).send("Missing form data.");
        return;
    }

    const existingUserData = await pool.query("SELECT * FROM account where email = $1 AND passcode = $2;", [email, oldPassword])
    if(existingUserData.rows.length === 0) {
        res.status(400).send("Wrong old password entered.");
        return;
    }
    await pool.query("UPDATE account SET passcode = $1 WHERE id = $2", [newPassword, existingUserData.rows[0].id])
    res.sendStatus(200);
});

module.exports = router;