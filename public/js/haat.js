cartItems = {}
cartTotal = 0

function infoFormSubmit() {
	cartEmailItems = {}
	cartArtistTotal = {}
	$("#confirminfo").addClass("loading");
	if ($("#confirminfoform").form("is valid")) {
		artistsHTML = ""
		for (id in cartItems) {
			if(!cartEmailItems[cartItems[id].artist]) {
				cartEmailItems[cartItems[id].artist] = {}
			}
			if(!cartArtistTotal[cartItems[id].artist]) {
				cartArtistTotal[cartItems[id].artist] = 0
			}
			cartEmailItems[cartItems[id].artist][id] = cartItems[id]
			cartArtistTotal[cartItems[id].artist] += parseInt(cartItems[id].price)
		}
		for (artist in cartEmailItems) {
			itemsHTML = ""
			for (id in cartEmailItems[artist]) {
				itemsHTML += `<tr>
					<td style="-webkit-transition: background .1s ease,color .1s ease;transition: background .1s ease,color .1s ease;padding: .78571429em .78571429em;text-align: inherit;border-top: 1px solid rgba(34,36,38,.1);"><img src="https://atkhrfnsco.cloudimg.io/v7/dev.snsartsfestival.in/img/snsnartshaat/${cartEmailItems[artist][id].img}?width=256&amp;height=256&amp;func=fit&amp;bg_color=000" class="ui image tiny" style="border-style: none;position: relative;display: block;vertical-align: middle;max-width: none;background-color: transparent;width: 80px;height: auto;font-size: .85714286rem;"></td>
					<td style="-webkit-transition: background .1s ease,color .1s ease;transition: background .1s ease,color .1s ease;padding: .78571429em .78571429em;text-align: inherit;border-top: 1px solid rgba(34,36,38,.1);">
						<h4 style="font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;line-height: 1.28571429em;margin: calc(2rem - .14285714em) 0 1rem;font-weight: 300;padding: 0;margin-top: 0;margin-bottom: 0;">${cartEmailItems[artist][id].name}</h4>
					</td>
					<td style="-webkit-transition: background .1s ease,color .1s ease;transition: background .1s ease,color .1s ease;padding: .78571429em .78571429em;text-align: inherit;border-top: 1px solid rgba(34,36,38,.1);">
						<h4 style="font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;line-height: 1.28571429em;margin: calc(2rem - .14285714em) 0 1rem;font-weight: 300;padding: 0;margin-top: 0;margin-bottom: 0;">₹ ${cartEmailItems[artist][id].price}</h4>
					</td>
				</tr>`
			}
			artistsHTML += `<h4 style="font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;line-height: 1.28571429em;margin: calc(2rem - .14285714em) 0 1rem;font-weight: 700;font-size: 1.07142857rem;padding: 0;margin-top: 0;margin-bottom: 0;">${artist}</h4><br>
			<table class="ui table unstackable" style="width: 100%;background: #fff;margin: 1em 0;border: 1px solid rgba(34,36,38,.15);-webkit-box-shadow: none;box-shadow: none;border-radius: .28571429rem;text-align: left;color: rgba(0,0,0,.87);border-collapse: separate;border-spacing: 0;font-size: 1em;margin-top: 0;margin-bottom: 0;">
				<thead style="-webkit-box-shadow: none;box-shadow: none;">
					<tr>
						<th class="three wide" style="-webkit-transition: background .1s ease,color .1s ease;transition: background .1s ease,color .1s ease;cursor: auto;background: #f9fafb;text-align: inherit;color: rgba(0,0,0,.87);padding: .92857143em .78571429em;vertical-align: inherit;font-style: none;font-weight: 700;text-transform: none;border-bottom: 1px solid rgba(34,36,38,.1);border-left: none;width: 18.75%;">Item</th>
						<th class="ten wide" style="-webkit-transition: background .1s ease,color .1s ease;transition: background .1s ease,color .1s ease;cursor: auto;background: #f9fafb;text-align: inherit;color: rgba(0,0,0,.87);padding: .92857143em .78571429em;vertical-align: inherit;font-style: none;font-weight: 700;text-transform: none;border-bottom: 1px solid rgba(34,36,38,.1);border-left: none;width: 62.5%;">Item Name</th>
						<th class="three wide" style="-webkit-transition: background .1s ease,color .1s ease;transition: background .1s ease,color .1s ease;cursor: auto;background: #f9fafb;text-align: inherit;color: rgba(0,0,0,.87);padding: .92857143em .78571429em;vertical-align: inherit;font-style: none;font-weight: 700;text-transform: none;border-bottom: 1px solid rgba(34,36,38,.1);border-left: none;width: 18.75%;">Price</th>
					</tr>
				</thead>
				<tbody>
					${itemsHTML}
				</tbody>
				<tfoot style="-webkit-box-shadow: none;box-shadow: none;">
					<tr>
						<th colspan="2" style="-webkit-transition: background .1s ease,color .1s ease;transition: background .1s ease,color .1s ease;cursor: auto;border-top: 1px solid rgba(34,36,38,.15);background: #f9fafb;text-align: inherit;color: rgba(0,0,0,.87);padding: .78571429em .78571429em;vertical-align: middle;font-style: normal;font-weight: 400;text-transform: none;border-left: none;"><strong style="font-weight: bolder;">Total</strong></th>
						<th style="-webkit-transition: background .1s ease,color .1s ease;transition: background .1s ease,color .1s ease;cursor: auto;border-top: 1px solid rgba(34,36,38,.15);background: #f9fafb;text-align: inherit;color: rgba(0,0,0,.87);padding: .78571429em .78571429em;vertical-align: middle;font-style: normal;font-weight: 400;text-transform: none;">
							<h4 style="font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;line-height: 1.28571429em;margin: calc(2rem - .14285714em) 0 1rem;font-weight: 700;padding: 0;margin-top: 0;margin-bottom: 0;">₹ ${cartArtistTotal[artist]}</h4>
						</th>
					</tr>
				</tfoot>
			</table><br><br>`
		}
		emailHTML = `<head>
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2, user-scalable=no">
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css" type="text/css">
		</head>
		
		<body style="margin: 0;padding: 0;overflow-x: hidden;min-width: 320px;background: #fff;font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;font-size: 14px;line-height: 1.4285em;color: rgba(0,0,0,.87);height: 100%;">
			<div class="ui container" style="display: block;max-width: 100%!important;">
				${artistsHTML}
			</div>
		</body>`
		postData = {person: { name: $("#name").val(), phone: $("#phone").val(), email: $("#email").val()}, products: cartItems, html: emailHTML}
		$.post("/confirmorder", {
			data: JSON.stringify(postData)
		}, () => {
			$("#confirminfo").removeClass("loading");
			$("#cart-confirm-modal").modal('show');
		});
	}
	else {
		$("#confirminfo").removeClass("loading");
	}
	return false;
}

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

