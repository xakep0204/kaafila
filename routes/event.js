var express = require("express");
var router = express.Router();
var admin = require("../firebase-proj");
const { get } = require("./auth");
var db = admin.firestore();
var path = require("path");
var fs = require("fs");
const { lastRun } = require("gulp");

async function getUserData(uid) {
	doc = db.collection('schoolUsers').doc(uid);
	docref = await doc.get()
	if (!docref.exists) {
		return {}
	} else {
		return docref.data()
	}
}

async function getTakenSeats(subevent) {
	doc = db.collection('events').doc(subevent);
	docref = await doc.get()
	if (!docref.exists) {
		return 0
	} else {
		return docref.data().participants
	}
}

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
	registration = {};
	
	var webrender = () => {
		fs.readFile(path.join(__dirname, "eventRoutes.json"), "utf8", (err, jsonString) => {
			if (err) {
				return false;
			} try {
				const eventRoutes = JSON.parse(jsonString);
				var routingData = eventRoutes[event]
				getTakenSeats(subevent).then((n) => {
					if (routingData[subevent].registration) {
						if (routingData[subevent].registration.maxSeats - n < routingData[subevent].registration.maxSeatsPerSchool) {
							registration.availableSeats = routingData[subevent].registration.maxSeats - n
						} else {
							registration.availableSeats = routingData[subevent].registration.maxSeatsPerSchool
						}
					}
					res.render("subevent", {
						title: `${routingData[subevent].name} - ${routingData.name} - Kaafila`,
						url: subevent,
						subeventName: routingData[subevent].name,
						subeventImage: routingData[subevent].image,
						subeventDesc: routingData[subevent].description,
						cssID: routingData.cssID,
						[routingData.navID]: true,
						[routingData[subevent].pageID]: true,
						registration: registration,
						userData: userData,
						scripts: ["/js/subevent.js"]
					});
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
					getUserData(decodedClaims.sub).then((data) => {
						userData.schoolRepName = data.schoolRepName;
						if (data.registeredEvents) {
							if (subevent in data.registeredEvents) {
								registration.alreadyRegistered = true
							}
						}
						webrender();
					});
				})
				.catch(() => {
					webrender();
				});
		})
		.catch(() => {
			webrender();
		});
});

router.post("/registration/:subevent", function (req, res, next) {
	var subevent = req.params.subevent
	const sessionCookie = req.cookies.session || "";
	admin
		.auth()
		.verifySessionCookie(sessionCookie, true)
		.then(function (decodedClaims) {
			data = JSON.parse(req.body.data)
			console.log(data)
			doc = db.collection('schoolUsers').doc(decodedClaims.sub);
			doc.get().then((docRef) => {
				registeredEvents = docRef.data().registeredEvents || {};
				registeredEvents[subevent] = data
				doc.update({
					registeredEvents: registeredEvents
				}).then(() => {
					doc2 = db.collection('events').doc(subevent);
					doc2.get()
						.then((docRef2) => {
							participants = docRef2.data().participants + data.students.length;
							doc2.update({
								participants: participants
							})
							.then(() => {
								res.sendStatus(200)
							})
						})
				}).catch((e) => {})
			})
		})
		.catch(() => {});
});

router.post("/submission/:subevent", function (req, res, next) {
	var subevent = req.params.subevent
	const sessionCookie = req.cookies.session || "";
	admin
		.auth()
		.verifySessionCookie(sessionCookie, true)
		.then(function (decodedClaims) {
			doc = db.collection('schoolUsers').doc(decodedClaims.sub);
			doc.get()
			.then((docRef) => {
				registeredEvents = docRef.data().registeredEvents || {};
				console.log(registeredEvents[subevent].students)
				// res.sendStatus(200)
				for (i=0; i < registeredEvents[subevent].students.length; i++) {
					if (registeredEvents[subevent].students[i].name == req.body.name) {
						registeredEvents[subevent].students[i].submission = req.body.submission;
					}
				}
				doc.update({
					registeredEvents: registeredEvents,
				})
				.then(() => {
					res.sendStatus(200)
				})
				.catch(() => {})
			})
		})
		.catch(() => {});
});

module.exports = router;