var express = require("express");
var router = express.Router();
var admin = require('../firebase-proj')


router.get("/snsartshaat", function (req, res, next) {
	artData = {}
	res.render("snsartshaat", {
		title: "SNS Arts Haat - Kaafila",
		artData: artData,
		scripts: ["/js/navbar.js", "/js/about.js"],
	});
});

module.exports = router;