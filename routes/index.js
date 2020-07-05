var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: "Express",
        headerStyles: '/partials/navbar_css'
    });
});

module.exports = router;