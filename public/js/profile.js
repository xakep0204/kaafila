function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return value != null ? unescape(value[1]) : null;
}

$("#signout").on("click", () => {
  $("#signout").addClass("loading");
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