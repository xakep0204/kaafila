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
	$("#signin_email").addClass("loading");
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
						$("#signin_email").removeClass("loading");
						window.location.assign("/profile");
					});
			})
			.catch((error) => {
				$("#signin_email").removeClass("loading");
				if (error.code == "auth/user-not-found") {
					$("#signinform").form("add errors", [
						"Account doesn't exist, sign up instead",
					]);
				}
				if (error.code == "auth/wrong-password") {
					$("#signinform").form("add errors", ["Wrong password"]);
				}
			});
	} else {
		$("#signin_email").removeClass("loading");
	}
	return false;
});

$("#signin_google").on("click", () => {
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
						schoolName: $("#schoolName").val(),
						schoolRepName: $("#schoolRepName").val(),
						photoURL: user.photoURL,
					})
					.catch((error) => {
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
			});
	} else {
		$("#schoolinfo").removeClass("loading");
	}
	return false;
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
	if ($("#forgotpasswordform").form('is valid')) {
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
						.catch(() => {});
				}
			});
	} else {
		$("#resetpassword").removeClass("loading");
	}
	return false;
});
