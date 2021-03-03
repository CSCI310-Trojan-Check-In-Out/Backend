var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send("Manager endpoint page. This is used to serve all APIs related to manager clients (upload CSV, view / edit history, etc.).");
});

module.exports = router;