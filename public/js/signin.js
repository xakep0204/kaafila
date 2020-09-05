function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return value != null ? unescape(value[1]) : null;
}

$("#signinform").form({
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

$("#signinform").submit(function () {
	if ($("#signinform").form("is valid")) {
		email = $("#email").val();
		password = $("#password").val();
		firebase
			.auth()
			.signInWithEmailAndPassword(email, password)
			.then(() => {
				var user = firebase.auth().currentUser;
				user
					.getIdToken()
					.then((idToken) => {
						const csrfToken = getCookie("csrfToken");
						return $.post("/sessionLogin", {
							idToken: idToken,
							csrfToken: csrfToken,
						});
					})
					.then(() => {
						return firebase.auth().signOut();
					})
					.then(() => {
						window.location.assign("/profile");
					});
			})
			.catch((error) => {
				if (error.code == "auth/user-not-found") {
					$("#signinform").form("add errors", [
						"Account doesn't exist, sign up instead",
					]);
				}
				if (error.code == "auth/wrong-password") {
					$("#signinform").form("add errors", ["Wrong password"]);
				}
			});
	}
	return false;
});

$("#signin_google").on("click", () => {
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase
		.auth()
		.signInWithPopup(provider)
		.then(function (result) {
			var user = firebase.auth().currentUser;
			user
				.getIdToken()
				.then((idToken) => {
					const csrfToken = getCookie("csrfToken");
					return $.post("/sessionLogin", {
						idToken: idToken,
						csrfToken: csrfToken,
					});
				})
				.then(() => {
					return firebase.auth().signOut();
				})
				.then(() => {
					window.location.assign("/profile");
				});
		});
});

$("#forgotpassword").on("click", () => {
	$("#forgotpasswordmodal").modal("show");
});

$("#forgotpasswordform").form({
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

$("#forgotpasswordform").submit(() => {
	$("#resetpassword").addClass("loading");
	email = $("#forgotpasswordform #email").val();
	firebase
	.auth()
	.signInWithEmailAndPassword(email, "sns")
	.catch((error) => {
		$("#resetpassword").removeClass("loading");
		if (error.code == "auth/user-not-found") {
			$("#forgotpasswordform").form("add errors", [
				"Account doesn't exist, sign up instead",
			]);
		}
		if (error.code == "auth/wrong-password") {
				firebase
				.auth()
				.sendPasswordResetEmail(email)
					.then(function () {
						$("#forgotpasswordmodal").modal("hide");
						$("#resetconfirmmodal").modal("show");
					})
					.catch(function (error) {
						console.log(error);
					});
			}
		});
	return false;
});