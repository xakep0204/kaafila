var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: "Kaafila - Shiv Nadar School Noida",
        styles: [
            '/css/navbar.css',
            '/css/hero-banner.css',
            '/css/index.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});


router.get('/signin', function(req, res, next) {
    res.render('signin', {
        title: "Kaafila - Shiv Nadar School Noida",
        styles: [
            '/css/navbar-logo.css',
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
        styles: [
            '/css/navbar-logo.css',
            '/css/signup.css',
        ],
        scripts: [
            '/js/google_signin.js'
        ]
    });
});

router.get('/bread-and-circuses', function(req, res, next) {
    res.render('event', {
        title: "Bread & Circuses - Kaafila",
        eventName: "Bread & Circuses",
        eventImg: "img/bread-and-circuses-banner.png",
        styles: [
            '/css/navbar.css',
            '/css/event.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar-logo.js',
        ]
    });
});

router.get('/folk-fluence', function(req, res, next) {
    res.render('event', {
        title: "Folk Fluence - Kaafila",
        eventName: "Folk Fluence",
        eventImg: "img/folk-fluence-banner.png",
        styles: [
            '/css/navbar.css',
            '/css/event.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar-logo.js',
        ]
    });
});

router.get('/iridescence', function(req, res, next) {
    res.render('event', {
        title: "Iridescence - Kaafila",
        eventName: "Iridescence",
        eventImg: "img/iridescence-banner.png",
        styles: [
            '/css/navbar.css',
            '/css/event.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar-logo.js',
        ]
    });
});

router.get('/strings-attached', function(req, res, next) {
    res.render('event', {
        title: "Strings Attached - Kaafila",
        eventName: "Strings Attached",
        eventImg: "img/strings-attached-banner.png",
        styles: [
            '/css/navbar.css',
            '/css/event.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar-logo.js',
        ]
    });
});



module.exports = router;
