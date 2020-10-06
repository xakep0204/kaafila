var express = require("express");
var router = express.Router();
var csrf = require("csurf");
var admin = require("../firebase-proj");
var csrfProtection = csrf({ cookie: true });

async function renderSignIn(req, res) {
	const sessionCookie = req.cookies.session || "";
	try {
		const firebaseUserClaims = await admin.auth().verifySessionCookie(sessionCookie, true)
		res.redirect("/");
	} catch (err) {
		console.log(err);
		res.cookie("csrfToken", req.csrfToken());
		res.render("signin", {
			title: "Sign in - Kaafila Admin",
			scripts: ["/js/signin.js"],
		});
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

	res.redirect("/signin");
}

router.get("/signin", csrfProtection, (req, res) => renderSignIn(req, res));
router.get("/signout", (req, res) => serverSignOut(req, res));
router.post("/sessionlogin", (req, res) => serverSignIn(req, res));

module.exports = router;