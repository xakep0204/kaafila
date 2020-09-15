db = firebase.firestore();

$("#signUpForm").form({
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
				{
					type: "minLength[8]",
					prompt: "Your password must be at least {ruleValue} characters",
				},
			],
		},
		confirmPassword: {
			identifier: "confirmPassword",
			rules: [
				{
					type: "empty",
					prompt: "Please confirm your password",
				},
				{
					type: "match[password]",
					prompt: "Passwords do not match",
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

async function signUpEmail() {
	try {
		if ($("#signUpForm").form("is valid")) {
			$("#signUpEmail").addClass("loading");
			email = $("#email").val();
			password = $("#password").val();
			const firebaseSignUp = await firebase.auth().createUserWithEmailAndPassword(email, password)
			var user = await firebase.auth().currentUser;
			const updateUserProfile = await user.updateProfile({
				displayName: $("#signUpForm #schoolName").val(),
				photoURL: "https://atkhrfnsco.cloudimg.io/v7/dev.snsartsfestival.in/img/profile-blank.png",
			})
			const sendVerificationEmail = user.sendEmailVerification()
			const updateUserDatabase = await db.collection("schoolUsers").doc(user.uid).set({
				email: user.email,
				schoolName: $("#signUpForm #schoolName").val(),
				schoolRepName: $("#signUpForm #schoolRepName").val(),
				photoURL: user.photoURL,
			})
			const idToken = await user.getIdToken()
			const csrfToken = getCookie("csrfToken");
			const sendTokens = await $.post("/sessionLogin", {
				idToken: idToken,
				csrfToken: csrfToken
			}).promise();
			const firebaseSignOut = firebase.auth().signOut();
			window.location.assign("/profile");
		}
	} catch (err) {
		$("#signUpEmail").removeClass("loading");
		if (err.code == "auth/email-already-in-use") {
			$("#signUpForm").form("add errors", ["Account already exists, sign in instead"]);
		} else {
			console.log(err);
		}
	}
}

async function signUpGoogle() {
	try {
		var provider = new firebase.auth.GoogleAuthProvider();
		const firebaseSignUp = await firebase.auth().signInWithPopup(provider)
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

$("#signUpForm").submit(() => {signUpEmail(); return false;});
$("#signUpGoogle").on("click", () => signUpGoogle());

$("#schoolInfoForm").submit(() => {schoolInfoForm(); return false;});