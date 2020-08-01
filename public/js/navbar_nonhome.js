var $nav = $(".ui.borderless.menu");
var $header = $("header.hero");

$(document).ready(function () {
	$(".ui.toggle.button").click(function () {
		if (!($(document).scrollTop() + 108 > $header.height())) {
			$nav.toggleClass("scrolled");
		}
		$(".mobile.only.grid .ui.vertical.menu").toggle(100);
	});
	
	$nav.toggleClass("scrolled", $(this).scrollTop() + 108 > $header.height());
	$(document).scroll(function () {
		$nav.toggleClass("scrolled", $(this).scrollTop() + 108 > $header.height());
	});
	
	$("#bnc").click(function() {
		window.location.href = "/breadandcircuses"
	})
	$("#bnc-m").click(function() {
		window.location.href = "/breadandcircuses"
	})
	$("#ff").click(function() {
		window.location.href = "/folk-fluence"
	})
	$("#ff-m").click(function() {
		window.location.href = "/folk-fluence"
	})
	$("#i").click(function() {
		window.location.href = "/iridescence"
	})
	$("#i-m").click(function() {
		window.location.href = "/iridescence"
	})
	$("#sa").click(function() {
		window.location.href = "/strings-attached"
	})
	$("#sa-m").click(function() {
		window.location.href = "/strings-attached"
	})
});
