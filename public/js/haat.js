$("#confirminfoform").form({
	fields: {
		fullName: {
			identifier: "fullName",
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
    },
    phone: {
			identifier: "phone",
			rules: [
				{
					type: "empty",
					prompt: "Enter your phone number",
				},
				{
					type: "regExp[/^[0-9]{10}$/]",
					prompt: "Enter a valid phone number",
				},
			],
		},
	},
});

$('.ui.embed').embed();

$('.artist-fancybox').fancybox({
	buttons: [
    "close"
  ]
});

$("#cart-icon").click(() => { $("#cart-modal").modal('show'); })
$("#cart-confirm").click(() => { 
  $("#cart-modal").modal('hide');
  $("#person-modal").modal('show');
})

$("#confirminfoform").submit(() => {
  $("#confirminfo").addClass("loading");
	if ($("#confirminfoform").form("is valid")) {
    $.post("/confirmorder", {data: JSON.stringify({
      person: {name: $("#fullName").val(), phone: $("#phone").val(), email: $("#email").val()},
		})}, () => {
      $("#confirminfo").removeClass("loading");
      $("#person-modal").modal('hide');
      $("#cart-confirm-modal").modal('hide');
		});
	}
	else {
		$("#confirminfo").removeClass("loading");
	}
	return false;
})
