db = firebase.firestore();

$("#signInForm").form({
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

async function signInEmail() {
	try {
		if ($("#signInForm").form("is valid")) {
			$("#signInEmail").addClass("loading");
			email = $("#email").val();
			password = $("#password").val();
			const firebaseSignIn = await firebase.auth().signInWithEmailAndPassword(email, password)
			var user = await firebase.auth().currentUser;
			const idToken = await user.getIdToken()
			const csrfToken = getCookie("csrfToken");
			const sendTokens = await $.post("/sessionLogin", {
				idToken: idToken,
				csrfToken: csrfToken,
			}).promise();
			const firebaseSignOut = await firebase.auth().signOut();
			window.location.assign("/profile");
		}
	} catch (err) {
		$("#signInEmail").removeClass("loading");
		if (err.code === "auth/user-not-found") {
			$("#signInForm").form("add errors", ["Account doesn't exist, sign up instead"]);
		} else if (err.code === "auth/wrong-password") {
			const firebaseMethods = await firebase.auth().fetchSignInMethodsForEmail(email)
			console.log(firebaseMethods);
			if (firebaseMethods.length === 1) {
				$("#signInForm").form("add errors", ["Account associated with Google, sign in with Google instead.",]);
			} else {
				$("#signInForm").form("add errors", ["Wrong password"]);
			}
		} else {
		}
		console.log(err);
	}
}

async function signInGoogle() {
	try {
		var provider = new firebase.auth.GoogleAuthProvider();
		const firebaseSignIn = await firebase.auth().signInWithPopup(provider)
		user = await firebase.auth().currentUser;
		const docref = await db.collection('schoolUsers').doc(user.uid).get()
		if (docref.exists) {
			const idToken = await user.getIdToken()
			const csrfToken = getCookie("csrfToken");
			const sendTokens = await $.post("/sessionLogin", {
				idToken: idToken,
				csrfToken: csrfToken,
			}).promise();
			const firebaseSignOut = await firebase.auth().signOut();
			window.location.assign("/profile");
		}
		else {
			$("#schoolInfoModal").modal("show");
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
			const sendTokens = await $.post("/sessionLogin", {
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

function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return value != null ? unescape(value[1]) : null;
}

$("#signInForm").submit(() => {signInEmail(); return false;});
$("#signInGoogle").on("click", () => signInGoogle())

$("#schoolInfoForm").submit(() => {schoolInfoForm(); return false;});
$("#forgotPasswordForm").submit(() => {forgotPasswordForm(); return false;});
$("#forgotPassword").on("click", () => $("#forgotPasswordmodal").modal("show"));