var $nav = $(".ui.borderless.menu");
var $header = $("header.hero");

$(document).ready(function () {
	$(".ui.toggle.button").click(function () {
		if (!($(document).scrollTop() + 108 > $header.height())) {
			$nav.toggleClass("scrolled");
		}
		$(".mobile.only.grid .ui.vertical.menu").toggle(100);
	});
	
	$(".vertical.menu a").click(function() {
		if (!$(this).hasClass('dropdown')) {
				$(".mobile.only.grid .ui.vertical.menu").toggle(100);
		}
	});

	$(".vertical.menu #dropdowntext").click(function() {
			$(".mobile.only.grid .ui.vertical.menu").toggle(100);
	});

	$nav.toggleClass("scrolled", $(this).scrollTop() + 108 > $header.height());
	$(document).scroll(function () {
		$nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
	});
	
	$(".ui.borderless.menu a").click(function() {
		var target = $(this).attr('data-target');
		
		$('html, body').animate({
				scrollTop: $(target).offset().top - 54
		}, 700);
	});

	$("#bnc").click(function() {
		window.location.href = "/breadandcircuses"
	})
	$("#bnc-m").click(function() {
		window.location.href = "/breadandcircuses"
	})
	$("#ff").click(function() {
		window.location.href = "/folkfluence"
	})
	$("#ff-m").click(function() {
		window.location.href = "/folkfluence"
	})
	$("#i").click(function() {
		window.location.href = "/iridescence"
	})
	$("#i-m").click(function() {
		window.location.href = "/iridescence"
	})
	$("#sa").click(function() {
		window.location.href = "/stringsattached"
	})
	$("#sa-m").click(function() {
		window.location.href = "/stringsattached"
	})
});
