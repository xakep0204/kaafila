var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");

var galleryDirectoryPath = path.join(__dirname, "../public/img/gallery");
var sponsorsDirectoryPath = path.join(__dirname, "../public/img/sponsors");

router.get("/", function (req, res, next) {
	var galleryImagesMain = [];
	var galleryImages = [];
	var galleryImagesMore = [];

	fs.readdir(galleryDirectoryPath, function (err, files) {
		if (err) {
			return console.log("Unable to scan directory: " + err);
		}
		files.forEach(function (file) {
			if (
				file.slice(-3) == "jpg" ||
				file.slice(-3) == "png" ||
				file.slice(-3) == "JPG" ||
				file.slice(-3) == "gif"
			) {
				imageObject = { path: file, caption: file.slice(0, -4) };
				galleryImagesMain.push(imageObject);
			}
		});
		if (galleryImagesMain.length > 8) {
			galleryImagesMore = galleryImagesMain.slice(
				8,
				galleryImagesMain.length - 1
			);
			galleryImages = galleryImagesMain.slice(0, 8);
		} else {
			galleryImages = galleryImagesMain;
		}
		// console.log("Main", galleryImagesMain.length, "null", galleryImages.length, "More", galleryImagesMore.length)
		res.render("index", {
			title: "Kaafila - Shiv Nadar School Noida",
			galleryImages: galleryImages,
			galleryImagesMore: galleryImagesMore,
			styles: ["/css/pastels.css"],
			scripts: ["/js/navbar.js", "/js/about.js"],
		});
	});
});

// router.get('/about', function(req, res, next) {
//     var galleryImages = []
//     fs.readdir(galleryDirectoryPath, function (err, files) {
//         if (err) {
//             return console.log('Unable to scan directory: ' + err);
//         }
//         files.forEach(function (file) {
//             if (file.slice(-3) == 'jpg' || file.slice(-3) == 'png' || file.slice(-3) == 'JPG' || file.slice(-3) == 'gif') {
//                 imageObject = {'path': file, 'caption': file.slice(0, -4)}
//                 galleryImages.push(imageObject);
//             }
//         });
//     });
//     var sponsorsImages = []
//     fs.readdir(sponsorsDirectoryPath, function (err, files) {
//         if (err) {
//             return console.log('Unable to scan directory: ' + err);
//         }
//         files.forEach(function (file) {
//             if (file.slice(-3) == 'jpg' || file.slice(-3) == 'png' || file.slice(-3) == 'gif') {
//                 sponsorsImages.push(file);
//             }
//         });
//     });

//     res.render('about', {
//         title: "About - Kaafila",
//         active_a: true,
//         galleryImages: galleryImages,
//         sponsorsImages: sponsorsImages,
//         styles: [
//             '/css/pastels.css',
//             '/css/fancybox.min.css'
//         ],
//         scripts: [
//             '/js/navbar.js',
//             '/js/fancybox.min.js',
//             '/js/about.js'
//         ]
//     });
// });

const authCheck = (req, res, next) => {
	if (!req.user) {
		res.redirect("/signin");
	} else {
		next();
	}
};

router.get("/profile", (req, res) => {
	res.render("profile", {
		active_p: true,
		user: req.user,
	});
});

module.exports = router;
