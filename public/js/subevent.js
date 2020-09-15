var members;
var globalMembers;
categories = ["western-vocals", "hindustani-classical-vocals", "instrumental-strings", "instrumental-guitar", "instrumental-keyboard", "instrmental-percussion", "own-composition"]
categoriesProper = ["Western Vocals", "Hindustani Classical Vocals", "Instrumental Strings", "Instrumental Guitar", "instrumental Keyboard", "Instrmental Percussion", "Own Composition"]
categoriesAbbr = ["wv", "hcv", "is", "ig", "ik", "ip", "oc"]
groups = ["group0910", "group1112"]
groupsProper = ["Group 1 - Grades 9-10", "Group 2 - Grades 11-12"]

$.fn.form.settings.rules.leastCategoryCount = () => { 
	return (Object.keys(members).reduce((acc, cur) => acc + members[cur].length, 0) > 0);
};

function studentRemove(e) {
  studentID = $(e).attr("data-student");
  $(`#student${studentID}`).remove();
	members.splice(members.indexOf(studentID), 1);
	members.sort((a, b) => {return a - b});
	$("#studentAdd").removeAttr("disabled");
	$("#registereventform").form({ fields: formFields });
}

function studentRemoveSAS(e) {
	categoryAbbr = $(e).parent().parent().attr("id").split("-")[0]
	category = categories[categoriesAbbr.indexOf(categoryAbbr)]
	studentID = $(e).attr("data-student");

  $(`#${categoryAbbr}-student${studentID}`).remove();
	members[categoryAbbr].splice(members[categoryAbbr].indexOf(studentID), 1);
	members[categoryAbbr].sort((a, b) => {return a - b});
	$(`#${category} .studentAdd`).removeAttr("disabled");
	$("#registereventform").form({ fields: formFields });
}

function studentRemoveSOF(e) {
	group = $(e).parent().parent().attr("id").split("-")[0]
	studentID = $(e).attr("data-student");

  $(`#${group}-student${studentID}`).remove();
	members[group].splice(members[group].indexOf(studentID), 1);
	members[group].sort((a, b) => {return a - b});
	$(`.studentAdd`).removeAttr("disabled");
	$("#registereventform").form({ fields: formFields });
}

