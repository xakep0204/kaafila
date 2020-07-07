$(document).ready(function() {
    $(".ui.toggle.button").click(function() {
        $(".mobile.only.grid .ui.vertical.menu").toggle(100);
    });

    $(".ui.dropdown").dropdown();
});

$(function() {
    $(document).scroll(function() {
        var $nav = $(".ui.borderless.menu");
        $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    });
});