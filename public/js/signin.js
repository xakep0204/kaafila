function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return value != null ? unescape(value[1]) : null;
}

$(".ui.form").form({
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
				}
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
      .signInWithEmailAndPassword(email, password)
      .then(() => {
				var user = firebase.auth().currentUser;
        user.getIdToken().then((idToken) => {
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
					window.location.assign('/profile');
				});
			})
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
			user.getIdToken().then((idToken) => {
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
				window.location.assign('/profile');
			});
    })
});