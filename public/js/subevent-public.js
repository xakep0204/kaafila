var members;
var globalMembers;

async function registerPublicEvent() {
	$("#registerevent").addClass("loading");
	data = { name: registrationMeta.name }
	$.post(`/registration`, {data: JSON.stringify(data), subevent: registrationMeta.subevent}, (status) => {
		if (status == "OK") {
			$("#registereventconfirmmodal").modal("show");
		} else {
			console.log(status);
		}
	})
}

function sbForm() {
	members = [1];
	globalMembers = [1];

	formFields = {
		contactPerson: {
			identifier: "contactPerson",
			rules: [
				{
					type: "empty",
					prompt: "Enter the contact person's name",
				},
			],
		},
		email: {
			identifier: "email",
			rules: [
				{
					type: "empty",
					prompt: "Enter the contact person's email",
				},
				{
					type: "email",
					prompt: "Enter a valid email",
				},
			],
		},
		phone: {
			identifier: "phone",
			rules: [
				{
					type: "empty",
					prompt: "Enter contact person's phone number",
				},
				{
					type: "regExp[/^[0-9]{10}$/]",
					prompt: "Enter a valid phone number",
				},
			],
		},
		bandName: {
			identifier: "bandName",
			rules: [
				{
					type: "empty",
					prompt: "Enter the band's name",
				},
			],
		},
		member1Name: {
			identifier: "member1Name",
			rules: [
				{
					type: "empty",
					prompt: "Enter member's name",
				},
			],
		},
		member1Class: {
			identifier: "member1Class",
			rules: [
				{
					type: "empty",
					prompt: "Enter member's class",
				},
			],
		},
	};

	for (i = 2; i <= 100; i++) {
		globalMembers.push(i);
		formFields[`member${i}Name`] = {
			identifier: `member${i}Name`,
			rules: [
				{
					type: "empty",
					prompt: "Enter member's name",
				},
			],
		};
		formFields[`member${i}Class`] = {
			identifier: `member${i}Class`,
			rules: [
				{
					type: "empty",
					prompt: "Enter member's class",
				},
			],
		};
	}
	
	$("#registereventform").form({ fields: formFields });
	
	$("#memberAdd").on('click', () => {
		temp_members = globalMembers.filter(function (x) { return members.indexOf(x) < 0 });
		temp_members.sort((a, b) => {return a - b});
		members.push(temp_members[0]);
		members.sort((a, b) => {return a - b});
		$("#members").append(`
			<div id="member${temp_members[0]}">
				<div class="two fields">
					<div class="eight wide field">
						<label>Member Name</label>
						<input type="text" class="form-control" id="member${temp_members[0]}Name" placeholder="Member Name">
					</div>
					<div class="four wide field">
						<label>Member Class</label>
						<select class="ui dropdown" id="member${temp_members[0]}Class">
							<option value="">Member Class</option>
							<option value="9">Class 9</option>
							<option value="10">Class 10</option>
							<option value="11">Class 11</option>
							<option value="12">Class 12</option>
						</select>
					</div>
				</div>
				<div class="field">
					<button onclick="memberRemove(this)" data-member="${temp_members[0]}" type="button" class="ui tiny red button">Remove member</button>
				</div>
			</div>
		`);
		$(".ui.dropdown").dropdown();
		$("#registereventform").form({ fields: formFields });
		if (members.length >= 100) {
			$("#memberAdd").attr("disabled", "");
		}
	});
	
	$("#registereventform").submit(() => {
		if ($("#registereventform").form('is valid')) {
			$("#registerevent").addClass("loading");
			data = {
				name: registrationMeta.name,
				contactPerson: $("#registereventform #contactPerson").val(),
				email: $("#registereventform #email").val(),
				phone: $("#registereventform #phone").val(),
				bandName: $("#registereventform #bandName").val() || $("#registereventform #bandName").attr('placeholder'),
				submission: []
			}
			$("#members > div").each((i,e) => {
				memberID = $(e).attr('id')
				data.submission.push({
					name: $(`#${memberID}Name`).val(),
					class: $(`#${memberID}Class`).val()
				})
			});
			data.participants = data.submission.length

			$.post(`/registration`, {data: JSON.stringify(data), subevent: registrationMeta.subevent}, (status) => {
				if (status == "OK") {
					$("#registereventmodal").modal("hide");
					$("#registereventconfirmmodal").modal("show");
				} else {
					console.log(status);
				}
			})
		}
		return false;
	})

}

$(".ui.dropdown").dropdown();
$("#registereventconfirmmodal").modal({ onHidden: () => window.location.assign("/profile") });
$("#registereventmodalbutton").on("click", () => $("#registereventmodal").modal("show"));
$("#registereventmodalbuttonm").on("click", () => $("#registereventmodal").modal("show"));

registrationMeta = {}
if (document.getElementById("registereventmodalbutton")) {
	$.each(document.getElementById("registereventmodalbutton").attributes,function(i,a){
		if (['id', 'class'].indexOf(a.name) === -1) { registrationMeta[a.name.slice(5)] = a.value }
	})
	if (!("formid" in registrationMeta)) { registrationMeta.formid = "stnd" }
	
	switch (registrationMeta.formid) {
		case "stnd":
			stndForm();
			break;
		case "sb":
			sbForm();
			break;
	}
}