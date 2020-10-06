db = firebase.firestore();

$("#signInForm").form({
	fields: {
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

async function signInEmailPublic() {
	try {
		if ($("#signInForm").form("is valid")) {
			email = "admin@snsartsfestival.in";
			password = $("#password").val();
			$(`#signInForm`).addClass("loading");
			const firebaseSignIn = await firebase.auth().signInWithEmailAndPassword(email, password)
			var user = await firebase.auth().currentUser;
			const idToken = await user.getIdToken()
			const csrfToken = getCookie("csrfToken");
			const sendTokens = await $.post("/sessionlogin", {
				idToken: idToken,
				csrfToken: csrfToken,
			}).promise();
			const firebaseSignOut = await firebase.auth().signOut();
			window.location.assign("/");
		}
	} catch (err) {
		$(`#signInForm`).removeClass("loading");
		if (err.code === "auth/wrong-password") {
			$("#signInForm").form("add errors", ["Wrong password"]);
		} else {
			console.log(err);
		}
	}
}

function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return value != null ? unescape(value[1]) : null;
}

$("#signInForm").submit(() => {signInEmailPublic(); return false;});