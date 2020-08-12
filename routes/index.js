var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');


var galleryDirectoryPath = path.join(__dirname, '../public/img/gallery');
var sponsorsDirectoryPath = path.join(__dirname, '../public/img/sponsors');

router.get('/', function(req, res, next) {
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
    res.render('index', {
        title: "Kaafila - Shiv Nadar School Noida",
        galleryImages: galleryImages,
        sponsorsImages: sponsorsImages,
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