$("#cart-confirm-modal").modal({ onHidden: () => window.location.assign("/snsnartshaat") });

// $("#cart-confirm").click(() => { 
// 	$("#cart-modal").modal('hide');
//   $("#person-modal").modal('show');
// })
$("#cart-confirm").click(() => infoFormSubmit());
$(".cart-icon").click(() => { 
	$("#cart-modal").modal('show'); 
})
$("#confirminfoform").submit(() => infoFormSubmit());

$('.cartbutton').click(function () {
	id = $(this).attr('data-id')
	if (cartItems[id]) {
		$(this).html("Add to Cart")
		delete cartItems[id]
		cartTotal -= parseInt($(this).attr('data-price'))
	} else {
		$(this).html("<i class='icon check'></i> Added to Cart")
		cartItems[id] = {artist: $(this).attr('data-artist'), name: $(this).attr('data-name'), img: $(this).attr('data-img'), price: $(this).attr('data-price')}
		cartTotal += parseInt($(this).attr('data-price'))
	}
	html = ''
	for (id in cartItems) {
		html += `<tr><td><img src="https://atkhrfnsco.cloudimg.io/v7/dev.snsartsfestival.in/img/snsnartshaat/${cartItems[id].img}?width=256&height=256" class="ui image tiny"></td><td><h4>${cartItems[id].name}</h4></td></td><td><h4>₹ ${cartItems[id].price}</h4></td></tr>`
	}

	$("#cart-modal tbody").html(html)
	$("#cart-modal tfoot").html(`<tr><th colspan="2"><strong>Total</strong></th><th><h4>₹ ${cartTotal}</h4></th></tr>`)
});