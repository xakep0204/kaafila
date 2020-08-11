var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');


var galleryDirectoryPath = path.join(__dirname, '../public/img/gallery');
var sponsorsDirectoryPath = path.join(__dirname, '../public/img/sponsors');

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
    var galleryImages = []
    fs.readdir(galleryDirectoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            if (file.slice(-3) == 'jpg' || file.slice(-3) == 'png' || file.slice(-3) == 'JPG' || file.slice(-3) == 'gif') {
                imageObject = {'path': file, 'caption': file.slice(0, -4)}
                galleryImages.push(imageObject);
                console.log(imageObject)
            }
        });
    });
    var sponsorsImages = []
    fs.readdir(sponsorsDirectoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            if (file.slice(-3) == 'jpg' || file.slice(-3) == 'png' || file.slice(-3) == 'gif') {
                sponsorsImages.push(file);
            }
        });
    });

    res.render('about', {
        title: "About - Kaafila",
        active_a: true,
        galleryImages: galleryImages,
        sponsorsImages: sponsorsImages,
        styles: [
            '/css/pastels.css',
            '/css/fancybox.min.css'
        ],
        scripts: [
            '/js/navbar.js',
            '/js/fancybox.min.js',
            '/js/about.js'
        ]
    });
});

router.get('/bread-and-circuses', function(req, res, next) {
    res.render('event', {
        title: "Bread and Circuses - Kaafila",
        header_bnc: true,
        header: 'Bread <span class="princess-sofia">&</span> Circuses',
        headerFont: 'rye',
        headerGradient: 'background: rgb(201,120,76); background: linear-gradient(45deg, rgba(201,120,76,1) 37%, rgba(217,217,217,1) 100%);',
        bannerName: "bread-and-circuses",
        active_bnc: true,
        styles: [
            '/css/fonts.css',
            '/css/events.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});
router.get('/folk-fluence', function(req, res, next) {
    res.render('event', {
        title: "Folk Fluence - Kaafila",
        header: 'Folk Fluence',
        headerFont: 'ardagh',
        headerGradient: 'background: rgb(145,63,63); background: linear-gradient(45deg, rgba(145,63,63,1) 0%, rgba(156,185,53,1) 100%);',
        bannerName: "folk-fluence",
        active_ff: true,
        styles: [
            '/css/fonts.css',
            '/css/events.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});
router.get('/iridescence', function(req, res, next) {
    res.render('event', {
        title: "Iridescence - Kaafila",
        header: 'Iridescence',
        headerFont: 'apple-garamond',
        headerGradient: 'background: rgb(183,145,182); background: linear-gradient(45deg, rgba(183,145,182,1) 41%, rgba(91,208,186,1) 100%);',
        bannerName: "iridescence",
        active_i: true,
        styles: [
            '/css/fonts.css',
            '/css/events.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});
router.get('/strings-attached', function(req, res, next) {
    res.render('event', {
        title: "Strings Attached - Kaafila",
        header: 'Strings Attached',
        headerFont: 'welcome',
        headerGradient: 'background: rgb(203,78,44); background: linear-gradient(45deg, rgba(203,78,44,1) 0%, rgba(208,139,53,1) 100%);',
        bannerName: "strings-attached",
        active_sa: true,
        styles: [
            '/css/fonts.css',
            '/css/events.css',
            '/css/pastels.css',
        ],
        scripts: [
            '/js/navbar.js',
        ]
    });
});


const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/signin');
    } else {
        next();
    }
};

router.get('/profile', (req, res) => {
    res.render('profile', { 
        user: req.user 
    });
});

module.exports = router;
