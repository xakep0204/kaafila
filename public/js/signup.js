function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return value != null ? unescape(value[1]) : null;
}

db = firebase.firestore();

async function checkUser(uid) {
  doc = db.collection('schoolUsers').doc(uid);
  docref = await doc.get()
  return docref.exists
}

$("#signupform").form({
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

$("#signupform").submit(function () {
	$("#signup_email").addClass("loading");
	if ($("#signupform").form("is valid")) {
		email = $("#email").val();
		password = $("#password").val();
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then(() => {
				var user = firebase.auth().currentUser;
				user
					.updateProfile({
						displayName: $("#signupform #schoolName").val(),
						photoURL: "https://atkhrfnsco.cloudimg.io/v7/dev.snsartsfestival.in/img/profile-blank.png",
					})
					.then(() => {
						user.sendEmailVerification().catch(() => {});
						db.collection("schoolUsers")
							.doc(user.uid)
							.set({
								email: user.email,
								schoolName: $("#signupform #schoolName").val(),
								schoolRepName: $("#signupform #schoolRepName").val(),
								photoURL: user.photoURL,
							})
							.catch((error) => {
								return firebase.auth().signOut();
							})
							.then(() => {
                user.getIdToken()
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
					});
      })
      .catch((error) => {
				$("#signup_email").removeClass("loading");
				if (error.code == "auth/email-already-in-use") {
					$("#signupform").form("add errors", ["Account already exists, sign in instead"]);
				}
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
      user = firebase.auth().currentUser;
      checkUser(user.uid).then((a) => {
        if (!a) {
          $("#schoolinfomodal").modal("show");
        } else {
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
            window.location.assign("/profile");
          });
        }
      });
		});
});

$("#schoolinfoform").form({
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

$("#schoolinfoform").submit(() => {
	$("#schoolinfo").addClass("loading");
	if ($("#schoolinfoform").form("is valid")) {
		var user = firebase.auth().currentUser;
		user
			.updateProfile({
				displayName: $("#schoolinfoform #schoolName").val(),
			})
			.then(() => {
				db.collection("schoolUsers")
					.doc(user.uid)
					.set({
						email: user.email,
						schoolName: $("#schoolinfoform #schoolName").val(),
						schoolRepName: $("#schoolinfoform #schoolRepName").val(),
						photoURL: user.photoURL,
					})
					.catch(() => {
						return firebase.auth().signOut();
					})
					.then(() => {
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
							window.location.assign("/profile");
						});
					})
			})
	}
	return false;
});