var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: "Kaafila - Shiv Nadar School Noida",
        styles: [
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});
router.get('/about', function(req, res, next) {
    res.render('about', {
        title: "About - Kaafila",
        active_a: true,
        styles: [
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});

router.get('/bread-and-circuses', function(req, res, next) {
    res.render('events/bread-and-circuses', {
        title: "Bread and Circuses - Kaafila",
        active_bnc: true,
        styles: [
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});
router.get('/folk-fluence', function(req, res, next) {
    res.render('events/folk-fluence', {
        title: "Folk Fluence - Kaafila",
        active_ff: true,
        styles: [
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});
router.get('/iridescence', function(req, res, next) {
    res.render('events/iridescence', {
        title: "Iridescence - Kaafila",
        active_i: true,
        styles: [
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});
router.get('/strings-attached', function(req, res, next) {
    res.render('events/strings-attached', {
        title: "Strings Attached - Kaafila",
        active_sa: true,
        styles: [
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});

module.exports = router;
