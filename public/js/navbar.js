var $nav = $(".ui.borderless.menu");
var $header = $("header.hero");

$(document).ready(function() {
    $(".ui.toggle.button").click(function() {
      if ($(this).scrollTop() <= $header.height()) {
        $nav.toggleClass('scrolled');
      }
      $(".mobile.only.grid .ui.vertical.menu").toggle(100);
    });

    $(".ui.dropdown").dropdown();
  });

$(function() {
  $(document).scroll(function() {
    $nav.toggleClass('scrolled', $(this).scrollTop() > $header.height());
    });
});