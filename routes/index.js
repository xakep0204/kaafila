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

router.get('/breadandcircuses', function(req, res, next) {
    res.render('event', {
        title: "Bread & Circuses - Kaafila",
        eventName: "Bread & Circuses",
        eventImg: "img/gallery/1.jpg",
        headerStyles: [
            '/css/navbar.css',
            '/css/event.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar_nonhome.js',
        ]
    });
});

router.get('/folkfluence', function(req, res, next) {
    res.render('event', {
        title: "Folk Fluence - Kaafila",
        eventName: "Folk Fluence",
        eventImg: "img/gallery/2.jpg",
        headerStyles: [
            '/css/navbar.css',
            '/css/event.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar_nonhome.js',
        ]
    });
});

router.get('/iridescence', function(req, res, next) {
    res.render('event', {
        title: "Iridescence - Kaafila",
        eventName: "Iridescence",
        eventImg: "img/gallery/3.jpg",
        headerStyles: [
            '/css/navbar.css',
            '/css/event.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar_nonhome.js',
        ]
    });
});

router.get('/stringsattached', function(req, res, next) {
    res.render('event', {
        title: "Strings Attached - Kaafila",
        eventName: "Strings Attached",
        eventImg: "img/gallery/4.jpg",
        headerStyles: [
            '/css/navbar.css',
            '/css/event.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar_nonhome.js',
        ]
    });
});



module.exports = router;
