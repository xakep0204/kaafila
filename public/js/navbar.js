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
});

$(function () {
	$(document).scroll(function () {
		$nav.toggleClass("scrolled", $(this).scrollTop() + 108 > $header.height());
	});
});

$(function () {
  $(".ui.borderless.menu a").click(function() {
    var target = $(this).attr('data-target');
    
    $('html, body').animate({
        scrollTop: $(target).offset().top - 54
    }, 700);
  });
});
