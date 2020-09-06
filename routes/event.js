var express = require("express");
var router = express.Router();
var admin = require("../firebase-proj");
const { get } = require("./auth");
var db = admin.firestore();
var path = require("path");
var fs = require("fs");

router.get("/events/:event", function (req, res, next) {
	var event = req.params.event;
	var userData = {};
	var webrender = () => {
		fs.readFile(path.join(__dirname, "eventRoutes.json"), "utf8", (err, jsonString) => {
			if (err) {
				return false;
			} try {
				const eventRoutes = JSON.parse(jsonString);
				var routingData = eventRoutes[event]
				res.render("event", {
					eventName: routingData.name,
					title: `${routingData.name} - Kaafila`,
					cssID: routingData.cssID,
					headerFont: routingData.headerFont,
					bannerName: event,
					eventCategories: routingData.eventCategories,
					[routingData.navID]: true,
					styles: ["/css/fonts.css", "/css/main.css"],
					scripts: ["/js/navbar.js"],
					userData: userData,
				});
			} catch (err) {
				return false;
			}
		});
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

router.get("/events/:event/:subevent", function (req, res, next) {
	var event = req.params.event;
	var subevent = req.params.subevent;
	var userData = {};
	var webrender = () => {
		fs.readFile(path.join(__dirname, "eventRoutes.json"), "utf8", (err, jsonString) => {
			if (err) {
				return false;
			} try {
				const eventRoutes = JSON.parse(jsonString);
				var routingData = eventRoutes[event]
				res.render("subevent", {
					title: `${routingData[subevent].name} - ${routingData.name} - Kaafila`,
					subeventName: routingData[subevent].name,
					subeventImage: routingData[subevent].image,
					cssID: routingData.cssID,
					[routingData.navID]: true,
					[routingData[subevent].pageID]: true,
					styles: ["/css/fonts.css", "/css/main.css"],
					scripts: ["/js/navbar.js"],
					userData: userData,
				});
			} catch (err) {
				return false;
			}
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