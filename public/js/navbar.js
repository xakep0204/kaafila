var $nav = $(".ui.borderless.menu");

$(document).ready(function () {
	$(".ui.dropdown").dropdown();

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
	
});