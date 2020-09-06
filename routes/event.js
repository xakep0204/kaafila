var express = require("express");
var router = express.Router();
var admin = require("../firebase-proj");

router.get("/bread-and-circuses", function (req, res, next) {
	var userData = {};
	var webrender = () => {
		res.render("event", {
			title: "Bread and Circuses - Kaafila",
			cssID: "bnc",
			headerFont: "rye",
			bannerName: "bread-and-circuses",
			eventCategories: [
				{
					name: "Competitive Events",
					main: [
						{
							image: "bnc-mm-banner.png",
							link: "/bread-and-circuses/monologue-maestros",
						},
						{
							image: "bnc-oap-banner.png",
							link: "/bread-and-circuses/one-act-play",
						},
					],
				},
			],
			active_bnc: true,
			styles: ["/css/fonts.css", "/css/main.css"],
			scripts: ["/js/navbar.js"],
			userData: userData,
		});
	};
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
						email: userRecord.email,
						schoolName: userRecord.displayName,
						schoolRepName: "Manjima Chatterjee",
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
router.get("/folk-fluence", function (req, res, next) {
	var userData = {};
	var webrender = () => {
		res.render("event", {
			title: "Folk Fluence - Kaafila",
			header: "Folk Fluence",
			cssID: "ff",
			headerFont: "ardagh",
			bannerName: "folk-fluence",
			eventCategories: [
				{
					name: "Competitive Events",
					main: [
						{ image: "ff-ff-banner.png", link: "/folk-fluence/folk-fluence" },
					],
				},
			],
			active_ff: true,
			styles: ["/css/fonts.css", "/css/main.css"],
			scripts: ["/js/navbar.js"],
			userData: userData,
		});
	};
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
						email: userRecord.email,
						schoolName: userRecord.displayName,
						schoolRepName: "Manjima Chatterjee",
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
router.get("/iridescence", function (req, res, next) {
	var userData = {};
	var webrender = () => {
		res.render("event", {
			title: "Iridescence - Kaafila",
			header: "Iridescence",
			cssID: "i",
			headerFont: "apple-garamond",
			bannerName: "iridescence",
			eventCategories: [
				{
					name: "Competitive Events",
					main: [
						{
							image: "i-sof-banner.png",
							link: "/iridescence/spirit-of-freedom",
						},
					],
				},
			],
			active_i: true,
			styles: ["/css/fonts.css", "/css/main.css"],
			scripts: ["/js/navbar.js"],
			userData: userData,
		});
	};
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
						email: userRecord.email,
						schoolName: userRecord.displayName,
						schoolRepName: "Manjima Chatterjee",
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
router.get("/strings-attached", function (req, res, next) {
	var userData = {};
	var webrender = () => {
		res.render("event", {
			title: "Strings Attached - Kaafila",
			header: "Strings Attached",
			cssID: "sa",
			headerFont: "welcome",
			bannerName: "strings-attached",
			eventCategories: [
				{
					name: "Competitive Events",
					main: [
						{
							image: "sa-sas-banner.png",
							link: "/strings-attached/strings-attached-solos",
						},
					],
				},
				{
					name: "Collaborative Events",
					main: [
						{
							image: "sa-sff-banner.png",
							link: "/strings-attached/songs-for-freedom",
						},
					],
				},
			],
			active_sa: true,
			styles: ["/css/fonts.css", "/css/main.css"],
			scripts: ["/js/navbar.js"],
			userData: userData,
		});
	};
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
						email: userRecord.email,
						schoolName: userRecord.displayName,
						schoolRepName: "Manjima Chatterjee",
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

router.get("/bread-and-circuses/monologue-maestros", function (req, res, next) {
	var userData = {};
	var webrender = () => {
		res.render("subevent", {
			title: "Monologue Maestros - Bread and Circuses - Kaafila",
			subeventName: "Monologue Maestros",
			subeventImage: "bnc-mm-banner.png",
			active_bnc: true,
			bnc_mm: true,
			cssID: "bnc",
			styles: ["/css/fonts.css", "/css/main.css"],
			scripts: ["/js/navbar.js"],
			userData: userData,
		});
	};
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
						email: userRecord.email,
						schoolName: userRecord.displayName,
						schoolRepName: "Manjima Chatterjee",
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
router.get("/bread-and-circuses/one-act-play", function (req, res, next) {
	var userData = {};
	var webrender = () => {
		res.render("subevent", {
			title: "One Act Play - Bread and Circuses - Kaafila",
			subeventName: "One Act Play",
			subeventImage: "bnc-oap-banner.png",
			active_bnc: true,
			bnc_oap: true,
			cssID: "bnc",
			styles: ["/css/fonts.css", "/css/main.css"],
			scripts: ["/js/navbar.js"],
			userData: userData,
		});
	};
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
						email: userRecord.email,
						schoolName: userRecord.displayName,
						schoolRepName: "Manjima Chatterjee",
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

router.get("/folk-fluence/folk-fluence", function (req, res, next) {
	var userData = {};
	var webrender = () => {
		res.render("subevent", {
			title: "Folk Fluence - Folk Fluence - Kaafila",
			subeventName: "Folk Fluence",
			subeventImage: "ff-ff-banner.png",
			active_ff: true,
			ff_ff: true,
			cssID: "ff",
			styles: ["/css/fonts.css", "/css/main.css"],
			scripts: ["/js/navbar.js"],
			userData: userData,
		});
	};
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
						email: userRecord.email,
						schoolName: userRecord.displayName,
						schoolRepName: "Manjima Chatterjee",
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

router.get("/iridescence/spirit-of-freedom", function (req, res, next) {
	var userData = {};
	var webrender = () => {
		res.render("subevent", {
			title: "Spirit of Freedom - Iridescence - Kaafila",
			subeventName: "Spirit of Freedom",
			subeventImage: "i-sof-banner.png",
			active_i: true,
			i_sof: true,
			cssID: "i",
			styles: ["/css/fonts.css", "/css/main.css"],
			scripts: ["/js/navbar.js"],
			userData: userData,
		});
	};
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
						email: userRecord.email,
						schoolName: userRecord.displayName,
						schoolRepName: "Manjima Chatterjee",
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

router.get("/strings-attached/strings-attached-solos", function (
	req,
	res,
	next
) {
	var userData = {};
	var webrender = () => {
		res.render("subevent", {
			title: "Strings Attached Solos - Strings Attached - Kaafila",
			subeventName: "Strings Attached Solos",
			subeventImage: "sa-sas-banner.png",
			active_sa: true,
			sa_sas: true,
			cssID: "sa",
			styles: ["/css/fonts.css", "/css/main.css"],
			scripts: ["/js/navbar.js"],
			userData: userData,
		});
	};
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
						email: userRecord.email,
						schoolName: userRecord.displayName,
						schoolRepName: "Manjima Chatterjee",
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
router.get("/strings-attached/songs-for-freedom", function (req, res, next) {
	var userData = {};
	var webrender = () => {
		res.render("subevent", {
			title: "Songs for Freedom - Strings Attached - Kaafila",
			subeventName: "Songs for Freedom",
			subeventImage: "sa-sff-banner.png",
			active_sa: true,
			sa_sff: true,
			cssID: "sa",
			styles: ["/css/fonts.css", "/css/main.css"],
			scripts: ["/js/navbar.js"],
			userData: userData,
		});
	};
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
						email: userRecord.email,
						schoolName: userRecord.displayName,
						schoolRepName: "Manjima Chatterjee",
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

module.exports = router;
