db = firebase.firestore();

$("[data-tab='publicUsers'] #signUpForm").form({
	fields: {
		name: {
			identifier: "name",
			rules: [
				{
					type: "empty",
					prompt: "Enter your full name",
				},
			],
		},
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
$("[data-tab='schoolUsers'] #signUpForm").form({
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
			identifier: "passwordSchool",
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
			identifier: "confirmPasswordSchool",
			rules: [
				{
					type: "empty",
					prompt: "Please confirm your password",
				},
				{
					type: "match[passwordSchool]",
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

async function signUpEmailPublic() {
	try {
		if (!(await checkUserExistance($("[data-tab='publicUsers'] #email").val(), 'public'))) {
			if ($("[data-tab='publicUsers'] #signUpForm").form("is valid")) {
				$("[data-tab='publicUsers'] #signUpForm").addClass("loading");
				email = $("[data-tab='publicUsers'] #email").val();
				password = $("[data-tab='publicUsers'] #password").val();
				const firebaseSignUp = await firebase.auth().createUserWithEmailAndPassword(email, password)
				var user = await firebase.auth().currentUser;
				const updateUserProfile = await user.updateProfile({
					displayName: $("[data-tab='publicUsers'] #signUpForm #name").val(),
					photoURL: "https://atkhrfnsco.cloudimg.io/v7/snsartsfestival.in/img/profile-blank.png",
				})
				const sendVerificationEmail = user.sendEmailVerification()
				const updateUserDatabase = await db.collection("publicUsers").doc(user.uid).set({
					email: user.email,
					photoURL: user.photoURL,
				})
				const idToken = await user.getIdToken()
				const csrfToken = getCookie("csrfToken");
				const sendTokens = await $.post("/sessionlogin", {
					idToken: idToken,
					csrfToken: csrfToken
				}).promise();
				const firebaseSignOut = firebase.auth().signOut();
				window.location.assign("/profile");
			}
		}
	} catch (err) {
		$("[data-tab='publicUsers'] #signUpForm").removeClass("loading");
		console.log(err);
	}
}

async function signUpGooglePublic() {
	try {
		var provider = new firebase.auth.GoogleAuthProvider();
		const firebaseSignUp = await firebase.auth().signInWithPopup(provider)
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

async function signUpEmailSchool() {
	try {
		if (!(await checkUserExistance($("[data-tab='schoolUsers'] #email").val(), 'school'))) {
			if ($("[data-tab='schoolUsers'] #signUpForm").form("is valid")) {
				$("[data-tab='schoolUsers'] #signUpForm").addClass("loading");
				email = $("[data-tab='schoolUsers'] #email").val();
				password = $("[data-tab='schoolUsers'] #passwordSchool").val();
				const firebaseSignUp = await firebase.auth().createUserWithEmailAndPassword(email, password)
				var user = await firebase.auth().currentUser;
				const updateUserProfile = await user.updateProfile({
					displayName: $("[data-tab='schoolUsers'] #signUpForm #schoolName").val(),
					photoURL: "https://atkhrfnsco.cloudimg.io/v7/snsartsfestival.in/img/profile-blank.png",
				})
				const sendVerificationEmail = user.sendEmailVerification()
				const updateUserDatabase = await db.collection("schoolUsers").doc(user.uid).set({
					email: user.email,
					schoolName: $("[data-tab='schoolUsers'] #signUpForm #schoolName").val(),
					schoolRepName: $("[data-tab='schoolUsers'] #signUpForm #schoolRepName").val(),
					photoURL: user.photoURL,
				})
				const idToken = await user.getIdToken()
				const csrfToken = getCookie("csrfToken");
				const sendTokens = await $.post("/sessionlogin", {
					idToken: idToken,
					csrfToken: csrfToken
				}).promise();
				const firebaseSignOut = firebase.auth().signOut();
				window.location.assign("/profile");
			}
		}
	} catch (err) {
		$("[data-tab='schoolUsers'] #signUpForm").removeClass("loading");
		console.log(err);
	}
}

async function signUpGoogleSchool() {
	try {
		var provider = new firebase.auth.GoogleAuthProvider();
		const firebaseSignUp = await firebase.auth().signInWithPopup(provider)
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
		const deleteUser = await firebase.auth().currentUser.delete();
		console.log(err)
	}
}

async function checkUserExistance(email, db) {
	if (!$(`[data-tab='${db}Users'] #signUpForm`).form("is valid", "email")) {
		$(`[data-tab='${db}Users'] #signUpForm`).form("validate form");
		return false;
	} else {
		$(`[data-tab='${db}Users'] #signUpForm`).addClass("loading");
	}
	dbs = ['school', 'public']
	dbOtherRaw = dbs.filter(v => v != db)[0]
	dbOther = dbOtherRaw.charAt(0).toUpperCase() + dbOtherRaw.slice(1)
	const serverData = await $.post("/checkuser", {email: email}).promise();
	$(`[data-tab='${db}Users'] #signUpForm`).removeClass("loading");
	if (serverData.emailExists == false) {
		$(`[data-tab='${db}Users'] #signUpForm`).form("validate form");
		return false;
	} else if (serverData.dbCollection == db) {
		$(`[data-tab='${db}Users'] #signUpForm`).form("add errors", ["Account already exists, sign in instead"]);
		return true;
	} else if (serverData.dbCollection == dbOtherRaw) {
		$(`[data-tab='${db}Users'] #signUpForm`).form("add errors", [`${dbOther} account already exists with the same email`]);
		return true;
	} else {
		$(`[data-tab='${db}Users'] #signUpForm`).form("add errors", ["Account already exists, sign in instead"]);
		return true;
	}
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

$("[data-tab='publicUsers'] #signUpForm").submit(() => {signUpEmailPublic(); return false;});
$("[data-tab='publicUsers'] #signUpGoogle").on("click", () => signUpGooglePublic());
$("[data-tab='schoolUsers'] #signUpForm").submit(() => {signUpEmailSchool(); return false;});
$("[data-tab='schoolUsers'] #signUpGoogle").on("click", () => signUpGoogleSchool());

$("#schoolInfoForm").submit(() => {schoolInfoForm(); return false;});