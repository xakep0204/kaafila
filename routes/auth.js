var express = require("express");
var router = express.Router();
var csrf = require("csurf");
var admin = require("../firebase-proj");
var csrfProtection = csrf({ cookie: true });
var db = admin.firestore();

async function getUserData(uid) {
	doc = db.collection('schoolUsers').doc(uid);
	docref = await doc.get()
	if (!docref.exists) {
		return 'NA'
	} else {
		return docref.data();
	}
}

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

async function renderProfile(req, res) {
	const sessionCookie = req.cookies.session || "";

	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		const userRecord = await admin.auth().getUser(firebaseUserClaims.sub)
		const userFirestoreData = await getUserData(firebaseUserClaims.sub)
		userData = {
			email: userRecord.email,
			schoolName: userRecord.displayName,
			schoolRepName: userFirestoreData.schoolRepName,
			photoURL: userRecord.photoURL,
			registeredEvents: userFirestoreData.registeredEvents
		};
		res.render("profile", {
			title: `${userRecord.displayName} - Kaafila`,
			active_p: true,
			userData: userData,
			scripts: ['/js/profile.js']
		});
	} catch (err) {
		res.redirect("/signin");
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
		const updateUserAccount = await admin.auth().updateUser(firebaseUserClaims.sub, {displayName: req.body.schoolName,});
		const updateUserDatabase = await db.collection('schoolUsers').doc(firebaseUserClaims.sub).update({
			schoolName: req.body.schoolName,
			schoolRepName: req.body.schoolRepName,
		})
		res.status(200).send();
	} catch (err) {
		console.log(err);
	}
}

router.get("/signin", csrfProtection, (req, res) => renderSignIn(req, res));
router.get("/signup", csrfProtection, (req, res) => renderSignUp(req, res));
router.get("/signout", (req, res) => serverSignOut(req, res));
router.get("/profile", (req, res) => renderProfile(req, res));
router.post("/sessionLogin", (req, res) => serverSignIn(req, res));
router.post("/updateuser", (req, res) => serverUpdateUser(req, res));

module.exports = router;