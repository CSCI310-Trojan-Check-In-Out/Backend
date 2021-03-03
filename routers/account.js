var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send("Account endpoint page. This is used to serve all APIs related to account management (registration, log in, etc.).");
});

module.exports = router;