var express = require("express");
var router = express.Router();
var csrf = require("csurf");
var admin = require("../firebase-proj");
var csrfProtection = csrf({ cookie: true });
var db = admin.firestore();
var createError = require("http-errors");

async function renderSignUp(req, res) {
	const sessionCookie = req.cookies.session || "";
	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		res.redirect("/profile");
	} catch (err) {
		res.cookie("csrfToken", req.csrfToken());
		res.render("signup", {
			title: "Sign up - Kaafila",
			scripts: ["/js/signup.js"],
		});
	}
}

async function renderSignIn(req, res) {
	const sessionCookie = req.cookies.session || "";
	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		res.redirect("/profile");
	} catch (err) {
		res.cookie("csrfToken", req.csrfToken());
		res.render("signin", {
			title: "Sign in - Kaafila",
			scripts: ["/js/signin.js"],
		});
	}
}

async function renderProfile(req, res, next) {
	const sessionCookie = req.cookies.session || "";

	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const checkPublicDatabase = await db.collection('publicUsers').doc(firebaseUserClaims.sub).get()
		if (checkPublicDatabase.exists) {
			const userRecord = await admin.auth().getUser(firebaseUserClaims.sub)
			var userFirestoreData = checkPublicDatabase.data();
			if (userFirestoreData.registeredEvents) {
				const eventFirestoreData = await db.collection('events').get()
				eventFirestoreData.forEach(doc => { 
					if (userFirestoreData.registeredEvents[doc.id]) {
						userFirestoreData.registeredEvents[doc.id].joinLink = doc.data().joinLink; 
						userFirestoreData.registeredEvents[doc.id].joinText = doc.data().joinText; 
					}
				})
			}
			
			userData = {
				name: userRecord.displayName,
				email: userRecord.email,
				photoURL: userRecord.photoURL,
				registeredEvents: userFirestoreData.registeredEvents,
				registeredEventsJS: JSON.stringify(userFirestoreData.registeredEvents)
			};
			res.render("profile-public", {
				title: `${userRecord.displayName} - Kaafila`,
				active_p: true,
				userData: userData,
				scripts: ['/js/profile-public.js']
			});
		} 
		else {
			const checkSchoolDatabase = await db.collection('schoolUsers').doc(firebaseUserClaims.sub).get()
			if (checkSchoolDatabase.exists) {
				const userRecord = await admin.auth().getUser(firebaseUserClaims.sub)
				const userFirestoreData = checkSchoolDatabase.data();
				if (userFirestoreData.registeredEvents) {
					const eventFirestoreData = await db.collection('events').get()
					eventFirestoreData.forEach(doc => { 
						if (userFirestoreData.registeredEvents[doc.id]) {
							userFirestoreData.registeredEvents[doc.id].joinLink = doc.data().joinLink; 
							userFirestoreData.registeredEvents[doc.id].joinText = doc.data().joinText; 
						}
					})
				}
				userData = {
					schoolName: userRecord.displayName,
					schoolRepName: userFirestoreData.schoolRepName,
					email: userRecord.email,
					photoURL: userRecord.photoURL,
					registeredEvents: userFirestoreData.registeredEvents,
					registeredEventsJS: JSON.stringify(userFirestoreData.registeredEvents)
				};
				res.render("profile-school", {
					title: `${userRecord.displayName} - Kaafila`,
					active_p: true,
					userData: userData,
					scripts: ['/js/profile-school.js']
				});
			} else {
				return next(createError(401, 'User not found in database'))
			}
		}
	} catch (err) {
		res.redirect("/signin");
		console.log(err);
	}
}

async function serverSignIn(req, res) {
	const idToken = req.body.idToken.toString();
	const csrfToken = req.body.csrfToken.toString();
	const expiresIn = 60 * 60 * 24 * 5 * 1000;

	if (csrfToken !== req.cookies.csrfToken) {
		res.status(401).send("UNAUTHORIZED REQUEST!");
		return;
	}

	try {
		const firebaseUserClaims = await admin.auth().verifyIdToken(idToken)
		if (new Date().getTime() / 1000 - firebaseUserClaims.auth_time < 5 * 60) {
			sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: expiresIn });
		} else {
			throw new Error("UNAUTHORIZED REQUEST!");
		}
		const options = { maxAge: expiresIn, httpOnly: true, secure: false };
		res.cookie("session", sessionCookie, options);
		res.end(JSON.stringify({ status: "success" }));
	} catch (err) {
		console.log(err);
		res.status(401).send("UNAUTHORIZED REQUEST!");
	}
}

async function serverSignOut(req, res) {
	const sessionCookie = req.cookies.session || "";
	res.clearCookie("session");

	try {
		if (sessionCookie) {
			const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
			admin.auth().revokeRefreshTokens(firebaseUserClaims.sub);
		}
	} catch (err) {
		console.log(err);
	}

	res.redirect("/");
}

async function serverUpdateUser(req, res) {
	const csrfToken = req.body.csrfToken.toString();
	const sessionCookie = req.cookies.session || "";

	if (csrfToken !== req.cookies.csrfToken) {
		res.status(401).send("UNAUTHORIZED REQUEST!");
		return;
	}

	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
		if (req.body.db == 'school') {
			const updateUserAccount = await admin.auth().updateUser(firebaseUserClaims.sub, {displayName: req.body.schoolName,});
			const updateUserDatabase = await db.collection(`schoolUsers`).doc(firebaseUserClaims.sub).update({
				schoolName: req.body.schoolName,
				schoolRepName: req.body.schoolRepName,
			})
			res.status(200).send();
		} else if (req.body.db == 'public') {
			const updateUserAccount = await admin.auth().updateUser(firebaseUserClaims.sub, {displayName: req.body.name,});
			const updateUserDatabase = await db.collection(`publicUsers`).doc(firebaseUserClaims.sub).update({
				name: req.body.name,
			})
			res.status(200).send();
		}
	} catch (err) {
		console.log(err);
	}
}

async function serverCheckUser(req, res) {
	const email = req.body.email;
	var returnData = {
		emailExists: false,
		dbCollection: null,
	}
	try {
		const firebaseUserClaims = await admin.auth().getUserByEmail(email);
		returnData.emailExists = true

		const checkPublicDatabase = await db.collection('publicUsers').doc(firebaseUserClaims.toJSON().uid).get()
		if (checkPublicDatabase.exists) { returnData.dbCollection = "public" } 
		else {
			const checkSchoolDatabase = await db.collection('schoolUsers').doc(firebaseUserClaims.toJSON().uid).get()
			if (checkSchoolDatabase.exists) { returnData.dbCollection = "school" }
		}

		returnData.googleAccount = firebaseUserClaims.toJSON().providerData.reduce((a, c) => { return  a || c.providerId == 'google.com' }, false)
		res.json(returnData);
	} catch (err) {
		if (err.code == "auth/user-not-found") {
			returnData = { emailExists: false }
			res.json(returnData);
		} else {
			console.log(err);
			res.json(err);
		}
	}
}

router.get("/signin", csrfProtection, (req, res) => renderSignIn(req, res));
router.get("/signup", csrfProtection, (req, res) => renderSignUp(req, res));
router.get("/signout", (req, res) => serverSignOut(req, res));
router.get("/profile", (req, res, next) => renderProfile(req, res, next));
router.post("/sessionlogin", (req, res) => serverSignIn(req, res));
router.post("/updateuser", (req, res) => serverUpdateUser(req, res));
router.post("/checkuser", (req, res) => serverCheckUser(req, res));

module.exports = router;