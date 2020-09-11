var express = require("express");
var admin = require("../firebase-proj");
var path = require("path");
var fs = require("fs").promises;

var router = express.Router();
var db = admin.firestore();

async function getUserData(uid) {
	doc = db.collection('schoolUsers').doc(uid);
	docref = await doc.get()
	if (!docref.exists) {
		return null
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

async function renderEvent(req, res) {
	var event = req.params.event;
	const sessionCookie = req.cookies.session || "";

	var userData = {};

	try {
		const readRoutes = await fs.readFile(path.join(__dirname, "eventRoutes.json"), "utf8")
		routingData = JSON.parse(readRoutes)[event]
	
		const webrender = () => {
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
		}
	
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const user = await admin.auth().getUser(firebaseUserClaims.sub)
		userData.photoURL = user.photoURL
		webrender();
	} catch (err) {
		if (err.code !== "auth/argument-error") { console.log(err); }
		webrender();
	}

}

async function renderSubevent(req, res) {
	var event = req.params.event;
	var subevent = req.params.subevent;
	const sessionCookie = req.cookies.session || "";

	var userData = {};
	var registration = {};
	
	try {
		const readRoutes = await fs.readFile(path.join(__dirname, "eventRoutes.json"), "utf8")
		routingData = JSON.parse(readRoutes)[event]
		var registration = routingData[subevent].registration || {};
	
		const webrender = () => {
			res.render("subevent", {
				title: `${routingData[subevent].name} - ${routingData.name} - Kaafila`,
				url: subevent,
				subeventName: routingData[subevent].name,
				subeventImage: routingData[subevent].image,
				subeventDesc: routingData[subevent].description,
				cssID: routingData.cssID,
				[routingData.navID]: true,
				pageID: "subevents/" + routingData[subevent].pageID,
				formID: routingData[subevent].registration ? "subevents/forms/" + routingData[subevent].registration.formID : null,
				registration: Object.keys(registration).length > 0 ? registration : null,
				userData: Object.keys(userData).length > 0 ? userData : null,
				scripts: ["/js/subevent.js"]
			});
		}
	
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const user = await admin.auth().getUser(firebaseUserClaims.sub)
		userData.photoURL = user.photoURL
		
		if (Object.keys(registration).length > 0) {
			registration.takenSeats = await getTakenSeats(subevent)
		}
		const userFirestoreData = await getUserData(firebaseUserClaims.sub)
		userData.schoolRepName = userFirestoreData.schoolRepName;
		if (userFirestoreData.registeredEvents) {
			if (subevent in userFirestoreData.registeredEvents) {
				registration.alreadyRegistered = true;
			}
		}
		webrender();
	} catch (err) {
		if (err.code !== "auth/argument-error") { console.log(err); }
		webrender();
	}

}

async function subeventRegistration(req, res) {
	var subevent = req.params.subevent;
	const sessionCookie = req.cookies.session || "";
	var data = JSON.parse(req.body.data);

	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		doc = db.collection('schoolUsers').doc(firebaseUserClaims);
		docref = await doc.get()
		registeredEvents = docref.data().registeredEvents || {};
		registeredEvents[subevent] = data;
		const updateDatabase = doc.update({registeredEvents: registeredEvents,})
	
		doc = db.collection('schoolUsers').doc(firebaseUserClaims);
		docref = await doc.get()
		if (docref.exists) {
			participants = docref.data().participants || 0;
			participants += data.students.length;
			const updateDatabase = doc.update({participants: participants})
			res.sendStatus(200);
		} else {
			participants = data.students.length;
			doc.set({participants: participants})
			res.sendStatus(200);
		}
	} catch (err) {
		res.send(err)
		console.log(err);
	}
}

async function subeventSubmission(req, res) {
	var subevent = req.params.subevent;
	const sessionCookie = req.cookies.session || "";

	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const docref = await db.collection('schoolUsers').doc(firebaseUserClaims).get();
		registeredEvents = docref.data().registeredEvents || {};
		for (i = 0; i < registeredEvents[subevent].students.length; i++) {
			if (registeredEvents[subevent].students[i].name == req.body.name) {
				registeredEvents[subevent].students[i].submission = req.body.submission;
			}
		}
		const updateDatabase = await doc.update({registeredEvents: registeredEvents,});
		res.sendStatus(200);
	} catch (err) {
		console.log(err);
	}
}

router.get("/events/:event", (req, res) => renderEvent(req, res));
router.get("/events/:event/:subevent", (req, res) => renderSubevent(req, res));
router.post("/registration/:subevent", (req, res) => subeventRegistration(req, res));
router.post("/submission/:subevent", (req, res) => subeventSubmission(req, res));

module.exports = router;