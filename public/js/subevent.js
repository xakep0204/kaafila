function getCookie(name) {
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return value != null ? unescape(value[1]) : null;
}

function leastCheckedCount(formElement, val) {
  formId = formElement.attr('id')
  if ($(`#${formId} .ui.checkbox.checked`).length == val) {
    return true
  } else {
    formElement.form("add errors", [`Please check ${val} entry(ies)`])
    return false
  }
}

async function checkPreviousVote(formElement) {
  serverData = await $.post("/checkvoteemail", {
    email: formElement.find(`[name="email"]`).val(), 
    subevent: formElement.find(`[type=submit]`).attr('data-event'),
  }).promise();
  if (serverData.data) {
    formElement.form("add errors", [`Already voted for current category`])
  }
  return serverData.data
}

async function voteFormSubmit(formElement) {
  formId = formElement.attr('id')
  if (formElement.form('is valid', 'email')) {
    previousVote = await checkPreviousVote(formElement)
    if (formElement.form('is valid') && leastCheckedCount(formElement, 2) && !previousVote) {
      $(`#${formId} .votesubmit`).addClass("loading")
      votes = []
      $.each($(`#${formId} .ui.checkbox.checked`), function () {
        votes.push($(this).children().first().attr('name'))
      })
      
      postData = {
        name: formElement.find(`[name="name"]`).first().val(), 
        email: formElement.find(`[name="email"]`).first().val(), 
        subevent: formElement.find(`[type=submit]`).attr('data-event'),
        votes: votes
      }

      document.cookie = `name=${postData.name};path=/`
      document.cookie = `email=${postData.email};path=/`

      $.post("/publicvote", {
        data: JSON.stringify(postData)
      }, () => {
        $(`#${formId} .votesubmit`).removeClass("loading");
        $("#confirmmodal").modal('show');
      });
    }
  }
}

$.each($(".confirminfoform"), function () {
  $(this).find("[name='name']").first().val(getCookie("name"))
  $(this).find("[name='email']").first().val(getCookie("email"))
})

$(".confirminfoform").form({
	fields: {
		fullName: {
			identifier: "name",
			rules: [
				{
					type: "empty",
					prompt: "Enter your full name",
				},
			],
		},
		email: {
			identifier: "email",
			rules: [
				{
					type: "empty",
					prompt: "Enter your email",
				},
				{
					type: "email",
					prompt: "Enter a valid email",
				},
			],
    }
	},
});

$(".vote").click(function () {
  $(`#${this.id}-modal`).modal("show");
})

$(".confirminfoform").submit(function () { 
  voteFormSubmit($(this));
  return false;
})

$(".ui.checkbox").checkbox('enable');
$(".ui.embed").embed();

$('.embed-fancybox').fancybox({
  buttons: [
    "close"
  ]
});