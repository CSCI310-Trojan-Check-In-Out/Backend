var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send("Student endpoint page. This is used to serve all APIs related to student clients (check in / out, view history).");
});

module.exports = router;