var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: "Express",
        headerStyles: ['/css/navbar.css'],
        scripts: ['/js/navbar.js']
    });
});

module.exports = router;