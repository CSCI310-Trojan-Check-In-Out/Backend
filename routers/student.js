const multer = require('multer');
const Router = require('express-promise-router')
const upload = multer();
const router = new Router();

// connect to database
const {pool: pool} = require('../database/db');

router.get('/', (req, res) => {
    res.send("Student endpoint page. This is used to serve all APIs related to student clients (check in / out, view history).");
});

router.post('/checkin', upload.none(), async (req, res) => {
    if(!req.is('multipart/form-data')) {
        res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
        return;
    }

    if(!req.session.userid) {
        res.status(400).send("The client is not logged in.");
        console.log(req.session.userid);
        return;
    }


});

module.exports = router;