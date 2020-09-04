var express = require("express");
var router = express.Router();

router.get("/snsartshaat", function (req, res, next) {
	res.render("snsartshaat", {
		title: "SNS Arts Haat - Kaafila",
		artData: artData,
		styles: ["/css/pastels.css"],
		scripts: ["/js/navbar.js", "/js/about.js"],
	});
});

module.exports = router;