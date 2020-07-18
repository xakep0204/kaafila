var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: "Kaafila - Shiv Nadar School Noida",
        headerStyles: [
            '/css/navbar.css',
            '/css/hero-banner.css',
            '/css/index.css',
            '/css/pastels.css'
        ],
        scripts: [
            '/js/navbar.js'
        ]
    });
});


router.get('/signin', function(req, res, next) {
    res.render('signin', {
        title: "Kaafila - Shiv Nadar School Noida",
        headerStyles: [
            '/css/navbar_logo.css',
            '/css/signin.css',
        ],
        scripts: [
            '/js/google_signin.js'
        ]
    });
});

router.get('/signup', function(req, res, next) {
    res.render('signup', {
        title: "Kaafila - Shiv Nadar School Noida",
        headerStyles: [
            '/css/navbar_logo.css',
            '/css/signup.css',
        ],
        scripts: [
            '/js/google_signin.js'
        ]
    });
});

module.exports = router;
