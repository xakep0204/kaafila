var $nav = $(".ui.borderless.menu");
var $header = $("header.hero");

$(document).ready(function () {
	$(".ui.toggle.button").click(function () {
		if (!($(document).scrollTop() > 54)) {
			if ($(".mobile.only.grid .ui.vertical.menu").css('display') == 'none') {
				$nav.addClass("scrolled");
			}
			else {
				$nav.removeClass("scrolled");
			}
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
	
	$nav.toggleClass("scrolled", $(this).scrollTop() > 54);
	$(document).scroll(function () {
		$nav.toggleClass("scrolled", $(this).scrollTop() > 54);
	});
	
	$(".header-content a").click(function() {
		var target = $(this).attr('data-target');
		
		$('html, body').animate({
				scrollTop: $(target).offset().top - 54
		}, 700);
	});
	
	$("#bnc").click(function() {
		window.location.href = "/events/bread-and-circuses"
	})
	$("#bnc-m").click(function() {
		window.location.href = "/events/bread-and-circuses"
	})
	$("#ff").click(function() {
		window.location.href = "/events/folk-fluence"
	})
	$("#ff-m").click(function() {
		window.location.href = "/events/folk-fluence"
	})
	$("#i").click(function() {
		window.location.href = "/events/iridescence"
	})
	$("#i-m").click(function() {
		window.location.href = "/events/iridescence"
	})
	$("#sa").click(function() {
		window.location.href = "/events/strings-attached"
	})
	$("#sa-m").click(function() {
		window.location.href = "/events/strings-attached"
	})
});
