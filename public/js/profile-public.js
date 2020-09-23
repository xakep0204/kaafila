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
$("#editsubmissionform").form({
	fields: {
		link: {
			identifier: "link",
			rules: [
				{
					type: "url",
					prompt: "Enter a valid URL",
				},
				{
					type: "empty",
					prompt: "Enter the link to your file",
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

function editSubmission(e) {
	subevent = $(e).attr("data-subevent")
	name = $(e).attr("data-name")
	url = $(e).attr("data-url")
	submissionPath = $(e).attr("data-submissionPath")
	$("#modaldesc").html(`${name} - ${subevent}`)
	$("#editsubmissionmodal").modal("show");
}

function editSubmissionForm() {
	if ($("#editsubmissionform").form("is valid")) {
		$("#editsubmission").addClass("loading");

		var res = submissionPath.split(".");
    var fieldName = res.splice(res.length - 1, 1);
		var objField = res.reduce((r, u) => r && r[u] ? r[u] : '', registeredEvents[url]);
		objField[fieldName] = $("input#link").val();
		$.post(`/submission`, {data: JSON.stringify(registeredEvents[url]), subevent: url}, (status) => {
			if (status == "OK") { 
				window.location.reload() 
			} else { 
				console.log(status); 
			}
		});
	}
	return false;
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