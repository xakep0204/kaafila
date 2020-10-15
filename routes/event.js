var express = require("express");
var admin = require("../firebase-proj");	
var path = require("path");
var createError = require("http-errors");
var fs = require("fs").promises;

var router = express.Router();
var db = admin.firestore();

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
	const webrender = (db) => {
		if (db) {
			res.render(`subevent`, {
				title: `${routingData[subevent].name} - ${routingData.title} - Kaafila`,
				url: subevent,
				subeventName: routingData[subevent].name,
				subeventImage: routingData[subevent].image,
				subeventDesc: routingData[subevent].description,
				cssID: routingData.cssID,
				[routingData.navID]: true,
				pageID: "subevents/" + routingData[subevent].pageID,
				formID: routingData[subevent].registration[db] ? "subevents/forms/" + routingData[subevent].registration[db].formID : null,
				regOut: JSON.stringify(registration),
				registration: registration,
				watchLink: watchLink,
				watchText: watchText,
				joinLink: joinLink,
				joinText: joinText,
				voteStatus: voteStatus,
				entries: entries,
				userData: Object.keys(userData).length > 0 ? userData : null,
				scripts: [`/js/subevent-${db}.js`, `/js/subevent.js`],
				regOut: registration ? JSON.stringify(registration) : "nope"
			});
		} else {
			res.render(`subevent`, {
				title: `${routingData[subevent].name} - ${routingData.title} - Kaafila`,
				url: subevent,
				subeventName: routingData[subevent].name,
				subeventImage: routingData[subevent].image,
				subeventDesc: routingData[subevent].description,
				cssID: routingData.cssID,
				[routingData.navID]: true,
				pageID: "subevents/" + routingData[subevent].pageID,
				regOut: JSON.stringify(registration),
				registration: registration,
				watchLink: watchLink,
				watchText: watchText,
				joinLink: joinLink,
				joinText: joinText,
				voteStatus: voteStatus,
				entries: entries,
				userData: Object.keys(userData).length > 0 ? userData : null,
				scripts: [`/js/subevent.js`],
			});
		}
	}

	var event = req.params.event;
	var subevent = req.params.subevent;
	const sessionCookie = req.cookies.session || "";
	var userData = {};
	var registration = {};
	
	const readRoutes = await fs.readFile(path.join(__dirname, "eventRoutes.json"), "utf8")
	routingData = JSON.parse(readRoutes)
	if (!(event in routingData)) { return next(createError(404)) } 
	routingData = routingData[event]
	if (!(subevent in routingData)) { return next(createError(404)) }

	var registration = routingData[subevent].registration || null;

	const readEntries = await fs.readFile(path.join(__dirname, "entries.json"), "utf8")
	entriesData = JSON.parse(readEntries)
	entries = entriesData[event][subevent] ? entriesData[event][subevent] : null

	doc = await db.collection('votes').doc('master').get();
	voteStatus = doc.data()[subevent]
	doc = await db.collection('events').doc(subevent);
	docref = await doc.get();
	watchLink = docref.exists ? docref.data().watchLink : null
	watchText = docref.exists ? docref.data().watchText : null
	joinLink = docref.exists ? docref.data().joinLink : null
	joinText = docref.exists ? docref.data().joinText : null

	try {
		
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const userRecord = await admin.auth().getUser(firebaseUserClaims.sub)
		userData.photoURL = userRecord.photoURL

		const checkPublicDatabase = await db.collection('publicUsers').doc(firebaseUserClaims.sub).get()
		if (checkPublicDatabase.exists) {
			const userFirestoreData = checkPublicDatabase.data();
			registration = registration.public
			userData.name = userRecord.name;

			if (userFirestoreData.registeredEvents) {
				if (subevent in userFirestoreData.registeredEvents) {
					registration.alreadyRegistered = true;
				} else if (registration) {
					doc = db.collection('events').doc(subevent);
					docref = await doc.get()
					if (!docref.exists) {
						takenSeats = 0
					} else {
						takenSeats = docref.data().participants ? docref.data().participants : 0
						registration.closed = docref.data().closed ? docref.data().closed : false
					}
			
					if (takenSeats >= registration.maxSeats) {
						registration.seatsFull = true
					}
				}
			}

			webrender('public');

		} else {
			const checkSchoolDatabase = await db.collection('schoolUsers').doc(firebaseUserClaims.sub).get()
			if (checkSchoolDatabase.exists) {
				const userFirestoreData = checkSchoolDatabase.data();
				registration = registration.school

				if (registration) {
					doc = db.collection('events').doc(subevent);
					docref = await doc.get()
					if (!docref.exists) {
						takenSeats = 0
					} else {
						takenSeats = docref.data().participants ? docref.data().participants : 0
						registration.closed = docref.data().closed ? docref.data().closed : false
					}
			
					if (takenSeats >= registration.maxSeats) {
						registration.seatsFull = true
					} else if (!registration.closed) {
						if (takenSeats + registration.maxSeatsPerSchool > registration.maxSeats) {
							registration.maxSeatsPerSchool = registration.maxSeats - takenSeats
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
		if (!(err.code in ["auth/argument-error", "auth/session-cookie-revoked"])) { console.log(err); }
		if (registration) {
			doc = db.collection('events').doc(subevent);
			docref = await doc.get()
			if (!docref.exists) {
				takenSeats = 0
			} else {
				takenSeats = docref.data().participants ? docref.data().participants : 0
				registration.closed = docref.data().closed ? docref.data().closed : false
			}
	
			if (takenSeats >= registration.maxSeats) {
				registration.seatsFull = true
			}
		}
		webrender();
	}

}

async function subeventRegistration(req, res) {
	const maxSeatEvents = ['collab-lab', 'the-sounds-of-stories', 'stories-through-the-lens', 'flesh-n-bones', 'bamboo-craft-workshop', 'tessellations'];
	const sessionCookie = req.cookies.session || "";
	var subevent = req.body.subevent;
	var data = JSON.parse(req.body.data);

	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const checkPublicDatabase = await db.collection('publicUsers').doc(firebaseUserClaims.sub).get()
		if (checkPublicDatabase.exists) {
			registeredEvents = checkPublicDatabase.data().registeredEvents || {};
			registeredEvents[subevent] = data;
			const updateDatabase = db.collection('publicUsers').doc(firebaseUserClaims.sub).update({registeredEvents: registeredEvents})
		
			
			if (maxSeatEvents.indexOf(subevent) != -1) {
				doc = db.collection('events').doc(subevent);
				docref = await doc.get()
				if (docref.exists) { participants = docref.data().participants + data.participants || data.participants; } 
				else { participants = data.participants; }
				doc.set({participants: participants})
			}

			res.sendStatus(200);
		} else {
			const checkSchoolDatabase = await db.collection('schoolUsers').doc(firebaseUserClaims.sub).get()
			if (checkSchoolDatabase.exists) {
				registeredEvents = checkSchoolDatabase.data().registeredEvents || {};
				registeredEvents[subevent] = data;
				const updateDatabase = db.collection('schoolUsers').doc(firebaseUserClaims.sub).update({registeredEvents: registeredEvents})
				
				
				if (maxSeatEvents.indexOf(subevent) != -1) {
					doc = db.collection('events').doc(subevent);
					docref = await doc.get()
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

	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const checkPublicDatabase = await db.collection('publicUsers').doc(firebaseUserClaims.sub).get()
		if (checkPublicDatabase.exists) {
			const doc = await db.collection('publicUsers').doc(firebaseUserClaims.sub);
			const docref = await doc.get();
			submissionPath = `registeredEvents.${subevent}`;
			submissionData = JSON.parse(req.body.data);
			if (docref.exists) {
				const updateDatabase = await doc.update({[submissionPath]: submissionData});
				res.sendStatus(200);
			} else {
				res.send("No User Exists");
			}
		} else {
			const checkSchoolDatabase = await db.collection('schoolUsers').doc(firebaseUserClaims.sub).get()
			if (checkSchoolDatabase.exists) {
				const doc = await db.collection('schoolUsers').doc(firebaseUserClaims.sub);
				const docref = await doc.get();
				submissionPath = `registeredEvents.${subevent}`;
				submissionData = JSON.parse(req.body.data);
				if (docref.exists) {
					const updateDatabase = await doc.update({[submissionPath]: submissionData});
					res.sendStatus(200);
				} else {
					res.send("No User Exists");
				}
			}
		}
	} catch (err) {
		if (err.code !== "auth/argument-error") { 
			console.log(err); 
			res.send(err)
		}
	}
}

async function checkVoteEmail(req, res) {
	const email = req.body.email;
	const subevent = req.body.subevent;
	try {
		const getVoteData = await db.collection('votes').doc(email).get()
		if (getVoteData.exists) { 
			if (getVoteData.data()[subevent]) {
				res.json({data: true})
			} else {
				res.json({data: false})
			}
		} 
		else {
			res.json({data: false})
		}
	} catch (err) {
		console.log(err);
	}
}

async function publicVote(req, res) {
	const data = JSON.parse(req.body.data)

	const email = data.email;
	const name = data.name;
	const votes = data.votes;
	const subevent = data.subevent;
	try {
		const individualVoteDoc = await db.collection('votes').doc(email)
		const individualVoteDocRef = await individualVoteDoc.get()
		if (individualVoteDocRef.exists) { 
			individualVoteDoc.update({[subevent]: votes})
		} else {
			individualVoteDoc.set({
				name: name,
				[subevent]: votes
			})
		}
		res.sendStatus(200)
	} catch (err) {
		console.log(err);
	}
}

router.get("/events/:event", (req, res, next) => renderEvent(req, res, next));
router.get("/events/:event/:subevent", (req, res, next) => renderSubevent(req, res, next));
router.post("/registration", (req, res) => subeventRegistration(req, res));
router.post("/submission", (req, res) => subeventSubmission(req, res));
router.post("/checkvoteemail", (req, res) => checkVoteEmail(req, res));
router.post("/publicvote", (req, res) => publicVote(req, res));

module.exports = router;