var url;
var name;
var subevent;
var submissionPath;

$("#editdetailsform").form({
	fields: {
		name: {
			identifier: "name",
			rules: [
				{
					type: "empty",
					prompt: "Enter your name",
				},
			],
		},
	},
});

function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return value != null ? unescape(value[1]) : null;
}

function editDetailsForm() {
	$("#editdetails").addClass("loading");
	if ($("#editdetailsform").form("is valid")) {
		const csrfToken = getCookie("csrfToken");
		$.post("/updateuser", {
			name: $("#name").val(),
			db: 'public',
			csrfToken: csrfToken
		}, () => {
			window.location.assign("/profile");
		});
	}
	else {
		$("#editdetails").removeClass("loading");
	}
	return false;
}

$("#signout").on("click", () => $("#signout").addClass("loading"));
$("#editdetailsmodalbutton").on("click", () => $("#editdetailsmodal").modal("show"));
$("#editdetailsform").submit(() => editDetailsForm());
$("#editsubmissionform").submit(() => editSubmissionForm());