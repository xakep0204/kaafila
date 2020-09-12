var express = require("express");
var path = require("path");
var fs = require("fs").promises;
var admin = require("../firebase-proj");

var router = express.Router();
var galleryDirectoryPath = path.join(__dirname, process.env.GALLERY_PATH);

async function renderIndex(res, req) {
	var userData = {};
	var galleryImagesMain = [];
	var galleryImages = [];
	var galleryImagesMore = [];
	const sessionCookie = req.cookies.session || "";

	const webrender = () => {
		res.render("index", {
			title: "Kaafila - Shiv Nadar School Noida",
			galleryImages: galleryImages,
			galleryImagesMore: galleryImagesMore,
			userData: Object.keys(userData).length > 0 ? userData : null,
			scripts: ["/js/index.js"],
		});
	};

	const processGalleryFiles = async () => {
		try {
			const files = await fs.readdir(galleryDirectoryPath)
			files.forEach((file) => {
				if (["jpg", "png", "JPG", "gif"].includes(file.slice(-3))) {
					imageObject = { path: file, caption: file.slice(0, -4) };
					galleryImagesMain.push(imageObject);
				}
			});
			if (galleryImagesMain.length > 8) {
				galleryImagesMore = galleryImagesMain.slice(8);
				galleryImages = galleryImagesMain.slice(0, 8);
			}
			else {
				galleryImages = galleryImagesMain;
			}
		} catch (err) {
			return console.log("Unable to scan directory: " + err);
		}
		
	}

	try {
		const loadGallery = await processGalleryFiles()
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const user = await admin.auth().getUser(firebaseUserClaims.sub)
		userData = {photoURL: user.photoURL,};
		webrender();
	} catch (err) {
		if (err.code !== "auth/argument-error") { console.log(err); }
		webrender();
	}
}

router.get("/", (req, res, next) => renderIndex(res, req));

module.exports = router;