function studentRemove(e) {
  studentID = $(e).attr("data-student");
  $(`#student${studentID}`).remove();
  $("#registereventform").form({ fields: formFields });
	members.splice(members.indexOf(studentID), 1);
	members.sort();
	$("#studentAdd").removeAttr("disabled");
}

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
	studentName: {
		identifier: "studentName",
		rules: [
			{
				type: "empty",
				prompt: "Enter student's name",
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

$("#registereventmodalbutton").on("click", () => {
  $("#registereventmodal").modal("show");
});
$("#registereventmodalbuttonm").on("click", () => {
  $("#registereventmodal").modal("show");
});



for (i = 2; i <= availableSeats; i++) {
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
$(".ui.dropdown").dropdown();

$("#studentAdd").on('click', () => {
  
  temp_members = globalMembers.filter(function (x) {
    return members.indexOf(x) < 0;
  });
  temp_members.sort();
  members.push(temp_members[0]);
  members.sort();
  $("#students").append(`
    <div id="student${temp_members[0]}">
      <div class="two fields">
        <div class="eight wide field">
          <label>Student Name</label>
          <input type="text" class="form-control" id="student${temp_members[0]}Name" placeholder="Student Name">
        </div>
        <div class="four wide field">
        </div>
      </div>
      <div class="field">
        <button onclick="studentRemove(this)" data-student="${temp_members[0]}" type="button" class="ui tiny red button">Remove Student</button>
      </div>
    </div>
  `);
  var $classOptions = $('#student1 .four.wide.field').html();
  $(`#student${temp_members[0]} .four.wide.field`).html($classOptions);
  $(`#student${temp_members[0]} .four.wide.field select`).attr('id', `student${temp_members[0]}Class`);
  $(".ui.dropdown").dropdown();
  $("#registereventform").form({ fields: formFields });
  if (members.length == availableSeats) {
    $("#studentAdd").attr("disabled", "");
  }
});

$("#registereventform").submit(() => {
  $("#registerevent").addClass("loading");
  if ($("#registereventform").form('is valid')) {
    data = {
      contactPerson: $("#registereventform #contactPerson").val(),
      phone: $("#registereventform #phone").val(),
      students: [],
      name: name,
    }
    $("#students > div").each((i,e) => {
      studentID = $(e).attr('id')
      data.students.push({
        name: $(`#${studentID}Name`).val(),
        class: $(`#${studentID}Class`).val()
      })
    });
    postURL = $("#registereventmodalbutton").attr("data-url")
    $.post(`/registration/${postURL}`, {data: JSON.stringify(data)}, (status) => {
      if (status == "OK") {
        $("#registereventmodal").modal("hide");
        $("#registereventconfirmmodal").modal({
          onHidden: () => {
            window.location.assign("/profile");
          }
        });
        $("#registereventconfirmmodal").modal("show");
      }
    })
    return false;
  } else {
    $("#registerevent").removeClass("loading");
  }
})