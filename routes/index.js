var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");
var admin = require("../firebase-proj");

var galleryDirectoryPath = path.join(__dirname, process.env.GALLERY_PATH);
// var galleryDirectoryPath = path.join(__dirname, "../public/img/gallery");

router.get("/", function (req, res, next) {
	var userData = {}
	var webrender = () => {
		res.render("index", {
			title: "Kaafila - Shiv Nadar School Noida",
			galleryImages: galleryImages,
			galleryImagesMore: galleryImagesMore,
			scripts: ["/js/index.js"],
			userData: userData,
		});
	}

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

		const sessionCookie = req.cookies.session || "";
		admin
			.auth()
			.verifySessionCookie(sessionCookie, true)
			.then(function (decodedClaims) {
				admin
					.auth()
					.getUser(decodedClaims.sub)
					.then(function (userRecord) {
						userData = {
							photoURL: userRecord.photoURL,
						};
						webrender();
					})
					.catch(() => {
						webrender();
					});
			})
			.catch(() => {
				webrender();
			});
	});
});

module.exports = router;