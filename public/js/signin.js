db = firebase.firestore();

$("[data-tab='publicUsers'] #signInForm").form({
	fields: {
		email: {
			identifier: "email",
			rules: [
				{
					type: "empty",
					prompt: "Enter your email",
				},
				{
					type: "email",
					prompt: "Enter a valid email",
				},
			],
		},
		password: {
			identifier: "password",
			rules: [
				{
					type: "empty",
					prompt: "Please enter a password",
				},
			],
		},
	},
});
$("[data-tab='schoolUsers'] #signInForm").form({
	fields: {
		email: {
			identifier: "email",
			rules: [
				{
					type: "empty",
					prompt: "Enter your school representative's email",
				},
				{
					type: "email",
					prompt: "Enter a valid email",
				},
			],
		},
		password: {
			identifier: "password",
			rules: [
				{
					type: "empty",
					prompt: "Please enter a password",
				},
			],
		},
	},
});
$("#schoolInfoForm").form({
	fields: {
		schoolName: {
			identifier: "schoolName",
			rules: [
				{
					type: "empty",
					prompt: "Enter your school's name",
				},
			],
		},
		schoolRepName: {
			identifier: "schoolRepName",
			rules: [
				{
					type: "empty",
					prompt: "Enter your school representative's name",
				},
			],
		},
	},
});
$("#forgotPasswordForm").form({
	fields: {
		email: {
			identifier: "email",
			rules: [
				{
					type: "empty",
					prompt: "Enter your school representative's email",
				},
				{
					type: "email",
					prompt: "Enter a valid email",
				},
			],
		},
	},
});

async function signInEmailPublic() {
	try {
		if (!(await checkUserExistance($("[data-tab='publicUsers'] #email").val(), 'public'))) {
			if ($("[data-tab='publicUsers'] #signInForm").form("is valid")) {
				email = $("[data-tab='publicUsers'] #email").val();
				password = $("[data-tab='publicUsers'] #password").val();
				$(`[data-tab='publicUsers'] #signInForm`).addClass("loading");
				const firebaseSignIn = await firebase.auth().signInWithEmailAndPassword(email, password)
				var user = await firebase.auth().currentUser;
				const idToken = await user.getIdToken()
				const csrfToken = getCookie("csrfToken");
				const sendTokens = await $.post("/sessionlogin", {
					idToken: idToken,
					csrfToken: csrfToken,
				}).promise();
				const docref = await db.collection('publicUsers').doc(user.uid).get()
				if (!docref.exists) {
					const updateUserDatabase = await db.collection("publicUsers").doc(user.uid).set({
						email: user.email,
						photoURL: user.photoURL,
					})
				}
				const firebaseSignOut = await firebase.auth().signOut();
				window.location.assign("/profile");
			}
		}
	} catch (err) {
		$(`[data-tab='publicUsers'] #signInForm`).removeClass("loading");
		if (err.code === "auth/wrong-password") {
			$("[data-tab='publicUsers'] #signInForm").form("add errors", ["Wrong password"]);
		} else {
			console.log(err);
		}
	}
}

async function signInGooglePublic() {
	try {
		var provider = new firebase.auth.GoogleAuthProvider();
		const firebaseSignIn = await firebase.auth().signInWithPopup(provider)
		user = await firebase.auth().currentUser;
		if (!(await checkGoogleUserExistance(user.email, 'school'))) {
			const idToken = await user.getIdToken()
			const csrfToken = getCookie("csrfToken");
			const sendTokens = await $.post("/sessionlogin", {
				idToken: idToken,
				csrfToken: csrfToken,
			}).promise();
			const docref = await db.collection('publicUsers').doc(user.uid).get()
			if (!docref.exists) {
				const updateUserDatabase = await db.collection("publicUsers").doc(user.uid).set({
					email: user.email,
					photoURL: user.photoURL,
				})
			}
			const firebaseSignOut = await firebase.auth().signOut();
			window.location.assign("/profile");
		}
	} catch (err) {
		console.log(err)	
	}
}

async function signInEmailSchool() {
	try {
		if (!(await checkUserExistance($("[data-tab='schoolUsers'] #email").val(), 'school'))) {
			if ($("[data-tab='schoolUsers'] #signInForm").form("is valid")) {
				email = $("[data-tab='schoolUsers'] #email").val();
				password = $("[data-tab='schoolUsers'] #password").val();
				$(`[data-tab='schoolUsers'] #signInForm`).addClass("loading");
				const firebaseSignIn = await firebase.auth().signInWithEmailAndPassword(email, password)
				var user = await firebase.auth().currentUser;
				const idToken = await user.getIdToken()
				const csrfToken = getCookie("csrfToken");
				const sendTokens = await $.post("/sessionlogin", {
					idToken: idToken,	
					csrfToken: csrfToken,
				}).promise();
				const firebaseSignOut = await firebase.auth().signOut();
				window.location.assign("/profile");
			}
		}
	} catch (err) {
		$(`[data-tab='schoolUsers'] #signInForm`).removeClass("loading");
		if (err.code === "auth/wrong-password") {
			$("[data-tab='schoolUsers'] #signInForm").form("add errors", ["Wrong password"]);
		} else {
			console.log(err);
		}
	}
}

