var express = require("express");
var admin = require("../firebase-proj");	
var path = require("path");
var createError = require("http-errors");
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

async function renderEvent(req, res, next) {
	var event = req.params.event;
	const sessionCookie = req.cookies.session || "";

	var userData = {};

	const readRoutes = await fs.readFile(path.join(__dirname, "eventRoutes.json"), "utf8")
	routingData = JSON.parse(readRoutes)
	if (!(event in routingData)) {
		return next(createError(404))
	} 
	routingData = routingData[event]

	const webrender = () => {
		res.render("event", {
			eventName: routingData.name,
			title: `${routingData.title} - Kaafila`,
			cssID: routingData.cssID,
			pageID: "events/" + event,
			headerFont: routingData.headerFont,
			bannerName: event,
			eventCategories: routingData.eventCategories,
			[routingData.navID]: true,
			userData: Object.keys(userData).length > 0 ? userData : null,
		});
	}

	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const user = await admin.auth().getUser(firebaseUserClaims.sub)
		userData.photoURL = user.photoURL
		webrender();
	} catch (err) {
		if (err.code !== "auth/argument-error") { console.log(err); }
		webrender();
	}

}

async function renderSubevent(req, res, next) {
	var event = req.params.event;
	var subevent = req.params.subevent;

	const sessionCookie = req.cookies.session || "";

	var userData = {};
	var registration = {};
	
	const readRoutes = await fs.readFile(path.join(__dirname, "eventRoutes.json"), "utf8")
	routingData = JSON.parse(readRoutes)
	if (!(event in routingData)) {
		return next(createError(404))
	} 
	routingData = routingData[event]
	if (!(subevent in routingData)) {
		return next(createError(404))
	}
	var registration = routingData[subevent].registration || {};

	const webrender = (db) => {
		if (db) {
			res.render(`subevent-${db}`, {
				title: `${routingData[subevent].name} - ${routingData.title} - Kaafila`,
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
				scripts: [`/js/subevent-${db}.js`]
			});
		} else {
			res.render(`subevent-public`, {
				title: `${routingData[subevent].name} - ${routingData.title} - Kaafila`,
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
				scripts: [`/js/subevent-public.js`]
			});
		}
	}

	try {
		
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const userRecord = await admin.auth().getUser(firebaseUserClaims.sub)
		userData.photoURL = userRecord.photoURL

		const checkPublicDatabase = await db.collection('publicUsers').doc(firebaseUserClaims.sub).get()
		if (checkPublicDatabase.exists) {
			const userFirestoreData = checkPublicDatabase.data();
			registration = registration.userType == 'public' ? registration : {}
			if (Object.keys(registration).length > 0) {
				const takenSeats = await getTakenSeats(subevent)
				if (takenSeats === registration.maxSeats) {
					registration.seatsFull = true
				}
			}
			userData.name = userRecord.name;
			if (userFirestoreData.registeredEvents) {
				if (subevent in userFirestoreData.registeredEvents) {
					registration.alreadyRegistered = true;
				}
			}
			webrender('public');
		} else {
			const checkSchoolDatabase = await db.collection('schoolUsers').doc(firebaseUserClaims.sub).get()
			if (checkSchoolDatabase.exists) {
				const userFirestoreData = checkSchoolDatabase.data();
				registration = registration.userType == 'school' ? registration : {}
				if (Object.keys(registration).length > 0) {
					const takenSeats = await getTakenSeats(subevent)
					if (registration.maxSeats) {
						if (takenSeats === registration.maxSeats) {
							registration.seatsFull = true
						} else if (registration.maxSeatsPerSchool) {
							if (takenSeats + registration.maxSeatsPerSchool > registration.maxSeats) {
								registration.maxSeatsPerSchool = registration.maxSeats - takenSeats
							}
						}
					}
				}
				userData.schoolRepName = userFirestoreData.schoolRepName;
				userData.schoolName = userRecord.displayName;
				if (userFirestoreData.registeredEvents) {
					if (subevent in userFirestoreData.registeredEvents) {
						registration.alreadyRegistered = true;
					}
				}
			}
			webrender('school');
		}

	} catch (err) {
		if (err.code !== "auth/argument-error") { console.log(err); }
		webrender();
	}

}

async function subeventRegistration(req, res) {
	const maxSeatEvents = ['collab-lab', 'the-sounds-of-stories', 'stories-through-the-lens', 'flesh-n-bones', 'kalbeliya-lec-dem', 'ff-career-conversations', 'i-career-conversations', 'bamboo-craft-workshop', 'tessellations', 'art-as-a-catalyst-for-social-change', 'sa-career-conversations', 'khasi-music-workshop'];
	const sessionCookie = req.cookies.session || "";
	var subevent = req.body.subevent;
	var data = JSON.parse(req.body.data);

	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const checkPublicDatabase = await db.collection('publicUsers').doc(firebaseUserClaims.sub).get()
		if (checkPublicDatabase.exists) {
			registeredEvents = checkPublicDatabase.data().registeredEvents || {};
			registeredEvents[subevent] = {name: data.name};
			const updateDatabase = db.collection('publicUsers').doc(firebaseUserClaims.sub).update({registeredEvents: registeredEvents})
		
			doc = db.collection('events').doc(subevent);
			docref = await doc.get()
	
			if (docref.exists) { participants = docref.data().participants + 1 || 1; } 
			else { participants = 1; }
			doc.set({participants: participants})
			res.sendStatus(200);
		} else {
			const checkSchoolDatabase = await db.collection('schoolUsers').doc(firebaseUserClaims.sub).get()
			if (checkSchoolDatabase.exists) {
				registeredEvents = checkSchoolDatabase.data().registeredEvents || {};
				registeredEvents[subevent] = data;
				const updateDatabase = db.collection('schoolUsers').doc(firebaseUserClaims.sub).update({registeredEvents: registeredEvents})
				
				doc = db.collection('events').doc(subevent);
				docref = await doc.get()
		
				if (maxSeatEvents.indexOf(subevent) != -1) {
					if (docref.exists) { participants = docref.data().participants + data.participants || data.participants; } 
					else { participants = data.participants; }
					doc.set({participants: participants})
				}
				res.sendStatus(200);
			}
		}
	} catch (err) {
		if (err.code !== "auth/argument-error") { 
			console.log(err); 
			res.send(err)
		}
	}
}

async function subeventSubmission(req, res) {
	var subevent = req.body.subevent;
	const sessionCookie = req.cookies.session || "";
	console.log(req.body.data); 

	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const docref = await db.collection('schoolUsers').doc(firebaseUserClaims.sub).get();
		submissionPath = `registeredEvents.${subevent}`;
		submissionData = JSON.parse(req.body.data);
		if (docref.exists) {
			const updateDatabase = await doc.update({[submissionPath]: submissionData});
			res.sendStatus(200);
		} else {
			res.send("No User Exists");
		}
	} catch (err) {
		if (err.code !== "auth/argument-error") { 
			console.log(err); 
			res.send(err)
		}
	}
}

router.get("/events/:event", (req, res, next) => renderEvent(req, res, next));
router.get("/events/:event/:subevent", (req, res, next) => renderSubevent(req, res, next));
router.post("/registration", (req, res) => subeventRegistration(req, res));
router.post("/submission", (req, res) => subeventSubmission(req, res));

module.exports = router;