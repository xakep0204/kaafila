var express = require("express");
var path = require("path");
var fs = require("fs").promises;
var admin = require("../firebase-proj");

var router = express.Router();
var galleryDirectoryPath = path.join(__dirname, process.env.GALLERY_PATH);

async function renderIndex(res, req) {
	var userData = {};
	const sessionCookie = req.cookies.session || "";

	const webrender = () => {
		res.render("index", {
			title: "Kaafila - Shiv Nadar School Noida",
			userData: Object.keys(userData).length > 0 ? userData : null,
			scripts: ["/js/index.js"],
			docFilms: [
				"https://www.youtube.com/embed/videoseries?list=PLM4S2hGZDSE580Mx38MTFMxSDBE3BuSVV",
				"https://www.youtube.com/embed/videoseries?list=PLhDK1gM1gf0NaEiinSi_-_2O4MlIrU9aN",
				"https://www.youtube.com/embed/qHg2AR8_UeM",
				"https://www.youtube.com/embed/cf5FvgJ7Lhk",
				"https://www.youtube.com/embed/VefL3LCoq10",
				"https://www.youtube.com/embed/2pJD5HtlKwg",
				"https://www.youtube.com/embed/3_I2eT6jrIc",
				"https://www.youtube.com/embed/Xy2wXYm8i3k",
				"https://www.youtube.com/embed/ak_a1RJ2DZc",
				"https://www.youtube.com/embed/iFXgou31qHw",
				"https://www.youtube.com/embed/7_Y2ILelYTg",
				"https://www.youtube.com/embed/mBR5Pwf1doA",
			],
			sffSongs: [
				"https://youtube.com/embed/9ulxZmYJ53o",
				"https://youtube.com/embed/O0NxwolCX0o",
				"https://youtube.com/embed/MiKCgK-Vvgk",
				"https://youtube.com/embed/BWEEmVGI1O8",
				"https://youtube.com/embed/bDVSkZNNUJo",
				"https://youtube.com/embed/LcpdH5tDPFk",
				"https://youtube.com/embed/5SorKYIRwp4",
				"https://youtube.com/embed/c8A_lzdqfRg",
				"https://youtube.com/embed/pR_p2DiMbBA",
				"https://youtube.com/embed/Z8jG5HSS8M8"
			],
			sbSongs: [
				{
					name: "Step By Step School",
					link: "https://youtube.com/embed/vbjQDZHkMSM",
				},
				{
					name: "Shiv Nadar School Faridabad",
					link: "https://youtube.com/embed/btNMlLzjNkI",
				},
				{
					name: "Shiv Nadar School Faridabad",
					link: "https://youtube.com/embed/57nYPIjP1Rc",
				}
			]
		});
	};

	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const user = await admin.auth().getUser(firebaseUserClaims.sub)
		userData = {photoURL: user.photoURL,};
		webrender();
	} catch (err) {
		if (err.code !== "auth/argument-error") { console.log(err); }
		webrender();
	}
}

async function renderAbout(res, req) {
	var userData = {};
	var galleryImagesMain = [];
	var galleryImages = [];
	var galleryImagesMore = [];
	const sessionCookie = req.cookies.session || "";

	const webrender = () => {
		res.render("about", {
			title: "About - Kaafila",
			galleryImages: galleryImages,
			userData: Object.keys(userData).length > 0 ? userData : null,
			scripts: ["/js/about.js"],
		});
	};

	const processGalleryFiles = async () => {
		try {
			const files = await fs.readdir(galleryDirectoryPath)
			files.forEach((file) => {
				if (["jpg", "png", "JPG", "gif"].includes(file.slice(-3))) {
					imageObject = { path: file, caption: file.slice(0, -4) };
					galleryImages.push(imageObject);
				}
			});
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
router.get("/about", (req, res, next) => renderAbout(res, req));

module.exports = router;