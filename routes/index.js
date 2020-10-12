var express = require("express");
var path = require("path");
var csrf = require("csurf");
var csrfProtection = csrf({ cookie: true });
var fs = require("fs").promises;
var admin = require("../firebase-proj");

var router = express.Router();
var db = admin.firestore();

async function renderIndex(req, res) {
	const sessionCookie = req.cookies.session || "";
	var registrationData = {}

	const readRoutes = await fs.readFile(path.join(__dirname, "eventRoutes.json"), "utf8")
	routingData = JSON.parse(readRoutes)

	const webrender = () => {
		res.render("schools", {
			title: "Schools - Kaafila Admin",
			navbarData: routingData,
			registrationData: Object.keys(registrationData).length > 0 ? registrationData : null,
			scripts: ["/js/index.js"],
		});
	};

	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		if (firebaseUserClaims.sub == 'FTlGrpamffeH2Qeg8i7PFAUFohf2') {
			const firestoreData = await db.collection('schoolUsers').get()
			firestoreData.forEach(doc => { 
				registrationData[doc.id] = doc.data(); 
			})

			webrender();
		} 
		else {
			res.redirect('/signin')
		}
	} catch (err) {
		res.redirect('/signin')
		if (err.code !== "auth/argument-error") { console.log(err); }
	}
}

async function renderSubevent(req, res, next) {
	var event = req.params.event;
	var subevent = req.params.subevent;
	const sessionCookie = req.cookies.session || "";

	var registrationData = {};
	
	const readRoutes = await fs.readFile(path.join(__dirname, "eventRoutes.json"), "utf8")
	routingData = JSON.parse(readRoutes)
	
	const webrender = () => {
		res.render(`subevent`, {
			title: `${routingData[event][subevent].name} - Kaafila Admin`,
			navbarData: routingData,
			url: subevent,
			[subevent]: true,
			name: routingData[event][subevent].name,
			registrationData: Object.keys(registrationData).length > 0 ? registrationData : null,
			scripts: [`/js/index.js`]
		});
	}

	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		if (firebaseUserClaims.sub == 'FTlGrpamffeH2Qeg8i7PFAUFohf2') {
			if (subevent == "space-band") { 
				const firestoreData = await db.collection('publicUsers').get() 
				firestoreData.forEach(doc => { 
					if (doc.data().registeredEvents) {
						if (doc.data().registeredEvents[subevent]) {
							registrationData[doc.id] = doc.data().registeredEvents[subevent]; 
						}
					}
				})
			} else {
				const firestoreData = await db.collection('schoolUsers').get()
				firestoreData.forEach(doc => { 
					if (doc.data().registeredEvents) {
						if (doc.data().registeredEvents[subevent]) {
							registrationData[doc.id] = doc.data().registeredEvents[subevent]; 
							registrationData[doc.id].schoolName = doc.data().schoolName; 
						}
					}
				})
			}

			webrender();
		} 
	} catch (err) {
		if (err.code !== "auth/argument-error") { console.log(err); }
		res.redirect('/signin')
	}

}

router.get("/", (req, res) => renderIndex(req, res));
router.get("/events/:event/:subevent", (req, res, next) => renderSubevent(req, res, next));

module.exports = router;