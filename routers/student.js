const multer = require('multer');
const Router = require('express-promise-router')
const FirebaseSync = require('../firebase/firebaseSync')
const upload = multer();
const router = new Router();

// connect to database
const {pool: pool} = require('../database/db');

router.get('/', (req, res) => {
    res.send("Student endpoint page. This is used to serve all APIs related to student clients (check in / out, view history).");
});

router.get('/test', async (req, res) =>{
    const historyData = await pool.query("SELECT * FROM place;");
    res.send(historyData.rows)
})

router.get('/insertPlaceTest', async (req, res) =>{
    await pool.query("INSERT INTO place (place_name, abbreviation, place_address,  picture, capacity, " +
        "current_numbers, open_time, close_time) " +
        "VALUES ('Viterbi Building', 'VB', '123', 'null', 10, 0, '1999-01-08 04:05:06', '1999-01-08 04:05:06');");
    res.sendStatus(200)
})

router.post('/checkin', upload.none(), async (req, res) => {
    if(!req.is('multipart/form-data')) {
        res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
        return;
    }

    if(!req.session.userid) {
        res.status(400).send("The client is not logged in.");
        return;
    }

    let qrCodeToken = req.body.qrCodeToken;
    if(!qrCodeToken) {
        res.status(400).send("Missing form data.");
        return;
    }

    const placeData = await pool.query("SELECT * FROM place WHERE qr_code_token = $1;", [qrCodeToken]);
    if(placeData.rows.length === 0) {
        res.status(400).send("Invalid or expired token.");
        return;
    }

    const existingHistoryData = await pool.query("SELECT * FROM visit_history WHERE account_id = $1", [req.session.userid])
    for (key in existingHistoryData.rows) {
        let history = existingHistoryData.rows[key];
        if(history.leave_time === null) {
            res.status(400).send("The client has unfinished check-in histories.");
            return;
        }
    }

    await pool.query("INSERT INTO visit_history (account_id, place_id) " +
        "VALUES (‘$1’, $2)", [req.session.userid, placeData.rows[0].id]);

    FirebaseSync.userCheckin(placeData.rows[0].id, req.session.userid);

    res.json(placeData.rows[0]);
});

router.post('/checkout', upload.none(), async (req, res) => {
    if(!req.is('multipart/form-data')) {
        res.status(415).send("Wrong form Content-Type. Should be multipart/form-data.");
        return;
    }

    if(!req.session.userid) {
        res.status(400).send("The client is not logged in.");
        return;
    }

    let qrCodeToken = req.body.qrCodeToken;
    if(!qrCodeToken) {
        res.status(400).send("Missing form data.");
        return;
    }

    // For convenience and safety, checks out all existing history
    const updatedHistoryData = await pool.query("UPDATE visit_history SET leave_time = CURRENT_TIMESTAMP WHERE account_id = $1 RETURNING place_id;", [req.session.userid]);
    for(key in updatedHistoryData.rows) {
        FirebaseSync.userCheckout(updatedHistoryData.rows[key].place_id, req.session.userid);
    }
    res.sendStatus(200);
});

router.post('/pastHistory', upload.none(), async (req, res) => {
    if(!req.session.userid) {
        res.status(400).send("The client is not logged in.");
        return;
    }

    let lookupTimeStr = "9999999";//req.body.lookupTime;
    if(!lookupTimeStr) {
        res.status(400).send("Missing form data.");
        return;
    }
    let lookupTime = parseInt(lookupTimeStr);
    
    // For convenience and safety, checks out all existing history
    const pastHistoryData = await pool.query("SELECT visit_history.id, visit_history.enter_time, " +
        "visit_history.leave_time, place.place_name, place.abbreviation, place.place_address, place.picture AS place_picture, " +
        "place.capacity, place.current_numbers, place.open_time, place.close_time FROM visit_history " +
        "FULL OUTER JOIN place ON place.id = visit_history.place_id " +
        "WHERE visit_history.account_id = $1" +
        " AND EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - visit_history.enter_time)) < $2;",
        [req.session.userid, lookupTime]);

    res.json(pastHistoryData.rows);
});

module.exports = router;