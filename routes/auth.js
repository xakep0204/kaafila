var express = require("express");
var router = express.Router();
var csrf = require("csurf");
var admin = require("../firebase-proj");
var csrfProtection = csrf({ cookie: true });

router.get("/signin", csrfProtection, function (req, res, next) {
	const sessionCookie = req.cookies.session || "";
	admin
		.auth()
		.verifySessionCookie(sessionCookie, true)
		.then(function (decodedClaims) {
			admin
				.auth()
				.getUser(decodedClaims.sub)
				.then(() => {
					res.redirect("/");
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch(function (error) {
			res.cookie("csrfToken", req.csrfToken());
			res.render("signin", {
				title: "Sign in - Kaafila",
				styles: ["/css/navbar-logo.css"],
				scripts: ["/js/signin.js"],
			});
		});
});

router.get("/signup", csrfProtection, function (req, res, next) {
	const sessionCookie = req.cookies.session || "";
	admin
		.auth()
		.verifySessionCookie(sessionCookie, true)
		.then(function (decodedClaims) {
			admin
				.auth()
				.getUser(decodedClaims.sub)
				.then(() => {
					res.redirect("/");
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch(function (error) {
			res.cookie("csrfToken", req.csrfToken());
			res.render("signup", {
				title: "Sign up - Kaafila",
				styles: ["/css/navbar-logo.css"],
				scripts: ["/js/signup.js"],
			});
		});
});

router.get("/signout", function (req, res) {
	const sessionCookie = req.cookies.session || "";
	res.clearCookie("session");
	if (sessionCookie) {
		admin
			.auth()
			.verifySessionCookie(sessionCookie, true)
			.then(function (decodedClaims) {
				return admin.auth().revokeRefreshTokens(decodedClaims.sub);
			})
			.then(function () {
				res.redirect("/");
			})
			.catch(function () {
				res.redirect("/");
			});
	} else {
		res.redirect("/");
	}
});

router.post("/sessionLogin", (req, res) => {
	const idToken = req.body.idToken.toString();
	const csrfToken = req.body.csrfToken.toString();
	if (csrfToken !== req.cookies.csrfToken) {
		res.status(401).send("UNAUTHORIZED REQUEST!");
		return;
	}
	const expiresIn = 60 * 60 * 24 * 5 * 1000;
	admin
		.auth()
		.verifyIdToken(idToken)
		.then(function (decodedClaims) {
			if (new Date().getTime() / 1000 - decodedClaims.auth_time < 5 * 60) {
				return admin
					.auth()
					.createSessionCookie(idToken, { expiresIn: expiresIn });
			}
			throw new Error("UNAUTHORIZED REQUEST!");
		})
		.then(function (sessionCookie) {
			const options = { maxAge: expiresIn, httpOnly: true, secure: false };
			res.cookie("session", sessionCookie, options);
			res.end(JSON.stringify({ status: "success" }));
		})
		.catch(function (error) {
			res.status(401).send("UNAUTHORIZED REQUEST!");
		});
});

router.get("/profile", function (req, res, next) {
	// res.render("profile", {
	//   title: `${userRecord.displayName} - Kaafila`,
	//   active_p: true,
	//   styles: ["/css/navbar-logo.css", "/css/pastels.css"],
	//   title: `Shiv Nadar School Noida - Kaafila`,
	//   userData: {
	//     email: 'contact@snsartsfestival.in',
	//     schoolName: 'Shiv Nadar School',
	//     schoolRepName: 'Manjima Chatterjee',
	//     photoURL: "https://atkhrfnsco.cloudimg.io/v7/dev.snsartsfestival.in/img/profile-blank.png",
	//   },
	// });
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
          }
					res.render("profile", {
						title: `${userRecord.displayName} - Kaafila`,
						active_p: true,
						styles: ["/css/navbar-logo.css", "/css/pastels.css"],
						userData: userData,
					});
				})
				.catch((err) => {
					console.log(err);
          res.redirect("/signin");
				});
		})
		.catch(function (error) {
			console.log(error);
			res.redirect("/signin");
		});
});

module.exports = router;