function stndForm() {
	members = [1];
	globalMembers = [1];
	if (members.length == parseInt(registrationMeta.maxseatsperschool)) {
		$("#studentAdd").attr("disabled", "");
	}

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
		student1Name: {
			identifier: "student1Name",
			rules: [
				{
					type: "empty",
					prompt: "Enter student's name",
				},
			],
		},
		student1Class: {
			identifier: "student1Class",
			rules: [
				{
					type: "empty",
					prompt: "Enter student's class",
				},
			],
		},
	};

	for (i = 2; i <= parseInt(registrationMeta.maxseatsperschool); i++) {
		globalMembers.push(i);
		formFields[`student${i}Name`] = {
			identifier: `student${i}Name`,
			rules: [
				{
					type: "empty",
					prompt: "Enter student's name",
				},
			],
		};
		formFields[`student${i}Class`] = {
			identifier: `student${i}Class`,
			rules: [
				{
					type: "empty",
					prompt: "Enter student's class",
				},
			],
		};
	}
	
	$("#registereventform").form({ fields: formFields });
	
	$("#studentAdd").on('click', () => {
		temp_members = globalMembers.filter(function (x) { return members.indexOf(x) < 0 });
		temp_members.sort((a, b) => {return a - b});
		members.push(temp_members[0]);
		members.sort((a, b) => {return a - b});
		$("#students").append(`
			<div id="student${temp_members[0]}">
				<div class="two fields">
					<div class="eight wide field">
						<label>Student Name</label>
						<input type="text" class="form-control" id="student${temp_members[0]}Name" placeholder="Student Name">
					</div>
					<div class="four wide field">
						<label>Student Class</label>
						<select class="ui dropdown" id="student${temp_members[0]}Class">
							<option value="">Student Class</option>
							<option value="9">Class 9</option>
							<option value="10">Class 10</option>
							<option value="11">Class 11</option>
							<option value="12">Class 12</option>
						</select>
					</div>
				</div>
				<div class="field">
					<button onclick="studentRemove(this)" data-student="${temp_members[0]}" type="button" class="ui tiny red button">Remove Student</button>
				</div>
			</div>
		`);
		$(".ui.dropdown").dropdown();
		$("#registereventform").form({ fields: formFields });
		if (members.length >= parseInt(registrationMeta.maxseatsperschool)) {
			$("#studentAdd").attr("disabled", "");
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
				submission: [],
				participants: $("#students > div").length
			}
			$("#students > div").each((i,e) => {
				studentID = $(e).attr('id')
				data.submission.push({
					name: $(`#${studentID}Name`).val(),
					class: $(`#${studentID}Class`).val()
				})
			});

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

function mmForm() {
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
		studentName: {
			identifier: "studentName",
			rules: [
				{
					type: "empty",
					prompt: "Enter student's name",
				},
			],
		},
		studentClass: {
			identifier: "studentClass",
			rules: [
				{
					type: "empty",
					prompt: "Enter student's class",
				},
			],
		},
	};
	$("#registereventform").form({ fields: formFields });
	
	$("#registereventform").submit(() => {
		if ($("#registereventform").form('is valid')) {
			$("#registerevent").addClass("loading");
			data = {
				name: registrationMeta.name,
				contactPerson: $("#registereventform #contactPerson").val(),
				email: $("#registereventform #email").val(),
				phone: $("#registereventform #phone").val(),
				submission: {
					name: $(`#studentName`).val(),
					class: $(`#studentClass`).val()
				},
				participants: 1
			}
			
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

function oapForm() {
	members = [1,2,3,4,5];
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
		student1Name: {
			identifier: "student1Name",
			rules: [
				{
					type: "empty",
					prompt: "Enter student's name",
				},
			],
		},
		student1Class: {
			identifier: "student1Class",
			rules: [
				{
					type: "empty",
					prompt: "Enter student's class",
				},
			],
		},
	};

	for (i = 2; i <= parseInt(registrationMeta.maxseatsperschool); i++) {
		globalMembers.push(i);
		formFields[`student${i}Name`] = {
			identifier: `student${i}Name`,
			rules: [
				{
					type: "empty",
					prompt: "Enter student's name",
				},
			],
		};
		formFields[`student${i}Class`] = {
			identifier: `student${i}Class`,
			rules: [
				{
					type: "empty",
					prompt: "Enter student's class",
				},
			],
		};
	}
	
	$("#registereventform").form({ fields: formFields });
	
	$("#studentAdd").on('click', () => {
		temp_members = globalMembers.filter(function (x) { return members.indexOf(x) < 0 });
		temp_members.sort((a, b) => {return a - b});
		members.push(temp_members[0]);
		members.sort((a, b) => {return a - b});
		$("#students").append(`
			<div id="student${temp_members[0]}">
				<div class="two fields">
					<div class="eight wide field">
						<label>Student Name</label>
						<input type="text" class="form-control" id="student${temp_members[0]}Name" placeholder="Student Name">
					</div>
					<div class="four wide field">
						<label>Student Class</label>
						<select class="ui dropdown" id="student${temp_members[0]}Class">
							<option value="">Student Class</option>
							<option value="9">Class 9</option>
							<option value="10">Class 10</option>
							<option value="11">Class 11</option>
							<option value="12">Class 12</option>
						</select>
					</div>
				</div>
				<div class="field">
					<button onclick="studentRemove(this)" data-student="${temp_members[0]}" type="button" class="ui tiny red button">Remove Student</button>
				</div>
			</div>
		`);
		$(".ui.dropdown").dropdown();
		$("#registereventform").form({ fields: formFields });
		if (members.length >= parseInt(registrationMeta.maxseatsperschool)) {
			$("#studentAdd").attr("disabled", "");
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
				groupName: $("#registereventform #groupName").val() || $("#registereventform #groupName").attr('placeholder'),
				submission: [],
				participants: 1
			}
			$("#students > div").each((i,e) => {
				studentID = $(e).attr('id')
				data.submission.push({
					name: $(`#${studentID}Name`).val(),
					class: $(`#${studentID}Class`).val()
				})
			});

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

function sasForm() {
	members = {};
	globalMembers = {};

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
		leastCategoryCount: {
			identifier: "leastCategoryCount",
			rules: [
				{
					type: "leastCategoryCount",
					prompt: "Add students to atleast one event category",
				},
			],
		},
	};

	categoriesAbbr.map((val) => {
		members[val] = [];
		globalMembers[val] = [];
		for (i = 1; i <= parseInt(registrationMeta.maxseatsperschool); i++) {
			globalMembers[val].push(i);
			formFields[`${val}-student${i}Name`] = {
				identifier: `${val}-student${i}Name`,
				rules: [
					{
						type: "empty",
						prompt: "Enter student's name",
					},
				],
			};
			formFields[`${val}-student${i}Class`] = {
				identifier: `${val}-student${i}Class`,
				rules: [
					{
						type: "empty",
						prompt: "Enter student's class",
					},
				],
			};
		}
	});
	
	$("#registereventform").form({ fields: formFields });
	
	$(".studentAdd").on('click', function () {
		category = $(this).parent().parent().attr("id")
		categoryAbbr = categoriesAbbr[categories.indexOf(category)]
		temp_members = globalMembers[categoryAbbr].filter((x) => { return members[categoryAbbr].indexOf(x) < 0 });
		temp_members.sort((a, b) => {return a - b});
		members[categoryAbbr].push(temp_members[0]);
		members[categoryAbbr].sort((a, b) => {return a - b});
		$(`#${category} #students`).append(`
			<div id="${categoryAbbr}-student${temp_members[0]}">
				<div class="two fields">
					<div class="eight wide field">
						<label>Student Name</label>
						<input type="text" class="form-control" id="${categoryAbbr}-student${temp_members[0]}Name" placeholder="Student Name">
					</div>
					<div class="four wide field">
						<label>Student Class</label>
						<select class="ui dropdown" id="${categoryAbbr}-student${temp_members[0]}Class">
							<option value="">Student Class</option>
							<option value="9">Class 9</option>
							<option value="10">Class 10</option>
							<option value="11">Class 11</option>
							<option value="12">Class 12</option>
						</select>
					</div>
				</div>
				<div class="field">
					<button onclick="studentRemoveSAS(this)" data-student="${temp_members[0]}" type="button" class="ui tiny red button">Remove Student</button>
				</div>
			</div>
		`);
		$(".ui.dropdown").dropdown();
		$("#registereventform").form({ fields: formFields });
		if (members[categoryAbbr].length >= parseInt(registrationMeta.maxseatsperschool)) {
			$(`#${category} .studentAdd`).attr("disabled", "");
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
				submission: {},
				participants: {},
			}
			$("#submission > div").each((i,catE) => {
				category = $(catE).attr('id');
				if ($(`#${category} #students > div`).length > 0) {
					data.submission[category] = {}
					data.submission[category].name = categoriesProper[categories.indexOf(category)]
					data.submission[category].submission = []
					$(`#${category} #students > div`).each((j,studE) => {
						studentID = $(studE).attr('id')
						data.submission[category].submission.push({
							name: $(`#${studentID}Name`).val(),
							class: $(`#${studentID}Class`).val()
						})
					});
					data.participants[category] = data.submission[category].submission.length;
				} else {
					data.participants[category] = 0;
				}
			});

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

function sofForm() {
	members = {};
	globalMembers = {};

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
		leastCategoryCount: {
			identifier: "leastCategoryCount",
			rules: [
				{
					type: "leastCategoryCount",
					prompt: "Add students to atleast one event category",
				},
			],
		},
	};

	groups.map((val) => {
		members[val] = [];
		globalMembers[val] = [];
		for (i = 1; i <= parseInt(registrationMeta.maxseatsperschool); i++) {
			globalMembers[val].push(i);
			formFields[`${val}-student${i}Name`] = {
				identifier: `${val}-student${i}Name`,
				rules: [
					{
						type: "empty",
						prompt: "Enter student's name",
					},
				],
			};
			formFields[`${val}-student${i}Class`] = {
				identifier: `${val}-student${i}Class`,
				rules: [
					{
						type: "empty",
						prompt: "Enter student's class",
					},
				],
			};
		}
	});
	$("#registereventform").form({ fields: formFields });
	
	$(".studentAdd").on('click', function () {
		group = $(this).parent().parent().attr("id")
		temp_members = globalMembers[group].filter((x) => { return members[group].indexOf(x) < 0 });
		temp_members.sort((a, b) => {return a - b});
		members[group].push(temp_members[0]);
		members[group].sort((a, b) => {return a - b});
		if (group === "group0910") {
			$(`#${group} #students`).append(`
				<div id="${group}-student${temp_members[0]}">
					<div class="two fields">
						<div class="eight wide field">
							<label>Student Name</label>
							<input type="text" class="form-control" id="${group}-student${temp_members[0]}Name" placeholder="Student Name">
						</div>
						<div class="four wide field">
							<label>Student Class</label>
							<select class="ui dropdown" id="${group}-student${temp_members[0]}Class">
								<option value="">Student Class</option>
								<option value="9">Class 9</option>
								<option value="10">Class 10</option>
							</select>
						</div>
					</div>
					<div class="field">
						<button onclick="studentRemoveSOF(this)" data-student="${temp_members[0]}" type="button" class="ui tiny red button">Remove Student</button>
					</div>
				</div>
			`);
		} else {
			$(`#${group} #students`).append(`
				<div id="${group}-student${temp_members[0]}">
					<div class="two fields">
						<div class="eight wide field">
							<label>Student Name</label>
							<input type="text" class="form-control" id="${group}-student${temp_members[0]}Name" placeholder="Student Name">
						</div>
						<div class="four wide field">
							<label>Student Class</label>
							<select class="ui dropdown" id="${group}-student${temp_members[0]}Class">
								<option value="">Student Class</option>
								<option value="11">Class 11</option>
								<option value="12">Class 12</option>
							</select>
						</div>
					</div>
					<div class="field">
						<button onclick="studentRemoveSOF(this)" data-student="${temp_members[0]}" type="button" class="ui tiny red button">Remove Student</button>
					</div>
				</div>
			`);
		}
		$(".ui.dropdown").dropdown();
		$("#registereventform").form({ fields: formFields });
		currTotalStudents = Object.keys(members).reduce((acc, cur) => acc + members[cur].length, 0)
		if (currTotalStudents >= parseInt(registrationMeta.maxseatsperschool)) {
			$(`.studentAdd`).attr("disabled", "");
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
				submission: {},
				participants: {},
			}
			$("#submission > div").each((i,groupE) => {
				group = $(groupE).attr('id');
				if ($(`#${group} #students > div`).length > 0) {
					data.submission[group] = {}
					data.submission[group].name = groupsProper[groups.indexOf(group)]
					data.submission[group].submission = []
					$(`#${group} #students > div`).each((j,studE) => {
						studentID = $(studE).attr('id')
						data.submission[group].submission.push({
							name: $(`#${studentID}Name`).val(),
							class: $(`#${studentID}Class`).val()
						})
					});
					data.participants[group] = data.submission[group].submission.length;
				} else {
					data.participants[group] = 0;
				}
			});

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
$.each(document.getElementById("registereventmodalbutton").attributes,function(i,a){
	if (['id', 'class'].indexOf(a.name) === -1) { registrationMeta[a.name.slice(5)] = a.value }
})
if (Object.keys(registrationMeta).length > 0) {
	if (!("formid" in registrationMeta)) { registrationMeta.formid = "stnd" }

	switch (registrationMeta.formid) {
		case "stnd":
			stndForm();
			break;
		case "mm":
			mmForm();
			break;
		case "oap":
			oapForm();
			break;
		case "sas":
			sasForm();
			break;
		case "sof":
			sofForm();
			break;
	}
}