async function signInGoogleSchool() {
	try {
		var provider = new firebase.auth.GoogleAuthProvider();
		const firebaseSignIn = await firebase.auth().signInWithPopup(provider)
		user = await firebase.auth().currentUser;
		if (!(await checkGoogleUserExistance(user.email, 'public'))) {
			const docref = await db.collection('schoolUsers').doc(user.uid).get()
			if (docref.exists) {
				const idToken = await user.getIdToken()
				const csrfToken = getCookie("csrfToken");
				const sendTokens = await $.post("/sessionlogin", {
					idToken: idToken,
					csrfToken: csrfToken,
				}).promise();
				const firebaseSignOut = await firebase.auth().signOut();
				window.location.assign("/profile");
			}
			else {
				$("#schoolInfoModal").modal("show");
			}
		}
	} catch (err) {
		console.log(err)	
	}
}

async function forgotPasswordForm() {
	if ($("#forgotPasswordForm").form('is valid')) {
		$("#resetPassword").addClass("loading");
		email = $("#forgotPasswordForm #email").val();
		try {
			$("#resetPassword").removeClass("loading");
			const firebaseMethods = await firebase.auth().fetchSignInMethodsForEmail(email)
			if (firebaseMethods.length === 0) {
				$("#forgotPasswordForm").form("add errors", ["Account doesn't exist, sign up instead",]);
			} else {
				const firebaseSendEmail = await firebase.auth().sendPasswordResetEmail(email)
				$("#forgotPasswordmodal").modal("hide");
				$("#resetconfirmmodal").modal("show");
			}
		} catch (err) {
			console.log(err)
		}
	}
	return false;
}

async function schoolInfoForm() {
	try {
		if ($("#schoolInfoForm").form("is valid")) {
			$("#schoolInfo").addClass("loading");
			var user = await firebase.auth().currentUser;
			const updateUserProfile = await user.updateProfile({ displayName: $("#schoolInfoForm #schoolName").val(), })
			const updateUserDatabase = await db.collection("schoolUsers").doc(user.uid).set({
				email: user.email,
				schoolName: $("#schoolInfoForm #schoolName").val(),
				schoolRepName: $("#schoolInfoForm #schoolRepName").val(),
				photoURL: user.photoURL,
			})
			const idToken = await user.getIdToken()
			const csrfToken = getCookie("csrfToken")
			const sendTokens = await $.post("/sessionlogin", {
				idToken: idToken,
				csrfToken: csrfToken,
			}).promise();
			const firebaseSignOut = await firebase.auth().signOut();
			window.location.assign("/profile");
		}
	} catch (err) {
		const firebaseSignOut = await firebase.auth().signOut();
		console.log(err)
	}
}

async function checkUserExistance(email, db) {
	if (!$(`[data-tab='${db}Users'] #signInForm`).form("is valid", "email")) {
		$(`[data-tab='${db}Users'] #signInForm`).form("validate form");
		return false;
	} else {
		$(`[data-tab='${db}Users'] #signInForm`).addClass("loading");
	}
	dbs = ['school', 'public']
	dbOtherRaw = dbs.filter(v => v != db)[0]
	dbOther = dbOtherRaw.charAt(0).toUpperCase() + dbOtherRaw.slice(1)
	const serverData = await $.post("/checkuser", {email: email}).promise();
	$(`[data-tab='${db}Users'] #signInForm`).removeClass("loading");
	if (!serverData.emailExists) {
		$(`[data-tab='${db}Users'] #signInForm`).form("add errors", ["Account doesn't exist, sign up instead"]);
		return true;
	} else if (serverData.dbCollection == dbOtherRaw) {
		$(`[data-tab='${db}Users'] #signInForm`).form("add errors", [`${dbOther} account exists with the same email`]);
		return true;
	} else if (serverData.googleAccount) {
		$(`[data-tab='${db}Users'] #signInForm`).form("add errors", ["Account associated with Google, sign in with Google instead."]);
		return true;
	}
	return false;
};

async function checkGoogleUserExistance(email, db) {
	$(`[data-tab='${db}Users'] #signInForm`).addClass("loading");
	dbs = ['school', 'public']
	dbOtherRaw = dbs.filter(v => v != db)[0]
	dbOther = dbOtherRaw.charAt(0).toUpperCase() + dbOtherRaw.slice(1)
	const serverData = await $.post("/checkuser", {email: email}).promise();
	$(`[data-tab='${db}Users'] #signInForm`).removeClass("loading");
	if (serverData.dbCollection == db) {
		$(`[data-tab='${db}Users'] #signInForm`).form("add errors", [`${dbOther} account already exists with the same email`]);
		return true;
	} else {
		return false;
	}
};

function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return value != null ? unescape(value[1]) : null;
}

$('.menu .item').tab();

$("[data-tab='publicUsers'] #signInForm").submit(() => {signInEmailPublic(); return false;});
$("[data-tab='publicUsers'] #signInGoogle").on("click", () => signInGooglePublic())
$("[data-tab='schoolUsers'] #signInForm").submit(() => {signInEmailSchool(); return false;});
$("[data-tab='schoolUsers'] #signInGoogle").on("click", () => signInGoogleSchool())

$("#schoolInfoForm").submit(() => {schoolInfoForm(); return false;});
$("#forgotPasswordForm").submit(() => {forgotPasswordForm(); return false;});
$("#forgotPassword").on("click", () => $("#forgotPasswordmodal").modal("show"));