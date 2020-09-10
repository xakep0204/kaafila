function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return value != null ? unescape(value[1]) : null;
}

$("#signout").on("click", () => {
  $("#signout").addClass("loading");
});

var subevent;
var name;
var postURL;

function editSubmission(e) {
	subevent = $(e).attr("data-subevent")
	name = $(e).attr("data-student")
	postURL = $(e).attr("data-url")
	$("#modaldesc").html(`${name} - ${subevent}`)
	$("#editsubmissionmodal").modal("show");
}

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

$("#editsubmissionform").submit(() => {
  $("#editsubmission").addClass("loading");
	if ($("#editsubmissionform").form("is valid")) {
		data = {
			name: name,
      submission: $("form #link").val(),
    }
    $.post(`/submission/${postURL}`, data, (status) => {
			if (status == "OK") {
				window.location.reload();
      }
		})
	} else {
		$("#editsubmission").removeClass("loading");
	}
	return false;
});


$("#editdetailsmodalbutton").on("click", () => {
	$("#editdetailsmodal").modal("show");
});

$("#editdetailsform").form({
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

$("#editdetailsform").submit(() => {
  $("#editdetails").addClass("loading");
	if ($("#editdetailsform").form("is valid")) {
		const csrfToken = getCookie("csrfToken");
    $.post("/updateuser", {
			schoolName: $("#schoolName").val(),
      schoolRepName: $("#schoolRepName").val(),
      csrfToken: csrfToken
    }, () => {
			window.location.assign("/profile")
    });
	} else {
		$("#editdetails").removeClass("loading");
	}
	return false;
});