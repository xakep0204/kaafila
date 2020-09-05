function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return value != null ? unescape(value[1]) : null;
}

$(".ui.form").form({
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

$(".ui.form").submit(function () {
	if ($(".ui.form").form("is valid")) {
		email = $("#email").val();
		password = $("#password").val();
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(() => {
				var user = firebase.auth().currentUser;
				user
					.updateProfile({
						displayName: $("#schoolName").val(),
						photoURL:
							"https://atkhrfnsco.cloudimg.io/v7/dev.snsartsfestival.in/img/profile-blank.png",
					})
					.then(() => {
						user.sendEmailVerification().catch(() => {});
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
	}
	return false;
});

$("#signup_google").on("click", () => {
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